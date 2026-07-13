'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Google Analytics 4 (GA4). Bật bằng biến môi trường NEXT_PUBLIC_GA_ID = "G-XXXXXXX".
// Không có ID → không render gì. Tự bắn pageview mỗi lần đổi route (App Router).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_ID) return
    const gtag = (window as any).gtag
    if (typeof gtag === 'function') {
      gtag('config', GA_ID, { page_path: pathname })
    }
  }, [pathname])

  if (!GA_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  )
}
