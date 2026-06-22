import React, { useState } from 'react';
import { API_URL } from "../../src/API_URL/Api";
export default function AdminAddDoctorPage() {
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'General Physician',
    age: '',
    gender: 'Male',  
    qualification: '',
    patients: '0+', 
    location: '',
    experience: '',
    fees: '',
    imageUrl: '' // 🟢 Track Image URL string input
  });

  const [availability, setAvailability] = useState({
    slotsPerDay: 8,
    durationMinutes: 30,
    startTime: '09:00',
    endTime: '17:00',
    workDays: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false,
    }
  });
  
  const [imageType, setImageType] = useState('file'); // 🟢 'file' or 'url' toggling
  const [imageFile, setImageFile] = useState(null);   // Renamed from image to clear naming confusion
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayCheckboxChange = (day) => {
    setAvailability({
      ...availability,
      workDays: { ...availability.workDays, [day]: !availability.workDays[day] }
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
 
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('specialization', formData.specialization);
    dataToSend.append('experience', formData.experience);
    dataToSend.append('fees', formData.fees);
    dataToSend.append('age', formData.age);
    dataToSend.append('gender', formData.gender);
    dataToSend.append('qualification', formData.qualification);
    dataToSend.append('patients', formData.patients);
    dataToSend.append('location', formData.location);
    dataToSend.append('availabilityRules', JSON.stringify(availability));
    
    // 🟢 Send based on chosen source mode
    if (imageType === 'file' && imageFile) {
      dataToSend.append('image', imageFile);
    } else if (imageType === 'url' && formData.imageUrl) {
      dataToSend.append('imageUrl', formData.imageUrl); 
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/add-doctor`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '🩺 Doctor onboarded and schedule active on frontend calendars!' });
        
        setFormData({ 
          name: '' , specialization: 'General Physician', 
          age: '', qualification: '', patients: '0+', location: '', 
          gender: 'Male', experience: '', fees: '', imageUrl: ''
        });
        setImageFile(null);
        e.target.reset();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to process registry request.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection failure.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to resolve avatar preview source cleanly
  const getPreviewSrc = () => {
    if (imageType === 'file' && imageFile) return URL.createObjectURL(imageFile);
    if (imageType === 'url' && formData.imageUrl) return formData.imageUrl;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">🩺 Onboard Doctor & Configure Calendar</h1>
        <p className="text-xs font-semibold text-slate-400">Add medical staff profiles and define their bookable working hour allocations</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-xs border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: PERSONAL CLINICAL PROFILE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-2">1. Clinical Credentials</h3>
          
          {/* IMAGE METHOD SELECTOR SWITCH */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-700">Profile Image Resource Mode</label>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button type="button" onClick={() => setImageType('file')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${imageType === 'file' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-400'}`}>
                📁 Upload Local File
              </button>
              <button type="button" onClick={() => setImageType('url')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${imageType === 'url' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-400'}`}>
                🌐 Inject Web URL
              </button>
            </div>
          </div>

          {/* DYNAMIC IMAGE INPUT RENDER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
            <div className="w-14 h-14 shrink-0 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
              {getPreviewSrc() ? (
                <img src={getPreviewSrc()} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/150'; }} />
              ) : (
                <span className="text-xl">📸</span>
              )}
            </div>

            <div className="w-full">
              {imageType === 'file' ? (
                <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
              ) : (
                <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} placeholder="https://images.unsplash.com/photo-example-id..." className="w-full text-xs font-medium px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
              )}
              <p className="text-[10px] text-slate-400 mt-1">This representation displays instantly across operational patient search layouts.</p>
            </div>
          </div>

          {/* INPUT FORM FIELDS CONTAINER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name || ''} onChange={handleInputChange} placeholder="Dr. Sarah Jenkins" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Age</label>
              <input type="number" name="age" required value={formData.age || ''} onChange={handleInputChange} placeholder="35" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>
          
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender || 'Male'} onChange={handleInputChange} className="w-full text-xs font-bold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Qualification</label>
              <input type="text" name="qualification" required value={formData.qualification || ''} onChange={handleInputChange} placeholder="MBBS, MD Cardiology" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Specialization / Category</label>
              <input type="text" name="specialization" required value={formData.specialization || ''} onChange={handleInputChange} placeholder="Cardiologist" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Patients Treated Count</label>
              <input type="text" name="patients" required value={formData.patients || ''} onChange={handleInputChange} placeholder="500+" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Clinic Room Location</label>
              <input type="text" name="location" required value={formData.location || ''} onChange={handleInputChange} placeholder="Block C, Room 402" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>
          
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Years of Experience</label>
              <input type="number" name="experience" required value={formData.experience || ''} onChange={handleInputChange} placeholder="12" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Consultation Fees (₹)</label>
              <input type="number" name="fees" required value={formData.fees || ''} onChange={handleInputChange} placeholder="500" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        {/* SECTION 2: AVAILABILITY MATRIX */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <h3 className="text-xs font-black uppercase text-indigo-500 tracking-wider border-b pb-2">2. Patient Calendar Slot Matrix</h3>
          
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2.5">Available Operational Days</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(availability.workDays).map((day) => {
                const checked = availability.workDays[day];
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayCheckboxChange(day)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                      checked 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Execution Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50">
            {loading ? 'Publishing Matrix Schedules...' : '🚀 Save Profile & Active Booking Availability'}
          </button>
        </div>

      </form>
    </div>
  );
}
