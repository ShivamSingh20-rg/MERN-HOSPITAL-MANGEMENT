// src/Admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function SidebarOutlet() {
  return (
    <div className="flex bg-slate-100 min-h-screen font-sans antialiased">
    
      <AdminSidebar />
      
       
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet /> 
      </main>
    </div>
  );
}