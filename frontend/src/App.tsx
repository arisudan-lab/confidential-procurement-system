import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { ProcurementForm } from './components/ProcurementForm';
import { BidForm } from './components/BidForm';
import { ProcurementState } from './components/ProcurementState';
import { NetworkStatus } from './components/NetworkStatus';
import './App.css';

// Environment variables for configuration
const NETWORK = import.meta.env.VITE_NETWORK || 'undeployed';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const network = NETWORK;
  const contractAddress = CONTRACT_ADDRESS;

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletAddress(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔒 Confidential Procurement System</h1>
        <p className="subtitle">Privacy-preserving sealed-bid auctions on Midnight</p>
      </header>

      <div className="status-bar">
        <NetworkStatus network={network} />
        {contractAddress && (
          <div className="contract-info">
            <span className="label">Contract:</span>
            <code>{contractAddress.slice(0, 12)}...{contractAddress.slice(-8)}</code>
          </div>
        )}
      </div>

      <main className="app-main">
        <section className="wallet-section">
          <WalletConnect 
            onConnect={handleWalletConnect} 
            onDisconnect={handleWalletDisconnect}
            isConnected={walletConnected}
            address={walletAddress}
          />
        </section>

        {walletConnected ? (
          <div className="procurement-sections">
            <section className="procurement-card">
              <h2>Create Procurement Request</h2>
              <ProcurementForm />
            </section>

            <section className="procurement-card">
              <h2>Submit Confidential Bid</h2>
              <BidForm />
            </section>

            <section className="procurement-card full-width">
              <h2>Procurement State</h2>
              <ProcurementState contractAddress={contractAddress} />
            </section>
          </div>
        ) : (
          <div className="connect-prompt">
            <p>Connect your Lace wallet to interact with the procurement system</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built on Midnight Network • 
          Bids are private using zero-knowledge proofs • 
          Only the winner is disclosed
        </p>
      </footer>
    </div>
  );
}

export default App;
