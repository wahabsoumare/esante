import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import api from '../config/axios'
const linkCls = ({isActive}) => 'px-3 py-2 rounded-lg ' + (isActive ? 'bg-brand-600 text-white' : 'hover:bg-brand-50 text-brand-900')

export default function PatientLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [patientName, setPatientName] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/patients/profile')
        const p = res.data
        setPatientName(`${p.prenom || ''} ${p.nom || ''}`.trim())
      } catch (err) {
        // ignore if not logged in or profile not available
        setPatientName(null)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      // logout should be best-effort; still navigate to login
      console.error('Error during logout:', err)
    }
    navigate('/connexion')
  }

  const goHome = () => navigate('/')

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goHome} className="font-semibold text-brand-900 text-xl flex items-center gap-1">
              Clinique<span className="text-brand-600">Connect</span>
            </button>
            <div className="text-sm text-zinc-600">{patientName || 'Espace patient'}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goHome} className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200">Accueil</button>
            <button onClick={()=>setShowConfirm(true)} className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-600 hover:bg-red-100">Se déconnecter</button>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Confirmer la déconnexion</h3>
            <p className="text-sm text-zinc-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowConfirm(false)} className="px-3 py-1 rounded-md bg-gray-100">Annuler</button>
              <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-red-600 text-white">Se déconnecter</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
        <aside className="card h-fit md:sticky md:top-6">
          <nav className="grid gap-2">
            <NavLink to="/patient" end className={linkCls}>Tableau de bord</NavLink>
            <NavLink to="/patient/rendez-vous" className={linkCls}>Rendez-vous</NavLink>
            <NavLink to="/patient/teleconsultations" className={linkCls}>Téléconsultations</NavLink>
            <NavLink to="/patient/indicateurs" className={linkCls}>Indicateurs de santé</NavLink>
            <NavLink to="/patient/preinscriptions" className={linkCls}>Préinscriptions</NavLink>
            <NavLink to="/patient/rappels" className={linkCls}>Rappels</NavLink>
          </nav>
        </aside>
        <main className="md:col-span-4"><Outlet /></main>
      </div>
    </div>
  )
}
