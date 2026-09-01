type Variant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'muted'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-700',
  muted: 'bg-secondary text-muted-foreground',
}

export default function Badge({ children, variant = 'primary', className = '' }: {
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, Variant> = {
    pending: 'warning', confirmed: 'info', processing: 'info',
    shipped: 'primary', delivered: 'success', cancelled: 'error',
    returned: 'muted', paid: 'success', failed: 'error', refunded: 'muted',
    active: 'success', inactive: 'muted', in_stock: 'success',
    low_stock: 'warning', out_of_stock: 'error',
  }
  const labels: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
    returned: 'Returned', paid: 'Paid', failed: 'Failed', refunded: 'Refunded',
    active: 'Active', inactive: 'Inactive', in_stock: 'In Stock',
    low_stock: 'Low Stock', out_of_stock: 'Out of Stock',
  }
  return <Badge variant={map[status] ?? 'muted'}>{labels[status] ?? status}</Badge>
}
