export default function PatientTeleconsult() {
  return (
    <div className="card">
      <div className="h3">Téléconsultations</div>
      <p className="mt-2 text-sm text-zinc-600">Rejoindre une téléconsultation, consulter l’historique et les comptes-rendus.</p>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Code de la session" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
        <button className="btn">Rejoindre</button>
      </div>
    </div>
  )
}
