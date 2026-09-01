import { useToast } from '../../store/ToastContext'

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

const COLORS = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-primary',
  warning: 'bg-yellow-500',
}

export default function ToastNotifications() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-foreground text-background text-sm font-medium px-4 py-3 rounded-xl shadow-2xl pointer-events-auto max-w-sm animate-fade-in"
        >
          <span className={`${COLORS[toast.type]} text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold`}>
            {ICONS[toast.type]}
          </span>
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-background/50 hover:text-background transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
