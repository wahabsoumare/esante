const items = [
  { name: 'Fatou', text: 'Téléconsultation rapide, j’ai parlé à un médecin le jour même.'},
  { name: 'Moussa', text: 'Le suivi des indicateurs m’aide à mieux gérer mon diabète.'},
  { name: 'Aïcha', text: 'Interface claire, rappels pratiques et médecins à l’écoute.'},
]
export default function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="h2">Ce que disent nos patients</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={i} className="card">
              <p className="text-zinc-700">“{t.text}”</p>
              <div className="mt-4 font-semibold text-brand-900">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
