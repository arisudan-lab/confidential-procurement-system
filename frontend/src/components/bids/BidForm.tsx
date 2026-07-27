import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BidService } from '../../services/BidService';
import { useWallet } from '../../contexts/WalletContext';
import { expectedNetworkId, isExpectedNetwork } from '../../midnight/Network';

export default function BidForm() {
  const { state: walletState, connect } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [bidCount, setBidCount] = useState<string>('0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      let connectedWallet = walletState;
      if (!connectedWallet.isConnected) {
        try {
          connectedWallet = await connect();
        } catch (err: any) {
          throw new Error('Wallet Rejection: You must connect and authorize the Lace wallet.');
        }
      }

      if (!connectedWallet.network || !isExpectedNetwork(connectedWallet.network)) {
        throw new Error(`Network mismatch: switch your wallet to '${expectedNetworkId()}'.`);
      }

      if (!amount || !notes || !company) {
        throw new Error('Please fill all required fields');
      }

      setStatus('loading');

      const supplierAddress = connectedWallet.address;
      if (!supplierAddress) throw new Error('Wallet did not return an unshielded address.');

      await BidService.submitBid({
        supplier: supplierAddress,
        amount: Number(amount),
        secret: notes
      });

      const updatedCount = await BidService.getBidCount();
      setBidCount(updatedCount);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Proof failure or network error occurred.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 w-full max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30 shadow-glow-purple">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Bid Submitted Successfully</h2>
        <p className="text-slate-400">Your zero-knowledge proof was verified and the encrypted bid was accepted by the Compact contract.</p>
        
        <div className="p-4 bg-midnight-900/50 rounded-xl border border-white/5 inline-block min-w-48 my-4">
          <div className="text-sm font-medium text-slate-400">Global Tender Bids</div>
          <div className="text-3xl font-mono font-bold text-accent-cyan mt-1">{bidCount}</div>
        </div>

        <div>
          <button onClick={() => setStatus('idle')} className="btn-primary px-8 py-3">Submit Another</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-8 w-full max-w-2xl mx-auto space-y-6 relative overflow-hidden"
      onSubmit={handleSubmit}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
          <Loader2 className="w-12 h-12 text-accent-purple animate-spin mb-4" />
          <p className="text-lg font-medium text-white">Generating Zero-Knowledge Proof...</p>
          <p className="text-sm text-slate-400 mt-2">This may take up to 30 seconds.</p>
        </div>
      )}

      <div className="space-y-2 text-center mb-8">
        <div className="w-16 h-16 bg-accent-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-purple/20 shadow-glow-purple">
          <Lock className="w-8 h-8 text-accent-purple" />
        </div>
        <h2 className="text-2xl font-bold text-white">Submit Confidential Bid</h2>
        <p className="text-sm text-slate-400">Your bid details are protected by Midnight ZK proofs.</p>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tender ID</label>
          <input type="text" value="TND-2024-081" disabled className="input-field w-full opacity-70 cursor-not-allowed font-mono" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Company Name</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Enter company name" className="input-field w-full" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Bid Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="input-field w-full pl-8" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Estimated Delivery</label>
          <input type="text" placeholder="e.g. 6 Months" className="input-field w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Confidential Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Include any private remarks..." className="input-field w-full resize-none"></textarea>
      </div>

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center space-x-2 py-3 mt-4 text-lg">
        <Send className="w-5 h-5" />
        <span>Submit Encrypted Bid</span>
      </button>
    </motion.form>
  );
}
