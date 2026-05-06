import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Search, SlidersHorizontal, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLeaves = async (status = filter) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/leaves?status=${status}`);
      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/leaves/${id}/status`, { status });
      toast.success(`Leave request ${status}`);
      fetchLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const filteredData = leaves.filter(l => 
    l.employee?.name.toLowerCase().includes(search.toLowerCase()) ||
    l.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Leave Requests Management</h1>
            <p className="text-slate-500 mt-1 text-sm">Approve or reject employee leaves.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
            </div>
            <div className="relative">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select 
                    title="Leave Status"
                    className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Request</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
            {loading ? (
                <div className="p-8 text-center text-slate-500">Loading requests...</div>
            ) : filteredData.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No requests found.</div>
            ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/60">
                    <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Employee</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Type</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date Range</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Reason</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredData.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{leave.employee?.name}</div>
                            <div className="text-xs text-slate-500">{leave.employee?.email} | Bal: {leave.employee?.leaveBalance}</div>
                        </td>
                        <td className="px-6 py-4 capitalize text-slate-800 font-medium">{leave.leaveType}</td>
                        <td className="px-6 py-4 text-slate-600">
                            <div>{format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}</div>
                            <div className="text-xs text-slate-400 mt-1">{leave.days} Day(s)</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                            <div className="max-w-[200px] truncate" title={leave.reason}>{leave.reason}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            {leave.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={() => handleStatusUpdate(leave._id, 'approved')}
                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-colors border border-green-200 hover:border-transparent"
                                        title="Approve"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-200 hover:border-transparent"
                                        title="Reject"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                    ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                `}>
                                    {leave.status}
                                </span>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
}
