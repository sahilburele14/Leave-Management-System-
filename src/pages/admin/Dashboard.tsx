import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Users, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">System overview and leave metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Employees</p>
            <p className="text-4xl font-semibold text-slate-900">{stats.totalEmployees}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Pending Requests</p>
            <p className="text-4xl font-semibold text-slate-900">{stats.pendingRequests}</p>
          </div>
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Approved Leaves</p>
            <p className="text-4xl font-semibold text-slate-900">{stats.approvedTotal}</p>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Rejected Leaves</p>
            <p className="text-4xl font-semibold text-slate-900">{stats.rejectedTotal}</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
