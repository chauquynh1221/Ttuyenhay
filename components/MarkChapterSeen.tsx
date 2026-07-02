'use client'

import { useEffect } from 'react'

// Mở trang chi tiết truyện → đánh dấu đã thấy chương mới của truyện này (nếu đang theo dõi).
// Vô hại nếu chưa đăng nhập / không theo dõi.
export default function MarkChapterSeen({ slug }: { slug: string }) {
  useEffect(() => {
    fetch('/api/notifications/seen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => { })
  }, [slug])
  return null
}
