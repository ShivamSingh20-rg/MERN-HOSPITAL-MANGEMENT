const Doctor = require('../models/Doctor.model');
const Service = require('../models/Service.model');
const Appointment = require('../models/Appointment.model');

const addDoctors = async (req, res) => {
   

  try {
     const imagePath = req.file 
  ? `/uploads/${req.file.filename}` 
  : (req.body.imageUrl || '');

    console.log("🧠 [BACKEND] Parsing availability configurations...");
    let processedAvailability = undefined;
    if (req.body.availabilityRules) {
      processedAvailability = typeof req.body.availabilityRules === 'string'
        ? JSON.parse(req.body.availabilityRules)
        : req.body.availabilityRules;
    }

    const clearDoctorPayload = {
      name: req.body.name,
      category: req.body.specialization || req.body.category, 
      age: Number(req.body.age || 35), 
      gender: req.body.gender || "Male",
      experience: Number(req.body.experience || 0),
      patients: req.body.patients || "0+",
      qualification: req.body.qualification,
      location: req.body.location,
      fee: Number(req.body.fees || req.body.fee || 0),
      image: imagePath,
      availabilityRules: processedAvailability
    };

 
    const newDoctor = new Doctor(clearDoctorPayload);
    
 
    const saved = await newDoctor.save(); 
    
   
    return res.status(201).json({ success: true, data: saved });

  } catch (err) {
    
    return res.status(400).json({ success: false, message: err.message });
  }
};
const addService =async(req,res)=>{
try {
    const { name, category, cost, duration, description, specifications } = req.body;
     
  const imagePath = req.file 
  ? `/uploads/${req.file.filename}` 
  : (req.body.imageUrl || '');

    const newService = new Service({
      name,
      category,
      fee: Number(cost),
      duration: Number(duration),
      description,
      specifications: specifications ? JSON.parse(specifications) : [],
      image: imagePath
    });

    const saved = await newService.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

const getAppointment = async(req,res) =>{
    try {
    const appointments = await Appointment.find()
      .populate('doctorId', 'name category qualification')
      .populate('serviceId', 'title location');
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
 
module.exports ={getAppointment,addDoctors,addService};