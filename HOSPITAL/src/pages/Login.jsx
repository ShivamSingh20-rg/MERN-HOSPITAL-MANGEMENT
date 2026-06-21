import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from '../API_URL/Api'
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userProfile', JSON.stringify(user));

 
      if (user.role === 'admin') navigate('/admin/overview');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/ ');
      
    } catch (err) {
      alert(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>Terminal Login</h2>
        <p className="text-slate-400 text-xs mb-6">Enter credentials to securely pass access gates.</p>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@hospital.com" className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-emerald-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-emerald-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-6">New patient? <Link to="/register" className="text-emerald-700 font-bold hover:underline">Create an account →</Link></p>
      </div>
    </div>
  );
}