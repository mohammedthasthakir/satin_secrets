import { useState } from 'react'
import { products } from '../../../data/products'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { useToast } from '../../../store/ToastContext'
import { StatusBadge } from '../../../components/ui/Badge'

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [quantities, setQuantities] = useState<Record<string, number>>(Object.fromEntries(products.map(p => [p.id, p.stock])))
  const { showToast } = useToast()

  const getStatus = (stock: number) => stock === 0 ? 'out_of_stock' : stock < 15 ? 'low_stock' : 'in_stock'

  const filtered = products.filter(p => {
    const q = quantities[p.id] ?? p.stock
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || getStatus(q) === filter
    return matchSearch && matchFilter
  })

  const handleUpdate = (id: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, qty) }))
    showToast('Stock updated', 'success')
  }

  const lowStockCount = products.filter(p => { const q = quantities[p.id] ?? p.stock; return q > 0 && q < 15 }).length
  const outCount = products.filter(p => (quantities[p.id] ?? p.stock) === 0).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage stock levels</p>
        </div>
        <button className="border border-border bg-card px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary">↓ Export</button>
      </div>

      {/* Alerts */}
      {(lowStockCount > 0 || outCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div><p className="font-semibold text-red-700">{outCount} Products Out of Stock</p><p className="text-xs text-red-600">Restock immediately to prevent lost sales.</p></div>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div><p className="font-semibold text-yellow-700">{lowStockCount} Products Low Stock</p><p className="text-xs text-yellow-600">Less than 15 units remaining.</p></div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input type="search" placeholder="Search product or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background pl-9" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background">
          <option value="All">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {['Product', 'SKU', 'Category', 'Current Stock', 'Status', 'Update Stock'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const qty = quantities[p.id] ?? p.stock
                const status = getStatus(qty)
                return (
                  <tr key={p.id} className={`border-t border-border hover:bg-secondary/50 ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <img src={unsplashUrl(p.imageId, 80, 96)} alt={p.name} onError={e => imgFallback(e)} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-medium text-sm">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{p.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-sm ${status === 'out_of_stock' ? 'text-red-500' : status === 'low_stock' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {qty}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          defaultValue={qty}
                          onBlur={e => handleUpdate(p.id, Number(e.target.value))}
                          className="w-20 border border-border rounded-lg px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                        <button onClick={() => handleUpdate(p.id, qty + 50)} className="text-xs text-accent border border-accent/30 px-2 py-1 rounded-lg hover:bg-accent/5">+50</button>
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
