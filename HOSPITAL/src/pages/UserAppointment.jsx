import React, { useState, useEffect } from 'react';
import { API_URL } from '../API_URL/Api';

export default function UserAppointment() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${API_URL}/appointment/my-appointment`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (res.ok && json.success) {
          setMyBookings(Array.isArray(json.data) ? json.data : []);
        } else {
          setMyBookings([]);  
        }
      } catch (err) {
        console.error("Failed loading personal records mapping", err);
        setMyBookings([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchUserAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 animate-pulse">Loading your schedules...</div>
      </div>
    );
  }

  const doctorAppointments = myBookings.filter(booking => !booking.serviceId);
  const serviceBookings = myBookings.filter(booking => booking.serviceId || booking.serviceName);

  const StatusBadge = ({ status }) => {
    const styles = 
      status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
      status === 'Completed' ? 'bg-slate-800 text-slate-100 border-slate-700' :
      status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-300' : 
      'bg-amber-100 text-amber-800 border-amber-300';

    return (
      <span className={`inline-flex items-center text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow-2xs tracking-wider ${styles}`}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse bg-current"></span>
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-emerald-50/60 via-white to-emerald-50/20 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* HEADER BRANDING CARD */}
        <div className="bg-white border border-emerald-100/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden backdrop-blur-md">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-100/40 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
              My Bookings <span className="text-emerald-600">Dashboard</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Easily track, manage, and review your medical consultations and diagnostic laboratory services.
            </p>
          </div>
        </div>

        {/* SECTION 1: DOCTOR CONSULTATIONS */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <span className="text-xl">🩺</span>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Doctor Consultations</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {doctorAppointments.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((booking) => (
                <div key={booking._id} className="bg-white border border-emerald-100/70 hover:border-emerald-300 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-xs hover:shadow-md transition-all duration-300 group">
                  <div className="space-y-2">
                    <StatusBadge status={booking.appointmentStatus} />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {booking.doctorName || "General Practitioner"}
                      </h3>
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mt-0.5">
                        {booking.specialization || "General Medicine"}
                      </p>
                    </div>
                    
                    <div className="pt-1 text-xs font-medium text-slate-600 space-y-1 border-t border-slate-50">
                      <p className="flex items-center gap-1.5"><span className="text-slate-400">Patient:</span> <span className="font-semibold text-slate-800">{booking.patientName}</span> ({booking.patientAge} Yrs)</p>
                      <p className="flex items-center gap-1.5"><span className="text-slate-400">Schedule:</span> <span className="font-semibold text-slate-800">{booking.appointmentDate}</span></p>
                    </div>
                  </div>

                  <div className="sm:text-right border-t border-emerald-50 sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block sm:text-right">Consultation Fee</span>
                      <span className="text-2xl font-black text-slate-900 block sm:text-right">₹{booking.fee}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded-md font-medium border border-emerald-100/50">
                        Gateway: <b className="uppercase font-bold text-slate-700">{booking.paymentMethod}</b> ({booking.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-emerald-200 rounded-2xl bg-emerald-50/20 p-6">
                <span className="text-2xl block mb-2 opacity-60">📅</span>
                <p className="text-xs font-bold text-emerald-800/60 uppercase tracking-wider">No Consultation History</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your booked doctor visits will show up here.</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: LAB & DIAGNOSTIC SERVICES */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-1">
            <span className="text-xl">🧪</span>
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Lab & Diagnostic Services</h2>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {serviceBookings.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {serviceBookings.length > 0 ? (
              serviceBookings.map((booking) => (
                <div key={booking._id} className="bg-white border border-teal-100/70 hover:border-teal-300 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-xs hover:shadow-md transition-all duration-300 group">
                  <div className="space-y-2">
                    <StatusBadge status={booking.appointmentStatus} />
                    <div>
                      <h3 className="text-base font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors">
                        {booking.serviceName}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                        <span>📍</span> {booking.doctorName || "Lab Diagnostics Center"}
                      </p>
                    </div>
                    
                    <div className="pt-1 text-xs font-medium text-slate-600 space-y-1 border-t border-slate-50">
                      <p className="flex items-center gap-1.5"><span className="text-slate-400">Patient:</span> <span className="font-semibold text-slate-800">{booking.patientName}</span> ({booking.patientGender})</p>
                      <p className="flex items-center gap-1.5"><span className="text-slate-400">Testing Date:</span> <span className="font-semibold text-slate-800">{booking.appointmentDate}</span></p>
                    </div>
                  </div>

                  <div className="sm:text-right border-t border-teal-50 sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block sm:text-right">Service Cost</span>
                      <span className="text-2xl font-black text-emerald-600 block sm:text-right">₹{booking.fee}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] text-teal-800 bg-teal-50/80 px-2 py-1 rounded-md font-medium border border-teal-100/50">
                        Gateway: <b className="uppercase font-bold text-slate-700">{booking.paymentMethod}</b> ({booking.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-teal-200 rounded-2xl bg-teal-50/20 p-6">
                <span className="text-2xl block mb-2 opacity-60">🔬</span>
                <p className="text-xs font-bold text-teal-800/60 uppercase tracking-wider">No Booked Lab Services</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your prescription lab orders will appear here automatically.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}