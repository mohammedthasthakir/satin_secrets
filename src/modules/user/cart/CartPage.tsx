import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../../../store/CartContext'
import { useToast } from '../../../store/ToastContext'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { formatPrice } from '../../../utils/format'

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  const shipping = cartTotal >= 1499 ? 0 : 99
  const discount = couponApplied ? Math.round(cartTotal * 0.2) : 0
  const total = cartTotal + shipping - discount

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'SATIN20') {
      setCouponApplied(true)
      setCouponError('')
      showToast('Coupon applied — 20% off!', 'success')
    } else {
      setCouponError('Invalid coupon code')
      setCouponApplied(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center text-4xl">🛒</div>
        <h2 className="font-serif text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground text-sm mb-8">Discover our curated collection of luxury innerwear.</p>
        <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">
          My Cart <span className="text-muted-foreground font-sans font-normal text-lg">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
        </h1>
        <button onClick={() => { clearCart(); showToast('Cart cleared', 'info') }} className="text-sm text-red-400 hover:text-red-500 transition-colors">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const disc = Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
            return (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-card rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm">
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.product.slug}`)}>
                  <img src={unsplashUrl(item.product.imageId, 200, 250)} alt={item.product.name} onError={e => imgFallback(e, 200, 250)} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.product.slug}`} className="font-semibold text-foreground hover:text-accent transition-colors text-sm leading-snug">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">{item.product.category}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Size: <strong className="text-foreground">{item.size}</strong></span>
                        <span className="flex items-center gap-1">Color: <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.color }} /></span>
                      </div>
                    </div>
                    <button onClick={() => { removeFromCart(item.product.id, item.size, item.color); showToast('Item removed', 'info') }} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary text-sm font-medium">−</button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.size, item.color, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary text-sm font-medium">+</button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                      {disc > 0 && <p className="text-xs text-muted-foreground line-through">{formatPrice(item.product.originalPrice * item.quantity)}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Free shipping bar */}
          <div className="bg-secondary rounded-2xl p-4">
            {cartTotal < 1499 ? (
              <>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Add <strong className="text-primary">{formatPrice(1499 - cartTotal)}</strong> more for free shipping</span>
                  <span>{Math.round((cartTotal / 1499) * 100)}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 1499) * 100)}%` }} />
                </div>
              </>
            ) : (
              <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                You qualify for FREE shipping!
              </p>
            )}
          </div>

          <Link to="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-xl font-bold mb-5">Order Summary</h2>

            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={coupon}
                onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                placeholder="Coupon code (SATIN20)"
                className="flex-1 text-sm border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30 bg-background"
              />
              <button onClick={applyCoupon} disabled={couponApplied} className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-secondary text-primary hover:bg-muted transition-colors disabled:opacity-50">
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-500 -mt-3 mb-3">{couponError}</p>}
            {couponApplied && <p className="text-xs text-green-600 -mt-3 mb-3">✓ 20% discount applied!</p>}

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">Discount (20%)</span><span className="text-green-600">-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-3"><span>Total</span><span>{formatPrice(total)}</span></div>
              <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
            </div>

            <Link to="/checkout" className="block w-full mt-6 bg-primary text-primary-foreground py-4 rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg text-center">
              Proceed to Checkout →
            </Link>

            <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🔒 Secure</span><span>🛡️ Discreet</span><span>✓ Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
