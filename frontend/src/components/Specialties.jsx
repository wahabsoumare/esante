import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor, faChildren, faVenus, faSun, faHeartPulse, faEarListen, faEye, faBrain, faTooth, faSyringe } from '@fortawesome/free-solid-svg-icons'

const specs = [
  { label: 'Médecine générale', icon: faUserDoctor, desc: 'Premier contact, prise en charge globale et orientation vers les spécialistes.' },
  { label: 'Pédiatrie', icon: faChildren, desc: 'Suivi de l’enfant : croissance, vaccination, pathologies infantiles.' },
  { label: 'Gynécologie', icon: faVenus, desc: 'Santé de la femme : suivi, dépistage, conseils et traitements.' },
  { label: 'Dermatologie', icon: faSun, desc: 'Peau, ongles, cheveux : acné, eczéma, dépistage des lésions.' },
  { label: 'Cardiologie', icon: faHeartPulse, desc: 'Prévention et suivi des maladies du cœur et des vaisseaux.' },
  { label: 'ORL', icon: faEarListen, desc: 'Oreille, nez, gorge : infections, audition, ronflement.' },
  { label: 'Ophtalmologie', icon: faEye, desc: 'Vision, dépistage et suivi des troubles oculaires.' },
  { label: 'Psychologie', icon: faBrain, desc: 'Bien-être mental, gestion du stress, accompagnement thérapeutique.' },
  { label: 'Dentisterie', icon: faTooth, desc: 'Soins dentaires, hygiène bucco-dentaire, urgences.' },
  { label: 'Diabétologie', icon: faSyringe, desc: 'Équilibre glycémique, éducation thérapeutique, prévention.' },
]

export default function Specialties() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="h2">Nos spécialités</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-600/10 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={s.icon} className="text-brand-600" />
                </div>
                <div>
                  <div className="h3">{s.label}</div>
                  <p className="mt-1 text-sm text-zinc-600">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
