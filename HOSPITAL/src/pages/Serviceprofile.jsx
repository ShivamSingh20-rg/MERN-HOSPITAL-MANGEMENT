import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../API_URL/Api';
import { useBooking } from './Context'; // 👈 Using your centralized global hook layer

export default function ServiceProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🟢 Connect your central Context API actions safely
  const { handleServiceBookingSubmit, isBoooking } = useBooking();
 
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAddress, setPatientAddress] = useState("");  
  const [selectedDate, setSelectedDate] = useState("");  
  
  // 🟢 Changed default state from "counter" to "cod" to match your context and backend schemas cleanly
  const [paymentMethod, setPaymentMethod] = useState("cod"); 

  useEffect(() => {
    const fetchLiveServiceRecord = async () => {
      try {
        setLoading(true);
        const cleanUrl = `${API_URL}/public/get-services/${id}`.replace(/([^:]\/)\/+/g, "$1");
        const response = await fetch(cleanUrl);
        const json = await response.json();
        
        if (response.ok && json.success) {
          setService(json.data);
        } else {
          setService(null);
        }
      } catch (err) {
        console.error("Transmission breakdown retrieving service metadata: ", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLiveServiceRecord();
  }, [id]);
 
  const calculatedServiceImage = useMemo(() => {
    if (!service || !service.image) return "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400";
    if (service.image.startsWith('http')) return service.image;

    const host = API_URL.replace('/api', '');
    const joinSlash = service.image.startsWith('/') ? '' : '/';
    return `${host}/uploads/${service.image.split('/uploads/')[1] || service.image}`;
  }, [service]);

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  // 🟢 Refactored submission pipeline over to Context API
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Package your form data properties into a clean object argument model
    const patientDetailsPayload = {
      name: patientName,
      age: patientAge,
      gender: patientGender,
      phone: patientPhone,
      address: patientAddress,
      date: selectedDate,
      paymentMethod: paymentMethod // 'cod' or 'online'
    };
 
    await handleServiceBookingSubmit(service, patientDetailsPayload, navigate);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] uppercase tracking-widest font-black mt-3">Fetching Clinical Metadata...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <h2 className="text-sm font-bold mb-2">Service facility record not verified or active.</h2>
        <button onClick={() => navigate(-1)} className="text-emerald-600 text-xs font-black hover:underline tracking-tight">
          ← Exit Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/20 via-white to-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <button onClick={() => navigate(-1)} className="mb-5 text-emerald-700 font-bold flex items-center gap-2 hover:text-emerald-600 transition-all text-xs group cursor-pointer">
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Hospital Services
        </button>

        {/* Dynamic Service Overview Display */}
        <div className="bg-white/90 rounded-2xl border border-emerald-100/60 p-4 sm:p-5 shadow-[0_8px_30px_rgba(16,185,129,0.03)] backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            
            <div className="w-full sm:w-32 h-24 sm:h-32 shrink-0 rounded-xl border border-emerald-100/60 shadow-xs overflow-hidden bg-slate-50">
              <img 
                src={calculatedServiceImage} 
                alt={service.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"; }}
              />
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div>
                <span className="bg-emerald-600 text-white text-[9px] tracking-wider font-black px-2 py-0.5 rounded-sm uppercase">
                  {service.category || "General Checkup"}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
                  {service.name}
                </h1>
                <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-normal font-medium">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs pt-0.5">
                <div className="px-3 py-1.5 bg-emerald-50/40 rounded-lg border border-emerald-100/60 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Base Tariff:</span>
                  {/* 🟢 FIX: Aligned variable naming to service.cost to keep it secure */}
                  <span className="text-emerald-600 font-black">₹{service.fee || service.fee|| service.fee}</span>
                </div>
                <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Frame:</span>
                  <span className="text-slate-700 font-bold">⏱️ {service.duration || '30'} Minutes</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-stretch">
  
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-xs">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
                Book Appointment Registration
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Configure your appointment parameters and registration context fields below.</p>
            </div>

            {/* Calendar Selection block */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. Select Checkup Date</label>
              <input
                type="date"
                required
                min={todayString}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
              />
            </div>

            {/* Demographics Block inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Patient Full Name</label>
                <input
                  type="text" required placeholder="Full name" value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Patient Age</label>
                  <input
                    type="number" required min="1" max="120" placeholder="Years" value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Patient Gender</label>
                  <select
                    required value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:bg-white focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="" disabled hidden>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Contact Number</label>
                  <input
                    type="tel" required placeholder="Mobile number" value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Patient Address</label>
                  <input
                    type="text" required placeholder="Complete residence address" value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option Selector block */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">3. Select Payment Option</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-emerald-600 h-4 w-4" />
                  <span className="text-xs font-semibold">Pay at Counter</span>
                </label>
                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="accent-emerald-600 h-4 w-4" />
                  <span className="text-xs font-semibold">Pay Online</span>
                </label>
              </div>
            </div>

            {/* Use the shared global isBooking tracking state variable now */}
            <button type="submit" disabled={isBoooking} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer pt-3">
              {isBoooking ? 'Processing Transmission Streams...' : 'Confirm Clinical Service Booking'}
            </button>
          </div>

          {/* 📋 RIGHT COLUMN: LIVE DATA RECEIPT LEDGER */}
          <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Record Summary</h3>
                <p className="text-[10px] text-slate-400">Verifying targeted dynamic facility parameters in real-time.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-800">
                  <span className="text-slate-400 font-medium">Facility Module:</span>
                  <span className="font-extrabold text-white text-right max-w-[150px] truncate">{service.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-800">
                  <span className="text-slate-400 font-medium">Estimated Frame:</span>
                  <span className="font-bold text-slate-300">⏱️ {service.duration || '30'} Min</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-800">
                  <span className="text-slate-400 font-medium">Token Base Fee:</span>
                  <span className="font-black text-emerald-400 text-sm">₹{service.cost}</span>
                </div>
              </div>

              {/* Real-time State Mirror Block ledger */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Patient Document Metrics</p>
                
                <div className="text-xs space-y-2.5">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Scheduled Date</p>
                    <p className="font-bold text-slate-200">{selectedDate ? `🗓️ ${selectedDate}` : "⚠️ Select calendar date"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Full Name</p>
                    <p className="font-bold text-slate-200 truncate">{patientName || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Age Axis</p>
                      <p className="font-bold text-slate-200">{patientAge ? `${patientAge} Yrs` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Gender</p>
                      <p className="font-bold text-slate-200">{patientGender || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Contact Registry</p>
                    <p className="font-bold text-slate-200">{patientPhone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Address Trace</p>
                    <p className="font-bold text-slate-300 line-clamp-1">{patientAddress || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Gateway Strategy</p>
                    <p className="font-black text-emerald-400 uppercase text-[10px]">💳 {paymentMethod === 'cod' ? "Counter Remittance" : "Online Checkout"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-slate-800 mt-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">🔒 Server-Side Encryption Verified</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}