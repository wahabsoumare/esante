import { useState } from 'react'
import api from '../config/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom' //React Router


export default function Register() {
  const navigate = useNavigate() // hook de navigation

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    sexe: 'M',
    dateNaissance: '',
    adresse: '',
    commune: '',
    personneUrgence: '',
    languePref: 'Français'
  })

  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null) // message d'erreur global
  const [globalSuccess, setGlobalSuccess] = useState(null) // message de succès
  const [fieldErrors, setFieldErrors] = useState({}) // erreurs par champ

  // Gestion générique des changements d'input
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // si le champ avait une erreur, l'effacer à la première saisie
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
    }

    // effacer les messages globaux lorsque l'utilisateur recommence à saisir
    setGlobalError(null)
    setGlobalSuccess(null)
  }

  // Petite validation côté client avant envoi
  const validate = () => {
    const errs = {}
    if (!form.prenom || form.prenom.trim() === '') errs.prenom = "Le prénom est requis"
    if (!form.nom || form.nom.trim() === '') errs.nom = "Le nom est requis"
    if (!form.email || form.email.trim() === '') errs.email = "L'email est requis"
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Format d'email invalide"
    if (!form.password || form.password.length < 6) errs.password = "Le mot de passe doit contenir au moins 6 caractères"
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGlobalError(null)
    setGlobalSuccess(null)
    setFieldErrors({})

    const clientErrs = validate()
    if (Object.keys(clientErrs).length > 0) {
      setFieldErrors(clientErrs)
      return
    }

    setLoading(true)
    try {
      const payload = {
        prenom: form.prenom,
        nom: form.nom,
        telephone: form.telephone,
        email: form.email,
        password: form.password,
        sexe: form.sexe,
        date_naissance: form.dateNaissance,
        adresse: form.adresse,
        commune: form.commune,
        personne_urgence: form.personneUrgence,
        langue_pref: form.languePref
      }

  const response = await api.post('/api/patients/', payload)

      // Succès : afficher message et rediriger proprement
      setGlobalSuccess('Inscription réussie — vous allez être redirigé vers la page de connexion')
      setTimeout(() => navigate('/connexion'), 2000) //navigate au lieu de router.push

      console.log('Réponse serveur:', response.data)
    } catch (err) {
      console.error('Erreur requête :', err)

      if (err.response) {
        const data = err.response.data
        if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
          setFieldErrors(data.errors)
          if (data.message) setGlobalError(data.message)
        } else if (data.errors && Array.isArray(data.errors)) {
          const fe = {}
          data.errors.forEach((it) => {
            if (it.param) fe[it.param] = it.msg || it.message || JSON.stringify(it)
          })
          setFieldErrors(fe)
        } else if (data.message) {
          setGlobalError(data.message)
        } else {
          setGlobalError(JSON.stringify(data))
        }
      } else {
        setGlobalError(err.message || 'Erreur inconnue')
      }
    } finally {
      setLoading(false)
    }
  }

  const renderError = (name) => {
    if (!fieldErrors || !fieldErrors[name]) return null
    return <p className="text-sm text-red-700 mt-1">{fieldErrors[name]}</p>
  }

  return (
    <div>
      <Navbar />

      <section className="section">
        <div className="max-w-xl mx-auto card">
          <h2 className="h2">Inscription</h2>

          {/* Bannière d'erreur globale */}
          {globalError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
              <p className="font-medium text-red-800">Erreur</p>
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          )}

          {/* Bannière de succès */}
          {globalSuccess && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3">
              <p className="font-medium text-green-800">Succès</p>
              <p className="text-sm text-green-700">{globalSuccess}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3" noValidate>
            <div className="md:col-span-1">
              <input
                name="prenom"
                type="text"
                placeholder="Prénom"
                value={form.prenom}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('prenom')}
            </div>

            <div className="md:col-span-1">
              <input
                name="nom"
                type="text"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('nom')}
            </div>

            <div className="md:col-span-2">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('email')}
            </div>

            <div className="md:col-span-1">
              <input
                name="telephone"
                type="tel"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('telephone')}
            </div>

            <div className="md:col-span-1">
              <select
                name="sexe"
                value={form.sexe}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              >
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
              {renderError('sexe')}
            </div>

            <div className="md:col-span-2">
              <input
                name="dateNaissance"
                type="date"
                placeholder="Date de naissance"
                value={form.dateNaissance}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('dateNaissance')}
            </div>

            <div className="md:col-span-2">
              <input
                name="adresse"
                type="text"
                placeholder="Adresse"
                value={form.adresse}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('adresse')}
            </div>

            <div className="md:col-span-2">
              <input
                name="commune"
                type="text"
                placeholder="Commune"
                value={form.commune}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('commune')}
            </div>

            <div className="md:col-span-2">
              <input
                name="personneUrgence"
                type="text"
                placeholder="Personne à contacter en cas d'urgence"
                value={form.personneUrgence}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('personneUrgence')}
            </div>

            <div className="md:col-span-2">
              <input
                name="languePref"
                type="text"
                placeholder="Langue préférée"
                value={form.languePref}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('languePref')}
            </div>

            <div className="md:col-span-2">
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-zinc-200 bg-white w-full"
              />
              {renderError('password')}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn md:col-span-2"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
