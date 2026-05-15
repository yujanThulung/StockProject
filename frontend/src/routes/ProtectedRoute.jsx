
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authentication.store";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check auth status when component mounts
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader text="Verifying session..." /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;