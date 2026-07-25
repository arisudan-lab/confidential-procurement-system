import { useState, useEffect } from 'react';
import './WalletConnect.css';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
  address: string | null;
}

export function WalletConnect({ onConnect, onDisconnect, isConnected, address }: WalletConnectProps) {
  const [laceDetected, setLaceDetected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Lace wallet is installed
    const checkLace = async () => {
      try {
        // Lace injects midnightProvider into the window object
        const hasLace = typeof window !== 'undefined' && 
          ('midnightProvider' in window || 'lace' in window);
        setLaceDetected(hasLace);
      } catch (err) {
        setLaceDetected(false);
      }
    };
    checkLace();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);

    try {
      // Try to connect to Lace wallet
      // @ts-ignore - Lace wallet provider
      const provider = window.lace || window.midnightProvider;
      
      if (!provider) {
        throw new Error('Lace wallet not found. Please install the Lace browser extension.');
      }

      // Enable the wallet (this prompts the user to connect)
      const enabledProvider = await provider.enable();
      
      // Get the wallet address
      // @ts-ignore
      const accounts = await enabledProvider.request({ method: 'getAccounts' });
      
      if (accounts && accounts.length > 0) {
        onConnect(accounts[0]);
      } else {
        throw new Error('No accounts found');
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onDisconnect();
  };

  const installLace = () => {
    window.open('https://lace.io', '_blank');
  };

  if (isConnected && address) {
    return (
      <div className="wallet-connect connected">
        <div className="wallet-status">
          <span className="status-indicator connected"></span>
          <span className="wallet-label">Wallet Connected</span>
        </div>
        <code className="wallet-address">{address.slice(0, 12)}...{address.slice(-8)}</code>
        <button className="btn btn-disconnect" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {!laceDetected ? (
        <div className="wallet-not-found">
          <p>🦎 Lace wallet not detected</p>
          <p className="help-text">
            Lace is a browser extension wallet for Midnight. 
            Install it to interact with the procurement system.
          </p>
          <button className="btn btn-primary" onClick={installLace}>
            Install Lace Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-actions">
          {error && <div className="error-message">{error}</div>}
          <button 
            className="btn btn-primary" 
            onClick={connectWallet}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect Lace Wallet'}
          </button>
        </div>
      )}
    </div>
  );
}
