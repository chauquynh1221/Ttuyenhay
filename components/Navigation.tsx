'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Genre { _id: string; name: string; slug: string }
interface NavigationProps { genres: Genre[] }

const categories = [
  { name: '🔥 Truyện Hot', href: '/danh-sach/truyen-hot' },
  { name: '📚 Mới cập nhật', href: '/danh-sach/truyen-moi' },
  { name: '✅ Truyện Full', href: '/danh-sach/truyen-full' },
]

// Thanh chip cuộn ngang — CHỈ mobile/tablet (<lg). Desktop dùng SideRail bên trái.
export default function Navigation({ genres = [] }: NavigationProps) {
  const [genrePanel, setGenrePanel] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname() || ''

  // Ẩn khi đang đọc chương → rộng chỗ đọc
  const isReading = /^\/truyen\/[^/]+\/[^/]+/.test(pathname)

  useEffect(() => {
    const onOutside = (e: Event) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setGenrePanel(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('touchstart', onOutside)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('touchstart', onOutside)
    }
  }, [])

  if (isReading) return null

  return (
    <nav ref={navRef} className="lg:hidden sticky top-16 z-40 bg-bg/85 backdrop-blur-xl border-b border-border/60">
      <div className="container">
        {/* Chip strip cuộn ngang */}
        <div className="flex items-center gap-2 h-12 overflow-x-auto no-scrollbar -mx-1 px-1">
          <button
            onClick={() => setGenrePanel((v) => !v)}
            aria-expanded={genrePanel}
            className="flex items-center gap-1 px-3.5 h-9 rounded-full bg-primary text-primary-fg text-sm font-semibold whitespace-nowrap flex-shrink-0"
          >
            Thể loại
            <svg className={`w-3 h-3 transition-transform ${genrePanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* BXH & Tủ sách đã có ở tab bar dưới — không lặp lại */}
          {categories.map((c) => (
            <Link key={c.href} href={c.href} className="px-3.5 h-9 leading-9 rounded-full bg-surface-2 text-foreground text-sm font-medium whitespace-nowrap flex-shrink-0">
              {c.name}
            </Link>
          ))}
        </div>

        {/* Genre panel */}
        {genrePanel && (
          <div className="pb-3 animate-slide-down">
            <div className="grid grid-cols-3 gap-1.5 max-h-[50vh] overflow-y-auto">
              {genres.map((g) => (
                <Link key={g._id} href={`/the-loai/${g.slug}`} onClick={() => setGenrePanel(false)}
                  className="px-2 py-2 text-center text-[13px] rounded-md bg-surface-2 text-foreground hover:bg-primary-soft hover:text-primary transition-colors">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
