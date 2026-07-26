import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WalletState } from '../wallet/walletTypes';
import { laceWallet } from '../wallet/LaceWallet';

interface WalletContextType {
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: null,
    error: null,
    isConnecting: false,
    isMissing: false,
  });

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      try {
        const isAvailable = await laceWallet.isAvailable();
        if (!isAvailable) {
          setState(s => ({ ...s, isMissing: true }));
          return;
        }

        const isEnabled = await laceWallet.isEnabled();
        if (isEnabled) {
          // If already connected/enabled, auto-connect
          await connect();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    setState(s => ({ ...s, isConnecting: true, error: null }));
    try {
      await laceWallet.connect();
      const addressHex = await laceWallet.getAddress();
      const network = await laceWallet.getNetwork();
      
      // Basic formatting for display if it's raw hex, normally you'd use a library to parse the address
      const formattedAddress = addressHex.length > 20 
        ? `${addressHex.slice(0, 8)}...${addressHex.slice(-6)}`
        : addressHex;

      setState({
        isConnected: true,
        address: formattedAddress,
        network,
        error: null,
        isConnecting: false,
        isMissing: false,
      });
    } catch (error: any) {
      setState(s => ({
        ...s,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error : new Error(error.message || 'Failed to connect wallet')
      }));
      throw error;
    }
  };

  const disconnect = () => {
    laceWallet.disconnect();
    setState({
      isConnected: false,
      address: null,
      network: null,
      error: null,
      isConnecting: false,
      isMissing: false,
    });
  };

  return (
    <WalletContext.Provider value={{ state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
