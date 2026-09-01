import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { products } from '../../../data/products'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { formatPrice } from '../../../utils/format'
import Stars from '../../../components/ui/Stars'
import ProductCard from '../../../components/common/ProductCard'
import { useCart } from '../../../store/CartContext'
import { useWishlist } from '../../../store/WishlistContext'
import { useToast } from '../../../store/ToastContext'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.slug === slug)

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'fabric' | 'care' | 'reviews'>('description')
  const [sizeError, setSizeError] = useState(false)
  const [addedAnim, setAddedAnim] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()

  useEffect(() => {
    if (product) setSelectedColor(product.colors[0])
  }, [product])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting), { threshold: 0 })
    if (ctaRef.current) obs.observe(ctaRef.current)
    return () => obs.disconnect()
  }, [])

  if (!product) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
        <Link to="/products" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold">Browse Products</Link>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const wishlisted = isWishlisted(product.id)
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)

  const allImages = product.images.length > 0 ? product.images : [product.imageId]

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); showToast('Please select a size', 'warning'); return }
    setSizeError(false)
    addToCart(product, selectedSize, selectedColor, quantity)
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 2000)
  }

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); showToast('Please select a size', 'warning'); return }
    addToCart(product, selectedSize, selectedColor, quantity)
    navigate('/checkout')
  }

  const REVIEWS = [
    { name: 'Meera K.', rating: 5, text: 'Absolutely love the quality! The fabric feels so luxurious.', date: 'Dec 2024', verified: true },
    { name: 'Divya R.', rating: 4, text: 'Beautiful product, very true to size. Delivery was quick and discreet.', date: 'Nov 2024', verified: true },
    { name: 'Kavitha M.', rating: 5, text: 'Third purchase from SatinSecrets. Quality never disappoints!', date: 'Nov 2024', verified: true },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Images */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
            {allImages.map((id, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-secondary border-2 transition-all ${activeImg === i ? 'border-primary' : 'border-transparent hover:border-border'}`}
              >
                <img src={unsplashUrl(id, 120, 150)} alt="" onError={e => imgFallback(e, 120, 150)} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-secondary" style={{ aspectRatio: '4/5' }}>
            <img
              src={unsplashUrl(allImages[activeImg], 700, 875)}
              alt={product.name}
              onError={e => imgFallback(e, 700, 875)}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2.5 py-1.5 rounded-full">-{discount}%</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
              <h1 className="font-serif text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
            </div>
            <button onClick={() => { toggleWishlist(product.id); showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡', 'success') }} className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent transition-colors">
              <svg className={`w-5 h-5 ${wishlisted ? 'text-accent fill-current' : 'text-muted-foreground'}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Stars rating={product.rating} size="md" />
            <span className="font-semibold text-sm">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="font-serif text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-accent/10 text-accent text-sm font-bold px-2 py-0.5 rounded-full">Save {formatPrice(product.originalPrice - product.price)}</span>
              </>
            )}
          </div>

          {/* Color */}
          <div className="mt-6">
            <p className="text-sm font-semibold mb-2">Color</p>
            <div className="flex gap-2.5">
              {product.colors.map(c => (
                <button key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-primary scale-110 shadow-md' : 'border-border hover:border-muted-foreground'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-semibold ${sizeError ? 'text-red-500' : ''}`}>
                Size {sizeError && <span className="font-normal text-xs">— Please select</span>}
              </p>
              <button className="text-xs text-accent underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false) }}
                  className={`min-w-[3rem] px-3 py-2 text-sm rounded-xl border-2 font-medium transition-all ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">Quantity</p>
            <div className="flex items-center border border-border rounded-xl overflow-hidden w-fit">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary text-lg font-medium">−</button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary text-lg font-medium">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mt-7">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all ${addedAnim ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'}`}
            >
              {addedAnim ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button onClick={handleBuyNow} className="flex-1 py-3.5 rounded-full font-semibold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
              Buy Now
            </button>
          </div>

          {/* Trust */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[['🔒','Secure Payment'],['🚚','Free ₹1499+'],['↩️','30-Day Returns'],['🛡️','Discreet Packing']].map(([icon,text]) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground"><span>{icon}</span>{text}</div>
            ))}
          </div>

          {/* Delivery */}
          <div className="mt-5 bg-secondary rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 font-medium mb-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              In Stock — Delivery by{' '}
              <span className="text-primary font-semibold">
                {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">Free shipping · Arrives in discreet packaging</p>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      {showSticky && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 lg:hidden bg-card border-t border-border shadow-2xl px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{product.name}</p>
            <p className="font-bold text-primary text-sm">{formatPrice(product.price)}</p>
          </div>
          <button onClick={handleAddToCart} className={`px-5 py-2.5 rounded-full font-semibold text-sm flex-shrink-0 ${addedAnim ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground'}`}>
            {addedAnim ? '✓ Added' : 'Add to Cart'}
          </button>
          <button onClick={handleBuyNow} className="px-4 py-2.5 rounded-full font-semibold text-sm border-2 border-primary text-primary flex-shrink-0">Buy Now</button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-14 border-b border-border">
        <div className="flex gap-6 overflow-x-auto">
          {(['description', 'fabric', 'care', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'reviews' ? `Reviews (${product.reviews})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8 max-w-2xl">
        {activeTab === 'description' && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}
        {activeTab === 'fabric' && <p className="text-muted-foreground">{product.fabric}</p>}
        {activeTab === 'care' && (
          <ul className="space-y-2">
            {product.care.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm"><span className="text-primary mt-0.5">•</span>{c}</li>
            ))}
          </ul>
        )}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <p className="font-serif text-5xl font-bold">{product.rating}</p>
              <div><Stars rating={product.rating} size="lg" /><p className="text-xs text-muted-foreground mt-1">{product.reviews} reviews</p></div>
            </div>
            {REVIEWS.map((r, i) => (
              <div key={i} className="border-b border-border pb-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Stars rating={r.rating} />
                  {r.verified && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">✓ Verified</span>}
                </div>
                <p className="text-sm mb-2">{r.text}</p>
                <p className="text-xs text-muted-foreground">{r.name} · {r.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-8 border-t border-border pt-12">
          <h2 className="font-serif text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
