import { formatPrice } from '../../../utils/format'

const MONTHLY = [
  { month: 'Jul', revenue: 284000, orders: 312 },
  { month: 'Aug', revenue: 318000, orders: 348 },
  { month: 'Sep', revenue: 292000, orders: 295 },
  { month: 'Oct', revenue: 405000, orders: 421 },
  { month: 'Nov', revenue: 512000, orders: 534 },
  { month: 'Dec', revenue: 684000, orders: 712 },
  { month: 'Jan', revenue: 440000, orders: 467 },
]

const CATEGORY_SALES = [
  { name: 'Bras', revenue: 285000, units: 420, percent: 28 },
  { name: 'Lingerie Sets', revenue: 245000, units: 180, percent: 24 },
  { name: 'Sleepwear', revenue: 198000, units: 142, percent: 19 },
  { name: 'Panties', revenue: 156000, units: 580, percent: 15 },
  { name: 'Shapewear', revenue: 89000, units: 98, percent: 9 },
  { name: 'Others', revenue: 51000, units: 67, percent: 5 },
]

function BarChart({ data }: { data: typeof MONTHLY }) {
  const max = Math.max(...data.map(d => d.revenue))
  return (
    <div className="flex items-end gap-2 h-44">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
          <p className="text-[10px] text-muted-foreground font-semibold">{formatPrice(d.revenue / 1000).replace('₹', '')}K</p>
          <div className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.revenue / max) * 120}px` }} />
          <span className="text-[10px] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminReportsPage() {
  const totalRevenue = MONTHLY.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = MONTHLY.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Sales Reports</h1>
          <p className="text-sm text-muted-foreground">Analytics and performance overview</p>
        </div>
        <div className="flex gap-3">
          <select className="border border-border rounded-xl px-3 py-2 text-sm bg-background">
            <option>Last 7 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
          <button className="border border-border bg-card px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary">↓ Export</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(totalRevenue), sub: '7 month period', color: 'text-foreground' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), sub: '7 month period', color: 'text-foreground' },
          { label: 'Avg Order Value', value: formatPrice(Math.round(totalRevenue / totalOrders)), sub: 'Per transaction', color: 'text-foreground' },
          { label: 'Conversion Rate', value: '3.8%', sub: 'Visitors to buyers', color: 'text-foreground' },
        ].map(k => (
          <div key={k.label} className="bg-card rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{k.label}</p>
            <p className={`font-serif text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-foreground">Monthly Revenue</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
        </div>
        <BarChart data={MONTHLY} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-5">Sales by Category</h3>
          <div className="space-y-4">
            {CATEGORY_SALES.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{cat.units} units</span>
                    <span className="font-bold text-foreground">{formatPrice(cat.revenue)}</span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${cat.percent}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-0.5">{cat.percent}% of total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly summary table */}
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-5">Monthly Summary</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Month</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Revenue</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Orders</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Avg</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY.map((d, i) => (
                  <tr key={d.month} className={`border-t border-border ${i % 2 === 1 ? 'bg-secondary/20' : ''}`}>
                    <td className="px-4 py-2.5 font-medium">{d.month}</td>
                    <td className="px-4 py-2.5 text-right text-sm">{formatPrice(d.revenue)}</td>
                    <td className="px-4 py-2.5 text-right text-sm">{d.orders}</td>
                    <td className="px-4 py-2.5 text-right text-sm">{formatPrice(Math.round(d.revenue / d.orders))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
