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

const chapterRanges = [
  { name: 'Dưới 100 chương', href: '/phan-loai/duoi-100-chuong' },
  { name: '100 - 500 chương', href: '/phan-loai/100-500-chuong' },
  { name: '500 - 1000 chương', href: '/phan-loai/500-1000-chuong' },
  { name: 'Trên 1000 chương', href: '/phan-loai/tren-1000-chuong' },
]

function Dropdown({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <li className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-1 px-3 h-11 text-[13px] font-semibold text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
      >
        {label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full bg-surface border border-border shadow-pop rounded-lg min-w-[220px] z-50 animate-scale-in origin-top overflow-hidden py-1.5">
          {children}
        </div>
      )}
    </li>
  )
}

export default function Navigation({ genres = [] }: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [genrePanel, setGenrePanel] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname() || ''

  // Ẩn thanh điều hướng thể loại khi đang đọc chương → rộng chỗ đọc
  const isReading = /^\/truyen\/[^/]+\/[^/]+/.test(pathname)

  useEffect(() => {
    const onOutside = (e: Event) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setGenrePanel(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('touchstart', onOutside)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('touchstart', onOutside)
    }
  }, [])

  const toggle = (m: string) => setOpenDropdown((d) => (d === m ? null : m))

  const itemCls = 'block px-3.5 py-2 text-[13px] text-foreground hover:bg-surface-2 hover:text-primary transition-colors'

  if (isReading) return null

  return (
    <nav ref={navRef} className="sticky top-16 z-40 bg-bg/85 backdrop-blur-xl border-b border-border/60">
      <div className="container">

        {/* ===== DESKTOP ===== */}
        <ul className="hidden md:flex items-center">
          <Dropdown label="Danh sách" open={openDropdown === 'ds'} onToggle={() => toggle('ds')}>
            {categories.map((c) => (
              <Link key={c.href} href={c.href} className={itemCls} onClick={() => setOpenDropdown(null)}>{c.name}</Link>
            ))}
            <div className="border-t border-border my-1.5" />
            <div className="px-3.5 py-1 text-[10px] font-bold uppercase text-muted-2 tracking-wider">Thể loại</div>
            <div className="max-h-72 overflow-y-auto grid grid-cols-2 gap-x-1">
              {genres.length > 0 ? genres.map((g) => (
                <Link key={g._id} href={`/the-loai/${g.slug}`} className={itemCls} onClick={() => setOpenDropdown(null)}>{g.name}</Link>
              )) : <div className="px-3.5 py-2 text-sm text-muted-2">Đang tải...</div>}
            </div>
          </Dropdown>

          <Dropdown label="Theo số chương" open={openDropdown === 'pl'} onToggle={() => toggle('pl')}>
            {chapterRanges.map((c) => (
              <Link key={c.href} href={c.href} className={itemCls} onClick={() => setOpenDropdown(null)}>{c.name}</Link>
            ))}
          </Dropdown>

          <li><Link href="/bang-xep-hang" className="block px-3 h-11 leading-[2.75rem] text-[13px] font-semibold text-foreground/80 hover:text-primary transition-colors">🏆 BXH</Link></li>
          <li><Link href="/tu-sach" className="block px-3 h-11 leading-[2.75rem] text-[13px] font-semibold text-foreground/80 hover:text-primary transition-colors">📚 Tủ sách</Link></li>
          <li><Link href="/gop-y" className="block px-3 h-11 leading-[2.75rem] text-[13px] font-semibold text-foreground/80 hover:text-primary transition-colors">Góp ý</Link></li>
        </ul>

        {/* ===== MOBILE: chip strip cuộn ngang ===== */}
        <div className="md:hidden flex items-center gap-2 h-12 overflow-x-auto no-scrollbar -mx-1 px-1">
          <button
            onClick={() => setGenrePanel((v) => !v)}
            aria-expanded={genrePanel}
            className="flex items-center gap-1 px-3 h-8 rounded-full bg-primary text-primary-fg text-[13px] font-semibold whitespace-nowrap flex-shrink-0"
          >
            Thể loại
            <svg className={`w-3 h-3 transition-transform ${genrePanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* BXH & Tủ sách đã có ở tab bar dưới — không lặp lại ở đây */}
          {categories.map((c) => (
            <Link key={c.href} href={c.href} className="px-3.5 h-9 leading-9 rounded-full bg-surface-2 text-foreground text-sm font-medium whitespace-nowrap flex-shrink-0">
              {c.name}
            </Link>
          ))}
        </div>

        {/* Mobile genre panel */}
        {genrePanel && (
          <div className="md:hidden pb-3 animate-slide-down">
            <div className="grid grid-cols-3 gap-1.5 max-h-[50vh] overflow-y-auto">
              {genres.map((g) => (
                <Link key={g._id} href={`/the-loai/${g.slug}`} onClick={() => setGenrePanel(false)}
                  className="px-2 py-2 text-center text-[12px] rounded-md bg-surface-2 text-foreground hover:bg-primary-soft hover:text-primary transition-colors">
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
