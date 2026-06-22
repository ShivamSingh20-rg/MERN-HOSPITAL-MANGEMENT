 export default function StatCard({ icon, number, label }) {
  return (
    <div
      className="rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1" style={{ color: "#38bdf8" }}>
        {number}
      </div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}
