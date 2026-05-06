import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 px-8 py-6 h-full overflow-y-auto">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
