import { useState } from 'react'
import { useAuth } from '../../../store/AuthContext'
import { useToast } from '../../../store/ToastContext'
import { useNavigate } from 'react-router'

type Tab = 'profile' | 'addresses' | 'loyalty' | 'security'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('profile')
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateUser({ name: form.name, phone: form.phone })
      showToast('Profile updated successfully', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out', 'info')
    navigate('/')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  const loyalty = user.loyaltyPoints ?? 0
  const tier = loyalty >= 5000 ? 'Platinum' : loyalty >= 2000 ? 'Gold' : loyalty >= 500 ? 'Silver' : 'Bronze'
  const tierColors: Record<string, string> = { Platinum: 'from-slate-400 to-slate-600', Gold: 'from-yellow-400 to-yellow-600', Silver: 'from-gray-300 to-gray-500', Bronze: 'from-amber-500 to-amber-700' }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${tierColors[tier]} rounded-2xl p-6 text-white mb-8`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold font-serif">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">{user.name}</h1>
            <p className="text-white/75 text-sm">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{tier} Member</span>
              <span className="text-white/80 text-sm">{loyalty.toLocaleString()} points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="bg-card rounded-2xl shadow-sm p-2">
            {([
              { id: 'profile', label: 'My Profile', icon: '◉' },
              { id: 'addresses', label: 'Addresses', icon: '◫' },
              { id: 'loyalty', label: 'Loyalty Points', icon: '★' },
              { id: 'security', label: 'Security', icon: '🔒' },
            ] as { id: Tab; label: string; icon: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-500 hover:bg-red-50 transition-all mt-1">
              <span>↩</span> Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold mb-5">Personal Information</h2>
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { field: 'name', label: 'Full Name', type: 'text' },
                  { field: 'email', label: 'Email Address', type: 'email' },
                  { field: 'phone', label: 'Phone Number', type: 'tel' },
                ].map(({ field, label, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      disabled={field === 'email'}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-bold">Saved Addresses</h2>
                <button className="text-sm font-semibold text-primary border border-primary px-4 py-1.5 rounded-full hover:bg-primary/5 transition-colors">+ Add New</button>
              </div>
              <div className="space-y-4">
                {[
                  { type: 'Home', name: user.name, address: '42 Jubilee Hills, Hyderabad - 500033, Telangana', default: true },
                  { type: 'Office', name: user.name, address: '15 Nariman Point, Mumbai - 400021, Maharashtra', default: false },
                ].map(addr => (
                  <div key={addr.type} className="border-2 border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-secondary px-2 py-0.5 rounded-full">{addr.type}</span>
                        {addr.default && <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-accent hover:underline">Edit</button>
                        <button className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">{addr.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'loyalty' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold mb-5">Loyalty Points</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Points', value: loyalty.toLocaleString() },
                  { label: 'Points Value', value: `₹${Math.floor(loyalty / 10)}` },
                  { label: 'Tier', value: tier },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-secondary rounded-xl p-4 text-center">
                    <p className="font-serif text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold text-sm mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { desc: 'Welcome Bonus', points: '+100', date: 'Jan 2025', type: 'credit' },
                  { desc: 'Purchase — Midnight Lace Set', points: '+189', date: 'Dec 2024', type: 'credit' },
                  { desc: 'Referral Bonus', points: '+50', date: 'Dec 2024', type: 'credit' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{t.desc}</p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                    <span className="font-bold text-sm text-green-600">{t.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl font-bold mb-5">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Current Password</label>
                  <input type="password" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">New Password</label>
                  <input type="password" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
                  <input type="password" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                </div>
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">Update Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
