import { useEffect, useState } from 'react'
import api from '../../config/axios'

export default function PatientIndicators() {
  const [metriques, setMetriques] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const BASE_URL = 'http://localhost:3000'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // use relative path so api.baseURL + interceptors apply consistently
        const res = await api.get(`${BASE_URL}/api/patients/profile`)
        setMetriques(res.data.metriques || {})
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Erreur récupération profil')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!type || value === '') return setError('Type et valeur requis')

    try {
  // post using relative path, then re-fetch profile to ensure persisted data
  await api.post(`${BASE_URL}/api/patients/profile/metriques`, { type, value, date })
  // re-fetch profile to get authoritative persisted metriques
  const refresh = await api.get(`${BASE_URL}/api/patients/profile`)
  setMetriques(refresh.data.metriques || {})
      // reset inputs
      setType('')
      setValue('')
      setDate('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur ajout métrique')
    }
  }

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-600">{error}</div>

  // Create a simple indicators list from metriques (show last value)
  const indicators = Object.keys(metriques).map((k) => {
    const arr = metriques[k]
    const last = Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null
    return { label: k, value: last ? last.value : '—' }
  })

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {indicators.map((i, idx) => (
        <div key={idx} className="card">
          <div className="small-muted">{i.label}</div>
          <div className="text-2xl font-bold text-brand-900 mt-1">{i.value}</div>
        </div>
      ))}
      <div className="card md:col-span-2">
        <div className="h3">Ajouter une mesure</div>
        <form onSubmit={onSubmit} className="mt-3 grid md:grid-cols-3 gap-3">
          <input value={type} onChange={(e)=>setType(e.target.value)} type="text" placeholder="Type (ex: TA, glycémie…)" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <input value={value} onChange={(e)=>setValue(e.target.value)} type="text" placeholder="Valeur" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" className="px-4 py-3 rounded-xl border border-zinc-200 bg-white" />
          <button type="submit" className="btn md:col-span-3">Enregistrer</button>
        </form>
      </div>
    </div>
  )
}
