// components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  requireDoctorValidation = false 
}) {
  const { user, loading } = useAuth()
  const [doctorStatus, setDoctorStatus] = useState(null)
  const [checkingDoctor, setCheckingDoctor] = useState(false)
  const location = useLocation()

  // Vérifier le statut du médecin si nécessaire
  useEffect(() => {
    const checkDoctorStatus = async () => {
      if (requireDoctorValidation && user?.role === 'DOCTOR') {
        setCheckingDoctor(true)
        try {
          // 🔍 API pour vérifier le statut du médecin
          const status = await checkDoctorValidationStatus(user.id)
          setDoctorStatus(status)
        } catch (error) {
          console.error('Error checking doctor status:', error)
          setDoctorStatus('UNKNOWN')
        } finally {
          setCheckingDoctor(false)
        }
      }
    }

    checkDoctorStatus()
  }, [user, requireDoctorValidation])

  // ⏳ Affichage pendant le chargement
  if (loading || (requireDoctorValidation && checkingDoctor)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // 🔐 Vérification d'authentification
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 👥 Vérification des rôles autorisés
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 🩺 Vérification spécifique pour les médecins
  if (requireDoctorValidation && user.role === 'DOCTOR') {
    if (doctorStatus === 'PENDING' || doctorStatus === 'UNKNOWN') {
      return <Navigate to="/doctor-pending" replace />
    }
    if (doctorStatus === 'REJECTED') {
      return <Navigate to="/doctor-rejected" replace />
    }
  }

  // ✅ Tout est bon, afficher le contenu
  return children
}

// Fonction pour vérifier le statut du médecin
const checkDoctorValidationStatus = async (userId) => {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/api/doctors/status/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const data = await response.json()
      return data.validationStatus // 'APPROVED', 'PENDING', 'REJECTED'
    }
    
    return 'UNKNOWN'
  } catch (error) {
    console.error('Error fetching doctor status:', error)
    return 'UNKNOWN'
  }
}