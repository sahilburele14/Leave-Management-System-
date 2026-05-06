import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, CalendarCheck, LogOut, FileClock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const employeeLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/apply', icon: FileText, label: 'Apply Leave' },
    { to: '/history', icon: FileClock, label: 'My Leaves' },
  ];

  const adminLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/requests', icon: CalendarCheck, label: 'Leave Requests' },
  ];

  const links = user.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col items-stretch text-slate-800">
      <div className="h-16 flex items-center justify-center border-b font-bold text-xl tracking-tight text-blue-600">
        LeaveApp
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 flex flex-col gap-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
