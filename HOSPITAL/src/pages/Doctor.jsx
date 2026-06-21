import React from 'react';
import DoctorCard from '../components/DoctorCard';
import {useEffect,useState} from 'react';
 import axios from 'axios';
import {API_URL} from '../API_URL/Api'
const Doctor=() => {
const [data, setData] = useState([]);
  useEffect(() => {
    const fetchdoctor = async() => {
     const res = await axios .get(`${API_URL}/public/get-doctors`)
     setData(res.data)
    };
    fetchdoctor();
    
  }, []);

  console.log('this is data',data)

 
  

  const handleBooking = (doctorName) => {
    alert(`Initiating appointment booking flow for: ${doctorName}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      
   
      <div className="absolute top-24 left-0 w-72 h-72 bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        
      
        <div className="text-center mb-16">
          <span 
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#059669"
            }}
          >
            Medical Experts
          </span>
          <h1 
            className="mt-2 text-4xl font-bold sm:text-5xl text-slate-900 tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Meet Our <span style={{ color: "#10b981" }}>Specialist Doctors</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-slate-600 leading-relaxed">
            Consult with top-rated, experienced medical practitioners dedicated to your health and continuous recovery.
          </p>
        </div>

        
        {<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {data.map((dat) => (
            <DoctorCard 
              key={dat.id} 
         dat={dat}
              onBook={handleBooking} 
            />
          ))}
        </div> }

      </div>
    </div>
  );
};

export default Doctor;