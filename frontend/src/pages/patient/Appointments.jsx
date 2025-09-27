export default function PatientAppointments() {
  const upcoming = [
    { date: '15 Oct 2025 10:30', with: 'Dr. Mariam Diop', mode: 'Téléconsultation' },
    { date: '22 Oct 2025 09:00', with: 'Dr. Oumar Traoré', mode: 'Présentiel' },
  ]
  const past = [
    { date: '03 Oct 2025 14:00', with: 'Dr. Aïcha Njoya', mode: 'Téléconsultation' },
  ]
  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="h3">Prochains rendez-vous</div>
        <ul className="mt-3 space-y-2 text-sm">
          {upcoming.map((r,i)=>(<li key={i}>• {r.date} — {r.with} ({r.mode})</li>))}
        </ul>
      </div>
      <div className="card">
        <div className="h3">Rendez-vous passés</div>
        <ul className="mt-3 space-y-2 text-sm">
          {past.map((r,i)=>(<li key={i}>• {r.date} — {r.with} ({r.mode})</li>))}
        </ul>
      </div>
      <div className="card">
        <div className="h3">Prendre un rendez-vous</div>
        <form className="mt-4 grid md:grid-cols-2 gap-3">
          <input type="text" placeholder="Spécialité souhaitée" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <input type="datetime-local" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <select className="px-4 py-3 rounded-xl border border-zinc-200 bg-white">
            <option>Téléconsultation</option>
            <option>Présentiel</option>
          </select>
          <button className="btn md:col-span-2">Demander</button>
        </form>
      </div>
    </div>
  )
}
