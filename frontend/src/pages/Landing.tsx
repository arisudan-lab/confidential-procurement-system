
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import WalletButton from '../components/ui/WalletButton';

export default function Landing() {
  return (
    <div className="min-h-screen bg-midnight-900 overflow-hidden relative flex flex-col items-center justify-center text-center px-4">
      {/* Background Particles/Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm mb-8 backdrop-blur-sm">
          <Shield className="w-4 h-4 text-accent-cyan" />
          <span>Private Procurement Powered by Midnight</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Confidential Tenders, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-indigo to-accent-purple">
            Uncompromised Trust
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
          Enterprise-grade zero-knowledge procurement system. Submit bids, audit timelines, and award contracts with absolute privacy and verifiable integrity.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <WalletButton className="w-full sm:w-auto h-12 text-lg px-8" />
          <Link to="/dashboard" className="w-full sm:w-auto">
            <button className="btn-secondary h-12 text-lg px-8 flex items-center justify-center space-x-2 w-full">
              <span>Explore Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </motion.div>
      
      {/* Floating Elements Animation */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[Lock, Shield, Activity].map((Icon: any, index) => (
          <motion.div
            key={index}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ 
              y: ["100vh", "-20vh"], 
              opacity: [0, 0.3, 0],
              x: Math.sin(index) * 200
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15 + index * 5,
              ease: "linear",
              delay: index * 3
            }}
            className="absolute bottom-0 left-[20%] md:left-[40%]"
            style={{ left: `${20 + index * 30}%` }}
          >
            <Icon className="w-16 h-16 text-white/10" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
