// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar?: string
  loyaltyPoints?: number
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  category: string
  categoryId: string
  imageId: string
  images: string[]
  badge: string
  colors: string[]
  sizes: string[]
  description: string
  fabric: string
  care: string[]
  inStock: boolean
  stock: number
  sku: string
  featured: boolean
  tags: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  imageId: string
  productCount: number
  description?: string
  active: boolean
}

// ─── Cart & Orders ────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  address: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  couponCode?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
  trackingId?: string
}

export interface Address {
  id?: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  type?: 'home' | 'office' | 'other'
  isDefault?: boolean
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder: number
  maxUses: number
  usedCount: number
  active: boolean
  expiresAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  imageId: string
  link: string
  active: boolean
  position: number
}

export interface InventoryItem {
  productId: string
  productName: string
  sku: string
  stock: number
  lowStockThreshold: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface FilterParams {
  category?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  rating?: number
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity'
  search?: string
  page?: number
  limit?: number
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
