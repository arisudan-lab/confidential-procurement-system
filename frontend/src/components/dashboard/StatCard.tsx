
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
  glowColor?: 'purple' | 'cyan' | 'indigo';
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, delay = 0, glowColor = 'indigo' }: StatCardProps) {
  const glowMap = {
    purple: 'group-hover:shadow-glow-purple text-accent-purple',
    cyan: 'group-hover:shadow-glow-cyan text-accent-cyan',
    indigo: 'group-hover:shadow-glow-indigo text-accent-indigo',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 group transition-all duration-300 hover:-translate-y-1 hover:bg-midnight-700/80 cursor-default"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 font-medium text-sm">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-4 space-x-2">
              <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trendUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                {trend}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-midnight-800/50 transition-all duration-300", glowMap[glowColor])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
