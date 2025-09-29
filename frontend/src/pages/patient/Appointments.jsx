import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function PatientAppointments() {
  const { getToken } = useAuth()
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [medecins, setMedecins] = useState([])
  const [dispos, setDispos] = useState([])
  const [form, setForm] = useState({
    medecinId: '',
    disponibiliteId: '',
    dateRdv: '', // calculé automatiquement si on choisit un créneau
    heureDebut: '',
    heureFin: '',
    mode: 'Téléconsultation',
    notes: ''
  })

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/rendezvous/patient/me', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error('Erreur récupération des rendez-vous')
      const data = await res.json()

      const now = new Date()
      const upcomingList = []
      const pastList = []

      data.forEach(r => {
        const rdvDate = new Date(`${r.dateRdv}T${r.heureDebut}`)
        const item = {
          id: r.id,
          date: rdvDate.toLocaleString(),
          with: `${r.medecin.utilisateur.prenomu} ${r.medecin.utilisateur.nomu}`,
          mode: r.mode || 'Téléconsultation',
          statut: r.statut
        }
        if (rdvDate >= now) upcomingList.push(item)
        else pastList.push(item)
      })

      setUpcoming(upcomingList)
      setPast(pastList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedecins = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/utilisateurs/public/medecins', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error('Erreur récupération des médecins')
      const data = await res.json()
      setMedecins(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchDispos = async (medecinId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/disponibilites/medecin/${medecinId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error('Erreur récupération disponibilités')
      const data = await res.json()
      setDispos(data.disponibilites)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchMedecins()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'medecinId') {
      setForm({ ...form, medecinId: value, disponibiliteId: '', dateRdv: '', heureDebut: '', heureFin: '' })
      fetchDispos(value)
    } else if (name === 'disponibiliteId') {
      const dispo = dispos.find(d => d.id === parseInt(value))
      if (dispo) {
        // Calculer la date du prochain jour correspondant au créneau
        const today = new Date()
        const dayNames = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
        const targetDayIndex = dayNames.indexOf(dispo.jour.toLowerCase())
        const daysUntil = (targetDayIndex + 7 - today.getDay()) % 7 || 7
        const nextDate = new Date(today)
        nextDate.setDate(today.getDate() + daysUntil)

        setForm({
          ...form,
          disponibiliteId: value,
          dateRdv: nextDate.toISOString().split('T')[0], // YYYY-MM-DD
          heureDebut: dispo.heureDebut,
          heureFin: dispo.heureFin
        })
      }
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('http://localhost:3000/api/rendezvous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erreur création rendez-vous')
      }
      await fetchAppointments()
      setForm({
        medecinId: '',
        disponibiliteId: '',
        dateRdv: '',
        heureDebut: '',
        heureFin: '',
        mode: 'Téléconsultation',
        notes: ''
      })
      setDispos([])
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Chargement des rendez-vous...</div>

  return (
    <div className="grid gap-6">
      {error && <div className="text-red-600">{error}</div>}

      <div className="card">
        <div className="h3">Prochains rendez-vous</div>
        {upcoming.length === 0 ? <p>Aucun rendez-vous prévu.</p> :
          <ul className="mt-3 space-y-2 text-sm">
            {upcoming.map(r => (
              <li key={r.id}>• {r.date} — {r.with} ({r.mode}) [{r.statut}]</li>
            ))}
          </ul>
        }
      </div>

      <div className="card">
        <div className="h3">Rendez-vous passés</div>
        {past.length === 0 ? <p>Aucun rendez-vous passé.</p> :
          <ul className="mt-3 space-y-2 text-sm">
            {past.map(r => (
              <li key={r.id}>• {r.date} — {r.with} ({r.mode}) [{r.statut}]</li>
            ))}
          </ul>
        }
      </div>

      <div className="card">
        <div className="h3">Prendre un rendez-vous</div>
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <select
            name="medecinId"
            value={form.medecinId}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border"
            required
          >
            <option value="">-- Choisir un médecin --</option>
            {medecins.map(m => (
              <option key={m.idu} value={m.idm}>
                Dr {m.prenomu} {m.nomu} — {m.medecin?.specialite}
              </option>
            ))}
          </select>

          {dispos.length > 0 && (
            <select
              name="disponibiliteId"
              value={form.disponibiliteId}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border"
              required
            >
              <option value="">-- Choisir un créneau --</option>
              {dispos.map(d => (
                <option key={d.id} value={d.id}>
                  {d.jour} : {d.heureDebut} → {d.heureFin}
                </option>
              ))}
            </select>
          )}

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border"
          >
            <option>Téléconsultation</option>
            <option>Présentiel</option>
          </select>

          <input
            name="notes"
            type="text"
            placeholder="Notes (optionnel)"
            value={form.notes}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border"
          />

          <button type="submit" className="btn">Demander</button>
        </form>
      </div>
    </div>
  )
}
