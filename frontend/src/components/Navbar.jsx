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
  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {
      console.error('Logout failed:', e)
    }
    navigate('/connexion')
  }

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
              {/* determine dashboard path by role if possible */}
              {item(user?.typecompte?.includes('MEDECIN') || user?.role?.toString().includes('MEDECIN') ? '/doctor' : (user?.typecompte?.includes('ADMIN') || user?.role?.toString().includes('ADMIN') ? '/admin' : '/patient'), 'Tableau de bord', faNewspaper)}
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
            {user && item(user?.typecompte?.includes('MEDECIN') || user?.role?.toString().includes('MEDECIN') ? '/doctor' : (user?.typecompte?.includes('ADMIN') || user?.role?.toString().includes('ADMIN') ? '/admin' : '/patient'), 'Tableau de bord', faNewspaper)}
            {user && <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm text-red-600">Se déconnecter</button>}
          </div>
        </div>
      )}
    </header>
  )
}
