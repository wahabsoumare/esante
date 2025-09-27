import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('cc_auth_user')
    if (raw) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  const login = (payload) => {
    localStorage.setItem('cc_auth_user', JSON.stringify(payload))
    setUser(payload)
  }
  const logout = () => {
    localStorage.removeItem('cc_auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
