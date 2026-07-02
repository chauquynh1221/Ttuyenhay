'use client'

import Link from 'next/link'
import CatLogo from './CatLogo'
import { useState } from 'react'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="site-header sticky top-0 z-50 bg-header/85 backdrop-blur-xl border-b border-border/60">
      <div className="container">
        <div className="flex items-center gap-3 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Bongmeow">
            <CatLogo className="w-9 h-9 flex-shrink-0" />
            <span className="font-display font-extrabold text-xl tracking-tight text-header-foreground leading-none whitespace-nowrap">
              Bong<span className="text-primary">meow</span>
            </span>
          </Link>

          {/* Search — desktop inline */}
          <div className="hidden sm:block flex-1 max-w-lg mx-auto">
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
