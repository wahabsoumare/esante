// src/components/DoctorCard.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserMd, faLocationDot, faStethoscope, faCalendarPlus, faEye } from '@fortawesome/free-solid-svg-icons'

const PROFILE_ROUTE = '/medecins'

export default function DoctorCard({ doctor }) {
  const fullname = `${doctor.prenomu ?? ''} ${doctor.nomu ?? ''}`.trim()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth() // ✅ vérifie si user est connecté

  // 🔹 Gestion clic voir profil
  const handleViewProfile = () => {
    if (!isAuthenticated) {
      navigate('/connexion')
      return
    }
    navigate(`${PROFILE_ROUTE}/${doctor.idm}`)
  }

  // 🔹 Gestion clic prendre rendez-vous
  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/connexion')
      return
    }
    navigate(`${PROFILE_ROUTE}/${doctor.idm}#booking`)
  }

  return (
    <article className="card flex items-center gap-4 p-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-zinc-100">
        <FontAwesomeIcon icon={faUserMd} size="lg" className="text-brand-600" />
      </div>

      <div className="flex-1">
        <div className="font-medium">{fullname || '—'}</div>
        <div className="text-sm text-zinc-600 mt-1"><FontAwesomeIcon icon={faStethoscope} /> {doctor.specialite || '—'}</div>
        <div className="text-sm text-zinc-500 mt-1"><FontAwesomeIcon icon={faLocationDot} /> {doctor.adresse || '—'}</div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Bouton prendre rendez-vous */}
        <button
          onClick={handleBooking}
          className="btn inline-flex items-center gap-2 px-3 py-2"
        >
          <FontAwesomeIcon icon={faCalendarPlus} />
          Prendre RDV
        </button>

        {/* Bouton voir profil */}
        <button
          onClick={handleViewProfile}
          className="btn btn-outline inline-flex items-center gap-2 px-3 py-2"
        >
          <FontAwesomeIcon icon={faEye} />
          Voir profil
        </button>
      </div>
    </article>
  )
}
