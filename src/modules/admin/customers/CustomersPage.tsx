import { useState } from 'react'
import { ls, KEYS } from '../../../services/storage/localStorage'
import { formatDate } from '../../../utils/format'
import type { User } from '../../../types'
import { getInitials } from '../../../utils/format'

const MOCK_CUSTOMERS: (User & { orderCount: number; totalSpent: number })[] = [
  { id: 'c1', name: 'Priya Mehta', email: 'priya@example.com', phone: '9876543210', role: 'user', loyaltyPoints: 2450, createdAt: '2024-06-15T00:00:00Z', orderCount: 8, totalSpent: 12450 },
  { id: 'c2', name: 'Divya Sharma', email: 'divya@example.com', phone: '9123456789', role: 'user', loyaltyPoints: 890, createdAt: '2024-08-20T00:00:00Z', orderCount: 3, totalSpent: 4599 },
  { id: 'c3', name: 'Kavitha Rao', email: 'kavitha@example.com', phone: '9988776655', role: 'user', loyaltyPoints: 5100, createdAt: '2024-03-01T00:00:00Z', orderCount: 15, totalSpent: 28900 },
  { id: 'c4', name: 'Ananya Singh', email: 'ananya@example.com', phone: '9765432109', role: 'user', loyaltyPoints: 320, createdAt: '2024-11-10T00:00:00Z', orderCount: 2, totalSpent: 2799 },
  { id: 'c5', name: 'Rekha Joshi', email: 'rekha@example.com', phone: '9654321098', role: 'user', loyaltyPoints: 1200, createdAt: '2024-09-05T00:00:00Z', orderCount: 5, totalSpent: 7500 },
]

const TIER = (pts: number) => pts >= 5000 ? 'Platinum' : pts >= 2000 ? 'Gold' : pts >= 500 ? 'Silver' : 'Bronze'
const TIER_COLOR: Record<string, string> = { Platinum: 'text-slate-500', Gold: 'text-yellow-600', Silver: 'text-gray-500', Bronze: 'text-amber-600' }

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const registeredUsers: User[] = ls.get<User[]>(KEYS.USERS) ?? []
  const allCustomers = [...MOCK_CUSTOMERS, ...registeredUsers.filter(u => u.role !== 'admin').map(u => ({ ...u, orderCount: 0, totalSpent: 0 }))]
  const filtered = allCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{allCustomers.length} total customers</p>
        </div>
        <button className="border border-border bg-card px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary">↓ Export</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: allCustomers.length },
          { label: 'Active (30d)', value: Math.floor(allCustomers.length * 0.7) },
          { label: 'Gold+', value: allCustomers.filter(c => (c.loyaltyPoints ?? 0) >= 2000).length },
          { label: 'New (7d)', value: allCustomers.filter(c => new Date(c.createdAt) > new Date(Date.now() - 7*86400000)).length },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-4 shadow-sm text-center">
            <p className="font-serif text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <input type="search" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background pl-9" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {['Customer', 'Contact', 'Joined', 'Orders', 'Total Spent', 'Tier', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const tier = TIER(c.loyaltyPoints ?? 0)
                return (
                  <tr key={c.id} className={`border-t border-border hover:bg-secondary/50 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <p className="font-medium">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{c.email}</p>
                      {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 font-bold">{(c as typeof MOCK_CUSTOMERS[0]).orderCount ?? 0}</td>
                    <td className="px-4 py-3 font-bold">₹{((c as typeof MOCK_CUSTOMERS[0]).totalSpent ?? 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${TIER_COLOR[tier]}`}>{tier}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-xs text-accent hover:underline">View</button>
                        <button className="text-xs text-muted-foreground hover:underline">Block</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
