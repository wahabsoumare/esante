import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor, faStethoscope, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function DoctorProfile() {
  const { id } = useParams()
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      setError(null)
      try {
        let res
        if (id) {
          res = await api.get(`/api/utilisateurs/public/medecins/${id}`)
        } else {
          const token = getToken()
          if (!token) throw new Error('Utilisateur non authentifié')
          res = await api.get('/api/utilisateurs/profile')
        }
        const data = res.data
        setDoc({
          id: data.idu,
          prenom: data.prenomu || data.prenom || '',
          nom: data.nomu || data.nom || '',
          name: `${data.prenomu || data.prenom || ''} ${data.nomu || data.nom || ''}`.trim(),
          specialty: data.medecin?.specialite || data.specialite || '—',
          email: data.emailu || data.email || '—',
          region: data.adresse || '—'
        })
      } catch (err) {
        console.error('Erreur récupération médecin:', err)
        setError(err.response?.data?.message || err.message || 'Erreur récupération médecin')
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [id, getToken])

  if (loading) return <div className="p-6">Chargement...</div>
  if (error || !doc) return <div className="p-6 text-red-600">{error || 'Médecin introuvable'}</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card text-center py-8">
        <div className="mx-auto w-24 h-24 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          <FontAwesomeIcon icon={faUserDoctor} className="text-3xl" />
        </div>
        <h2 className="h3 mt-4">{doc.name || '—'}</h2>
        <div className="text-sm text-zinc-600 mt-2"><FontAwesomeIcon icon={faStethoscope} /> {doc.specialty}</div>
        <div className="mt-3 text-sm text-zinc-600"><FontAwesomeIcon icon={faEnvelope} /> {doc.email}</div>
        <div className="mt-1 text-sm text-zinc-600"><FontAwesomeIcon icon={faMapMarkerAlt} /> {doc.region}</div>
        <div className="mt-6">
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate('/doctor/profile/edit')} className="btn bg-brand-600 text-white px-4 py-2 rounded-md">Mettre à jour le profil</button>
            <button onClick={() => navigate('/doctor/profile/change-password')} className="btn bg-gray-100 px-4 py-2 rounded-md">Changer le mot de passe</button>
          </div>
        </div>
      </div>
    </div>
  )
}
