import React, { useState } from 'react';
import { API_URL } from "../../src/API_URL/Api";
export default function AdminAddServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Diagnostics',
    cost: '',
    duration: '',
    description: '',
    imageUrl: '' // 🟢 Track Image URL string input
  });
  
  const [imageType, setImageType] = useState('file'); // 🟢 'file' or 'url' toggling
  const [imageFile, setImageFile] = useState(null);
  const [specInput, setSpecInput] = useState('');
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSpecification = () => {
    if (!specInput.trim()) return;
    setSpecifications([...specifications, specInput.trim()]);
    setSpecInput('');
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    const dataStream = new FormData();
    dataStream.append('name', formData.name);
    dataStream.append('category', formData.category);
    dataStream.append('cost', formData.cost);
    dataStream.append('duration', formData.duration);
    dataStream.append('description', formData.description);
    dataStream.append('specifications', JSON.stringify(specifications));
    
    // 🟢 Dynamic selection routing matching your doctor form
    if (imageType === 'file' && imageFile) {
      dataStream.append('image', imageFile);
    } else if (imageType === 'url' && formData.imageUrl) {
      dataStream.append('imageUrl', formData.imageUrl);
    }

    try {
      const cleanUrl = `${API_URL}/admin/add-service`.replace(/([^:]\/)\/+/g, "$1");
      const token = localStorage.getItem('authToken');

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataStream
      });
      const resData = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', text: '✨ Medical Service Onboarded Successfully!' });
        setFormData({ name: '', category: 'Diagnostics', cost: '', duration: '', description: '', imageUrl: '' });
        setImageFile(null);
        setSpecifications([]);
        e.target.reset();
      } else {
        setStatus({ type: 'error', text: resData.message || 'Error processing record.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };
 
  const getPreviewSrc = () => {
    if (imageType === 'file' && imageFile) return URL.createObjectURL(imageFile);
    if (imageType === 'url' && formData.imageUrl) return formData.imageUrl;
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 px-4 animate-fadeIn">
      <h1 className="text-2xl font-black text-slate-800 mb-6">🛠️ Register New Hospital Service</h1>

      {status.text && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-xs border ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>{status.text}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        
        {/* INPUT MODE TOGGLER SWITCH */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-700">Service Banner Graphic Mode</label>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button type="button" onClick={() => setImageType('file')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${imageType === 'file' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400'}`}>
              📁 Local File Upload
            </button>
            <button type="button" onClick={() => setImageType('url')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${imageType === 'url' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400'}`}>
              🌐 Web Image URL
            </button>
          </div>
        </div>

        {/* IMAGE PREVIEW AND INPUT ROUTER CONTAINER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-xl">
          <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
            {getPreviewSrc() ? (
              <img src={getPreviewSrc()} alt="Service Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/150?text=Invalid+URL'; }} />
            ) : (
              <span className="text-xl">📸</span>
            )}
          </div>

          <div className="w-full">
            {imageType === 'file' ? (
              <input type="file" required={!imageFile} accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
            ) : (
              <input type="url" name="imageUrl" required={!formData.imageUrl} value={formData.imageUrl} onChange={handleInputChange} placeholder="https://images.unsplash.com/photo-example-id..." className="w-full text-xs font-medium px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            )}
            <p className="text-[10px] text-slate-400 mt-1">This graphical asset represents the department card on the primary marketplace deck.</p>
          </div>
        </div>

        {/* CORE DETAILS MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Service Department Title</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g., MRI Brain Scan with Contrast" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Service Classification</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full text-xs font-bold px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500">
              <option value="Diagnostics">Diagnostics / Radiology</option>
              <option value="Laboratory">Laboratory / Pathology</option>
              <option value="Surgical">Surgical Procedures</option>
              <option value="Therapy">Therapy / Rehabilitation</option>
              <option value="General">General Checkup Plans</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Base Price Cost (₹)</label>
            <input type="number" name="cost" required value={formData.cost} onChange={handleInputChange} placeholder="5000" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">Estimated Duration Time (Minutes)</label>
            <input type="number" name="duration" required value={formData.duration} onChange={handleInputChange} placeholder="45" className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 mb-1">Technical Medical Description</label>
          <textarea name="description" rows="3" required value={formData.description} onChange={handleInputChange} placeholder="Provide an explicit clinical layout overview..." className="w-full text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none" />
        </div>

        {/* SPECIFICATIONS LIST MATRIX */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-700">Pre-requisite / Inclusions Guidelines</label>
          <div className="flex gap-2">
            <input type="text" value={specInput} onChange={(e) => setSpecInput(e.target.value)} placeholder="e.g., Requires 8 hours of fasting" className="flex-grow text-xs font-medium px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500" />
            <button type="button" onClick={addSpecification} className="bg-slate-900 text-white font-black text-xs px-4 rounded-xl hover:bg-slate-800">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {specifications.map((item, idx) => (
              <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                {item}
                <button type="button" onClick={() => removeSpecification(idx)} className="text-rose-500 font-black hover:text-rose-700">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md">
            {loading ? 'Transmitting Data Streams...' : '🚀 Publish Service Portfolio'}
          </button>
        </div>
      </form>
    </div>
  );
}
