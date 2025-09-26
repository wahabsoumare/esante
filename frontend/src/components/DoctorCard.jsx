import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStethoscope, faCalendarCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <div className="card flex flex-col md:flex-row gap-4 items-center md:items-start">
      <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full object-cover"/>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h3">{doctor.name}</div>
          <span className="px-2 py-1 text-xs rounded bg-brand-600/10 text-brand-900">{doctor.specialty}</span>
        </div>
        <div className="mt-2 text-sm text-zinc-600 flex flex-wrap gap-4">
          <span><FontAwesomeIcon icon={faLocationDot} /> {doctor.region}</span>
          <span><FontAwesomeIcon icon={faStethoscope} /> {doctor.experience} ans d’exp.</span>
          <span><FontAwesomeIcon icon={faUser} /> {doctor.gender}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <button className="btn w-full md:w-44">
          <FontAwesomeIcon icon={faCalendarCheck} />
          Prendre rendez-vous
        </button>
         <Link className="btn-outline w-full md:w-44" to={`/medecins/${doctor.id}`}>
          Profil
        </Link>
      </div>
    </div>
  )
}
