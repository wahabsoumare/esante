import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStethoscope, faCalendarCheck, faCircleCheck, faLanguage, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

export default function DoctorProfile() {
  const { id } = useParams()
  const { getToken } = useAuth()

  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      setError(null)
      try {
        if (id) {
          // Public medecin view
          const res = await api.get(`/api/utilisateurs/public/medecins/${id}`)
          const data = res.data
          setDoc({
            id: data.idu,
            prenom: data.prenomu,
            nom: data.nomu,
            name: `${data.prenomu} ${data.nomu}`,
            specialty: data.specialite || data.medecin?.specialite || '—',
            email: data.emailu || null,
            bio: data.bio || null,
            region: data.adresse || null,
            availability: data.disponibilites || null,
            experience: data.experience || '—',
            languages: data.languages || ['fr'],
            fee: data.fee || null,
            photo: data.photo || null
          })
        } else {
          // Logged-in doctor's own profile
          // api instance attaches token from localStorage; ensure token exists
          const token = getToken()
          if (!token) {
            setError('Utilisateur non authentifié')
            setLoading(false)
            return
          }
          const res = await api.get('/api/utilisateurs/profile')
          const data = res.data
          setDoc({
            id: data.idu,
            prenom: data.prenomu,
            nom: data.nomu,
            name: `${data.prenomu} ${data.nomu}`,
            specialty: data.medecin?.specialite || '—',
            email: data.emailu || null,
            bio: data.bio || null,
            region: data.adresse || null,
            availability: data.disponibilites || null,
            experience: data.experience || '—',
            languages: data.languages || ['fr'],
            fee: data.fee || null,
            photo: data.photo || null
          })
        }
      } catch (err) {
        console.error('Erreur recuperation medecin:', err)
        setError(err.response?.data?.message || err.message || 'Erreur récupération médecin')
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [id, getToken])

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="section"><div className="max-w-4xl mx-auto px-4">Chargement du médecin...</div></section>
        <Footer />
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div>
        <Navbar />
        <section className="section"><div className="max-w-4xl mx-auto px-4 text-red-600">{error || 'Médecin introuvable.'}</div></section>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="card md:col-span-1 text-center">
            <img src={doc.photo || '/vite.svg'} alt={doc.name} className="w-32 h-32 rounded-full object-cover mx-auto" />
            <div className="h3 mt-3">{doc.name}</div>
            <div className="text-sm text-zinc-600"><FontAwesomeIcon icon={faStethoscope}/> {doc.specialty}</div>
            <div className="text-sm text-zinc-600 mt-1"><FontAwesomeIcon icon={faLocationDot}/> {doc.region || '—'}</div>
            <button className="btn w-full mt-4"><FontAwesomeIcon icon={faCalendarCheck}/> Prendre rendez-vous</button>
          </div>

          <div className="md:col-span-2 grid gap-4">
            <div className="card">
              <div className="h3">À propos</div>
              <p className="mt-2 text-sm text-zinc-700">{doc.bio || "Médecin expérimenté, à l’écoute, orienté prévention et éducation."}</p>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-zinc-700">
                <div><FontAwesomeIcon className="text-brand-600" icon={faCircleCheck}/> {doc.experience} ans d’expérience</div>
                <div><FontAwesomeIcon className="text-brand-600" icon={faLanguage}/> Langues : {(doc.languages || ['fr']).join(', ')}</div>
                <div><FontAwesomeIcon className="text-brand-600" icon={faMoneyBill}/> Tarif : {doc.fee || '—'}</div>
              </div>
            </div>
            <div className="card">
              <div className="h3">Disponibilités</div>
              <p className="mt-2 text-sm text-zinc-700">
                {doc.availability || 'Créneaux réguliers en semaine (matin & après-midi). Téléconsultation possible.'}
              </p>
            </div>
            <div className="card">
              <div className="h3">Informations de confiance</div>
              <ul className="mt-2 text-sm text-zinc-700 list-disc pl-5">
                <li>Identité et diplôme vérifiés</li>
                <li>Dossier patient sécurisé (RGPD)</li>
                <li>Notes & avis patients disponibles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
