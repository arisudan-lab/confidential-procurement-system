
import { motion } from 'framer-motion';
import { ShieldCheck, Star, MapPin } from 'lucide-react';
import { cn } from '../../utils/utils';

interface SupplierCardProps {
  name: string;
  industry: string;
  rating: number;
  country: string;
  verified: boolean;
  status: 'Active' | 'Under Review' | 'Suspended';
  delay?: number;
}

export default function SupplierCard({ name, industry, rating, country, verified, status, delay = 0 }: SupplierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-midnight-600 to-midnight-800 flex items-center justify-center border border-white/10 group-hover:border-accent-cyan/50 transition-colors">
          <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
        </div>
        {verified && (
          <div className="flex items-center space-x-1 text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded-full text-xs font-medium border border-accent-cyan/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-sm text-slate-400 mb-4">{industry}</p>
      
      <div className="mt-auto space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-yellow-500 space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium text-white">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center text-slate-400 space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{country}</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs font-medium">
          <span className="text-slate-500">Status</span>
          <span className={cn(
            status === 'Active' ? "text-green-400" :
            status === 'Under Review' ? "text-orange-400" : "text-red-400"
          )}>{status}</span>
        </div>
      </div>
    </motion.div>
  );
}
