'use client'

import Script from 'next/script'

// Nạp thư viện AdSense một lần cho toàn site.
// Bật bằng NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX".
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export default function GoogleAds() {
  if (!CLIENT) return null
  return (
    <Script
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
    />
  )
}
