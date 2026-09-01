import { products } from '../../../data/products'
import { formatPrice } from '../../../utils/format'
import { StatusBadge } from '../../../components/ui/Badge'

const STATS = [
  { label: 'Total Revenue', value: '₹12,84,290', growth: '+18.5%', positive: true, icon: '₹' },
  { label: 'Total Orders', value: '1,847', growth: '+12.3%', positive: true, icon: '◻' },
  { label: 'Customers', value: '9,234', growth: '+8.7%', positive: true, icon: '◉' },
  { label: 'Active Products', value: '156', growth: '-2 this week', positive: false, icon: '◫' },
]

const RECENT_ORDERS = [
  { id: 'SS-2025-001', customer: 'Priya Mehta', amount: 3499, status: 'delivered', date: '2025-01-15' },
  { id: 'SS-2025-002', customer: 'Divya Sharma', amount: 1899, status: 'shipped', date: '2025-01-15' },
  { id: 'SS-2025-003', customer: 'Kavitha Rao', amount: 5999, status: 'processing', date: '2025-01-14' },
  { id: 'SS-2025-004', customer: 'Ananya Singh', amount: 2799, status: 'confirmed', date: '2025-01-14' },
  { id: 'SS-2025-005', customer: 'Rekha Joshi', amount: 899, status: 'pending', date: '2025-01-13' },
]

const TOP_PRODUCTS = products.slice(0, 5).map((p, i) => ({
  name: p.name,
  sales: [324, 287, 203, 198, 156][i],
  revenue: formatPrice(p.price * [324, 287, 203, 198, 156][i]),
  category: p.category,
}))

function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-primary/70 rounded-sm"
          style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (i / data.length) * 0.6 }}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const weekRevenue = [48000, 52000, 61000, 55000, 72000, 68000, 84000]
  const weekOrders = [12, 18, 22, 15, 26, 20, 30]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-card rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">{s.value}</p>
            <p className={`text-xs mt-1 font-medium ${s.positive ? 'text-green-600' : 'text-red-500'}`}>{s.growth} vs last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <select className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-40">
            {weekRevenue.map((v, i) => {
              const max = Math.max(...weekRevenue)
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary rounded-t-lg transition-all" style={{ height: `${(v / max) * 130}px` }} />
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
            {[
              { label: 'Revenue', value: '₹4,40,000', trend: '↑ 18%' },
              { label: 'Orders', value: '143', trend: '↑ 12%' },
              { label: 'Avg Order', value: '₹3,077', trend: '↑ 5%' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="font-bold text-sm text-foreground">{m.value}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
                <p className="text-[10px] text-green-600 font-semibold">{m.trend}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">Orders This Week</h3>
            <MiniBarChart data={weekOrders} />
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>Mon</span><span>Sun</span>
            </div>
            <p className="font-serif text-xl font-bold mt-2">143 orders</p>
            <p className="text-xs text-green-600">↑ 12% vs last week</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">Low Stock Alert</h3>
            <div className="space-y-2">
              {products.filter(p => p.stock < 20).slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate flex-1">{p.name}</p>
                  <span className={`text-xs font-bold ml-2 ${p.stock < 15 ? 'text-red-500' : 'text-yellow-600'}`}>{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Orders</h3>
            <a href="/admin/orders" className="text-xs text-accent hover:underline">View all</a>
          </div>
          <div className="divide-y divide-border">
            {RECENT_ORDERS.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(order.amount)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Top Products</h3>
            <a href="/admin/products" className="text-xs text-accent hover:underline">View all</a>
          </div>
          <div className="divide-y divide-border">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <span className="w-6 h-6 rounded-full bg-secondary text-muted-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{p.sales} sold</p>
                  <p className="text-xs text-muted-foreground">{p.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
