import { useState } from 'react'
import { useToast } from '../../../store/ToastContext'

type Tab = 'general' | 'shipping' | 'payment' | 'coupons' | 'notifications'

const COUPONS = [
  { id: '1', code: 'SATIN20', type: 'percentage', value: 20, minOrder: 999, usedCount: 142, maxUses: 500, active: true, expiresAt: '2025-03-31' },
  { id: '2', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 0, usedCount: 89, maxUses: 200, active: true, expiresAt: '2025-12-31' },
  { id: '3', code: 'FLAT500', type: 'fixed', value: 500, minOrder: 2999, usedCount: 23, maxUses: 100, active: false, expiresAt: '2025-02-28' },
]

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [coupons, setCoupons] = useState(COUPONS)
  const { showToast } = useToast()

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'coupons', label: 'Coupons' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tab sidebar */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="bg-card rounded-2xl shadow-sm p-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {tab === 'general' && (
            <div className="bg-card rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-lg mb-1">Store Information</h2>
              {[
                { label: 'Store Name', defaultValue: 'SatinSecrets' },
                { label: 'Store Email', defaultValue: 'support@satinsecrets.com' },
                { label: 'Store Phone', defaultValue: '+91 98765 43210' },
                { label: 'GST Number', defaultValue: '27AAAAA0000A1Z5' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input defaultValue={f.defaultValue} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5">Store Address</label>
                <textarea rows={2} defaultValue="15 Fashion District, Bandra West, Mumbai - 400050, Maharashtra, India" className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <button onClick={() => showToast('Settings saved', 'success')} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all">Save Changes</button>
            </div>
          )}

          {tab === 'shipping' && (
            <div className="bg-card rounded-2xl shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-lg">Shipping Configuration</h2>
              <div className="space-y-4">
                {[
                  { label: 'Free Shipping Threshold (₹)', defaultValue: '1499' },
                  { label: 'Standard Shipping Rate (₹)', defaultValue: '99' },
                  { label: 'Express Shipping Rate (₹)', defaultValue: '199' },
                  { label: 'Standard Delivery Days', defaultValue: '4-6' },
                  { label: 'Express Delivery Days', defaultValue: '1-2' },
                  { label: 'Max Order Weight (kg)', defaultValue: '5' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                    <input defaultValue={f.defaultValue} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="font-medium text-sm">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Allow COD orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-border peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              <button onClick={() => showToast('Shipping settings saved', 'success')} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90">Save Changes</button>
            </div>
          )}

          {tab === 'payment' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-5">Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { label: 'UPI Payments', desc: 'Accept Google Pay, PhonePe, BHIM', enabled: true },
                  { label: 'Credit/Debit Cards', desc: 'Visa, Mastercard, Amex', enabled: true },
                  { label: 'Net Banking', desc: 'All major Indian banks', enabled: true },
                  { label: 'Cash on Delivery', desc: 'Pay when you receive', enabled: true },
                  { label: 'EMI Options', desc: '3, 6, 12 month plans', enabled: false },
                  { label: 'Wallets', desc: 'Paytm, Amazon Pay, Mobikwik', enabled: false },
                ].map(pm => (
                  <div key={pm.label} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/30 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{pm.label}</p>
                      <p className="text-xs text-muted-foreground">{pm.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={pm.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-border peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('Payment settings saved', 'success')} className="mt-5 bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90">Save Changes</button>
            </div>
          )}

          {tab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Coupon Management</h2>
                <button onClick={() => showToast('Coupon form coming soon', 'info')} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold">+ Add Coupon</button>
              </div>
              <div className="space-y-3">
                {coupons.map(c => (
                  <div key={c.id} className={`bg-card rounded-2xl shadow-sm p-5 border-2 ${c.active ? 'border-transparent' : 'border-red-100'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-base text-primary">{c.code}</span>
                          {!c.active && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactive</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {c.type === 'percentage' ? `${c.value}% off` : `₹${c.value} off`}
                          {c.minOrder > 0 ? ` · Min order ₹${c.minOrder}` : ''}
                        </p>
                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>{c.usedCount} / {c.maxUses} used</span>
                          <span>Expires: {c.expiresAt}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden w-48">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(c.usedCount / c.maxUses) * 100}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-accent border border-accent/30 px-3 py-1 rounded-full hover:bg-accent/5">Edit</button>
                        <button onClick={() => { setCoupons(prev => prev.map(cp => cp.id === c.id ? { ...cp, active: !cp.active } : cp)); showToast(c.active ? 'Coupon deactivated' : 'Coupon activated', 'success') }} className="text-xs border border-border px-3 py-1 rounded-full hover:bg-secondary">
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-lg mb-5">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'New Order Alert', desc: 'Get notified for every new order', enabled: true },
                  { label: 'Low Stock Alert', desc: 'When stock falls below threshold', enabled: true },
                  { label: 'New Customer Registration', desc: 'When a new user registers', enabled: false },
                  { label: 'Order Cancellation', desc: 'When a customer cancels an order', enabled: true },
                  { label: 'Payment Failed', desc: 'Alert on failed payment attempts', enabled: true },
                  { label: 'Daily Summary Email', desc: 'End-of-day performance summary', enabled: false },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={n.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-border peer-checked:bg-primary rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast('Notification settings saved', 'success')} className="mt-5 bg-primary text-primary-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
