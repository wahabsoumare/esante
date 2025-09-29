import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [emailu, setEmailu] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [globalSuccess, setGlobalSuccess] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setGlobalError(null)
    setGlobalSuccess(null)

    try {
      const response = await axios.post('http://localhost:3000/api/utilisateurs/login', {
        emailu,
        password,
      })

      // ATTENTION ici selon ton backend, la structure peut être "user" ou "patient"
      const { token, user, patient } = response.data

      if (!token) {
        throw new Error('Jeton manquant dans la réponse')
      }

      // Stockage du token
      localStorage.setItem('token', token)

      // Appel de la fonction login de ton contexte
      // Tu peux passer soit patient soit user selon la réponse reçue
      login({ patient: patient || null, user: user || null, token })

      setGlobalSuccess('Connexion réussie — redirection en cours...')

      // Définir le type à partir de user ou patient
      const type =
        (patient && patient.typecompte) ||
        (patient && patient.role) ||
        (user && user.typecompte) ||
        (user && user.role)

      let redirectPath = from
      if (type === 'ROLE_PATIENT') {
        redirectPath = '/patient'
      } else if (type === 'ROLE_ADMIN') {
        redirectPath = '/admin'
      } else if (type === 'ROLE_MEDECIN') {
        redirectPath = '/medecin'
      }

      // Redirection après 2 secondes
      setTimeout(() => navigate(redirectPath, { replace: true }), 2000)
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      if (error.response) {
        setGlobalError(
          error.response.data.error ||
          error.response.data.message ||
          'Email ou mot de passe incorrect'
        )
      } else {
        setGlobalError(error.message || 'Erreur réseau, veuillez réessayer')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
    setGlobalError(null)
    setGlobalSuccess(null)
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-md mx-auto card">
          <h2 className="h2 text-center">Connexion</h2>

          {globalError && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3">
              <p className="font-medium text-red-800">Erreur</p>
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          )}

          {globalSuccess && (
            <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3">
              <p className="font-medium text-green-800">Succès</p>
              <p className="text-sm text-green-700">{globalSuccess}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid gap-3">
            <input
              value={emailu}
              onChange={handleChange(setEmailu)}
              type="email"
              placeholder="Email"
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
              required
              autoComplete="username"
            />
            <input
              value={password}
              onChange={handleChange(setPassword)}
              type="password"
              placeholder="Mot de passe"
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white"
              required
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn w-full"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-600 text-center">
            Pas de compte ? <Link className="text-brand-600" to="/inscription">Créer un compte</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
