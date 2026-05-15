import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authentication.store';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div className="text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard/overview" replace />;

  return children;
};

export default AdminRoute;
