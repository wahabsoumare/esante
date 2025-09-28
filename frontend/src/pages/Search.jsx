
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DoctorCard from '../components/DoctorCard'
import { DOCTORS, SPECIALTIES, REGIONS } from '../data/doctors'
import { useMemo, useState } from 'react'

export default function Search() {
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('')
  const [region, setRegion] = useState('')

  const filtered = useMemo(() => {
    return DOCTORS.filter(d => {
      const matchQ = q === '' || d.name.toLowerCase().includes(q.toLowerCase())
      const matchS = spec === '' || d.specialty === spec
      const matchR = region === '' || d.region === region
      return matchQ && matchS && matchR
    })
  }, [q, spec, region])

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="h2">Médecins disponibles</h2>

          <div className="mt-6 grid md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Rechercher par nom…"
              className="col-span-2 md:col-span-1 px-4 py-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-brand-600 bg-white"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <select value={spec} onChange={e=>setSpec(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white">
              <option value="">Toutes spécialités</option>
              {SPECIALTIES.map((s,i)=>(<option key={i} value={s}>{s}</option>))}
            </select>
            <select value={region} onChange={e=>setRegion(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white">
              <option value="">Toutes régions</option>
              {REGIONS.map((r,i)=>(<option key={i} value={r}>{r}</option>))}
            </select>
            <button className="btn">Filtrer</button>
          </div>

          <div className="mt-6 grid gap-4">
            {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
            {filtered.length === 0 && <div className="text-zinc-600">Aucun médecin ne correspond à votre recherche.</div>}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
