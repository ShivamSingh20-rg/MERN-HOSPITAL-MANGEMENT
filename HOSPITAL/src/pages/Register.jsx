import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from '../API_URL/Api'
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('userProfile', JSON.stringify(res.data.user));
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration parameter failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>Register Patient</h2>
        <p className="text-slate-400 text-xs mb-6">Create a default account profile to book clinical procedures.</p>
        
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-emerald-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
            {loading ? "Registering User..." : "Establish Account"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-6">Already have an account? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Login here →</Link></p>
      </div>
    </div>
  );
}