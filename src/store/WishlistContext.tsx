import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { ls, KEYS } from '../services/storage/localStorage'

interface WishlistContextValue {
  wishlistIds: string[]
  isWishlisted: (id: string) => boolean
  toggleWishlist: (id: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => ls.get<string[]>(KEYS.WISHLIST) ?? [])

  useEffect(() => { ls.set(KEYS.WISHLIST, wishlistIds) }, [wishlistIds])

  const isWishlisted = useCallback((id: string) => wishlistIds.includes(id), [wishlistIds])

  const toggleWishlist = useCallback((id: string) => {
    setWishlistIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  return (
    <WishlistContext.Provider value={{ wishlistIds, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
