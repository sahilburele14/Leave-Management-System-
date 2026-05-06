import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Search } from 'lucide-react';

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get('/leave/my-leaves');
        setLeaves(response.data);
      } catch (error) {
        console.error('Failed to fetch leaves', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter(l => 
    l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.status.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My Leave History</h1>
            <p className="text-slate-500 mt-1 text-sm">View all your previous and upcoming approved leave requests.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
                type="text"
                placeholder="Search leaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
            {loading ? (
                <div className="p-8 text-center text-slate-500">Loading history...</div>
            ) : filteredLeaves.length === 0 ? (
                <div className="p-12 text-center text-slate-500">No leaves found.</div>
            ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200/60">
                    <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Type</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date Range</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Duration</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Reason</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 capitalize text-slate-800 font-medium">{leave.leaveType}</td>
                        <td className="px-6 py-4 text-slate-600">
                            {format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-slate-800">{leave.days} Day(s)</td>
                        <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={leave.reason}>{leave.reason}</td>
                        <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                            ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                            ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${leave.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                            {leave.status}
                        </span>
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
