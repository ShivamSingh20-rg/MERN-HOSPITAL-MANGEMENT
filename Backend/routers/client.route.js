const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor.model');
const Service = require('../models/Service.model');
const Appointment = require('../models/Appointment.model');

 
router.get('/get-doctors', async (req, res) => {
  try { res.json(await Doctor.find()); } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/get-services', async (req, res) => {
  try { res.json(await Service.find()); } catch (err) { res.status(500).json({ message: err.message }); }
});
 
router.get('/get-doctor/:id', async (req, res) => {
  console.log(req.params.id)
  try { const doctorRecord = await Doctor.findById(req.params.id);
if (!doctorRecord) {
      return res.status(404).json({ success: false, message: "Practitioner record not found" });
    }
    return res.status(200).json({ success: true, data: doctorRecord });


   } catch (err) { res.status(404).json({ message: "Not found" }); }
});

router.get('/get-services/:id', async (req, res) => {

  console.log(req.params.id)
  try { const ServiceRecord = await Service.findById(req.params.id);
if (!ServiceRecord) {
      return res.status(404).json({ success: false, message: "Practitioner record not found" });
    }
    return res.status(200).json({ success: true, data: ServiceRecord });
console.log(data)

   } catch (err) { res.status(404).json({ message: "Not found" }); }
});

module.exports = router;