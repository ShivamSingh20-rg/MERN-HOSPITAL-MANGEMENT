import React from 'react';
import { useNavigate } from 'react-router-dom';

 
import { API_URL } from '../API_URL/Api';

const DoctorCard = ({ dat, onBook }) => {
  const { name, category, experience, image, _id } = dat;
 
  const baseHost = API_URL.startsWith('http') 
    ? API_URL.replace('/api', '') 
    : 'http://localhost:3200'; //  

   
  let completeImageUrl = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"; 

  if (image) {
    if (image.startsWith('http')) {
      completeImageUrl = image;
    } else {
      // Ensure there's exactly one slash separating host and image path
      const separator = image.startsWith('/') ? '' : '/';
      completeImageUrl = `${baseHost}${separator}${image}`;
    }
  }
 
const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/40 hover:border-emerald-400/50 transition-all duration-300 w-full max-w-[260px] group
      shadow-[0_4px_20px_-4px_rgba(16,185,129,0.12)] 
      shadow-[0_12px_24px_-4px_rgba(16,185,129,0.22)]"
    >
       
      <div 
        onClick={() => navigate(`/doctor/${_id}`)} 
        className="relative w-24 h-24 mb-4 rounded-full p-1 bg-white ring-2 ring-slate-100 group-hover:ring-emerald-400 transition-all duration-300 overflow-hidden flex items-center justify-center shadow-xs cursor-pointer"
      >
        <img 
          src={completeImageUrl} 
          alt={name} 
          className="w-full h-full object-cover rounded-full filter grayscale-[10%] group-hover:grayscale-0 transition-all duration-300 scale-100 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
           
            e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150";
          }}
        />
      </div>

      <div className="flex-grow flex flex-col items-center">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
          {name}
        </h3>
        
        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
          {category}
        </p>
        
        <p className="text-[11px] text-slate-600 mt-2 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/50 font-medium shadow-2xs">
          💼 {experience} Years Exp
        </p>
      </div>

      {/* Action Button */}
      <div className="mt-4 w-full">
        <button
          onClick={() => {
            if (onBook) onBook(dat);
            navigate(`/doctor/${_id}`); 
          }}
          className="w-full text-white font-semibold py-2 px-3 rounded-lg text-xs transition-all duration-200 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 group/btn hover:opacity-95 active:scale-[0.98]"
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default DoctorCard;