import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '../../../store/CartContext'
import { useToast } from '../../../store/ToastContext'
import { useAuth } from '../../../store/AuthContext'
import { ls, KEYS } from '../../../services/storage/localStorage'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { formatPrice } from '../../../utils/format'
import type { Order, Address } from '../../../types'

const STEPS = ['Address', 'Shipping', 'Payment', 'Review', 'Confirmed']

const INPUT = 'w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background'

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<Address>({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard')
  const [payment, setPayment] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('upi')
  const [orderId, setOrderId] = useState('')
  const { cart, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shippingCost = cartTotal >= 1499 ? 0 : shipping === 'express' ? 199 : 99
  const total = cartTotal + shippingCost

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(1)
  }

  const handlePlaceOrder = () => {
    const id = `SS-${Date.now()}`
    setOrderId(id)
    const order: Order = {
      id,
      userId: user?.id ?? 'guest',
      items: cart,
      subtotal: cartTotal,
      shipping: shippingCost,
      discount: 0,
      total,
      status: 'confirmed',
      address,
      paymentMethod: payment,
      paymentStatus: payment === 'cod' ? 'pending' : 'paid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + (shipping === 'express' ? 2 : 4) * 86400000).toISOString(),
    }
    const orders: Order[] = ls.get<Order[]>(KEYS.ORDERS) ?? []
    ls.set(KEYS.ORDERS, [...orders, order])
    clearCart()
    setStep(4)
    showToast('Order placed successfully! 🎉', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold text-center mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-0">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i < step ? 'bg-primary text-primary-foreground' : i === step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i < step ? '✓' : i + 1}
              </span>
              <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 flex-shrink-0 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-5">Delivery Address</h2>
              <form onSubmit={handleAddressNext} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input required className={INPUT} placeholder="Your full name" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium mb-1.5">Phone *</label>
                    <input required className={INPUT} placeholder="+91 98765 43210" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 1 *</label>
                    <input required className={INPUT} placeholder="House no, Street name" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5">Address Line 2</label>
                    <input className={INPUT} placeholder="Area, Landmark (optional)" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City *</label>
                    <input required className={INPUT} placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">State *</label>
                    <input required className={INPUT} placeholder="State" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Pincode *</label>
                    <input required className={INPUT} placeholder="400001" maxLength={6} value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all mt-2">
                  Continue to Shipping →
                </button>
              </form>
            </div>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-5">Shipping Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard Delivery', desc: '4-6 Business Days', price: cartTotal >= 1499 ? 'FREE' : '₹99' },
                  { id: 'express', label: 'Express Delivery', desc: '1-2 Business Days', price: cartTotal >= 1499 ? '₹99' : '₹199' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setShipping(opt.id as 'standard' | 'express')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${shipping === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shipping === opt.id ? 'border-primary' : 'border-border'}`}>
                        {shipping === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${opt.price === 'FREE' ? 'text-green-600' : ''}`}>{opt.price}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 border-2 border-border py-3 rounded-full font-semibold text-sm hover:border-primary transition-colors">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-5">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'upi', icon: '📱', label: 'UPI', desc: 'Google Pay, PhonePe, BHIM' },
                  { id: 'card', icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
                  { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: 'All major banks supported' },
                  { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPayment(opt.id as typeof payment)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${payment === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === opt.id ? 'border-primary' : 'border-border'}`}>
                      {payment === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {payment === 'upi' && (
                <div className="mt-4">
                  <input className={INPUT} placeholder="Enter UPI ID (e.g. name@upi)" />
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-border py-3 rounded-full font-semibold text-sm hover:border-primary transition-colors">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-5">Review Order</h2>
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img src={unsplashUrl(item.product.imageId, 128, 160)} alt={item.product.name} onError={e => imgFallback(e, 128, 160)} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="font-bold text-sm mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <div className="mt-4 p-3 bg-secondary rounded-xl text-xs space-y-1">
                <p><strong>Delivering to:</strong> {address.name}, {address.line1}, {address.city} - {address.pincode}</p>
                <p><strong>Payment:</strong> {payment.toUpperCase()}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 border-2 border-border py-3 rounded-full font-semibold text-sm">← Back</button>
                <button onClick={handlePlaceOrder} className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">
                  Place Order 🎉
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmed */}
          {step === 4 && (
            <div className="bg-card rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
              <h2 className="font-serif text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground text-sm mb-4">Thank you for your order. We&rsquo;ll process it right away.</p>
              <div className="bg-secondary rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Estimated Delivery:</strong> {new Date(Date.now() + (shipping === 'express' ? 2 : 4) * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p><strong>Total Paid:</strong> {formatPrice(total)}</p>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row">
                <button onClick={() => navigate('/orders')} className="flex-1 bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:bg-primary/90 transition-all">Track Order</button>
                <button onClick={() => navigate('/')} className="flex-1 border-2 border-border py-3 rounded-full font-semibold hover:border-primary transition-colors">Continue Shopping</button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        {step < 4 && (
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary ({cart.length} items)</h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-2.5">
                    <div className="w-12 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img src={unsplashUrl(item.product.imageId, 96, 128)} alt={item.product.name} onError={e => imgFallback(e)} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                      <p className="text-xs font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
