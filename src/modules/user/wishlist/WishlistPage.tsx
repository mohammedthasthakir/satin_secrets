import { Link } from 'react-router'
import { products } from '../../../data/products'
import { useWishlist } from '../../../store/WishlistContext'
import { useCart } from '../../../store/CartContext'
import { useToast } from '../../../store/ToastContext'
import ProductCard from '../../../components/common/ProductCard'

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const wishlisted = products.filter(p => wishlistIds.includes(p.id))

  const handleAddAll = () => {
    wishlisted.forEach(p => addToCart(p, p.sizes[0], p.colors[0]))
    showToast(`${wishlisted.length} items added to cart!`, 'success')
  }

  if (wishlisted.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">♡</div>
        <h2 className="font-serif text-2xl font-bold mb-3">Your Wishlist is Empty</h2>
        <p className="text-muted-foreground text-sm mb-8">Save your favourite pieces to your wishlist and shop whenever you&rsquo;re ready.</p>
        <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
          Explore Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground text-sm mt-1">{wishlisted.length} saved {wishlisted.length === 1 ? 'item' : 'items'}</p>
        </div>
        <button
          onClick={handleAddAll}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Add All to Cart
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlisted.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
