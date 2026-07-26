import { AlertTriangle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

export default function WalletError({ message }: { message?: string }) {
  const { connect, state } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-amber-950/20 border border-amber-900/30 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-full bg-amber-900/40 flex items-center justify-center mb-4 text-amber-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-amber-200 mb-2">Wallet Issue</h3>
      <p className="text-amber-300/70 max-w-sm mb-6">
        {message || state.error?.message || "There was a problem communicating with the Lace wallet extension."}
      </p>
      
      {!state.isConnected && (
        <button
          onClick={() => connect()}
          className="px-4 py-2 bg-amber-900/50 hover:bg-amber-800/50 text-amber-200 rounded-lg transition-colors border border-amber-800"
        >
          Reconnect Wallet
        </button>
      )}
    </div>
  );
}
