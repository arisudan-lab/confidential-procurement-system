
import { motion } from 'framer-motion';
import { LayoutDashboard, Lock, Users, Briefcase, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const timelineData = [
  { name: 'Jan', tenders: 40, bids: 24 },
  { name: 'Feb', tenders: 30, bids: 13 },
  { name: 'Mar', tenders: 20, bids: 58 },
  { name: 'Apr', tenders: 27, bids: 39 },
  { name: 'May', tenders: 18, bids: 48 },
  { name: 'Jun', tenders: 23, bids: 38 },
  { name: 'Jul', tenders: 34, bids: 43 },
];

const stats = [
  { title: "Total Tenders", value: "142", icon: LayoutDashboard, trend: "+12%", trendUp: true, glowColor: "indigo" as const },
  { title: "Private Bids", value: "854", icon: Lock, trend: "+24%", trendUp: true, glowColor: "purple" as const },
  { title: "Approved Vendors", value: "68", icon: Users, trend: "+2%", trendUp: true, glowColor: "cyan" as const },
  { title: "Budget Protected", value: "$42.5M", icon: Briefcase, trend: "-5%", trendUp: false, glowColor: "purple" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Enterprise zero-knowledge procurement metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} delay={idx * 0.1} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Procurement Timeline</h3>
            <button className="text-sm text-accent-cyan hover:underline">View All Report</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTenders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => `${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tenders" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTenders)" />
                <Area type="monotone" dataKey="bids" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorBids)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Privacy Score</h3>
            <Activity className="w-5 h-5 text-accent-cyan" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <circle cx="96" cy="96" r="80" stroke="url(#gradient)" strokeWidth="12" fill="none" strokeDasharray="502" strokeDashoffset="50" className="drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-white">92</span>
                <span className="text-xs text-slate-400 mt-1">out of 100</span>
              </div>
            </div>
            
            <p className="text-center text-sm text-slate-400 mt-6 px-4">
              Your organization maintains excellent zero-knowledge standards across all active tenders.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
