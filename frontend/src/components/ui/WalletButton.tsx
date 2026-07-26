import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, LogOut, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useWallet } from '../../contexts/WalletContext';

export default function WalletButton({ className }: { className?: string }) {
  const { state, connect, disconnect } = useWallet();

  const handleConnect = () => {
    if (state.isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-full mr-4 flex items-center space-x-2 text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 whitespace-nowrap"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{state.error.message}</span>
          </motion.div>
        )}
        
        {state.isMissing && !state.isConnected && (
           <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 20 }}
           className="absolute right-full mr-4 flex items-center space-x-2 text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 whitespace-nowrap"
         >
           <AlertCircle className="w-4 h-4" />
           <span className="text-sm font-medium">Lace Wallet not found</span>
         </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleConnect}
        disabled={state.isConnecting}
        className={cn(
          "relative flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300",
          "border backdrop-blur-md overflow-hidden group",
          state.isConnected
            ? "bg-midnight-800/80 border-accent-purple/30 text-white shadow-glow-purple"
            : "bg-accent-purple hover:bg-accent-indigo border-transparent text-white shadow-glow-indigo"
        )}
      >
        {!state.isConnected && (
          <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-indigo opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        <div className="relative flex items-center space-x-2">
          {state.isConnecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : state.isConnected ? (
            <LogOut className="w-4 h-4 text-accent-purple" />
          ) : (
            <Wallet className="w-5 h-5" />
          )}
          
          <span>
            {state.isConnecting
              ? 'Connecting...'
              : state.isConnected
              ? state.address
              : 'Connect Lace'}
          </span>
        </div>
      </motion.button>
    </div>
  );
}
