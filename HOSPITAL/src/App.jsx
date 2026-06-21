import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRouteGuard from './components/Protectrouteguard';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './components/Unauthorized';
import Home from './pages/Home'; 
import Serviceprofile from './pages/Serviceprofile';  
import Doctorprofile from './pages/Doctorprofile';  
import Doctor from './pages/Doctor';
import Service from './pages/Service';
import AdminDashboard from '../Admin/AdminDashboard';
 
import Footer from './components/Footer';
import PatientOutlet from './pages/PatientOutlet';
import SidebarOutlet from '../Admin/pages/SidebarOutlet';
 import Overview from '../Admin/pages/Overview'
import AddDoctor from '../Admin/pages/Adddoctor'
import Addservice from '../Admin/pages/Addservice'
import UserAppointment from './pages/UserAppointment'
export default function App() {
  return (
    <div>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        
        <Route element={<PatientOutlet />}>  
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/service/:id" element={<Serviceprofile />} />
          <Route path="/doctor/:id" element={<Doctorprofile />} />
          
         
          
          
          <Route element={<ProtectedRouteGuard allowedRoles={['patient', 'doctor', 'admin']} />}>
            <Route path="/my-appointment" element={<UserAppointment />} />
          </Route>
        </Route>  

        
        <Route element={<ProtectedRouteGuard allowedRoles={['admin']} />}>
          <Route element={<SidebarOutlet />}>  
          
            <Route path="/admin/overview" element={<Overview />} />
            <Route path="/admin/create-user" element={<AdminDashboard />} />
            <Route path="/admin/add-doctor" element={<AddDoctor />} />
            <Route path="/admin/add-service" element={<Addservice />} />
   
          </Route>  
        </Route>
 
        <Route path="*" element={<Login />} />
      </Routes>

      <Footer />
    </div>
  );
}