import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children, role }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <p>Chargement...</p>

  if (!user) {
    return <Navigate to="/connexion" state={{ from: loc }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}
