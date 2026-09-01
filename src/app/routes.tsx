import { createHashRouter, Link } from 'react-router'

// Layouts
import UserLayout from '../layouts/UserLayout'
import AdminLayout from '../layouts/AdminLayout'

// Guards
import UserAuthGuard from '../routes/guards/UserAuthGuard'
import AdminAuthGuard from '../routes/guards/AdminAuthGuard'

// User pages
import HomePage from '../modules/user/home/HomePage'
import ProductListPage from '../modules/user/products/ProductListPage'
import ProductDetailPage from '../modules/user/products/ProductDetailPage'
import CartPage from '../modules/user/cart/CartPage'
import CheckoutPage from '../modules/user/cart/CheckoutPage'
import OrdersPage from '../modules/user/orders/OrdersPage'
import ProfilePage from '../modules/user/profile/ProfilePage'
import LoginPage from '../modules/user/auth/LoginPage'
import RegisterPage from '../modules/user/auth/RegisterPage'
import WishlistPage from '../modules/user/wishlist/WishlistPage'

// Admin pages
import AdminLoginPage from '../modules/admin/auth/AdminLoginPage'
import DashboardPage from '../modules/admin/dashboard/DashboardPage'
import AdminProductsPage from '../modules/admin/products/ProductsPage'
import AdminCategoriesPage from '../modules/admin/categories/CategoriesPage'
import AdminOrdersPage from '../modules/admin/orders/OrdersPage'
import AdminCustomersPage from '../modules/admin/customers/CustomersPage'
import AdminInventoryPage from '../modules/admin/inventory/InventoryPage'
import AdminReportsPage from '../modules/admin/reports/ReportsPage'
import AdminSettingsPage from '../modules/admin/settings/SettingsPage'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="font-serif text-8xl font-bold text-muted-foreground/20">404</p>
      <h1 className="font-serif text-2xl font-bold text-foreground mt-4 mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-sm mb-8">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
        Back to Home
      </Link>
    </div>
  )
}

export const router = createHashRouter([
  // ── User Portal ──────────────────────────────────────────────
  {
    path: '/',
    Component: UserLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'products', Component: ProductListPage },
      { path: 'product/:slug', Component: ProductDetailPage },
      { path: 'cart', Component: CartPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
      {
        path: 'checkout',
        Component: () => (
          <UserAuthGuard>
            <CheckoutPage />
          </UserAuthGuard>
        ),
      },
      {
        path: 'orders',
        Component: () => (
          <UserAuthGuard>
            <OrdersPage />
          </UserAuthGuard>
        ),
      },
      {
        path: 'profile',
        Component: () => (
          <UserAuthGuard>
            <ProfilePage />
          </UserAuthGuard>
        ),
      },
      { path: '*', Component: NotFound },
    ],
  },

  // ── Admin Portal ─────────────────────────────────────────────
  { path: '/admin/login', Component: AdminLoginPage },
  {
    path: '/admin',
    Component: () => (
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      { index: true, Component: DashboardPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'products', Component: AdminProductsPage },
      { path: 'categories', Component: AdminCategoriesPage },
      { path: 'orders', Component: AdminOrdersPage },
      { path: 'customers', Component: AdminCustomersPage },
      { path: 'inventory', Component: AdminInventoryPage },
      { path: 'reports', Component: AdminReportsPage },
      { path: 'settings', Component: AdminSettingsPage },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
})
