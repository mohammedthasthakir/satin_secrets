import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import { ls, KEYS } from '../services/storage/localStorage'

interface CartContextValue {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product, size: string, color: string, qty?: number) => void
  removeFromCart: (productId: string, size: string, color: string) => void
  updateQty: (productId: string, size: string, color: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => ls.get<CartItem[]>(KEYS.CART) ?? [])

  useEffect(() => { ls.set(KEYS.CART, cart) }, [cart])

  const addToCart = useCallback((product: Product, size: string, color: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      }
      return [...prev, { product, size, color, quantity: qty }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color)))
  }, [])

  const updateQty = useCallback((productId: string, size: string, color: string, qty: number) => {
    if (qty < 1) { removeFromCart(productId, size, color); return }
    setCart(prev => prev.map(i =>
      i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity: qty } : i
    ))
  }, [removeFromCart])

  const clearCart = useCallback(() => setCart([]), [])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
