import React, { useState } from 'react';
import axios from 'axios';
import {API_URL} from '../src/API_URL/Api'
export default function AdminDashboard() {
  const [staffData, setStaffData] = useState({ name: '', email: '', password: '', role: 'doctor' });

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`${API_URL}/auth/admin/create-user`, staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Successfully provisioned account identity context for role: [${staffData.role}]`);
      setStaffData({ name: '', email: '', password: '', role: 'doctor' });
    } catch (err) {
      alert(err.response?.data?.message || "Internal administrative authorization failure.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-md">
          <div>
            <span className="bg-rose-500 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase">Core Admin Workspace</span>
            <h1 className="text-2xl font-black mt-1" style={{ fontFamily: "'Georgia', serif" }}>Hospital Administration Control Desk</h1>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="bg-slate-800 hover:bg-rose-600 text-xs font-bold px-4 py-2 rounded-xl transition-all">Secure Exit</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
            <h3 className="text-sm font-black text-slate-800">Operational Summary</h3>
            <p className="text-xs text-slate-400">Manage user access configurations and clinical asset updates.</p>
          </div>

          {/* User Account Provision Form */}
          <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Provision Workforce Identity Profiles</h2>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                  <input type="text" required value={staffData.name} onChange={e => setStaffData({...staffData, name: e.target.value})} className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-200" placeholder="Dr. Mark Miller" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Account Role Assignment</label>
                  <select value={staffData.role} onChange={e => setStaffData({...staffData, role: e.target.value})} className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <option value="doctor">Clinical Specialist (Doctor)</option>
                    <option value="admin">Operations Controller (Admin)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Login Email</label>
                <input type="email" required value={staffData.email} onChange={e => setStaffData({...staffData, email: e.target.value})} className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-200" placeholder="staff@hospital.com" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Initial Entrance Password</label>
                <input type="password" required value={staffData.password} onChange={e => setStaffData({...staffData, password: e.target.value})} className="w-full text-sm p-2.5 rounded-xl bg-slate-50 border border-slate-200" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-600 transition-colors">
                Authorize Account and Generate Credentials
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}