import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../store/AuthContext'

export default function UserAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
