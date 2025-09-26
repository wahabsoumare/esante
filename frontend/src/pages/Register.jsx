import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('PATIENT')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstname,
        lastname,
        email,
        phone,
        password,
        role
      })

      alert('Inscription réussie !')
      window.location.href = '/Login.jsx'
      console.log(response.data)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l\'inscription. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
}

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-xl mx-auto card">
          <h2 className="h2">Inscription</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Prénom"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1"
            />
            <input
              type="text"
              placeholder="Nom"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2"
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2"
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Docteur</option>
            </select>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1"
            />
            <button type="submit" disabled={loading} className="btn md:col-span-2">
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
