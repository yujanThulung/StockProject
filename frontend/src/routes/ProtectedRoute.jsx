// import React from 'react';

// import {Navigate} from 'react-router-dom';
// import {useCookies} from 'react-cookie';


// const ProtectedRoute = ({children})=>{
//     const[cookies] = useCookies(['token']);
    
//     if(!cookies.token){
//         return <Navigate to="/login" replace/>;
//     }

//     return children;
// }

// export default ProtectedRoute;

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authentication.store";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check auth status when component mounts
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;