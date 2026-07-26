
import { motion } from 'framer-motion';
import { User, Bell, Palette, Shield, Globe } from 'lucide-react';

export default function Settings() {
  const sections = [
    { title: 'Profile', icon: User, description: 'Manage your enterprise identity and role.' },
    { title: 'Notifications', icon: Bell, description: 'Configure email and dashboard alerts for tenders.' },
    { title: 'Appearance', icon: Palette, description: 'Dark mode is currently enforced for security.' },
    { title: 'Wallet & Security', icon: Shield, description: 'Manage connected Lace wallets and 2FA.' },
    { title: 'Language & Region', icon: Globe, description: 'Set your preferred language and timezone.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your procurement platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar for settings */}
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <button key={idx} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${idx === 0 ? 'bg-midnight-700/80 text-white' : 'text-slate-400 hover:text-white hover:bg-midnight-800'}`}>
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">Enterprise Profile</h3>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-indigo to-accent-purple flex items-center justify-center text-2xl font-bold text-white shadow-glow-purple">
                  AC
                </div>
                <div>
                  <button className="btn-secondary text-sm">Change Avatar</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <input type="text" defaultValue="Alex Carter" className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <input type="email" defaultValue="alex@cyberdyn.com" className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Organization</label>
                  <input type="text" defaultValue="CyberDyn Systems" disabled className="input-field w-full opacity-60 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Role</label>
                  <input type="text" defaultValue="Procurement Officer" disabled className="input-field w-full opacity-60 cursor-not-allowed" />
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
