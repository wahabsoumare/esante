export default function PatientStats() {
  const cards = [
    { label: 'Prochains rendez-vous', value: 2 },
    { label: 'Téléconsultations ce mois', value: 1 },
    { label: 'Notifications actives', value: 3 },
    { label: 'Indicateurs suivis', value: 5 },
  ]
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c,i)=>(
        <div key={i} className="card">
          <div className="text-3xl font-bold text-brand-900">{c.value}</div>
          <div className="small-muted mt-1">{c.label}</div>
        </div>
      ))}
      <div className="card sm:col-span-2">
        <div className="h3">Bienvenue 👋</div>
        <p className="mt-2 text-zinc-600 text-sm">Ici vous verrez vos stats, vos prochains rendez-vous et le suivi de vos indicateurs.</p>
      </div>
    </div>
  )
}
