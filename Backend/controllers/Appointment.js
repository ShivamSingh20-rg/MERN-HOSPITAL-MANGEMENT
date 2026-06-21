const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment.model');
const configs = require ('../configs')
 
const razorpayInstance = new Razorpay({
  key_id: configs.RAZORPAY_ID || 'rzp_test_SvIPe997qXNEYQ',
  key_secret: configs.RAZORPAY_SECRET || '9S4Z3gcTymxq2rWwlU4ViLSj'
});

 
const BookAppointment= async (req, res) => {
  try {
    const { 
      patientName, patientPhone, patientAge, patientGender, 
      doctorName, specialization, appointmentDate, fee, paymentMethod 
    } = req.body;

    // Instantiate document layout fields
    const newAppointment = new Appointment({userId: req.user.id,
      patientName, patientPhone, patientAge, patientGender,
      doctorName, specialization, appointmentDate, fee, paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
      appointmentStatus: 'Requested'
    });

    if (paymentMethod === 'cod') {
      const saved = await newAppointment.save();
      return res.status(201).json({ success: true, mode: 'cod', data: saved });
    }

   
    const options = {
      amount: Number(fee) * 100, 
      currency: "INR",
      receipt: `rcpt_doc_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    
    newAppointment.razorpayOrderId = razorpayOrder.id;
    await newAppointment.save();

    res.status(201).json({
      success: true,
      mode: 'razorpay',
      appointmentId: newAppointment._id,
      razorpayOrder
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

 
 const verfiPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    // 1. Generate the expected signature using your secret key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", configs.RAZORPAY_SECRET|| '9S4Z3gcTymxq2rWwlU4ViLSj') 
      .update(sign.toString())
      .digest("hex");

    // 2. Compare the signatures
    if (razorpay_signature === expectedSign) {
      
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'Paid',
        appointmentStatus: 'Confirmed' // or 'Pending' depending on your business flow
      });

      return res.status(200).json({ success: true, message: "Payment verified successfully!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature verification match." });
    }

  } catch (err) {
    console.error("💥 Payment Verification Error:", err);
    return res.status(500).json({ success: false, message: err.message ,exactError: err.message,
      errorStack: err.stack});
  }
};

 
// router.put('/update-status/:id', async (req, res) => {
//   try {
//     const { appointmentStatus, paymentStatus } = req.body;
//     const updatedRecord = await DoctorAppointment.findByIdAndUpdate(
//       req.params.id,
//       { $set: { appointmentStatus, paymentStatus } },
//       { new: true }
//     );
//     res.status(200).json({ success: true, data: updatedRecord });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


const UserAppointments= async (req, res) => {
  try { 
const list = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


 const BookService = async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      patientName,
      patientAge,
      patientGender,
      patientPhone,
      patientAddress,
      appointmentDate,
      fee,
      paymentMethod
    } = req.body;

    
    if (!serviceId || !serviceName || !patientName || !appointmentDate || !fee || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing essential data configurations." });
    }

     
    const newServiceBooking = await Appointment.create({
      userId: req.user.id,  
      serviceId,
      serviceName,
      
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      patientPhone,
      patientAddress: patientAddress || "",
      appointmentDate,
      fee: Number(fee),
      paymentMethod,
      paymentStatus: 'Pending',
      appointmentStatus: 'Pending'
    });
 
    if (paymentMethod === 'cod') {
      return res.status(201).json({
        success: true,
        mode: 'cod',
        message: "Your standalone service application registry has been logged successfully via COD.",
        data: newServiceBooking
      });
    }

     
    const options = {
      amount: Math.round(Number(fee) * 100),  
      currency: "INR",
      receipt: `rcpt_srv_${newServiceBooking._id}`
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(201).json({
      success: true,
      mode: 'online',
      order: order,
      appointmentId: newServiceBooking._id
    });

  } catch (err) {
    console.error("💥 Standalone service route exception handler:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {BookAppointment,verfiPayment,UserAppointments,BookService};