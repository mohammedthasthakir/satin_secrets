import { useState } from 'react'
import { formatPrice, formatDate } from '../../../utils/format'
import { StatusBadge } from '../../../components/ui/Badge'
import { useToast } from '../../../store/ToastContext'
import type { OrderStatus } from '../../../types'

const ORDERS = [
  { id: 'SS-2025-001', customer: 'Priya Mehta', email: 'priya@example.com', amount: 3499, status: 'delivered' as OrderStatus, payment: 'paid', items: 2, date: '2025-01-15T10:30:00Z', city: 'Mumbai' },
  { id: 'SS-2025-002', customer: 'Divya Sharma', email: 'divya@example.com', amount: 1899, status: 'shipped' as OrderStatus, payment: 'paid', items: 1, date: '2025-01-15T14:00:00Z', city: 'Delhi' },
  { id: 'SS-2025-003', customer: 'Kavitha Rao', email: 'kavitha@example.com', amount: 5999, status: 'processing' as OrderStatus, payment: 'paid', items: 3, date: '2025-01-14T09:15:00Z', city: 'Bangalore' },
  { id: 'SS-2025-004', customer: 'Ananya Singh', email: 'ananya@example.com', amount: 2799, status: 'confirmed' as OrderStatus, payment: 'paid', items: 1, date: '2025-01-14T16:45:00Z', city: 'Hyderabad' },
  { id: 'SS-2025-005', customer: 'Rekha Joshi', email: 'rekha@example.com', amount: 899, status: 'pending' as OrderStatus, payment: 'pending', items: 1, date: '2025-01-13T11:20:00Z', city: 'Chennai' },
  { id: 'SS-2025-006', customer: 'Neha Patel', email: 'neha@example.com', amount: 4299, status: 'cancelled' as OrderStatus, payment: 'refunded', items: 2, date: '2025-01-12T08:00:00Z', city: 'Pune' },
  { id: 'SS-2025-007', customer: 'Shruti Verma', email: 'shruti@example.com', amount: 1299, status: 'delivered' as OrderStatus, payment: 'paid', items: 1, date: '2025-01-11T15:30:00Z', city: 'Kolkata' },
  { id: 'SS-2025-008', customer: 'Pooja Gupta', email: 'pooja@example.com', amount: 6499, status: 'shipped' as OrderStatus, payment: 'paid', items: 4, date: '2025-01-10T12:00:00Z', city: 'Ahmedabad' },
]

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<string[]>([])
  const { showToast } = useToast()

  const statuses = ['All', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

  const filtered = ORDERS.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    showToast(`Order ${id} updated to ${status}`, 'success')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{ORDERS.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 border border-border bg-card px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
          ↓ Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: ORDERS.length, color: 'text-foreground' },
          { label: 'Pending', value: ORDERS.filter(o => o.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'Shipped', value: ORDERS.filter(o => o.status === 'shipped').length, color: 'text-blue-600' },
          { label: 'Delivered', value: ORDERS.filter(o => o.status === 'delivered').length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm text-center">
            <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input type="search" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background pl-9" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background capitalize">
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left w-10"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(o => o.id) : [])} className="rounded" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={order.id} className={`border-t border-border hover:bg-secondary/50 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(order.id)} onChange={() => setSelected(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id])} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.city}</p>
                  </td>
                  <td className="px-4 py-3 font-bold">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={order.payment} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(order.date)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="text-xs border border-border rounded-lg px-2 py-1 bg-background"
                    >
                      {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
