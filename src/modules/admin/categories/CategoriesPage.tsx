import { useState } from 'react'
import { categories as initialCategories } from '../../../data/products'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import type { Category } from '../../../types'
import { useToast } from '../../../store/ToastContext'

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>(initialCategories)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', description: '', imageId: '' })
  const { showToast } = useToast()

  const handleSave = () => {
    if (editItem) {
      setItems(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c))
      showToast('Category updated', 'success')
    } else {
      const newCat: Category = { id: Date.now().toString(), name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, '-'), imageId: form.imageId, productCount: 0, active: true, description: form.description }
      setItems(prev => [...prev, newCat])
      showToast('Category created', 'success')
    }
    setShowForm(false)
    setForm({ name: '', description: '', imageId: '' })
  }

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
    showToast('Status updated', 'success')
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(c => c.id !== id))
    showToast('Category deleted', 'success')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">{items.length} categories</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: '', description: '', imageId: '' }); setShowForm(true) }} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90">
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(cat => (
          <div key={cat.id} className={`bg-card rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${cat.active ? 'border-transparent' : 'border-red-200 opacity-70'}`}>
            <div className="h-36 overflow-hidden relative">
              <img src={unsplashUrl(cat.imageId, 400, 200)} alt={cat.name} onError={e => imgFallback(e, 400, 200)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="font-serif font-bold text-white text-lg">{cat.name}</p>
                <p className="text-white/70 text-xs">{cat.productCount} products</p>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {cat.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              {cat.description && <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{cat.description}</p>}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditItem(cat); setForm({ name: cat.name, description: cat.description ?? '', imageId: cat.imageId }); setShowForm(true) }}
                  className="flex-1 text-xs font-semibold text-primary border border-primary py-1.5 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  Edit
                </button>
                <button onClick={() => handleToggle(cat.id)} className="flex-1 text-xs font-semibold text-muted-foreground border border-border py-1.5 rounded-xl hover:border-foreground transition-colors">
                  {cat.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center text-xs">
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-bold">{editItem ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">✕</button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">Category Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Bras" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Brief description..." /></div>
              <div><label className="block text-sm font-medium mb-1.5">Unsplash Image ID</label><input value={form.imageId} onChange={e => setForm(p => ({ ...p, imageId: e.target.value }))} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="photo-..." /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border-2 border-border py-2.5 rounded-full font-semibold text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90">{editItem ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
