import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../API_URL/Api';

const ServiceCard = ({ service, onBook }) => {
  const navigate = useNavigate();
  console.log('servicecard', service);

  // Destructure fields safely (using a fallback object to prevent destructuring crashes)
  const { name, category, image, _id } = service || {};
   
  const baseHost = API_URL.startsWith('http') 
    ? API_URL.replace('/api', '') 
    : 'http://localhost:3200'; 
  
  let completeImageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"; 
  
  if (image) {
    if (image.startsWith('http')) {
      completeImageUrl = image;
    } else {
      const separator = image.startsWith('/') ? '' : '/';
      completeImageUrl = `${baseHost}${separator}${image}`;
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-emerald-50/40 border border-emerald-100/40 hover:border-emerald-400/50 transition-all duration-300 w-full max-w-[260px] mx-auto group
      shadow-[0_4px_20px_-4px_rgba(16,185,129,0.12)] 
      hover:shadow-[0_12px_24px_-4px_rgba(16,185,129,0.22)]"
    >
      
      {/* 🖼️ IMAGE WRAPPER: Changed to dynamic aspect ratio for maximum horizontal span */}
      <div 
        onClick={() => navigate(`/service/${_id}`)} 
        className="relative w-full aspect-video overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img 
          src={completeImageUrl} 
          alt={name} 
          // 🟢 FIXED: Added 'object-top' to display the upper portion of images, and forced 'w-full' width expansion
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400";
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/20 via-transparent to-transparent" />
      </div>

      {/* Content Container Area */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4 text-center items-center">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
          {name}
        </h3>

        <button
          // 🟢 FIXED: Changed navigation routing parameter target from 'service.id' to your correct unique '_id' definition
          onClick={() => {
            if (onBook) onBook(service);
            navigate(`/service/${_id}`);
          }}
          className="w-full text-white font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 group/btn hover:opacity-95 active:scale-[0.98] cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)"
          }}
        >
          <span>Book Now</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3.5 w-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default ServiceCard;