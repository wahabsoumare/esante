import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHeart, faAnglesRight, faGavel, faPhone, faEnvelope, faLocationDot, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons'

const LinkItem = ({ children, href = '#' }) => (
  <a href={href} className="flex items-center gap-2 text-white/90 hover:text-white">
    <FontAwesomeIcon icon={faAnglesRight} className="opacity-80" />
    <span>{children}</span>
  </a>
)

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHeart} className="text-brand-300" />
            Clinique<span className="text-brand-300">Connect</span>
          </div>
          <p className="mt-3 text-white/80 text-sm">
            Plateforme de téléconsultation & e-santé pour des soins accessibles, rapides et sécurisés.
          </p>
          <div className="mt-5 flex gap-4 text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-brand-300"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-brand-300"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-300"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-brand-300"><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3 text-brand-300">Navigation</div>
          <div className="grid gap-2">
            <LinkItem href="/">Accueil</LinkItem>
            <LinkItem href="/recherche">Recherche</LinkItem>
            <LinkItem href="/rendez-vous">Rendez-vous</LinkItem>
            <LinkItem href="/inscription">Inscription</LinkItem>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3 text-brand-300">Légal</div>
          <div className="grid gap-2">
            <LinkItem><FontAwesomeIcon icon={faGavel} className="hidden" />Confidentialité</LinkItem>
            <LinkItem>RGPD & sécurité</LinkItem>
            <LinkItem>Conditions d’utilisation</LinkItem>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3 text-brand-300">Contact</div>
          <div className="grid gap-2 text-white">
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faPhone}/> +221 77 000 00 00</span>
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope}/> support@cliniqueconnect.local</span>
            <span className="flex items-center gap-2"><FontAwesomeIcon icon={faLocationDot}/> Plateau, Dakar</span>
            <a className="flex items-center gap-2 hover:text-brand-300" href="#">
              Centre d’aide <FontAwesomeIcon icon={faUpRightFromSquare}/>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/70">
        © {new Date().getFullYear()} CliniqueConnect — Tous droits réservés.
      </div>
    </footer>
  )
}
