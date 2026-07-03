'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  userId: string
  name: string
  email: string
  role: string
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  if (loading) return <div className="w-9 h-9 rounded-full skeleton" />

  if (!user) {
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Link href="/dang-nhap" className="px-2.5 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors whitespace-nowrap">
          Đăng nhập
        </Link>
        <Link href="/dang-ky" className="hidden xs:inline-flex btn btn-primary btn-sm">
          Đăng ký
        </Link>
      </div>
    )
  }

  const initial = user.name.charAt(0).toUpperCase()

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2" aria-label="Tài khoản">
        <span className="grid place-items-center w-9 h-9 bg-primary rounded-full text-primary-fg font-bold text-sm">{initial}</span>
        <span className="hidden md:block text-sm font-medium max-w-[110px] truncate text-foreground">{user.name}</span>
        <svg className="hidden md:block w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-pop z-50 py-1 overflow-hidden animate-scale-in origin-top-right">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-2 truncate">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block text-[10px] px-1.5 py-0.5 bg-primary-soft text-primary rounded mt-1.5">Admin</span>
            )}
          </div>

          <MenuLink href="/tu-sach" onClick={() => setOpen(false)} label="Tủ sách" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />

          <MenuLink href="/tai-khoan" onClick={() => setOpen(false)} label="Tài khoản" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

          {user.role === 'admin' && (
            <MenuLink href="/admin" onClick={() => setOpen(false)} label="Quản trị" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          )}

          <div className="border-t border-border mt-1">
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:bg-primary-soft hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({ href, onClick, label, icon }: { href: string; onClick: () => void; label: string; icon: string }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-surface-2 hover:text-primary transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {label}
    </Link>
  )
}
