const packs = [
  { name: 'Basique', price: '0 FCFA', items: ['Recherche de médecins', 'Prise de rendez-vous']},
  { name: 'Téléconsultation', price: '15 000 FCFA', items: ['Consultation vidéo', 'Compte-rendu']},
  { name: 'Suivi+', price: '25 000 FCFA/mois', items: ['Téléconsultations illimitées', 'Indicateurs', 'Rappels & alertes']},
]
export default function Packs() {
  return (
    <section className="section bg-brand-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="h2">Nos packs</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {packs.map((p, i) => (
            <div key={i} className="card">
              <div className="h3">{p.name}</div>
              <div className="mt-2 text-3xl font-bold text-brand-600">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                {p.items.map((it, j) => <li key={j}>• {it}</li>)}
              </ul>
              <button className="btn mt-6 w-full">Choisir</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
