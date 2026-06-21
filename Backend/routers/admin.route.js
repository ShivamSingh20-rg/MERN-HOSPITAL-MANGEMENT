const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');  
const { getAppointment, addDoctors, addService } = require('../controllers/Admin.controller');
const { protect, authorizeRoles } = require('../middleware/protect');

 
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });



 
router.post('/add-doctor', protect, upload.single('image'),  authorizeRoles('admin'),   addDoctors);
 router.post('/add-service', protect,upload.single('image'),authorizeRoles('admin'),addService);
 






module.exports = router;