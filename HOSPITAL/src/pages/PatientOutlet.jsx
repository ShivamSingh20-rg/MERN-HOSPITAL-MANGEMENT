// src/components/PatientLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function PatientOutlet() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}