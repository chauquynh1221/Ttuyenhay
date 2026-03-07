'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface Genre { _id: string; name: string; slug: string }
interface NavigationProps { genres: Genre[] }

const categories = [
  { name: 'Truyện tranh', href: '/danh-sach/truyen-tranh' },
  { name: 'Truyện mới cập nhật', href: '/danh-sach/truyen-moi' },
  { name: 'Truyện Hot', href: '/danh-sach/truyen-hot' },
  { name: 'Truyện Full', href: '/danh-sach/truyen-full' },
]

const chapterRanges = [
  { name: 'Dưới 100 chương', href: '/phan-loai/duoi-100-chuong' },
  { name: '100 - 500 chương', href: '/phan-loai/100-500-chuong' },
  { name: '500 - 1000 chương', href: '/phan-loai/500-1000-chuong' },
  { name: 'Trên 1000 chương', href: '/phan-loai/tren-1000-chuong' },
]

// Dropdown component tái sử dụng
function NavDropdown({
  label, open, onToggle, children
}: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <li className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-3 text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap"
        aria-expanded={open}
      >
        {label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-0 bg-white border border-[#E5E0D8] shadow-lg rounded min-w-[210px] z-50 animate-scale-in overflow-hidden">
          {children}
        </div>
      )}
    </li>
  )
}

export default function Navigation({ genres = [] }: NavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside as EventListener)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside as EventListener)
    }
  }, [])

  const toggle = (menu: string) => setOpenDropdown(openDropdown === menu ? null : menu)

  return (
    <nav ref={navRef} className="bg-[#2D2D2D] border-b border-black/20">
      <div className="container mx-auto px-3 sm:px-4">

        {/* ========== DESKTOP ========== */}
        <ul className="hidden md:flex items-center">

          <NavDropdown label="Danh sách" open={openDropdown === 'danh-sach'} onToggle={() => toggle('danh-sach')}>
            <div className="py-1.5">
              <div className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Danh mục</div>
              {categories.map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-[#F3F1EE] hover:text-[#C0392B] transition-colors"
                  onClick={() => setOpenDropdown(null)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-[#EEE9E0] my-1" />
              <div className="px-3 py-1 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Thể loại</div>
              <div className="max-h-64 overflow-y-auto">
                {genres.length > 0 ? genres.map(genre => (
                  <Link key={genre._id} href={`/the-loai/${genre.slug}`}
                    className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-[#F3F1EE] hover:text-[#C0392B] transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {genre.name}
                  </Link>
                )) : (
                  <div className="px-3 py-3 text-sm text-gray-400">Đang tải...</div>
                )}
              </div>
            </div>
          </NavDropdown>

          <NavDropdown label="Phân loại theo Chương" open={openDropdown === 'phan-loai'} onToggle={() => toggle('phan-loai')}>
            <div className="py-1.5">
              {chapterRanges.map(item => (
                <Link key={item.href} href={item.href}
                  className="block px-3 py-2 text-[13px] text-gray-700 hover:bg-[#F3F1EE] hover:text-[#C0392B] transition-colors"
                  onClick={() => setOpenDropdown(null)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </NavDropdown>

          <li>
            <Link href="/bang-xep-hang" className="block px-3 py-3 text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap">
              🏆 BXH
            </Link>
          </li>
          <li>
            <Link href="/tu-sach" className="block px-3 py-3 text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap">
              📚 Tủ sách
            </Link>
          </li>
          <li>
            <Link href="/gop-y" className="block px-3 py-3 text-[13px] font-medium text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap">
              Góp ý
            </Link>
          </li>
        </ul>

        {/* ========== MOBILE: Hamburger ========== */}
        <div className="md:hidden flex items-center justify-between py-2">
          <span className="text-white/50 text-xs uppercase tracking-wider">Điều hướng</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/80 hover:text-white p-2 rounded transition-colors"
            aria-label="Mở menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-3 border-t border-white/10 animate-slide-up">
            <div className="mt-2">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-white/40 tracking-wider">Danh mục</div>
              {categories.map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded mx-1 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 my-2" />
            <div>
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-white/40 tracking-wider">Phân loại theo Chương</div>
              {chapterRanges.map(item => (
                <Link key={item.href} href={item.href}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded mx-1 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {genres.length > 0 && (
              <>
                <div className="border-t border-white/10 my-2" />
                <div>
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase text-white/40 tracking-wider">Thể loại</div>
                  <div className="max-h-44 overflow-y-auto">
                    {genres.map(genre => (
                      <Link key={genre._id} href={`/the-loai/${genre.slug}`}
                        className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded mx-1 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="border-t border-white/10 my-2" />
            <Link href="/gop-y"
              className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded mx-1 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Góp ý
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
