// React Router
import { Routes, Route } from 'react-router-dom'

// --- Pages publiques ---
import Home from './pages/Home'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'

// --- Patient ---
import PatientLayout from './layouts/PatientLayout'
import PatientStats from './pages/patient/Stats'
import PatientAppointments from './pages/patient/Appointments'
import PatientTeleconsult from './pages/patient/Teleconsult'
import PatientIndicators from './pages/patient/Indicators'
import PatientPreinscriptions from './pages/patient/Preinscriptions'
import PatientReminders from './pages/patient/Reminders'
import DoctorProfile from './pages/DoctorProfile'

// --- Médecin ---
import DoctorLayout from './pages/Doctor/DoctorLayout'
import DashboardOverview from './pages/Doctor/DashboardOverview'
import AppointmentsView from './pages/Doctor/AppointmentsView'
import PatientsList from './pages/Doctor/PatientsList'
import MedecinProfile from './pages/Doctor/DoctorProfile'
import MedecinProfileEdit from './pages/Doctor/DoctorProfileEdit'
import MedecinChangePassword from './pages/Doctor/DoctorChangePassword'
import DisponibilitiesPage from './pages/Doctor/DisponibilitiesPage'

// --- Admin ---

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/adm/Dashboard'
import GestionUsers from './pages/adm/GestionUsers'
import Affichage from './pages/adm/Affichage'
import PaymentsDashboard from './pages/adm/PaymentsDashboard'
import SuccessfulConsultationsChart from './components/SuccessfulConsultationsChart'
import CreateUser from './pages/adm/CreateUser'
import EditUser from './pages/adm/EditUser'

// --- Auth / utils ---
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <Routes>
      {/* ---------------------- */}
      {/* Public routes */}
      {/* ---------------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/recherche" element={<Search />} />
      <Route path="/rendez-vous" element={<Search />} />
      <Route path="/medecins/:id" element={<DoctorProfile />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      {/* ---------------------- */}
      {/* Patient area (protected) */}
      {/* ---------------------- */}
      <Route
        path="/patient"
        element={
          <RequireAuth allowedRoles={["PATIENT"]}>
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

      {/* ---------------------- */}
      {/* Doctor area (protected) */}
      {/* ---------------------- */}
      <Route
        path="/doctor"
        element={
          <RequireAuth allowedRoles={["MEDECIN"]}>
            <DoctorLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="appointments" element={<AppointmentsView />} />
        <Route path="patients" element={<PatientsList />} />
  <Route path="disponibilites" element={<DisponibilitiesPage />} />
        <Route path="profile" element={<MedecinProfile />} />
  <Route path="profile/edit" element={<MedecinProfileEdit />} />
  <Route path="profile/change-password" element={<MedecinChangePassword />} />
      </Route>

      {/* ---------------------- */}
      {/* Admin area (protected) */}
      {/* ---------------------- */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <>
              <Dashboard />
              <SuccessfulConsultationsChart />
            </>
          }
        />
        <Route
          path="users"
          element={
            <>
              <Affichage />
              <GestionUsers />
            </>
          }
        />
        <Route path="paiements" element={<PaymentsDashboard />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="users/edit/:id" element={<EditUser />} />
      </Route>

      {/* ---------------------- */}
      {/* Catch-all */}
      {/* ---------------------- */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
