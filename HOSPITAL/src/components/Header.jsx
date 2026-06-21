import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
 
  const token = localStorage.getItem("authToken");
  const cachedProfile = localStorage.getItem("userProfile");
  const user = token && cachedProfile ? JSON.parse(cachedProfile) : null;

   
  const handleSignOut = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/login");
  };

    
  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "#059669" : "#475569", 
    background: isActive ? "rgba(16,185,129,0.08)" : "transparent",
  });

  const baseLinkClass = "px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 text-center";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255, 255, 255, 0.85)", 
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(16, 185, 129, 0.08)", 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* ── Logo + Hospital Name ── */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#10b981,#059669)", 
              boxShadow: "0 2px 12px rgba(16,185,129,0.25)",
            }}
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div
              className="text-slate-900 font-bold text-base leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              MediCare Hospital
            </div>
            <div className="text-emerald-600 text-xs tracking-widest uppercase font-semibold">
              Est. 2000
            </div>
          </div>
        </NavLink>
 
        {/* ── Centered Desktop Links (Arranged inside a Rounded Container Box) ── */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav 
            className="flex items-center gap-1 p-1.5 rounded-xl"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(16, 185, 129, 0.12)",
              boxShadow: "0 4px 18px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(16, 185, 129, 0.03)"
            }}
          >
            <NavLink to="/" className={baseLinkClass} style={getLinkStyle}>
              Home
            </NavLink>
            
            <NavLink to="/doctor" className={baseLinkClass} style={getLinkStyle}>
              Doctors
            </NavLink>
            
            <NavLink to="/service" className={baseLinkClass} style={getLinkStyle}>
              Services
            </NavLink>
            
            <NavLink to="/my-appointment" className={baseLinkClass} style={getLinkStyle}>
              Appointments
            </NavLink>
            
            <NavLink to="/contact" className={baseLinkClass} style={getLinkStyle}>
              Contact
            </NavLink>
          </nav>
        </div>

        {/* ── Desktop Authentication / Profile Toggle Block ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            /* 👤 AUTHENTICATED USER DROPDOWN LAYOUT CONSOLE */
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/60 p-1.5 pl-4 rounded-xl">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-800">
                  {user.name}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">
                  {user.role} profile
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-lg shadow-xs transition-all active:scale-95"
              >
                Log Out
              </button>
            </div>
          ) : (
            /* 🔓 GUEST VISITOR CONTROLS MAP */
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#059669",
                  background: "rgba(16,185,129,0.04)",
                }}
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  boxShadow: "0 2px 12px rgba(16,185,129,0.2)",
                }}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden ml-auto text-slate-800 font-bold text-xl w-8 h-8 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-2 border-t border-slate-100"
          style={{ background: "rgba(255, 255, 255, 0.98)" }}
        >
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="text-left px-4 py-2 rounded-lg text-sm font-semibold" style={getLinkStyle}>
            Home
          </NavLink>
          
          <NavLink to="/doctor" onClick={() => setMenuOpen(false)} className="text-left px-4 py-2 rounded-lg text-sm font-semibold" style={getLinkStyle}>
            Doctors
          </NavLink>
          
          <NavLink to="/service" onClick={() => setMenuOpen(false)} className="text-left px-4 py-2 rounded-lg text-sm font-semibold" style={getLinkStyle}>
            Services
          </NavLink>
          
          <NavLink to="/my-appointment" onClick={() => setMenuOpen(false)} className="text-left px-4 py-2 rounded-lg text-sm font-semibold" style={getLinkStyle}>
            Appointments
          </NavLink>
          
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="text-left px-4 py-2 rounded-lg text-sm font-semibold" style={getLinkStyle}>
            Contact
          </NavLink>

          {/* Mobile Profile Actions Block */}
          <div className="pt-2 border-t border-slate-100 mt-1">
            {user ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">{user.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold">{user.role}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setMenuOpen(false); navigate("/login"); }}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold text-center"
                  style={{ border: "1px solid rgba(16,185,129,0.4)", color: "#059669" }}
                >
                  Log In
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate("/register"); }}
                  className="flex-1 py-2 rounded-xl text-sm font-bold text-white text-center"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}