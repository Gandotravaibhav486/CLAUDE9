import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireAdmin({ children }) {
  const { profile, loading } = useAuth()

  if (loading) return null
  if (!profile?.is_admin) return <Navigate to="/dashboard" replace />

  return children
}
