const PLACEHOLDER = (w: number, h: number, text = 'SatinSecrets') =>
  `https://placehold.co/${w}x${h}/F5E9DA/5A3A22?text=${encodeURIComponent(text)}`

export function unsplashUrl(id: string, w = 600, h = 750): string {
  if (!id) return PLACEHOLDER(w, h)
  const cleanId = id.startsWith('photo-') ? id : `photo-${id}`
  return `https://images.unsplash.com/${cleanId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
}

export function imgFallback(e: React.SyntheticEvent<HTMLImageElement>, w = 400, h = 500) {
  const target = e.currentTarget
  target.onerror = null
  target.src = PLACEHOLDER(w, h)
}

export const placeholder = PLACEHOLDER
