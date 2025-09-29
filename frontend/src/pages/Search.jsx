// src/pages/Search.jsx
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DoctorCard from '../components/DoctorCard'
import axios from 'axios'
import { useMemo, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'  // ✅ import du contexte

export default function Search() {
  const { getToken } = useAuth()  // ✅ récupération du token
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('')
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Endpoint public ou protégé selon ton backend
  const API_MEDICIANS = 'http://localhost:3000/api/utilisateurs/public/medecins'

  useEffect(() => {
    let mounted = true

    const fetchDoctors = async () => {
      setLoading(true)
      try {
        // ✅ ajout du token dans les headers
        const res = await axios.get(API_MEDICIANS, {
          headers: { Authorization: `Bearer ${getToken() || ''}` }
        })
        if (!mounted) return

        setDoctors(res.data || [])

        const specs = Array.from(new Set((res.data || []).map(d => d.specialite).filter(Boolean)))
        setSpecialties(specs)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || err.message || 'Erreur réseau')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchDoctors()
    return () => { mounted = false }
  }, [getToken])

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase()
    return doctors.filter(d => {
      const fullName = `${d.prenomu ?? ''} ${d.nomu ?? ''}`.trim().toLowerCase()
      const matchQ = qLower === '' || fullName.includes(qLower)
      const matchS = spec === '' || (d.specialite === spec)
      return matchQ && matchS
    })
  }, [doctors, q, spec])

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

            <select
              value={spec}
              onChange={e => setSpec(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
            >
              <option value="">Toutes spécialités</option>
              {specialties.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>

            <button
              className="btn"
              onClick={() => { setQ(''); setSpec('') }}
              title="Réinitialiser filtres"
            >
              Réinitialiser
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {loading && <div className="text-zinc-600">Chargement des médecins…</div>}
            {error && <div className="text-red-600">Erreur : {error}</div>}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-zinc-600">Aucun médecin ne correspond à votre recherche.</div>
            )}

            {!loading && !error && filtered.map(d => (
              <DoctorCard key={d.idu} doctor={d} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
