
import TenderTable from '../components/tenders/TenderTable';
import { Plus } from 'lucide-react';

export default function TenderBoard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tender Board</h1>
          <p className="text-slate-400">View and manage confidential procurement requests.</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Tender</span>
        </button>
      </div>

      <TenderTable />
    </div>
  );
}
