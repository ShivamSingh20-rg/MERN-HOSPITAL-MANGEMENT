import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <span className="text-4xl">🛑</span>
      <h2 className="text-2xl font-black text-slate-900 mt-4" style={{ fontFamily: "'Georgia', serif" }}>Access Restriction Active</h2>
      <p className="text-xs text-slate-400 max-w-sm mt-1">Your account role level lacks the security clearance needed to view this route console grid.</p>
      <button onClick={() => navigate(-1)} className="mt-6 text-xs text-emerald-700 font-bold hover:underline">← Turn Back</button>
    </div>
  );
}