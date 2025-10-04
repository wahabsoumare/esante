import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarCheck, faMagnifyingGlass, faNewspaper, faBook,
  faRightToBracket, faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
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
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-brand-900 text-xl">
          Clinique<span className="text-brand-600">Connect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {item('/', 'Accueil', faNewspaper)}
          {item('/recherche', 'Recherche', faMagnifyingGlass)}
          {/* {item('/recherche', 'Événements', faNewspaper)} */}
          {/* {item('/', 'Ressources', faBook)} */}
          {item('/rendez-vous', 'Rendez-vous', faCalendarCheck)}
          {item('/connexion', 'Connexion', faRightToBracket)}
          {item('/inscription', 'Inscription', faUserPlus)}
        </nav>
        <button className="md:hidden btn-outline" onClick={()=>setOpen(v=>!v)}>Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-4 py-2 grid gap-1">
            {item('/', 'Accueil', faNewspaper)}
            {item('/recherche', 'Recherche', faMagnifyingGlass)}
            {/* {item('/recherche', 'Événements', faNewspaper)} */}
            {/* {item('/', 'Ressources', faBook)} */}
            {item('/rendez-vous', 'Rendez-vous', faCalendarCheck)}
            {item('/connexion', 'Connexion', faRightToBracket)}
            {item('/inscription', 'Inscription', faUserPlus)}
          </div>
        </div>
      )}
    </header>
  )
}
