import { useEffect, useState } from 'react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

export default function DoctorProfileEdit() {
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', specialty: '', adresse: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const token = getToken()
        if (!token) throw new Error('Non authentifié')
        const res = await api.get('/api/utilisateurs/profile')
        const d = res.data
        setForm({
          prenom: d.prenomu || d.prenom || '',
          nom: d.nomu || d.nom || '',
          email: d.emailu || d.email || '',
          specialty: d.medecin?.specialite || d.specialite || '',
          adresse: d.adresse || ''
        })
      } catch (e) {
        console.error(e)
        setError(e.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [getToken])

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        prenomu: form.prenom,
        nomu: form.nom,
        emailu: form.email,
        adresse: form.adresse,
        medecin: { specialite: form.specialty }
      }
      await api.put('/api/utilisateurs/profile', payload)
      navigate('/doctor')
    } catch (e) {
      console.error('Erreur sauvegarde profil:', e)
      setError(e.response?.data?.message || e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card p-6">
        <h2 className="h3">Modifier mon profil</h2>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <div className="grid gap-3 mt-4">
          <input name="prenom" value={form.prenom} onChange={onChange} className="input" placeholder="Prénom" />
          <input name="nom" value={form.nom} onChange={onChange} className="input" placeholder="Nom" />
          <input name="email" value={form.email} onChange={onChange} className="input" placeholder="Email" />
          <input name="specialty" value={form.specialty} onChange={onChange} className="input" placeholder="Spécialité" />
          <input name="adresse" value={form.adresse} onChange={onChange} className="input" placeholder="Adresse" />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onSave} disabled={saving} className="btn bg-brand-600 text-white px-4 py-2 rounded-md">
            <FontAwesomeIcon icon={faFloppyDisk} /> <span className="ml-2">{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
          <button onClick={() => navigate(-1)} className="btn bg-gray-100 px-4 py-2 rounded-md">Annuler</button>
        </div>
      </div>
    </div>
  )
}
