import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.tsx';
import Landing from './pages/Landing.tsx';
import Dashboard from './pages/Dashboard.tsx';
import TenderBoard from './pages/TenderBoard.tsx';
import PrivateBid from './pages/PrivateBid.tsx';
import Suppliers from './pages/Suppliers.tsx';
import Audit from './pages/Audit.tsx';
import Settings from './pages/Settings.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tenders" element={<TenderBoard />} />
          <Route path="/bids/new" element={<PrivateBid />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
