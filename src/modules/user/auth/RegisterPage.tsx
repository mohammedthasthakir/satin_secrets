import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../../store/AuthContext'
import { useToast } from '../../../store/ToastContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      showToast('Account created! Welcome to SatinSecrets 🎉', 'success')
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-serif text-3xl font-bold text-foreground">Create Account</p>
          <p className="text-muted-foreground text-sm mt-2">Join 50,000+ women who love SatinSecrets</p>
        </div>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
              { field: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', required: true },
              { field: 'phone', label: 'Phone number (optional)', type: 'tel', placeholder: '+91 98765 43210', required: false },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••', required: true },
              { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••', required: true },
            ].map(({ field, label, type, placeholder, required }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[field as keyof typeof form]}
                  onChange={update(field)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            You&rsquo;ll receive 100 loyalty points on joining!
          </p>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
