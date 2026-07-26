
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, Lock, Users, Briefcase, FileSignature, Settings, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Tender Board', icon: FileText, path: '/tenders' },
  { label: 'Private Bids', icon: Lock, path: '/bids/new' },
  { label: 'Suppliers', icon: Users, path: '/suppliers' },
  { label: 'Contracts', icon: Briefcase, path: '/contracts' },
  { label: 'Audit Logs', icon: FileSignature, path: '/audit' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Help', icon: HelpCircle, path: '/help' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen sticky top-0 bg-midnight-900 border-r border-white/5 hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-indigo to-accent-cyan">
          Midnight Procurement
        </h1>
      </div>
      
      <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => cn(
            "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
            isActive ? "text-white bg-midnight-700/50" : "text-slate-400 hover:text-white hover:bg-midnight-800/50"
          )}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-[60%] top-[20%] bg-accent-cyan rounded-r-md" />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-accent-cyan" : "group-hover:text-slate-300")} />
                <span className="font-medium text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/5 space-y-1">
        {bottomItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => cn(
            "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
            isActive ? "text-white bg-midnight-700/50" : "text-slate-400 hover:text-white hover:bg-midnight-800/50"
          )}>
            <item.icon className="w-5 h-5 group-hover:text-slate-300" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
