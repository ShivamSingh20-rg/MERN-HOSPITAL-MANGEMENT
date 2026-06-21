const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 🟢 Change required: true to false (or remove it) so service bookings don't fail
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: { type: String, default: "" }, 
  specialization: { type: String, default: "" },

  // Service-Only Fields
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String },

  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, required: true },
  patientPhone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  fee: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' },

  // 🟢 Ensure 'Pending' matches the exact casing used in your enum validation array
  appointmentStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled','Requested'], // 👈 Make sure 'Pending' is capitalized here
    default: 'Pending' 
  }
}, { timestamps: true });
 const Appointment = mongoose.model('Appointments', AppointmentSchema);
module.exports = Appointment
