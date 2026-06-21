export default function Footer({ navigate }) {
  const quickLinks = ["Home", "Doctors", "Services", "Appointments", "Contact"];
  const departments = ["Cardiology", "Neurology", "Orthopedics", "Gynecology", "Pediatrics"];
  const emergency = [
    "Emergency: 1800-XXX-XXXX",
    "Ambulance: 108",
    "Blood Bank: +91 77777 00000",
  ];

  return (
    <footer className="text-slate-400 py-12 px-8" style={{ background: "#060f1e" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">

        {/* Brand */}
        <div>
          <div
            className="text-white font-bold text-lg mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            MediCare Hospital
          </div>
          <p className="text-sm leading-relaxed">
            Delivering compassionate, world-class healthcare to the people of
            Madhya Pradesh since 2000.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-white font-semibold mb-3 text-sm">Quick Links</div>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li key={item}>
                <button
                  onClick={() => navigate(item)}
                  className="text-sm hover:text-sky-400 transition-colors text-left"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Departments */}
        <div>
          <div className="text-white font-semibold mb-3 text-sm">Departments</div>
          <ul className="space-y-2">
            {departments.map((d) => (
              <li key={d} className="text-sm">{d}</li>
            ))}
          </ul>
        </div>

        {/* Emergency */}
        <div>
          <div className="text-white font-semibold mb-3 text-sm">Emergency</div>
          <ul className="space-y-2">
            {emergency.map((e) => (
              <li key={e} className="text-sm">{e}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
        © 2026 MediCare Hospital, Rewa, Madhya Pradesh. All rights reserved.
      </div>
    </footer>
  );
}
