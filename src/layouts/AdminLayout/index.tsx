import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../store/AuthContext'
import { useToast } from '../../store/ToastContext'
import ToastNotifications from '../../components/common/ToastNotifications'

const NAV_ITEMS = [
  { icon: '◈', label: 'Dashboard', to: '/admin/dashboard' },
  { icon: '◫', label: 'Products', to: '/admin/products' },
  { icon: '⊞', label: 'Categories', to: '/admin/categories' },
  { icon: '◻', label: 'Orders', to: '/admin/orders' },
  { icon: '◉', label: 'Customers', to: '/admin/customers' },
  { icon: '⊟', label: 'Inventory', to: '/admin/inventory' },
  { icon: '≋', label: 'Reports', to: '/admin/reports' },
  { icon: '⚙', label: 'Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showToast('Logged out', 'info')
    navigate('/admin/login')
  }

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <div className="min-h-screen flex bg-[#f8f7f5]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-[#1a0f0a] text-white flex flex-col transition-all duration-300 h-screen sticky top-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-serif text-base font-bold leading-tight">SatinSecrets</p>
              <p className="text-white/40 text-[9px] tracking-widest uppercase">Admin</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ icon, label, to }) => (
            <Link
              key={to}
              to={to}
              title={!sidebarOpen ? label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                isActive(to)
                  ? 'bg-white/15 text-white border-r-2 border-[#d4af37]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base flex-shrink-0">{icon}</span>
              {sidebarOpen && <span className="font-medium">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-sm font-bold text-[#1a0f0a] flex-shrink-0">
                {user?.name?.[0] ?? 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{user?.name ?? 'Admin'}</p>
                <button onClick={handleLogout} className="text-[10px] text-white/50 hover:text-white transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-white/50 hover:text-white transition-colors py-1" title="Logout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4 sticky top-0 z-30">
          <div>
            <h1 className="font-semibold text-foreground capitalize text-sm">
              {NAV_ITEMS.find(n => isActive(n.to))?.label ?? 'Admin Panel'}
            </h1>
            <p className="text-xs text-muted-foreground">SatinSecrets Admin Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {user?.name?.[0] ?? 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastNotifications />
    </div>
  )
}
