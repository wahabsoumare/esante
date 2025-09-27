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

      <Route path="*" element={<Home />} />
    </Routes>
  )
}
