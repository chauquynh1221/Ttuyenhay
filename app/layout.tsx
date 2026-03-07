import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import NavigationWrapper from '@/components/NavigationWrapper'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Đọc Truyện Online - TruyenFull Clone',
  description: 'Đọc truyện full, truyện hot, tiên hiệp, ngôn tình, kiếm hiệp miễn phí',
  keywords: ['truyện', 'đọc truyện', 'truyện full', 'tiên hiệp', 'ngôn tình'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${lexend.variable}`}>
      <body className={inter.className}>
        <Header />
        <NavigationWrapper />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
