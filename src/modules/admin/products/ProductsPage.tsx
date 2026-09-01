import { useState } from 'react'
import { products as initialProducts } from '../../../data/products'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { formatPrice } from '../../../utils/format'
import type { Product } from '../../../types'
import { StatusBadge } from '../../../components/ui/Badge'
import { useToast } from '../../../store/ToastContext'

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const { showToast } = useToast()

  const categories = ['All', ...Array.from(new Set(initialProducts.map(p => p.category)))]

  const filtered = items.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || p.category === category
    return matchSearch && matchCat
  })

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
    showToast('Product deleted', 'success')
  }

  const handleBulkDelete = () => {
    setItems(prev => prev.filter(p => !selected.includes(p.id)))
    setSelected([])
    showToast(`${selected.length} products deleted`, 'success')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{items.length} total products</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <input
            type="search"
            placeholder="Search products or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background pl-9"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-border rounded-xl px-3 py-2.5 text-sm bg-background">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
            Delete {selected.length} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(p => p.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-t border-border hover:bg-secondary/50 transition-colors ${i % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img src={unsplashUrl(p.imageId, 80, 96)} alt={p.name} onError={e => imgFallback(e, 80, 96)} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm leading-snug">{p.name}</p>
                        {p.featured && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-sm">{formatPrice(p.price)}</p>
                    {p.originalPrice > p.price && (
                      <p className="text-xs text-muted-foreground line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${p.stock < 15 ? 'text-red-500' : p.stock < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.inStock ? 'in_stock' : 'out_of_stock'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditProduct(p); setShowForm(true) }} className="text-xs font-medium text-accent hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-medium text-red-400 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl mt-10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Product Name', 'SKU', 'Price (₹)', 'Original Price (₹)', 'Stock', 'Category'].map(label => (
                <div key={label} className={label === 'Product Name' ? 'col-span-2' : ''}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input
                    defaultValue={editProduct ? (label === 'Product Name' ? editProduct.name : '') : ''}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea rows={3} defaultValue={editProduct?.description} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border-2 border-border py-2.5 rounded-full font-semibold text-sm hover:border-foreground transition-colors">Cancel</button>
              <button onClick={() => { setShowForm(false); showToast(editProduct ? 'Product updated' : 'Product created', 'success') }} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all">
                {editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
