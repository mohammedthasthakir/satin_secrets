import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { products, categories } from '../../../data/products'
import ProductCard from '../../../components/common/ProductCard'
import type { FilterParams } from '../../../types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32A', '34B', '36C']
const PRICE_RANGES = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹3,000', min: 2000, max: 3000 },
  { label: 'Above ₹3,000', min: 3000, max: Infinity },
]

export default function ProductListPage() {
  const [params, setParams] = useSearchParams()
  const [mobileFilter, setMobileFilter] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<FilterParams>({
    category: params.get('category') ?? undefined,
    sortBy: (params.get('sort') as FilterParams['sortBy']) ?? 'popularity',
    sizes: [],
    minPrice: undefined,
    maxPrice: undefined,
    search: params.get('search') ?? '',
  })

  const setFilter = <K extends keyof FilterParams>(key: K, value: FilterParams[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filtered = useMemo(() => {
    let result = [...products]
    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
    }
    if (filters.minPrice !== undefined) result = result.filter(p => p.price >= filters.minPrice!)
    if (filters.maxPrice !== undefined) result = result.filter(p => p.price <= filters.maxPrice!)
    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter(p => filters.sizes!.some(s => p.sizes.includes(s)))
    }
    switch (filters.sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => b.id.localeCompare(a.id)); break
      default: result.sort((a, b) => b.reviews - a.reviews)
    }
    return result
  }, [filters])

  const toggleSize = (size: string) => {
    setFilter('sizes', filters.sizes?.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...(filters.sizes ?? []), size]
    )
  }

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Category</h3>
        <div className="space-y-1">
          {[{ name: 'All', id: 'all' }, ...categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter('category', cat.name === 'All' ? undefined : cat.name)}
              className={`block w-full text-left py-1.5 text-sm transition-colors ${
                (cat.name === 'All' ? !filters.category : filters.category === cat.name)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => {
                if (filters.minPrice === r.min && filters.maxPrice === r.max) {
                  setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }))
                } else {
                  setFilters(prev => ({ ...prev, minPrice: r.min, maxPrice: r.max === Infinity ? undefined : r.max }))
                }
              }}
              className={`flex items-center gap-2 text-sm w-full text-left ${
                filters.minPrice === r.min ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                filters.minPrice === r.min ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {filters.minPrice === r.min && <span className="text-white text-[9px] font-bold">✓</span>}
              </span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="border-t border-border pt-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 text-xs rounded-lg border-2 font-medium transition-all ${
                filters.sizes?.includes(size)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => setFilters({ sizes: [], sortBy: 'popularity' })}
        className="w-full text-sm text-red-500 hover:text-red-600 transition-colors border border-red-200 rounded-xl py-2"
      >
        Clear All Filters
      </button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {filters.category ?? 'All Products'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              type="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="w-56 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background pl-9"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort */}
          <select
            value={filters.sortBy ?? 'popularity'}
            onChange={e => setFilter('sortBy', e.target.value as FilterParams['sortBy'])}
            className="border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
          >
            <option value="popularity">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
            <option value="newest">Newest</option>
          </select>

          {/* View toggle */}
          <div className="hidden sm:flex border border-border rounded-xl overflow-hidden">
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-2 transition-colors ${viewMode === v ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
              >
                {v === 'grid' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            ))}
          </div>

          {/* Mobile filter */}
          <button
            onClick={() => setMobileFilter(true)}
            className="lg:hidden flex items-center gap-2 border border-border rounded-xl px-3 py-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
            Filter
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search query.</p>
              <button onClick={() => setFilters({ sizes: [], sortBy: 'popularity' })} className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
              : 'flex flex-col gap-4'
            }>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilter(false)} />
          <div className="relative bg-card w-80 h-full overflow-y-auto p-6 shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold">Filters</h2>
              <button onClick={() => setMobileFilter(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  )
}
