'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PatientIndicators() {
  const [indicators, setIndicators] = useState([])
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')

  const token = localStorage.getItem('token')

  // Instance axios avec token
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { Authorization: `Bearer ${token}` },
  })

  const fetchMetrics = async () => {
    try {
      const { data } = await axiosInstance.get('/patients/profile')
      const metricsArray = Object.entries(data.metriques || {}).map(([key, val]) => ({
        label: key,
        value: val,
      }))
      setIndicators(metricsArray)
    } catch (err) {
      console.error('Erreur récupération métriques :', err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  // Ajouter une nouvelle métrique
  const handleAddMetric = async (e) => {
    e.preventDefault()
    if (!type || !value) return

    try {
      // Récupérer les données actuelles du patient
      const { data: patient } = await axiosInstance.get('/patients/profile')
      const currentMetrics = patient.metriques || {}

      const updatedMetrics = {
        ...currentMetrics,
        [type]: value,
      }

      // Envoyer la mise à jour au serveur
      await axiosInstance.put('/patients/profile', { metriques: updatedMetrics })

      // Rafraîchir l'affichage
      setIndicators(Object.entries(updatedMetrics).map(([key, val]) => ({ label: key, value: val })))
      setType('')
      setValue('')
      setDate('')
    } catch (err) {
      console.error('Erreur ajout métrique :', err.response?.data || err.message)
    }
  }

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
        <form onSubmit={handleAddMetric} className="mt-3 grid md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Type (ex: TA, glycémie…)"
            className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Valeur"
            className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="date"
            className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit" className="btn md:col-span-3">Enregistrer</button>
        </form>
      </div>
    </div>
  )
}
