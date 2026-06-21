import React, { createContext, useState, useContext, useMemo } from 'react';
import { API_URL } from '../API_URL/Api';
import { loadRazorpayScript } from './Utlis';

const BookingContext = createContext();

export function ContextProvider({ children }) { 
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAddress, setPatientAddress] = useState("");  
  const [selectedDate, setSelectedDate] = useState("");  
  const [paymentMethod, setPaymentMethod] = useState("counter"); 
  const [isBooking, setIsBooking] = useState(false);

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

   const [isBoooking, setIsBoooking] = useState(false);

 
 const handleServiceBookingSubmit = async (service, patientData, navigate) => {
  if (!patientData.date) {
    alert("Please select an appointment date!");
    return;
  }

  setIsBooking(true);
  const token = localStorage.getItem('authToken');
  const standardPaymentMethod = patientData.paymentMethod === 'online' ? 'razorpay' : 'cod';

   
  const bookingPayload = {
    serviceId: service._id,
    serviceName: service.name,
     
    doctorName: "Lab Service Facility", 
    specialization: service.category || "Diagnostics", 

    patientName: patientData.name,
    patientAge: Number(patientData.age),
    patientGender: patientData.gender || "Male",
    patientPhone: patientData.phone,
    patientAddress: patientData.address || "",
    appointmentDate: patientData.date,
    fee: Number(service.cost || service.fee || 0),  
    paymentMethod: standardPaymentMethod,
    
    appointmentStatus: "Pending" 
  };

  
  console.log("🚀 SENDING PAYLOAD TO BACKEND ROUTE:", bookingPayload);

  try {
   
    const response = await fetch(`${API_URL}/appointment/book-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(bookingPayload)
    });

    const orderJson = await response.json();
    
    if (!response.ok) {
       console.error("💥 Server Rejection Response Details:", orderJson);
      throw new Error(orderJson.message || 'Booking submission rejected by server schema rules.');
    }

     if (orderJson.mode === 'cod' || standardPaymentMethod === 'cod') {
      alert(`🎉 Service Appointment Scheduled Successfully!`);
      navigate('/appointments-dashboard');
      return;
    }

    // 4. Razorpay Online handling path
    if (orderJson.mode === 'online' && orderJson.order) {

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed loading configuration elements from secure vendor servers.");
        return;
      }
      const options = {
        key: "rzp_test_SvIPe997qXNEYQ", 
        amount: orderJson.order.amount,
        currency: orderJson.order.currency,
        name: "Care System Services",
        description: `Payment for ${service.name}`,
        order_id: orderJson.order.id,
        handler: async function (paymentResponse) {
          try { 
            const verifyRes = await fetch(`${API_URL}/appointment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                appointmentId: orderJson.appointmentId
              })
            });
            


            
            if (verifyRes.ok) {
              alert("🎉 Online Payment Verified & Booked!");
              navigate('/my-appointment');
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {   console.error("❌ CRASH REASON FROM SERVER:", verifyData);
            console.error("Payment verification transaction crash:", err);
          }
        },
        prefill: {
          name: patientData.name,
          contact: patientData.phone
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }

  } catch (err) {
    console.error("Intercepted Exception in Context Submission Pipeline:", err);
    alert(err.message || "❌ Failed to request service booking.");
  } finally {
    setIsBooking(false);
  }
};







  const handleBookingSubmit = async (doctor, navigate) => {
    if (!selectedDate) {
      alert("Please select an appointment date!");
      return;
    }

    setIsBooking(true);
    const token = localStorage.getItem('authToken'); // Uses your existing token reference key string

    // Mapping internal client terminology to backend data model specifications
    const standardPaymentMethod = paymentMethod === 'online' ? 'razorpay' : 'cod';
    const cleanFee = Number(doctor.fee || doctor.fees || 0);

    const bookingPayload = {
      doctorId: doctor._id,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      patientPhone,
      patientAddress,
      doctorName: doctor.name,
      specialization: doctor.category || doctor.specialization,
      appointmentDate: selectedDate,
      fee: cleanFee,
      paymentMethod: standardPaymentMethod
    };

    try {
      const targetBookingUrl = `${API_URL}/appointment/book`.replace(/([^:]\/)\/+/g, "$1");

      const response = await fetch(targetBookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(bookingPayload)
      });

      const orderJson = await response.json();

      if (!response.ok) throw new Error(orderJson.message || 'Verification rejected.');
 
      if (orderJson.mode === 'cod' || standardPaymentMethod === 'cod') {
        alert(`🎉 Appointment Registered Successfully!\nReference Track ID received via Cash counter.`);
 
        setPatientName(""); setPatientAge(""); setPatientGender(""); setPatientPhone(""); setPatientAddress(""); setSelectedDate("");
        navigate('/my-appointment');
        return;
      }

  
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed loading configuration elements from secure vendor servers.");
        return;
      }

      const clientOptions = {
        key: "rzp_test_SvIPe997qXNEYQ", // Swap with your real public key parameter
        amount: orderJson.razorpayOrder ? orderJson.razorpayOrder.amount : cleanFee * 100,
        currency: orderJson.razorpayOrder ? orderJson.razorpayOrder.currency : "INR",
        name: "Metro Health Hospital",
        description: `Consultation with ${doctor.name}`,
        order_id: orderJson.razorpayOrder?.id,
        handler: async function (verifiedResponse) {
          const verifyPayload = {
            appointmentId: orderJson.appointmentId || orderJson.data?._id,
            razorpay_order_id: verifiedResponse.razorpay_order_id,
            razorpay_payment_id: verifiedResponse.razorpay_payment_id,
            razorpay_signature: verifiedResponse.razorpay_signature
          };

          const targetVerifyUrl = `${API_URL}/appointment/verify-payment`.replace(/([^:]\/)\/+/g, "$1");
          const verificationCheck = await fetch(targetVerifyUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(verifyPayload)
          });

          if (verificationCheck.ok) {
            alert("✨ Payment Confirmed & Appointment Verified Successfully!");
            setPatientName(""); setPatientAge(""); setPatientGender(""); setPatientPhone(""); setPatientAddress(""); setSelectedDate("");
            navigate('/my-appointment');
          } else {
            alert("Payment recorded, validation failure processing signature hashes.");
          }
        },
        prefill: { name: patientName, contact: patientPhone },
        theme: { color: "#10b981" }
      };

      const windowGateInstance = new window.Razorpay(clientOptions);
      windowGateInstance.open();

    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Critical Network Connection Failure.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <BookingContext.Provider value={{
      patientName, setPatientName,
      patientAge, setPatientAge,
      patientGender, setPatientGender,
      patientPhone, setPatientPhone,
      patientAddress, setPatientAddress,
      selectedDate, setSelectedDate,
      paymentMethod, setPaymentMethod,
      isBooking, todayString,
      handleBookingSubmit,handleServiceBookingSubmit,isBoooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);