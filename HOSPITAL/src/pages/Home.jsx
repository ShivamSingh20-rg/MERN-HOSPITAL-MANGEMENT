import { useNavigate } from "react-router-dom"; // Switched to React Router navigation
import StatCard from "../components/StatCard";
import Service from './Service';

const STATS = [
  { icon: "🏅", number: "25+", label: "Years of Excellence" },
  { icon: "👨‍⚕️", number: "150+", label: "Specialist Doctors" },
  { icon: "❤️", number: "50K+", label: "Happy Patients" },
  { icon: "🚑", number: "24/7", label: "Emergency Care" },
];

export default function Home() {
  const navigate = useNavigate(); // Hook for standard routing navigation

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ── Hero Section (Light Green & Crisp White Balance) ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "88vh",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%, #ecfdf5 100%)",
        }}
      >
        {/* Decorative Light Green Blobs */}
        <div
          className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #bbf7d0, transparent)" }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #86efac, transparent)" }}
        />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-emerald-500 opacity-60 animate-ping" />
        <div
          className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-green-400 opacity-60 animate-ping"
          style={{ animationDelay: "0.8s" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Left: Text Content */}
          <div>
            <span
              className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#16a34a",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              Advanced Healthcare Platform
            </span>
            <h1
              className="font-bold leading-tight mb-6 text-slate-900"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(2.2rem,5vw,3.8rem)",
              }}  
              
            > Your Health,<br />
              <span style={{ color: "#10b981" }}>Our Priority</span>
            </h1>
            <p className="text-slate-600 mb-10 leading-relaxed text-lg">
              Comprehensive hospital management delivering world-class care through
              cutting-edge technology and compassionate service.
            </p>
            
            {/* Call To Actions */}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/appointments")}
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                }}
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate("/services")}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  border: "1px solid rgba(16,185,129,0.4)",
                  color: "#059669",
                  background: "rgba(16,185,129,0.04)",
                }}
              >
                Our Services →
              </button>
            </div>
          </div>

          {/* Right: Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>
<div className="h-[2px] w-full bg-emerald-500/20 my-8"></div>
      <section className="py-24 px-8 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <Service />
        </div>
      </section>

 
      <section
        className="py-20 px-8 text-center text-slate-900"
        style={{ background: "linear-gradient(135deg, #dcfce7, #f0fdf4)" }}
      >
        <h2
          className="text-3xl font-bold mb-4 text-emerald-950"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Need Emergency Care?
        </h2>
        <p className="text-emerald-800 max-w-xl mx-auto mb-8 font-medium">
          Our emergency medical team is available round-the-clock for any medical situation.
        </p>
        <button
          className="px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-md shadow-emerald-700/20"
          style={{
            background: "linear-gradient(135deg,#059669,#047857)",
          }}
        >
          📞 Call Emergency: 1800-XXX-XXXX
        </button>
      </section>
    </div>
  );
}