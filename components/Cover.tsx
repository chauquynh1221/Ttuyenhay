'use client'

import { useState } from 'react'
import CoverFallback from './CoverFallback'

// Ảnh bìa an toàn: nếu URL hỏng (nguồn chết) → tự rơi về gradient + tên truyện.
// Dùng <img> thường (không next/image) vì nguồn bìa không ổn định + cần onError.
export default function Cover({ src, title }: { src?: string; title: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <CoverFallback title={title} />
  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )
}
