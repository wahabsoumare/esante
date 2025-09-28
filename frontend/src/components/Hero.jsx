import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

export default function Hero() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
            Votre santé, <span className="text-brand-600">à portée de main</span>
          </h1>
          <p className="mt-4 text-zinc-600">
            Consultez un médecin à distance, prenez des rendez-vous en quelques clics et suivez vos indicateurs.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/recherche" className="btn">
              <FontAwesomeIcon icon={faUserDoctor} />
              Trouver un médecin
            </Link>
            <Link to="/rendez-vous" className="btn-outline">
              <FontAwesomeIcon icon={faCalendarCheck} />
              Prendre rendez-vous
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1583912267550-d81d4fd6b8f8?q=80&w=1200&auto=format&fit=crop"
              alt="Téléconsultation" className="rounded-xl2 w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
