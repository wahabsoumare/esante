import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientLayout from './layouts/PatientLayout'
import PatientStats from './pages/patient/Stats'
import PatientAppointments from './pages/patient/Appointments'
import PatientTeleconsult from './pages/patient/Teleconsult'
import PatientIndicators from './pages/patient/Indicators'
import PatientPreinscriptions from './pages/patient/Preinscriptions'
import PatientReminders from './pages/patient/Reminders'
import DoctorProfile from './pages/DoctorProfile'
import RequireAuth from './components/RequireAuth'


// importation pour admin

import AdminLayout from './layouts/AdminLayout'
import Dashboard  from './pages/adm/Dashboard'
import GestionUsers  from './pages/adm/GestionUsers'
import Affichage from './pages/adm/Affichage'
import PaymentsDashboard from './pages/adm/PaymentsDashboard'
import SuccessfulConsultationsChart from './components/SuccessfulConsultationsChart'
import CreateUser from './pages/adm/CreateUser'
import EditUser  from './pages/adm/EditUser'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recherche" element={<Search />} />
      <Route path="/rendez-vous" element={<Search />} />
      <Route path="/medecins/:id" element={<DoctorProfile />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      <Route
        path="/patient"
        element={
          <RequireAuth>
            <PatientLayout />
          </RequireAuth>
        }
      >
        <Route index element={<PatientStats />} />
        <Route path="rendez-vous" element={<PatientAppointments />} />
        <Route path="teleconsultations" element={<PatientTeleconsult />} />
        <Route path="indicateurs" element={<PatientIndicators />} />
        <Route path="preinscriptions" element={<PatientPreinscriptions />} />
        <Route path="rappels" element={<PatientReminders />} />
      </Route>



       {/* Espace admin */}
     
      <Route
        path="/admin"
        element={
         
            <AdminLayout />
          
        }
      >

         <Route index element={
          <>
          <Dashboard />
          <SuccessfulConsultationsChart />
          </>} />
         <Route path="users" element={
          <>
              <Affichage />
              <GestionUsers />
             
          </>
         }
         />

         <Route path = "paiements" element = {<PaymentsDashboard />} />
         
         <Route path = "users/create" element = {<CreateUser />} />
         <Route path="users/edit/:id" element={<EditUser />} />
       

        
       
       
      </Route>

      <Route path="*" element={<Home />} />

    </Routes>
   
  )
}
