import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck, faMagnifyingGlass, faNewspaper, faBook,
  faRightToBracket, faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../config/axios'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const item = (to, label, icon) => (
    <NavLink
      to={to}
      className={({isActive}) => 'px-3 py-2 rounded-lg hover:bg-brand-50 ' +
        (isActive ? 'text-brand-600' : 'text-zinc-700')}
      onClick={() => setOpen(false)}
    >
      <span className="inline-flex items-center gap-2">
        <FontAwesomeIcon icon={icon} />
        {label}
      </span>
    </NavLink>
  )
  
  // Robust dashboard path resolver
  const getDashboardPath = () => {
    if (!user) return '/connexion'
    const roleRaw = user.role || user.typecompte || ''

    // If role is missing, try to decode the JWT token payload to infer role
    const decodeJwt = (token) => {
      if (!token) return null
      try {
        const parts = token.split('.')
        if (parts.length < 2) return null
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        // pad base64 string
        while (base64.length % 4) base64 += '='
        const json = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(json)
      } catch (e) {
        return null
      }
    }
    // Normalize to array of upper-case tokens for flexible matching
    let roles = Array.isArray(roleRaw)
      ? roleRaw.map(r => String(r).toUpperCase())
      : String(roleRaw).split(/[ ,|;]+/).map(r => r.toUpperCase())

    if ((!roles || roles.length === 0 || (roles.length === 1 && roles[0] === '')) && (user?.token || localStorage.getItem('token'))) {
      const token = user?.token || localStorage.getItem('token')
      const payload = decodeJwt(token)
      if (payload) {
        const tokenRole = payload.role || payload.type || payload.typecompte || payload.roles || payload.userRole
        if (tokenRole) {
          roles = Array.isArray(tokenRole) ? tokenRole.map(r => String(r).toUpperCase()) : String(tokenRole).split(/[ ,|;]+/).map(r => r.toUpperCase())
        }
        // Some tokens might include a medecin flag or similar
        if (!roles.some(Boolean) && (payload.medecin || payload.isMedecin || payload.is_doctor)) {
          roles = ['MEDECIN']
        }
      }
    }

  const isDoctor = roles.some(r => r.includes('MEDECIN') || r.includes('DOCTOR') || r.includes('MEDIC')) || Boolean(user?.medecin)
  const isAdmin = roles.some(r => r.includes('ADMIN')) || (typeof user?.typecompte === 'string' && user.typecompte.toUpperCase().includes('ADMIN'))

    if (isDoctor) return '/doctor'
    if (isAdmin) return '/admin'
    return '/patient'
  }
  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error('Logout failed:', e)
    }
    navigate('/connexion')
  }

  // (debug badge removed)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-brand-900 text-xl">
          Clinique<span className="text-brand-600">Connect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {item('/', 'Accueil', faNewspaper)}
          {item('/recherche', 'Recherche', faMagnifyingGlass)}
          {item('/rendez-vous', 'Rendez-vous', faCalendarCheck)}
          {!user && item('/connexion', 'Connexion', faRightToBracket)}
          {!user && item('/inscription', 'Inscription', faUserPlus)}
          {user && (
            <>
              {item(getDashboardPath(), 'Tableau de bord', faNewspaper)}
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Se déconnecter</button>
            </>
          )}
        </nav>
        
        <button className="md:hidden btn-outline" onClick={()=>setOpen(v=>!v)}>Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 py-2 grid gap-1">
            {item('/', 'Accueil', faNewspaper)}
            {item('/recherche', 'Recherche', faMagnifyingGlass)}
            {item('/rendez-vous', 'Rendez-vous', faCalendarCheck)}
            {!user && item('/connexion', 'Connexion', faRightToBracket)}
            {!user && item('/inscription', 'Inscription', faUserPlus)}
            {user && item(getDashboardPath(), 'Tableau de bord', faNewspaper)}
            {user && <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-red-600">Se déconnecter</button>}
          </div>
        </div>
      )}
    </header>
  )
}
