'use client'

import Link from 'next/link'
import CatLogo from './CatLogo'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'

interface Genre { name: string; slug: string }

const navLinks = [
  { name: 'Trang chủ', href: '/', match: (p: string) => p === '/' },
  { name: 'Truyện Hot', href: '/danh-sach/truyen-hot', match: (p: string) => p.startsWith('/danh-sach/truyen-hot') },
  { name: 'BXH', href: '/bang-xep-hang', match: (p: string) => p.startsWith('/bang-xep-hang') },
  { name: 'Tủ sách', href: '/tu-sach', match: (p: string) => p.startsWith('/tu-sach') },
]

// Header 1 tầng kiểu Netflix: logo + link chữ + dropdown Thể loại + search + user.
export default function Header({ genres = [] }: { genres?: Genre[] }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname() || '/'

  // Đổi trang → đóng dropdown
  useEffect(() => { setGenreOpen(false) }, [pathname])

  useEffect(() => {
    const onOutside = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setGenreOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <header ref={ref} className="site-header sticky top-0 z-50 bg-header/85 backdrop-blur-xl border-b border-border/60">
      <div className="container">
        <div className="flex items-center gap-3 lg:gap-6 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Bongmeow">
            <CatLogo className="w-14 h-14 -my-2 flex-shrink-0" />
            <span className="font-display font-extrabold text-xl tracking-tight text-header-foreground leading-none whitespace-nowrap">
              Bong<span className="text-primary">meow</span>
            </span>
          </Link>

          {/* Nav chữ — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 1).map((l) => <NavLink key={l.href} {...l} active={l.match(pathname)} />)}

            {/* Thể loại dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreOpen((v) => !v)}
                aria-expanded={genreOpen}
                className={`flex items-center gap-1 px-3 h-9 rounded-md text-sm font-semibold transition-colors ${genreOpen || pathname.startsWith('/the-loai') ? 'text-primary' : 'text-header-foreground/75 hover:text-header-foreground'}`}
              >
                Thể loại
                <svg className={`w-3 h-3 transition-transform ${genreOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {genreOpen && (
                <div className="absolute left-0 top-full mt-2 w-[620px] max-w-[80vw] bg-surface border border-border rounded-xl shadow-pop p-5 animate-scale-in origin-top-left z-50">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-3">Khám phá thể loại</p>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 max-h-72 overflow-y-auto">
                    {genres.map((g) => (
                      <Link key={g.slug} href={`/the-loai/${g.slug}`}
                        className="px-2.5 py-1.5 rounded text-sm text-foreground/85 hover:bg-surface-2 hover:text-primary transition-colors">
                        {g.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 pt-4 border-t border-border text-sm">
                    <Link href="/danh-sach/truyen-moi" className="text-muted hover:text-primary transition-colors">📚 Mới cập nhật</Link>
                    <Link href="/danh-sach/truyen-full" className="text-muted hover:text-primary transition-colors">✅ Truyện Full</Link>
                    <Link href="/phan-loai/duoi-100-chuong" className="text-muted hover:text-primary transition-colors">Dưới 100 chương</Link>
                    <Link href="/phan-loai/tren-1000-chuong" className="text-muted hover:text-primary transition-colors">Trên 1000 chương</Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((l) => <NavLink key={l.href} {...l} active={l.match(pathname)} />)}
          </nav>

          {/* Search — desktop bên phải */}
          <div className="hidden sm:block flex-1 max-w-lg lg:max-w-xs mx-auto lg:mx-0 lg:ml-auto">
            <SearchBar />
          </div>

          {/* Spacer mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="sm:hidden grid place-items-center w-9 h-9 rounded-full text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <NotificationBell />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        {/* Search — mobile expandable */}
        {searchOpen && (
          <div className="sm:hidden pb-3 animate-slide-down">
            <SearchBar autoFocus onSubmitted={() => setSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ name, href, active }: { name: string; href: string; active: boolean }) {
  return (
    <Link href={href}
      className={`px-3 h-9 leading-9 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${active ? 'text-primary' : 'text-header-foreground/75 hover:text-header-foreground'}`}>
      {name}
    </Link>
  )
}
