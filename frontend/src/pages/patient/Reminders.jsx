export default function PatientReminders() {
  const reminders = [
    { title: 'Rendez-vous cardiologie', date: '22 Oct 2025 09:00' },
    { title: 'Prise de glycémie', date: 'Tous les lundis 08:00' },
  ]
  return (
    <div className="card">
      <div className="h3">Rappels</div>
      <ul className="mt-3 space-y-2 text-sm">
        {reminders.map((r,i)=>(<li key={i}>• {r.title} — {r.date}</li>))}
      </ul>
      <form className="mt-4 grid md:grid-cols-3 gap-3">
        <input type="text" placeholder="Titre du rappel" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
        <input type="datetime-local" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
        <button className="btn">Ajouter</button>
      </form>
    </div>
  )
}
