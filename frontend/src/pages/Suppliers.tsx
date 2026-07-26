
import SupplierCard from '../components/suppliers/SupplierCard';
import { Filter } from 'lucide-react';

const suppliers = [
  { id: 1, name: 'CyberDyn Systems', industry: 'Defense Tech', rating: 4.9, country: 'USA', verified: true, status: 'Active' as const },
  { id: 2, name: 'Global Logistics Inc', industry: 'Supply Chain', rating: 4.5, country: 'UK', verified: true, status: 'Active' as const },
  { id: 3, name: 'SecureHealth Partners', industry: 'Medical DB', rating: 4.2, country: 'Canada', verified: false, status: 'Under Review' as const },
  { id: 4, name: 'Nexus Intelligence', industry: 'Data Analytics', rating: 4.8, country: 'Germany', verified: true, status: 'Active' as const },
  { id: 5, name: 'Quantum Core', industry: 'Hardware', rating: 3.5, country: 'Japan', verified: false, status: 'Suspended' as const },
  { id: 6, name: 'Aero Defense Group', industry: 'Aviation', rating: 4.7, country: 'USA', verified: true, status: 'Active' as const },
];

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Approved Suppliers</h1>
          <p className="text-slate-400">Manage and evaluate vendor trust ratings.</p>
        </div>
        <button className="btn-secondary flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filter Vendors</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {suppliers.map((s, idx) => (
          <SupplierCard key={s.id} delay={idx * 0.1} {...s} />
        ))}
      </div>
    </div>
  );
}
