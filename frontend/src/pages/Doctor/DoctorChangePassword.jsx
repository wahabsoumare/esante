import { useState } from 'react'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DoctorChangePassword() {
  const { getToken } = useAuth()
  const navigate = useNavigate()

  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const onSave = async () => {
    setError(null)
    if (!password) return setError('Le nouveau mot de passe est requis')
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas')
    try {
      setSaving(true)
      // The updateProfile endpoint accepts a `password` field and will hash it server-side
      await api.put('/api/utilisateurs/profile', { password })
      navigate('/doctor')
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="card p-6">
        <h2 className="h3">Changer le mot de passe</h2>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <div className="grid gap-3 mt-4">
          <input type="password" value={current} onChange={e=>setCurrent(e.target.value)} className="input" placeholder="Mot de passe actuel (optionnel)" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" placeholder="Nouveau mot de passe" />
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="input" placeholder="Confirmer le nouveau mot de passe" />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onSave} disabled={saving} className="btn bg-brand-600 text-white px-4 py-2 rounded-md">{saving ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}</button>
          <button onClick={()=>navigate(-1)} className="btn bg-gray-100 px-4 py-2 rounded-md">Annuler</button>
        </div>
      </div>
    </div>
  )
}
