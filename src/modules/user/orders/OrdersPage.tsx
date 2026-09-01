import { useState } from 'react'
import { Link } from 'react-router'
import { ls, KEYS } from '../../../services/storage/localStorage'
import { formatPrice, formatDate } from '../../../utils/format'
import type { Order } from '../../../types'
import { StatusBadge } from '../../../components/ui/Badge'

const MOCK: Order[] = [
  {
    id: 'SS-2024-001', userId: 'demo', items: [], subtotal: 5398, shipping: 0, discount: 0, total: 5398,
    status: 'delivered', address: { name: 'Demo User', phone: '9876543210', line1: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'UPI', paymentStatus: 'paid', createdAt: '2024-12-15T10:30:00Z', updatedAt: '2024-12-19T16:00:00Z',
    estimatedDelivery: '2024-12-19T00:00:00Z', trackingId: 'IND123456789',
  },
  {
    id: 'SS-2024-002', userId: 'demo', items: [], subtotal: 2799, shipping: 0, discount: 0, total: 2799,
    status: 'shipped', address: { name: 'Demo User', phone: '9876543210', line1: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    paymentMethod: 'Card', paymentStatus: 'paid', createdAt: '2024-12-20T14:00:00Z', updatedAt: '2024-12-22T10:00:00Z',
    estimatedDelivery: '2024-12-24T00:00:00Z', trackingId: 'IND987654321',
  },
]

export default function OrdersPage() {
  const [trackId, setTrackId] = useState('')
  const storedOrders: Order[] = ls.get<Order[]>(KEYS.ORDERS) ?? []
  const orders = [...storedOrders, ...MOCK].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const STEPS = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered']
  const getProgress = (status: string) => {
    const map: Record<string, number> = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1, returned: -1 }
    return map[status] ?? 0
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8">My Orders</h1>

      {/* Track */}
      <div className="bg-card rounded-2xl p-5 shadow-sm mb-8">
        <h2 className="font-semibold mb-3">Track an Order</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. SS-2024-001)"
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
          />
          <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">Track</button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-serif text-xl font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Your orders will appear here once you place them.</p>
          <Link to="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => {
            const progress = getProgress(order.status)
            const isCancelled = order.status === 'cancelled' || order.status === 'returned'
            return (
              <div key={order.id} className="bg-card rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
                  <div>
                    <p className="font-bold text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="font-bold text-foreground text-sm mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>

                {/* Progress */}
                {!isCancelled && (
                  <div className="px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-0">
                      {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= progress ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                              {i < progress ? '✓' : i + 1}
                            </div>
                            <span className="text-[9px] text-muted-foreground whitespace-nowrap hidden sm:block">{s}</span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < progress ? 'bg-primary' : 'bg-border'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    {order.trackingId && <p>Tracking: <span className="text-foreground font-medium">{order.trackingId}</span></p>}
                    <p>Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-semibold text-primary border border-primary px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors">
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="text-xs font-semibold text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:border-foreground transition-colors">
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
