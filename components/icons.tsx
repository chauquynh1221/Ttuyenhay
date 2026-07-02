// Bộ icon SVG đồng nhất (thay cho emoji) — nét mảnh, kế thừa currentColor.
// Dùng: <Fire className="w-5 h-5" />

import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (props: P) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  ...props,
})

export const Fire = (p: P) => (<svg {...base(p)}><path d="M12 2s4 3.5 4 8a4 4 0 0 1-8 0c0-1 .5-2 .5-2S6 10 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12Z" /></svg>)
export const BookOpen = (p: P) => (<svg {...base(p)}><path d="M12 6.5C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.3v13c1.2-.8 2.8-1.3 4.5-1.3s3.3.5 4.5 1.5m0-13c1.2-1 2.8-1.5 4.5-1.5s3.3.5 4.5 1.3v13c-1.2-.8-2.8-1.3-4.5-1.3s-3.3.5-4.5 1.5m0-13v13" /></svg>)
export const CheckCircle = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 5-5" /></svg>)
export const Star = ({ filled, ...p }: P & { filled?: boolean }) => (<svg {...base(p)} fill={filled ? 'currentColor' : 'none'}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9L12 3Z" /></svg>)
export const Home = (p: P) => (<svg {...base(p)}><path d="M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5" /></svg>)
export const Compass = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>)
export const Library = (p: P) => (<svg {...base(p)}><path d="M4 4v16M8 4v16m4-16 4 15M18 6l3 14" /></svg>)
export const UserCircle = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5a6 6 0 0 1 11 0" /></svg>)
export const Clock = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>)
export const ChevronRight = (p: P) => (<svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>)
export const ChevronLeft = (p: P) => (<svg {...base(p)}><path d="m15 6-6 6 6 6" /></svg>)
export const Play = (p: P) => (<svg {...base(p)} fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5-13-7.5Z" /></svg>)
export const Plus = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>)
export const Crown = (p: P) => (<svg {...base(p)}><path d="M3 7l4 4 5-6 5 6 4-4-2 12H5L3 7Z" /></svg>)
export const TrendingUp = (p: P) => (<svg {...base(p)}><path d="m3 17 6-6 4 4 8-8M15 7h6v6" /></svg>)
export const Sparkles = (p: P) => (<svg {...base(p)}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Zm6 10 .9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13Z" /></svg>)
export const BookmarkIcon = ({ filled, ...p }: P & { filled?: boolean }) => (<svg {...base(p)} fill={filled ? 'currentColor' : 'none'}><path d="M6 4h12v16l-6-4-6 4V4Z" /></svg>)
export const Eye = (p: P) => (<svg {...base(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>)
export const List = (p: P) => (<svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>)

// === Motif Bongmeow (fill-based) ===
export const Paw = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <ellipse cx="12" cy="16" rx="5" ry="4.2" />
    <ellipse cx="6" cy="10.5" rx="2.1" ry="2.6" />
    <ellipse cx="18" cy="10.5" rx="2.1" ry="2.6" />
    <ellipse cx="9.3" cy="7" rx="1.9" ry="2.3" />
    <ellipse cx="14.7" cy="7" rx="1.9" ry="2.3" />
  </svg>
)

export const CatEars = (p: P) => (
  <svg width={40} height={18} viewBox="0 0 40 18" fill="currentColor" {...p}>
    <path d="M3 18 C4 8 8 3 12 2 C11 7 12 13 15 18 Z" />
    <path d="M37 18 C36 8 32 3 28 2 C29 7 28 13 25 18 Z" />
  </svg>
)

export const Sparkle = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2c.5 4.5 3 7 7.5 8-4.5 1-7 3.5-7.5 8-.5-4.5-3-7-7.5-8 4.5-1 7-3.5 7.5-8Z" />
  </svg>
)
export const Cloud = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A4 4 0 0 1 18 18H7Z" />
  </svg>
)
export const Heart = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 21s-7-4.4-9.3-8.7A5 5 0 0 1 12 6.5a5 5 0 0 1 9.3 5.8C19 16.6 12 21 12 21Z" />
  </svg>
)

export const CatFace = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 4l2.5 3.2M19 4l-2.5 3.2" />
    <path d="M4 11a8 7 0 0 1 16 0 6 6 0 0 1-16 0Z" />
    <path d="M9 11h.01M15 11h.01M12 13.5v1M10.5 15.5c.5.4 2.5.4 3 0" />
    <path d="M3 12h2M19 12h2M3.5 14l2-.6M20.5 14l-2-.6" />
  </svg>
)
