// src/pages/DoctorProfile.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStethoscope, faCircleCheck, faLanguage, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'  // ✅ import du contexte

export default function DoctorProfile() {
  const { id } = useParams()
  const location = useLocation()
  const bookingRef = useRef(null)
  const { getToken } = useAuth()  // ✅ récupération du token

  const [doc, setDoc] = useState(null)
  const [dispos, setDispos] = useState([])
  const [rdvs, setRdvs] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDispo, setSelectedDispo] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Création d'un header Axios avec token
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getToken() || ''}`
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        // Endpoint getDisponibilitesByMedecin avec token
        const dispoRes = await axios.get(
          `http://localhost:3000/api/disponibilites/medecin/${id}`,
          axiosConfig
        )
        setDoc(dispoRes.data.medecin)
        setDispos(dispoRes.data.disponibilites || [])

        // RDV confirmés pour bloquer les créneaux
        const rdvRes = await axios.get(
          `http://localhost:3000/api/rendezvous/medecin/${id}`,
          axiosConfig
        )
        setRdvs(rdvRes.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  useEffect(() => {
    const openBooking = location.hash === '#booking' || new URLSearchParams(location.search).get('book') === 'true'
    if (openBooking && bookingRef.current) {
      const today = new Date().toISOString().slice(0, 10)
      setSelectedDate(prev => prev || today)
      setTimeout(() => {
        bookingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const input = bookingRef.current.querySelector('input[type="date"]')
        if (input) input.focus()
      }, 150)
    }
  }, [location.hash, location.search])

  if (loading) return <div>Chargement...</div>
  if (!doc) return (
    <div>
      <Navbar />
      <section className="section"><div className="max-w-4xl mx-auto px-4">Médecin introuvable.</div></section>
      <Footer />
    </div>
  )

  const jourNom = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
  const getDisponibilitesForDate = (date) => {
    if (!date) return []
    const d = new Date(date)
    const jour = jourNom[d.getDay()]
    return dispos.filter(dispo => dispo.jour === jour)
  }

  const isSlotTaken = (date, heureDebut, heureFin) =>
    rdvs.some(r => r.dateRdv === date && (r.heureDebut < heureFin && r.heureFin > heureDebut))

  const handleReserve = async () => {
    if (!selectedDate || !selectedDispo) {
      setMessage('Sélectionnez une date et un créneau.')
      return
    }
    try {
      const res = await axios.post(
        'http://localhost:3000/api/rendezvous',
        {
          medecinId: doc.id,
          disponibiliteId: selectedDispo.id,
          dateRdv: selectedDate,
          heureDebut: selectedDispo.heureDebut,
          heureFin: selectedDispo.heureFin,
          notes
        },
        axiosConfig // ✅ token inclus dans la requête POST
      )
      setMessage('Rendez-vous créé — en attente de confirmation.')
      setRdvs(prev => [...prev, res.data])
      setSelectedDate('')
      setSelectedDispo(null)
      setNotes('')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la réservation')
    }
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="card md:col-span-1 text-center" ref={bookingRef} id="booking">
            <div className="h4 mb-2">Prendre rendez-vous</div>
            <div className="mt-2">
              <input
                type="date"
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedDispo(null); setMessage('') }}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="mt-3">
              {selectedDate ? (
                getDisponibilitesForDate(selectedDate).map(dispo => {
                  const taken = isSlotTaken(selectedDate, dispo.heureDebut, dispo.heureFin)
                  return (
                    <button
                      key={dispo.id}
                      className={`btn w-full mt-2 ${taken ? 'bg-red-400 cursor-not-allowed' : 'bg-brand-600'}`}
                      disabled={taken}
                      onClick={() => { if (!taken) setSelectedDispo(dispo) }}
                    >
                      {dispo.heureDebut} - {dispo.heureFin} {taken ? ' (Occupé)' : ''}
                    </button>
                  )
                })
              ) : (
                <div className="text-sm text-zinc-500 mt-2">Choisissez une date pour voir les créneaux disponibles.</div>
              )}
            </div>
            {selectedDispo && (
              <div className="mt-3">
                <textarea
                  placeholder="Notes (facultatif)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="border w-full p-2 rounded"
                />
                <button className="btn w-full mt-3" onClick={handleReserve}>Confirmer le RDV</button>
              </div>
            )}
            {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
          </div>

          <div className="md:col-span-2 grid gap-4">
            <div className="card">
              <div className="h3">{doc.prenom} {doc.nom}</div>
              <div className="text-sm text-zinc-600 mt-1"><FontAwesomeIcon icon={faStethoscope}/> {doc.specialite}</div>
              <div className="text-sm text-zinc-600 mt-1"><FontAwesomeIcon icon={faLocationDot}/> {doc.adresse || '—'}</div>
              <div className="mt-4">
                <p className="text-sm text-zinc-700">{doc.bio || "Médecin expérimenté."}</p>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-zinc-700">
                <div><FontAwesomeIcon className="text-brand-600" icon={faCircleCheck}/> {doc.experience || '—'} ans d’expérience</div>
                <div><FontAwesomeIcon className="text-brand-600" icon={faLanguage}/> Langues : {doc.languages?.join?.(', ') || 'fr'}</div>
                <div><FontAwesomeIcon className="text-brand-600" icon={faMoneyBill}/> Tarif : {doc.fee || '—'}</div>
              </div>
            </div>

            <div className="card">
              <div className="h3">Disponibilités</div>
              <p className="mt-2 text-sm text-zinc-700">
                {dispos.length === 0 ? 'Aucune disponibilité renseignée' :
                  dispos.map(d => `${d.jour} : ${d.heureDebut} - ${d.heureFin}`).join(' | ')
                }
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
