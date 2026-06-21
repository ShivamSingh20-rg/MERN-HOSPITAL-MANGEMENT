const express = require('express');
const router = express.Router();
const {BookAppointment,verfiPayment,UserAppointments,BookService} = require('../controllers/Appointment')
const { protect, authorizeRoles } = require('../middleware/protect');

 router.post('/book-service',protect,BookService );
router.post('/book',protect,BookAppointment );
router.post('/verify-payment',verfiPayment );
router.get('/my-appointment',protect,UserAppointments)
router.post('/book-service',protect,BookService );

module.exports = router;


