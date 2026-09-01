import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { products, categories, testimonials, IMG } from '../../../data/products'
import { unsplashUrl, imgFallback } from '../../../utils/image'
import { formatPrice } from '../../../utils/format'
import ProductCard from '../../../components/common/ProductCard'
import Stars from '../../../components/ui/Stars'

const HERO_SLIDES = [
  {
    imageId: IMG.hero1,
    tag: 'New Collection 2024',
    headline: ['Secrets Worth', 'Keeping'],
    sub: 'Discover luxury innerwear crafted for the woman who values elegance in every detail.',
    cta: 'Shop Now',
    to: '/products',
  },
  {
    imageId: IMG.hero2,
    tag: 'Sleepwear Luxe',
    headline: ['Dream In', 'Pure Silk'],
    sub: 'Our mulberry silk sleepwear — because your nights deserve the same luxury as your days.',
    cta: 'Shop Sleepwear',
    to: '/products?category=Sleepwear',
  },
  {
    imageId: IMG.hero3,
    tag: 'Bridal Collection',
    headline: ['Your Perfect', 'Beginning'],
    sub: 'Exquisite bridal lingerie for the most memorable moments of your life.',
    cta: 'Explore Bridal',
    to: '/products?category=Lingerie+Sets',
  },
]

function CountdownTimer() {
  const [time, setTime] = useState({ h: 3, m: 47, s: 23 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(p => {
        let { h, m, s } = p
        s--; if (s < 0) { s = 59; m-- } if (m < 0) { m = 59; h-- } if (h < 0) return { h: 5, m: 59, s: 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return <span className="font-mono text-2xl font-bold text-accent">{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</span>
}

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const tabProducts = [
    products.filter(p => p.reviews > 200).slice(0, 4),
    products.filter(p => p.badge === 'New Arrival').concat(products.filter(p => p.badge !== 'New Arrival')).slice(0, 4),
    products.filter(p => p.featured).slice(0, 4),
    products.sort((a, b) => b.rating - a.rating).slice(0, 4),
  ][tab] ?? products.slice(0, 4)

  const current = HERO_SLIDES[slide]

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden bg-primary">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img
              src={unsplashUrl(s.imageId, 1400, 900)}
              alt={s.tag}
              onError={e => imgFallback(e, 1400, 900)}
              className="w-full h-full object-cover animate-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/45 to-transparent" />
          </div>
        ))}

        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-xl">
              <p key={`t-${slide}`} className="text-gold text-xs font-bold tracking-[0.35em] uppercase mb-4 animate-fade-in-down">{current.tag}</p>
              <h1 key={`h-${slide}`} className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5 animate-fade-in-up">
                {current.headline[0]}<br /><em>{current.headline[1]}</em>
              </h1>
              <p key={`s-${slide}`} className="text-white/78 text-lg leading-relaxed mb-8 animate-fade-in-up delay-200">{current.sub}</p>
              <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300">
                <Link to={current.to} className="bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-secondary transition-all hover:shadow-xl">
                  {current.cta}
                </Link>
                <Link to="/products" className="border-2 border-white/80 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all">
                  Explore All
                </Link>
              </div>
              <div className="mt-10 flex gap-8 animate-fade-in-up delay-400">
                {[['50K+','Customers'],['4.9★','Rating'],['300+','Cities']].map(([n,l]) => (
                  <div key={l}>
                    <p className="font-serif text-2xl font-bold text-white">{n}</p>
                    <p className="text-white/55 text-xs">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flash sale */}
        <div className="absolute right-6 bottom-10 hidden lg:block animate-float z-20">
          <div className="glass rounded-2xl p-4 shadow-xl border border-border bg-card/80 backdrop-blur">
            <p className="text-xs font-bold text-primary tracking-wide mb-1">⚡ Flash Sale Ends In</p>
            <CountdownTimer />
            <Link to="/products" className="mt-2 block text-center text-xs font-semibold bg-primary text-primary-foreground py-1.5 rounded-full hover:bg-primary/90 transition-colors">
              Grab the Deal →
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`rounded-full transition-all ${i === slide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">Shop by Category</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Find Your Perfect Fit</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {categories.map((cat, i) => {
            return(
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl bg-secondary"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div style={{ aspectRatio: '3/4' }} className="overflow-hidden">
                <img
                  src={unsplashUrl(cat.imageId, 280, 370)}
                  alt={cat.name}
                  onError={e => imgFallback(e, 280, 370)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  // loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="font-serif font-bold text-white text-xs leading-tight">{cat.name}</p>
                <p className="text-white/65 text-[10px]">{cat.productCount} styles</p>
              </div>
            </Link>
            )}
          )}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">Curated For You</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Trending Collections</h2>
          </div>
          <div className="flex justify-center gap-2 flex-wrap mb-10">
            {['Best Sellers', 'New Arrivals', "Editor's Picks", 'Top Rated'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === i ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-primary'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {tabProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="bg-foreground py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, d) => (
            <div key={d} className="flex">
              {['Free Shipping ₹1499+', 'Premium Quality', '30-Day Returns', 'Discreet Packaging', 'New Arrivals', '50,000+ Happy Customers', 'Secure Checkout'].map(t => (
                <span key={t} className="inline-flex items-center gap-3 text-xs font-semibold text-background tracking-widest uppercase px-6">
                  {t} <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Us ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">The SatinSecrets Promise</p>
          <h2 className="font-serif text-3xl font-bold text-foreground">Why 50,000+ Women Trust Us</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '🔒', title: 'Secure Payments', desc: 'SSL-encrypted checkout. Multiple payment options.' },
            { icon: '🛡️', title: 'Privacy Guaranteed', desc: 'Plain packaging, discreet billing. Always.' },
            { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-free returns and free size exchanges.' },
            { icon: '✨', title: 'Premium Quality', desc: 'Curated fabrics, 12-point quality checks.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-2xl bg-secondary hover:bg-muted transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="font-serif font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">Customer Love</p>
            <h2 className="font-serif text-3xl font-bold text-foreground">Real Reviews, Real Women</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(t => (
              <div key={t.id} className="bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                <div className="mb-3"><Stars rating={t.rating} /></div>
                <p className="text-sm text-foreground leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">{t.initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-primary">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">Exclusive Membership</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
            Unlock 15% Off<br /><em>Your First Order</em>
          </h2>
          <p className="text-white/65 text-sm mb-8">Join 50,000+ women who get first access to new collections and exclusive deals.</p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email address" className="flex-1 bg-white/12 border border-white/25 rounded-full px-5 py-3.5 text-sm text-white placeholder:text-white/45 focus:outline-none focus:border-white/60" />
            <button type="submit" className="bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-secondary transition-all whitespace-nowrap">Get 15% Off</button>
          </form>
        </div>
      </section>

      {/* ── Featured Grid ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">Complete Collection</p>
          <h2 className="font-serif text-3xl font-bold text-foreground">Our Favourites</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-10">
          <Link to="/products" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:shadow-lg">
            Shop All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
