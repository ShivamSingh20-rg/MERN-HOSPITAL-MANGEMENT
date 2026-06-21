import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

 
const sidebarConfig = [
  {
    id: 'dashboard',
    title: '📊 Dashboard Overview',
    basePath: '/admin/dashboard',
    subLinks: [
      { path: '/admin/create-user', label: '👤 Create User Accounts' },
      { path: '/admin/manage-doctors', label: '🩺 Doctors Dashboard' }, 
      { path: '/admin/manage-services', label: '🩺 Servie Dashboard' },
      { path: '/admin/appointments-ledger', label: '📅 All Appointments' },
      { path: '/admin/total-patients', label: '👥 Total Registered Patients' },
    ]
  },
  {
    id: 'manage',
    title: '🛠️ Manage Engine',
    basePath: '/admin/manage-services',
    subLinks: [
      { path: '/admin/add-doctor', label: '➕ Add New Doctor' },
      { path: '/admin/edit-doctors', label: '📝 Edit Doctor Profiles' },
      { path: '/admin/add-service', label: '🧪 Add New Service' },
      { path: '/admin/system-logs', label: '📝 Edit Service' },
      { path: '/admin/system-logs', label: 'All Staff ID/Pass' },
    ]
  },
   
];

export default function AdminSidebar() {
  const navigate = useNavigate();
 
  const [activeMenu, setActiveMenu] = useState(null);
  
  const cachedProfile = localStorage.getItem("userProfile");
  const adminName = cachedProfile ? JSON.parse(cachedProfile).name : "Administrator";

  const handleToggle = (id, e) => {
    e.preventDefault();
  
    setActiveMenu(activeMenu === id ? null : id);
  };

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
      isActive ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
    }`;

  const subLinkClass = ({ isActive }) => 
    `flex items-center gap-2.5 pl-9 pr-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
      isActive ? "text-emerald-400 bg-slate-800/50 font-bold" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/30"
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 h-screen sticky top-0 flex flex-col justify-between p-5 shrink-0 border-r border-slate-800 z-40">
      <div className="space-y-7 overflow-y-auto no-scrollbar">
        
      
        <div className="border-b border-slate-800 pb-5 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-white text-sm">M</div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide">MediCare Control</h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">HQ Terminal</p>
            </div>
          </div>
        </div>

        
        <nav className="flex flex-col gap-1.5">
          {sidebarConfig.map((menu) => {
            const isOpen = activeMenu === menu.id;  

            return (
              <div key={menu.id} className="relative flex flex-col gap-1">
                <div className="flex items-center justify-between group">
                  <NavLink to={menu.basePath} end={menu.id === 'dashboard'} className={`${linkClass} flex-1`}>
                    <span>{menu.title}</span>
                  </NavLink>
                  
              
                  <button 
                    onClick={(e) => handleToggle(menu.id, e)}
                    className={`absolute right-2 p-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                      isOpen 
                        ? "bg-emerald-500 text-white border-emerald-400 scale-100 rotate-45" 
                        : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    <span className="block w-3 h-3 flex items-center justify-center text-sm leading-none">+</span>
                  </button>
                </div>

               
                {isOpen && (
                  <div className="flex flex-col gap-1 pl-1 mt-1 border-l border-slate-800 ml-4 animate-fadeIn">
                    {menu.subLinks.map((sub, idx) => (
                      <NavLink key={idx} to={sub.path} className={subLinkClass}>
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Signout */}
      <div className="bg-slate-950/60 border border-slate-800/50 p-3.5 rounded-2xl space-y-3 mt-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200 truncate">{adminName}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">System Administrator</span>
        </div>
        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="w-full text-center bg-slate-800 hover:bg-rose-950 border border-slate-700 text-slate-300 hover:text-rose-400 font-bold text-[11px] py-2 rounded-xl transition-all"
        >
          Exit Admin Engine
        </button>
      </div>
    </aside>
  );
}