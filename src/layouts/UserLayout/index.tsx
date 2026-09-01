import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../store/AuthContext'
import { useCart } from '../../store/CartContext'
import { useWishlist } from '../../store/WishlistContext'
import { useToast } from '../../store/ToastContext'
import ToastNotifications from '../../components/common/ToastNotifications'

const NAV_LINKS = [
  { label: 'New Arrivals', to: '/products?badge=New Arrival' },
  { label: 'Bras', to: '/products?category=Bras' },
  { label: 'Lingerie Sets', to: '/products?category=Lingerie Sets' },
  { label: 'Sleepwear', to: '/products?category=Sleepwear' },
  { label: 'Loungewear', to: '/products?category=Loungewear' },
  { label: 'Sale', to: '/products?sort=price_asc' },
]

export default function UserLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistIds } = useWishlist()
  const { showToast } = useToast()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs text-center py-2 px-4 font-medium">
        Free Shipping on Orders ₹1499+ &nbsp;·&nbsp; Use code <strong>SATIN20</strong> for 20% off &nbsp;·&nbsp; <span className="underline cursor-pointer">Shop Now</span>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/95 backdrop-blur-md shadow-md' : 'bg-card'} border-b border-border`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <p className="font-serif text-xl font-bold text-foreground tracking-tight">SatinSecrets</p>
            <p className="text-[9px] text-muted-foreground tracking-[0.25em] uppercase -mt-0.5">Premium Innerwear</p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistIds.length}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors">Wishlist</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-secondary transition-colors">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 pb-4 animate-slide-down">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="py-2 text-sm font-medium text-foreground">Login</Link>
                  <Link to="/register" className="py-2 text-sm font-medium text-primary">Create Account</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-xl font-bold mb-1">SatinSecrets</p>
            <p className="text-primary-foreground/55 text-xs tracking-widest uppercase mb-4">Premium Innerwear</p>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">Premium lingerie and sleepwear crafted for the modern woman. Privacy guaranteed, quality assured.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-4">Shop</p>
            <ul className="space-y-2">
              {['New Arrivals', 'Best Sellers', 'Lingerie Sets', 'Bras', 'Sleepwear', 'Loungewear'].map(c => (
                <li key={c}>
                  <Link to={`/products?category=${c}`} className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-4">Help</p>
            <ul className="space-y-2">
              {['Size Guide', 'Track Order', 'Returns', 'FAQs', 'Contact Us'].map(t => (
                <li key={t}><span className="text-xs text-primary-foreground/60 cursor-pointer hover:text-primary-foreground transition-colors">{t}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-4">Account</p>
            <ul className="space-y-2">
              {[{l:'Login / Register',t:'/login'},{l:'My Orders',t:'/orders'},{l:'Wishlist',t:'/wishlist'},{l:'Profile',t:'/profile'}].map(({l,t}) => (
                <li key={l}><Link to={t} className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-primary-foreground/40">
          © 2024 SatinSecrets — SS Commerce Pvt Ltd. All rights reserved.
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {[
          { icon: '⌂', label: 'Home', to: '/' },
          { icon: '◫', label: 'Shop', to: '/products' },
          { icon: '♡', label: 'Saved', to: '/wishlist' },
          { icon: '◻', label: 'Cart', to: '/cart' },
          { icon: '◉', label: 'Account', to: isAuthenticated ? '/profile' : '/login' },
        ].map(({ icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${location.pathname === to ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <ToastNotifications />
    </div>
  )
}
