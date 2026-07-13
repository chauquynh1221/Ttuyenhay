'use client'

import { useEffect } from 'react'

// Một ô quảng cáo AdSense. Truyền `slot` = mã ad unit (data-ad-slot) tạo trong AdSense.
// Không có client id HOẶC không có slot → không render (an toàn khi chưa cấu hình).
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT

export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: {
  slot?: string
  format?: string
  responsive?: boolean
  className?: string
}) {
  useEffect(() => {
    if (!CLIENT || !slot) return
    try {
      ; ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch { }
  }, [slot])

  if (!CLIENT || !slot) return null

  return (
    <div className={`my-6 mx-auto max-w-full overflow-hidden text-center ${className}`}>
      <span className="block text-[10px] uppercase tracking-widest text-muted-2 mb-1">Quảng cáo</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
