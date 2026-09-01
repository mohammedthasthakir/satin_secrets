import { Navigate } from 'react-router'
import { useAuth } from '../../store/AuthContext'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don&rsquo;t have permission to access the admin portal.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
