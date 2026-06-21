import React from 'react';
import ServiceCard from '../components/ServiceCard';
import {useState,useEffect} from 'react'
import {API_URL} from '../API_URL/Api'
import axios from 'axios';
const Service = () => {
   const [data, setData] = useState([]);
  useEffect(() => {
    const fetchdoctor = async() => {
     const res = await axios .get(`${API_URL}/public/get-services`)
     setData(res.data)
    };
    fetchdoctor();
    
  }, []);


  const handleBooking = (serviceTitle) => {
    alert(`Opening booking portal for: ${serviceTitle}`);
  };
  console.log(data)

  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Soft Green Auras */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#059669"
            }}
          >
            Comprehensive Care
          </span>
          <h2
            className="mt-2 text-4xl font-bold sm:text-5xl text-slate-900 tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Our Medical <span style={{ color: "#10b981" }}>Services</span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
            We offer a full range of medical services designed to meet all your
            healthcare needs under one unified roof.
          </p>
        </div>

        {/* Services Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {data.map((dt) => (
           
            <ServiceCard 
              key={dt._id} 
              service={dt} 
              onBook={handleBooking} 
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Service;