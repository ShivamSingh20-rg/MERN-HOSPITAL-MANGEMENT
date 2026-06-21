const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
 
  category: { type: String, required: true }, 
  
   
  age: { type: Number, required: true },         
  gender: { type: String, required: true },     
  experience: { type: Number, required: true },
  
  patients: { type: String, default: "0+" },      
  qualification: { type: String, required: true },
  location: { type: String, required: true },
  
   
  fee: { type: Number, required: true },          
  image: { type: String, required: true },  

   
  availabilityRules: {
    workDays: {
      Monday: { type: Boolean, default: true },
      Tuesday: { type: Boolean, default: true },
      Wednesday: { type: Boolean, default: true },
      Thursday: { type: Boolean, default: true },
      Friday: { type: Boolean, default: true },
      Saturday: { type: Boolean, default: false },
      Sunday: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

const Doctor = mongoose.model('doctor', DoctorSchema);
module.exports = Doctor;