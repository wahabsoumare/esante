// context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import api from '../config/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        
        if (userData.token) {
          localStorage.setItem('token', userData.token)
        }
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // 🔑 FONCTION LOGIN - Adaptée à votre API
  const login = (apiResponse) => {
    console.log('Login called with API response:', apiResponse)
    
    if (!apiResponse || !apiResponse.user || !apiResponse.token) {
      console.error('Invalid API response for login')
      return
    }

    const userData = apiResponse.user
    const userInfo = {
      id: userData.id,
      email: userData.email,
      role: userData.role, // 'PATIENT', 'DOCTOR', 'ADMIN'
      firstname: userData.firstname,
      lastname: userData.lastname,
      phone: userData.phone,
      token: apiResponse.token,
      // Pour les médecins, on devra récupérer le validationStatus séparément
    }

    setUser(userInfo)
    localStorage.setItem('user', JSON.stringify(userInfo))
    localStorage.setItem('token', apiResponse.token)
  }

  // 🚪 FONCTION LOGOUT
  // Calls server logout endpoints (if available) and then clears local auth state
  const logout = async () => {
    console.log('Logout called')
    try {
      // attempt to invalidate token on both possible endpoints
      await api.post('/api/utilisateurs/logout')
    } catch (e) {
      // ignore server errors - may not exist for this role
    }
    try {
      await api.post('/api/patients/logout')
    } catch (e) {
      // ignore
    }

    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 🔍 FONCTIONS UTILITAIRES
  const hasRole = (role) => user?.role === role
  
  const isAuthenticated = !!user
  
  const getToken = () => localStorage.getItem('token')

  // Pour les médecins, on devra vérifier le statut via une API séparée
  const isApprovedDoctor = () => {
    // Cette fonction devra probablement faire un appel API
    // pour vérifier le validationStatus du médecin
    return user?.role === 'DOCTOR'
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    getToken,
    isApprovedDoctor
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}