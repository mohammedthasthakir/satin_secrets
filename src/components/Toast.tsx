import { useEffect, useState } from 'react'

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'cart'
  icon?: string
}

interface ToastProps {
  toasts: ToastItem[]
  removeToast: (id: string) => void
}

const iconMap = {
  success: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  cart: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
}

const colorMap = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-primary text-primary-foreground',
  cart: 'bg-foreground text-background',
}

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onRemove, 300)
    }, 3200)
    return () => clearTimeout(timer)
  }, [onRemove])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium min-w-[240px] max-w-[320px] ${colorMap[toast.type]} ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <span className="flex-shrink-0">{iconMap[toast.type]}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => { setExiting(true); setTimeout(onRemove, 300) }}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  )
}
