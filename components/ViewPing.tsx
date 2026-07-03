'use client'

import { useEffect } from 'react'

// Gọi tăng lượt xem 1 lần khi mở trang truyện (server dedupe theo cookie).
export default function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/truyen/${slug}/view`, { method: 'POST' }).catch(() => { })
  }, [slug])
  return null
}
