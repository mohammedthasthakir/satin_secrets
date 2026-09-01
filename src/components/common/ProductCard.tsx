import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../../types'
import { unsplashUrl, imgFallback } from '../../utils/image'
import { formatPrice } from '../../utils/format'
import Stars from '../ui/Stars'
import { useCart } from '../../store/CartContext'
import { useWishlist } from '../../store/WishlistContext'
import { useToast } from '../../store/ToastContext'

interface Props {
  product: Product
  onQuickView?: (p: Product) => void
}

export default function ProductCard({ product, onQuickView }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addedAnim, setAddedAnim] = useState(false)
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { showToast } = useToast()

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const wishlisted = isWishlisted(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const size = product.sizes[Math.min(1, product.sizes.length - 1)]
    addToCart(product, size, product.colors[0])
    showToast(`${product.name} added to cart`, 'success')
    setAddedAnim(true)
    setTimeout(() => setAddedAnim(false), 2000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡', wishlisted ? 'info' : 'success')
  }

  return (
    <div className="product-card group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: '3/4' }}>
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={unsplashUrl(product.imageId, 500, 650)}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => imgFallback(e, 500, 650)}
            className={`product-image w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            // loading="lazy"
          />
          <div className="product-overlay absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
            )}
            {!product.inStock && (
              <span className="bg-gray-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Out of Stock</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <svg className={`w-4 h-4 ${wishlisted ? 'text-accent fill-current' : 'text-muted-foreground'}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick actions */}
          <div className="product-actions absolute bottom-3 left-3 right-3 flex gap-1.5">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all shadow-sm ${
                addedAnim ? 'bg-green-600 text-white' :
                !product.inStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                'bg-white text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {addedAnim ? '✓ Added!' : !product.inStock ? 'Out of Stock' : 'Quick Add'}
            </button>
            {onQuickView && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); onQuickView(product) }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm text-primary"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-0.5">{product.category}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1.5 mb-2">
            <Stars rating={product.rating} />
            <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount > 0 && <span className="text-xs font-bold text-accent">{discount}% off</span>}
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {product.colors.slice(0, 5).map(c => (
              <div key={c} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
