
import { motion } from 'framer-motion';
import { FileSignature, Eye, Lock, Trophy } from 'lucide-react';
import { cn } from '../../utils/utils';

const events = [
  { id: 1, title: 'Winner Selected', description: 'Tender TND-2024-072 awarded to CyberDyn Systems.', date: 'Aug 28, 2024', time: '14:30 UTC', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { id: 2, title: 'Tender Closed', description: 'Tender TND-2024-072 closed for new bids.', date: 'Aug 25, 2024', time: '23:59 UTC', icon: Lock, color: 'text-red-400', bg: 'bg-red-400/10' },
  { id: 3, title: 'Bid Opened (Zero-Knowledge)', description: 'Department committee verified bids without revealing amounts.', date: 'Aug 26, 2024', time: '09:00 UTC', icon: Eye, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  { id: 4, title: 'Private Submission', description: 'Encrypted bid submitted by anonymous vendor.', date: 'Aug 24, 2024', time: '11:15 UTC', icon: FileSignature, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
];

export default function AuditTimeline() {
  return (
    <div className="relative border-l border-white/10 ml-6 md:ml-8 space-y-8 py-4">
      {events.map((event, index) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 md:pl-10 group"
        >
          <div className={cn("absolute -left-5 p-2 rounded-full border border-midnight-900", event.bg, event.color)}>
            <event.icon className="w-5 h-5" />
          </div>
          
          <div className="glass-card p-5 hover:bg-midnight-700/80 transition-colors">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <h4 className="text-lg font-semibold text-white">{event.title}</h4>
              <div className="text-xs text-slate-400 font-mono mt-1 md:mt-0 bg-midnight-900/50 px-2 py-1 rounded">
                {event.date} • {event.time}
              </div>
            </div>
            <p className="text-sm text-slate-300">{event.description}</p>
            
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Transaction Hash:</span>
              <span className="text-accent-indigo font-mono hover:underline cursor-pointer">0x7F2a...39bE</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
