import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="p-8 text-center">Chargement…</div>
  if (!user) return <Navigate to="/connexion" replace state={{ from: location }} />
  return children
}
