
import { motion } from 'framer-motion';
import { Lock, Paperclip, Send } from 'lucide-react';

export default function BidForm() {
  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-8 w-full max-w-2xl mx-auto space-y-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-2 text-center mb-8">
        <div className="w-16 h-16 bg-accent-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-purple/20 shadow-glow-purple">
          <Lock className="w-8 h-8 text-accent-purple" />
        </div>
        <h2 className="text-2xl font-bold text-white">Submit Confidential Bid</h2>
        <p className="text-sm text-slate-400">Your bid details are protected by Midnight ZK proofs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tender ID</label>
          <input type="text" value="TND-2024-081" disabled className="input-field w-full opacity-70 cursor-not-allowed font-mono" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Company Name</label>
          <input type="text" placeholder="Enter company name" className="input-field w-full" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Bid Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input type="number" placeholder="0.00" className="input-field w-full pl-8" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Estimated Delivery</label>
          <input type="text" placeholder="e.g. 6 Months" className="input-field w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Confidential Notes</label>
        <textarea rows={4} placeholder="Include any private remarks..." className="input-field w-full resize-none"></textarea>
      </div>

      <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-white/5 hover:border-accent-cyan/50 transition-colors cursor-pointer group">
        <Paperclip className="w-6 h-6 mb-2 group-hover:text-accent-cyan transition-colors" />
        <span className="text-sm">Click or drag attachments to upload</span>
        <span className="text-xs mt-1 text-slate-500">PDF, DOCX, ZIP up to 50MB</span>
      </div>

      <button className="btn-primary w-full flex items-center justify-center space-x-2 py-3 mt-4 text-lg">
        <Send className="w-5 h-5" />
        <span>Submit Encrypted Bid</span>
      </button>
    </motion.form>
  );
}
