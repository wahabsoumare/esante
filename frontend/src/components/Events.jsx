const events = [
  { title: 'Journée dépistage diabète', date: '12 Oct 2025', desc: 'Dépistage gratuit et sensibilisation.'},
  { title: 'Webinaire : santé mentale', date: '27 Oct 2025', desc: 'Techniques de gestion du stress.'},
  { title: 'Campagne vaccination', date: '10 Nov 2025', desc: 'Vaccination grippe saisonnière.'},
]
export default function Events() {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="h2">Événements & actualités</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <div key={i} className="card">
              <div className="small-muted">{e.date}</div>
              <div className="h3 mt-1">{e.title}</div>
              <p className="mt-2 text-zinc-600 text-sm">{e.desc}</p>
              <button className="btn mt-4">En savoir plus</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
