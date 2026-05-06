import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';
import AdminDashboard from './pages/admin/Dashboard';
import AllLeaves from './pages/admin/AllLeaves';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'employee' | 'any' }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && role !== 'any' && user.role !== role) return <Navigate to="/" replace />;
  
  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Dynamic Root Route based on role */}
      <Route path="/" element={
        <ProtectedRoute role="any">
          {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
        </ProtectedRoute>
      } />

      {/* Employee Routes */}
      <Route path="/apply" element={
        <ProtectedRoute role="employee">
          <ApplyLeave />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute role="employee">
          <LeaveHistory />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/requests" element={
        <ProtectedRoute role="admin">
          <AllLeaves />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

