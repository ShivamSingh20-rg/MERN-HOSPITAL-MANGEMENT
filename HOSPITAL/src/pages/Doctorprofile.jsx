import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../API_URL/Api';
import { useBooking } from './Context'; // 🟢 INJECTING CENTRALIZED CONTEXT

export default function Doctorprofile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States for fetching dynamic profile records remain component-specific
  const [doctor, setDoctor] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // 🟢 CONSUMING SHARED FORM DATA VALUES & METHODS FROM CONTEXT API
  const {
    patientName, setPatientName,
    patientAge, setPatientAge,
    patientGender, setPatientGender,
    patientPhone, setPatientPhone,
    patientAddress, setPatientAddress,
    selectedDate, setSelectedDate,
    paymentMethod, setPaymentMethod,
    isBooking, todayString,
    handleBookingSubmit
  } = useBooking();
  
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const targetUrl = `${API_URL}/public/get-doctor/${id}`.replace(/([^:]\/)\/+/g, "$1");
        
        const response = await fetch(targetUrl);
        const json = await response.json();

        if (response.ok && json.success) {
          setDoctor(json.data);
        } else {
          setDoctor(null);
        }
      } catch (err) {
        console.error("❌ Error retrieving profile:", err);
        setDoctor(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (id) fetchDoctorProfile();
  }, [id]);
 
  const completeImageUrl = useMemo(() => {
    if (!doctor || !doctor.image) return "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300";
    if (doctor.image.startsWith('http')) return doctor.image;
    
    const backendBaseUrl = API_URL.replace('/api', ''); 
    const separator = doctor.image.startsWith('/') ? '' : '/';
    return `${backendBaseUrl}${separator}${doctor.image}`;
  }, [doctor]);

  const dynamicDaysArray = useMemo(() => {
    if (!doctor) return [];
 
    const baseDate = new Date();
    return Array.from({ length: 7 }, (_, i) => { 
      const nextDate = new Date();
      nextDate.setDate(baseDate.getDate() + i);
      const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      let isAvailable = false;
      if (doctor.availabilityRules && doctor.availabilityRules.workDays) {
        isAvailable = doctor.availabilityRules.workDays[dayName] === true;
      }

      return {
        labelDay: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
        labelNum: `${nextDate.getDate()} ${nextDate.toLocaleDateString('en-US', { month: 'short' })}`,
        dateValue: nextDate.toISOString().split('T')[0],
        isAvailable
      };
    });
  }, [doctor]);
 
  const operationalDaysText = useMemo(() => {
    if (!doctor || !doctor.availabilityRules || !doctor.availabilityRules.workDays) return "Flexible Schedule";
    const activeDays = Object.keys(doctor.availabilityRules.workDays).filter(day => doctor.availabilityRules.workDays[day]);
    if (activeDays.length === 7) return "Everyday Available";
    if (activeDays.length === 0) return "No Active Hours Appended";
    return activeDays.map(d => d.substring(0,3)).join(', ');
  }, [doctor]);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 mt-4 tracking-wider uppercase">Loading Specialist Profile Matrix...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 text-slate-800">
        <h2 className="text-xl font-bold mb-4">Doctor profile data could not be verified.</h2>
        <button onClick={() => navigate(-1)} className="text-emerald-600 font-semibold hover:text-emerald-700">← Go Back</button>
      </div>
    );
  }

  // 🟢 BRIDGE TRIGGER PASSED INTO GLOBAL CONTEXT HANDLER
  const onSubmitBridge = (e) => {
    e.preventDefault();
    handleBookingSubmit(doctor, navigate);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        <button onClick={() => navigate(-1)} className="mb-6 text-emerald-700 hover:text-emerald-600 font-bold flex items-center gap-2 transition-all text-sm group">
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Specialists List
        </button>

        {/* CARD DOCTOR BIOGRAPHY */}
        <div className="bg-white/80 rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-[0_12px_40px_rgba(16,185,129,0.06)] backdrop-blur-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full p-1.5 bg-white ring-4 ring-emerald-400/80 shadow-md overflow-hidden mb-4">
                <img 
                  src={completeImageUrl} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300"; }}
                />
              </div>
              <div className="flex gap-2 justify-center w-full">
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl px-3 py-1.5 text-center min-w-[100px]">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Experience</p>
                  <p className="text-xs font-black mt-0.5">{doctor.experience} Yrs</p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl px-3 py-1.5 text-center min-w-[100px]">
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Patients</p>
                  <p className="text-xs font-black text-emerald-600 mt-0.5">{doctor.patients || "100+"}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-emerald-600 text-white text-[10px] font-black tracking-wide px-2.5 py-0.5 rounded-md uppercase">
                    {doctor.category || doctor.specialization}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    Age: {doctor.age}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                    Gender: {doctor.gender}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mt-2" style={{ fontFamily: "'Georgia', serif" }}>
                  {doctor.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">{doctor.about || "No medical description bio available."}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Qualification</span>
                  <span className="text-slate-800 font-bold block mt-0.5">{doctor.qualification}</span>
                </div>
                <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Consultancy Fee</span>
                  <span className="text-emerald-600 font-black text-base block mt-0.5">₹{doctor.fee || doctor.fees}</span>
                </div>
                <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Clinic Location</span>
                  <span className="text-slate-700 font-medium block mt-0.5">📍 {doctor.location}</span>
                </div>
                <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Weekly Op Hours</span>
                  <span className="text-emerald-700 font-bold block mt-0.5 truncate">🗓️ {operationalDaysText}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SPLIT APPOINTMENT BOOKING WORKSPACE */}
        <form onSubmit={onSubmitBridge} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT INTERACTIVE FORM WORKSPACE */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 space-y-4 shadow-xs">
            <div>
              <h2 className="text-xl text-emerald-600 font-black tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Book Your Appointment
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Configure your check-in timeline and credential information inputs.</p>
            </div>

            {/* Main Calendar Engine */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1. Select Appointment Date</label>
              <input
                type="date"
                required
                min={todayString}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-sm p-3 rounded-xl bg-slate-50 text-slate-900 font-semibold border border-slate-200 focus:outline-hidden focus:border-emerald-500 transition-all"
              />

              {/* Day Shortcut Matrices */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {dynamicDaysArray.slice(0, 4).map((dayItem, index) => (
                  <button
                    key={dayItem.dateValue || index}
                    type="button"
                    disabled={!dayItem.isAvailable}
                    onClick={() => setSelectedDate(dayItem.dateValue)}
                    className={`py-1.5 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      selectedDate === dayItem.dateValue
                        ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-2xs'
                        : dayItem.isAvailable
                        ? 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'
                        : 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed opacity-40'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold tracking-tight opacity-80">{dayItem.labelDay}</span>
                    <span className="text-xs font-black mt-0.5">{dayItem.labelNum.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Parameters Entry Matrix */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Patient Full Name</label>
                <input
                  type="text" required placeholder="Full name" value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Patient Age</label>
                  <input
                    type="number" required min="1" max="120" placeholder="Years" value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Patient Gender</label>
                  <select
                    required value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-all"
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Contact Phone Line</label>
                  <input
                    type="tel" required placeholder="Contact number" value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Home Address</label>
                  <input
                    type="text" required placeholder="Residential address" value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Radios */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">3. Transaction Method</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'counter' ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="counter" checked={paymentMethod === "counter"} onChange={() => setPaymentMethod("counter")} className="accent-emerald-600 h-4 w-4" />
                  <span className="text-xs">Pay at Counter</span>
                </label>
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'online' ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="accent-emerald-600 h-4 w-4" />
                  <span className="text-xs">Pay Online</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={isBooking} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 active:scale-[0.99] cursor-pointer pt-3">
              {isBooking ? 'Processing Booking Request...' : 'Confirm Appointment Booking Request'}
            </button>
          </div>

          {/* RIGHT VIEWPORT LIVE OUTPUT */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between text-white shadow-xl">
            <div className="space-y-4">
              <div className="border-b border-slate-700/60 pb-2">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Live Record Summary</h3>
                <p className="text-[10px] text-slate-400">Verifying targeted practitioner parameters in real-time.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/40">
                  <span className="text-slate-400 font-medium">Doctor Name:</span>
                  <span className="font-extrabold text-white">{doctor.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/40">
                  <span className="text-slate-400 font-medium">Specialty Unit:</span>
                  <span className="font-bold text-emerald-400">{doctor.category || doctor.specialization}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-slate-700/40">
                  <span className="text-slate-400 font-medium">Consultancy Fee:</span>
                  <span className="font-black text-emerald-400 text-sm">₹{doctor.fee || doctor.fees}</span>
                </div>
              </div>

              {/* Input Mirror Block */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Patient Inputs Appended</p>
                
                <div className="text-xs space-y-2.5">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Target Date</p>
                    <p className="font-bold text-white">{selectedDate ? `🗓️ ${selectedDate}` : "⚠️ Select from calendar"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Patient Name</p>
                    <p className="font-bold text-white truncate">{patientName || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Age</p>
                      <p className="font-bold text-white">{patientAge ? `${patientAge} Yrs` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Gender</p>
                      <p className="font-bold text-white">{patientGender || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Phone Line</p>
                    <p className="font-bold text-white">{patientPhone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Residential Address</p>
                    <p className="font-bold text-slate-300 line-clamp-1">{patientAddress || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Payment Mode Strategy</p>
                    <p className="font-black text-emerald-400 uppercase text-[10px]">💳 {paymentMethod === 'counter' ? "Pay at Counter" : "Online Checkout"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">🔒 Server-Side Encryption Verified</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}