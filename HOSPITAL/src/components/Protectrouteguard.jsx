import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function Protectedrouteguard({ allowedRoles }) {
  const token = localStorage.getItem('authToken');
  const cachedProfile = localStorage.getItem('userProfile');
  
  if (!token || !cachedProfile) {
     
    return <Navigate to="/login" replace />;
  }

  const currentUser = JSON.parse(cachedProfile);

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}