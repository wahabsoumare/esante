export default function PatientIndicators() {
  const indicators = [
    { label: 'Tension artérielle', value: '12/7' },
    { label: 'Glycémie à jeun', value: '0.95 g/L' },
    { label: 'Poids', value: '72 kg' },
    { label: 'IMC', value: '24.1' },
  ]
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {indicators.map((i,idx)=>(
        <div key={idx} className="card">
          <div className="small-muted">{i.label}</div>
          <div className="text-2xl font-bold text-brand-900 mt-1">{i.value}</div>
        </div>
      ))}
      <div className="card md:col-span-2">
        <div className="h3">Ajouter une mesure</div>
        <form className="mt-3 grid md:grid-cols-3 gap-3">
          <input type="text" placeholder="Type (ex: TA, glycémie…)" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <input type="text" placeholder="Valeur" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <input type="date" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <button className="btn md:col-span-3">Enregistrer</button>
        </form>
      </div>
    </div>
  )
}
