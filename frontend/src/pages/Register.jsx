import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [password, setPassword] = useState('')
  const [sexe, setSexe] = useState('M')
  const [dateNaissance, setDateNaissance] = useState('')
  const [adresse, setAdresse] = useState('')
  const [commune, setCommune] = useState('')
  const [personneUrgence, setPersonneUrgence] = useState('')
  const [languePref, setLanguePref] = useState('Français')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3000/api/patients/', {
        prenom,
        nom,
        telephone,
        email,
        password,
        sexe,
        date_naissance: dateNaissance,
        adresse,
        commune,
        personne_urgence: personneUrgence,
        langue_pref: languePref
      })
      console.log({
        prenom,
        nom,
        telephone,
        email,
        password,
        sexe,
        date_naissance: dateNaissance,
        adresse,
        commune,
        personne_urgence: personneUrgence,
        langue_pref: languePref
      })

      alert('Inscription réussie !')
      window.location.href = '/Login.jsx'
      console.log(response.data)
    } catch (error) {
      if (error.response) {
        console.error('Erreur backend:', error.response.data)
        alert('Erreur backend : ' + JSON.stringify(error.response.data))
      } else {
        console.error('Erreur frontend:', error.message)
        alert('Erreur frontend : ' + error.message)
      }
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
            <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="tel" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1" />
            <select value={sexe} onChange={(e) => setSexe(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-1">
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
            <input type="date" placeholder="Date de naissance" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="text" placeholder="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="text" placeholder="Commune" value={commune} onChange={(e) => setCommune(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="text" placeholder="Personne à contacter en cas d'urgence" value={personneUrgence} onChange={(e) => setPersonneUrgence(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="text" placeholder="Langue préférée" value={languePref} onChange={(e) => setLanguePref(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-3 rounded-xl border border-zinc-200 bg-white md:col-span-2" />
            <button type="submit" disabled={loading} className="btn md:col-span-2">{loading ? 'Inscription...' : 'Créer mon compte'}</button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
