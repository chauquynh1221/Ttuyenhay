import type { Metadata, Viewport } from 'next'
import { Nunito, Baloo_2 } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/Toast'
import MobileTabBar from '@/components/MobileTabBar'
import BackgroundDecor from '@/components/BackgroundDecor'
import AntiDevtools from '@/components/AntiDevtools'

// Body/UI: Nunito (tròn trịa, thân thiện, dễ đọc) — giữ tên biến --font-inter để không phải sửa nơi khác
const bodyFont = Nunito({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

// Tiêu đề/logo: Baloo 2 (bo tròn, dễ thương) — map vào --font-lexend (font-display)
const displayFont = Baloo_2({
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1014' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Chạy TRƯỚC khi paint để chống nhấp nháy (FOUC) khi đổi theme
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

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
      <body className="min-h-screen bg-bg paw-pattern text-foreground antialiased">
        <ToastProvider>
          <AntiDevtools />
          <div className="grain" aria-hidden />
          <BackgroundDecor />
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
