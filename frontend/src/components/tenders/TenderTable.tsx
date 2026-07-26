
import { Eye, Send } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

const dummyTenders = [
  { id: 'TND-2024-081', title: 'Zero-Knowledge Compute Nodes', department: 'Defense', budget: '$4.5M', closing: 'Oct 15, 2024', visibility: 'Private', status: 'Open' },
  { id: 'TND-2024-079', title: 'Secure Supply Chain Auditing', department: 'Logistics', budget: '$1.2M', closing: 'Sep 30, 2024', visibility: 'Public', status: 'Open' },
  { id: 'TND-2024-075', title: 'Confidential Medical Records DB', department: 'Health', budget: '$8.0M', closing: 'Sep 10, 2024', visibility: 'Restricted', status: 'Closed' },
  { id: 'TND-2024-072', title: 'Encrypted Communication Protocols', department: 'Intelligence', budget: '$12.5M', closing: 'Aug 25, 2024', visibility: 'Private', status: 'Awarded' },
];

export default function TenderTable() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-midnight-800/50 backdrop-blur-sm">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-midnight-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-white/5">
          <tr>
            <th className="px-6 py-4">Tender ID</th>
            <th className="px-6 py-4">Title & Department</th>
            <th className="px-6 py-4">Budget</th>
            <th className="px-6 py-4">Closing Date</th>
            <th className="px-6 py-4">Visibility</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {dummyTenders.map((tender) => (
            <tr key={tender.id} className="hover:bg-midnight-700/30 transition-colors group">
              <td className="px-6 py-4 font-mono text-accent-cyan">{tender.id}</td>
              <td className="px-6 py-4">
                <div className="font-medium text-white">{tender.title}</div>
                <div className="text-xs text-slate-500 mt-1">{tender.department}</div>
              </td>
              <td className="px-6 py-4">{tender.budget}</td>
              <td className="px-6 py-4">{tender.closing}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border",
                  tender.visibility === 'Private' ? "bg-accent-purple/10 text-accent-purple border-accent-purple/20" :
                  tender.visibility === 'Restricted' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                  "bg-green-500/10 text-green-400 border-green-500/20"
                )}>
                  {tender.visibility}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", tender.status === 'Open' ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" : tender.status === 'Closed' ? "bg-red-400" : "bg-accent-indigo")} />
                  <span>{tender.status}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="View Details">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/bids/new')} className="p-2 rounded-lg hover:bg-accent-purple/20 text-slate-400 hover:text-accent-purple transition-colors" title="Submit Bid">
                  <Send className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
