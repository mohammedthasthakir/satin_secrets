import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../../store/AuthContext'
import { useToast } from '../../../store/ToastContext'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@satinsecrets.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginAdmin, isAdmin } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginAdmin(email, password)
      showToast('Welcome to Admin Panel', 'success')
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-serif text-3xl font-bold text-white">SatinSecrets</p>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Admin Portal</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="font-semibold text-white text-xl mb-6">Sign in to Admin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
                placeholder="Admin@123"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] text-[#1a0f0a] py-3.5 rounded-full font-bold hover:bg-[#c9a227] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              Sign in to Admin Panel
            </button>
          </form>

          <div className="mt-6 p-3 bg-white/5 rounded-xl">
            <p className="text-xs text-white/50 text-center">Demo credentials: admin@satinsecrets.com / Admin@123</p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">← Back to Store</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
