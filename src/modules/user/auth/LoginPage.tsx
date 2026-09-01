import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../../store/AuthContext'
import { useToast } from '../../../store/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      showToast('Welcome back!', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@satinsecrets.com')
    setPassword('demo123')
    setLoading(true)
    try {
      // Register demo user if not exists
      const { authService } = await import('../../../services/auth/authService')
      try { authService.register('Demo User', 'demo@satinsecrets.com', 'demo123') } catch {}
      await login('demo@satinsecrets.com', 'demo123')
      showToast('Logged in as Demo User', 'success')
      navigate(from, { replace: true })
    } catch {
      setError('Demo login failed. Please try registering.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-serif text-3xl font-bold text-foreground">Welcome Back</p>
          <p className="text-muted-foreground text-sm mt-2">Sign in to your SatinSecrets account</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <button type="button" className="text-xs text-accent hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              Sign In
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleDemoLogin}
              className="w-full border-2 border-border text-foreground py-3 rounded-full font-semibold hover:border-primary transition-colors text-sm"
            >
              Try Demo Account
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&rsquo;t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              Admin?{' '}
              <Link to="/admin/login" className="text-accent hover:underline">Admin Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
