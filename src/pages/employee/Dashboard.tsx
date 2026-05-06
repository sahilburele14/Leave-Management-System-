import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get('/leave/my-leaves');
        setLeaves(response.data.slice(0, 5)); // Just recent 5
      } catch (error) {
        console.error('Failed to fetch leaves', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Good to see you, {user?.name.split(' ')[0]}</h1>
        <p className="text-slate-500">Here is a quick overview of your leave status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Leave Balance</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{user?.leaveBalance}</p>
            <p className="text-xs text-slate-400 mt-2">Days remaining this year</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Approved Leaves</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">{approvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Recent Leave Requests</h2>
          <Link to="/history" className="text-sm text-blue-600 hover:text-blue-700 font-medium font-sans">View all</Link>
        </div>
        
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading requests...</div>
          ) : leaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <FileText className="w-10 h-10 text-slate-300 mb-3" />
                <p>No recent leave requests found.</p>
                <Link to="/apply" className="text-blue-600 mt-2 font-medium hover:underline">Apply for leave</Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Duration</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Days</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                {leaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 capitalize text-slate-800 font-medium">{leave.leaveType}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-slate-800">{leave.days}</td>
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

// Just an icon to prevent compilation errors since lucide-react import was missing above.
import { FileText } from 'lucide-react';
