import { WifiOff } from 'lucide-react';

export default function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-950/20 border border-red-900/30 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center mb-4 text-red-400">
        <WifiOff className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-red-200 mb-2">Network Error</h3>
      <p className="text-red-300/70 max-w-xs mb-6">
        Unable to connect to the Midnight network. Please check your connection and RPC endpoints.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-200 rounded-lg transition-colors border border-red-800"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
}
