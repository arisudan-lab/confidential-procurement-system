
import AuditTimeline from '../components/audit/AuditTimeline';
import { Download } from 'lucide-react';

export default function Audit() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-slate-400">Verifiable trace of all zero-knowledge transactions.</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-midnight-800/30 border border-white/5 rounded-2xl p-6 md:p-10">
        <AuditTimeline />
      </div>
    </div>
  );
}
