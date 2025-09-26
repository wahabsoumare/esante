import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faClock, faThumbsUp, faShieldHeart } from '@fortawesome/free-solid-svg-icons'

const items = [
  { icon: faShieldHeart, title: 'Soins de qualité', desc: 'Professionnels vérifiés et pratiques conformes.' },
  { icon: faClock, title: 'Rapide', desc: 'Rendez-vous en minutes, rappels automatiques.' },
  { icon: faLock, title: 'Sécurisé', desc: 'Chiffrement des données, respect RGPD.' },
  { icon: faThumbsUp, title: 'Simple', desc: 'UX claire, 100% mobile.' },
]

export default function WhyUs() {
  return (
    <section className="section bg-brand-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="h2">Pourquoi nous choisir ?</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 flex items-center justify-center">
                <FontAwesomeIcon icon={it.icon} className="text-brand-600" />
              </div>
              <div className="mt-4 h3">{it.title}</div>
              <p className="mt-2 text-zinc-600 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
