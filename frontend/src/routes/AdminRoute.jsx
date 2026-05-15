import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authentication.store';
import Loader from '../components/common/Loader';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader text="Verifying admin access..." /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard/overview" replace />;

  return children;
};

export default AdminRoute;
