export const ls = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  },
}

export const KEYS = {
  AUTH: 'ss_auth',
  USERS: 'ss_users',
  CART: 'ss_cart',
  WISHLIST: 'ss_wishlist',
  ORDERS: 'ss_orders',
  ADDRESSES: 'ss_addresses',
}
