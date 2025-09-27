import { Link } from 'react-router-dom'
export default function CTA() {
  return (
    <section className="section bg-brand-600">
      <div className="max-w-7xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-semibold">Prêt à prendre soin de votre santé ?</h2>
        <p className="mt-2 text-brand-50/90">Rejoignez-nous et commencez en quelques minutes.</p>
        <Link to="/inscription" className="btn mt-6 bg-white text-brand-900 hover:opacity-90">Commencer maintenant</Link>
      </div>
    </section>
  )
}
