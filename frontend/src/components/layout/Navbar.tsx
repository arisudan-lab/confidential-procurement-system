import { Bell, Search } from 'lucide-react';
import WalletButton from '../ui/WalletButton.tsx';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-20 glass border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tenders, bids, or suppliers..." 
            className="w-full bg-midnight-900/50 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-cyan/50 focus:border-accent-cyan/50 transition-all placeholder-slate-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-purple rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
        </button>
        
        <div className="h-6 w-px bg-white/10 hidden md:block" />
        
        <WalletButton />
      </div>
    </nav>
  );
}
