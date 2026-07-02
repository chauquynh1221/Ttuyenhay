import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/Toast'
import MobileTabBar from '@/components/MobileTabBar'
import AntiDevtools from '@/components/AntiDevtools'

// Body/UI: Be Vietnam Pro (hiện đại, hỗ trợ tiếng Việt chuẩn) — giữ tên biến --font-inter
const bodyFont = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
})

// Display/tiêu đề: Bricolage Grotesque (đậm, có cá tính, chuẩn cinematic) — map vào --font-lexend
const displayFont = Bricolage_Grotesque({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bongmeow - Đọc truyện online',
    template: '%s | Bongmeow',
  },
  description: 'Bongmeow — đọc truyện online miễn phí: truyện hot, tiên hiệp, ngôn tình, kiếm hiệp. Giao diện hiện đại, tối ưu cho điện thoại.',
  keywords: ['bongmeow', 'truyện', 'đọc truyện', 'truyện full', 'tiên hiệp', 'ngôn tình', 'kiếm hiệp'],
  icons: { icon: '/bongmeow-logo.png', apple: '/bongmeow-logo.png' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F4F0' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D12' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Chạy TRƯỚC khi paint để chống nhấp nháy (FOUC).
// Dark là MẶC ĐỊNH (cinematic) — chỉ về light khi người dùng đã chọn.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${bodyFont.variable} ${displayFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg ambient-glow text-foreground antialiased">
        <ToastProvider>
          <AntiDevtools />
          <Header />
          <NavigationWrapper />
          <main className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
        </ToastProvider>
      </body>
    </html>
  )
}
