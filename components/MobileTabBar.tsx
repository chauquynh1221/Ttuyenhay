'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Library, TrendingUp } from './icons'

const tabs = [
  { href: '/', label: 'Trang chủ', Icon: Home, match: (p: string) => p === '/' },
  { href: '/tim-kiem', label: 'Tìm', Icon: Compass, match: (p: string) => p.startsWith('/tim-kiem') },
  { href: '/tu-sach', label: 'Tủ sách', Icon: Library, match: (p: string) => p.startsWith('/tu-sach') },
  { href: '/bang-xep-hang', label: 'BXH', Icon: TrendingUp, match: (p: string) => p.startsWith('/bang-xep-hang') },
]

export default function MobileTabBar() {
  const pathname = usePathname() || '/'

  // Ẩn ở trang đọc chương (/truyen/<slug>/<số>) và khu admin
  const isReading = /^\/truyen\/[^/]+\/[^/]+/.test(pathname)
  const isAdmin = pathname.startsWith('/admin')
  if (isReading || isAdmin) return null

  return (
    <>
      {/* spacer để nội dung không bị thanh che */}
      <div className="h-16 md:hidden" />
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-4 h-16">
          {tabs.map(({ href, label, Icon, match }) => {
            const active = match(pathname)
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${active ? 'text-primary' : 'text-muted'}`}>
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
