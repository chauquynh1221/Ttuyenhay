'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-20 text-center">
      <div className="text-5xl mb-4">😵</div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Đã có lỗi xảy ra</h1>
      <p className="text-muted mb-6 max-w-md mx-auto">
        Trang gặp sự cố khi tải. Bạn thử lại nhé — nếu vẫn lỗi, vui lòng quay lại sau.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="btn btn-primary">Thử lại</button>
        <Link href="/" className="btn btn-default">Về trang chủ</Link>
      </div>
    </div>
  )
}
