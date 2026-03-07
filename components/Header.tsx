import Link from 'next/link'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'
import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A] shadow-lg">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-4 h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="Trang chủ">
            <div className="w-8 h-8 bg-[#C0392B] rounded flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg sm:text-xl tracking-wide font-display leading-none">
              ĐỌC TRUYỆN
            </span>
          </Link>

          {/* Search — chiếm phần giữa */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <SearchBar />
          </div>

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* User Menu — tự động hiện đúng trạng thái */}
          <UserMenu />

        </div>
      </div>
    </header>
  )
}
