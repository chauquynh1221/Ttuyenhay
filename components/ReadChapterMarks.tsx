'use client'

import { useEffect } from 'react'

// Đánh dấu các chương ĐÃ ĐỌC trong danh sách chương (dựa localStorage `bm-read:<slug>`).
// Danh sách chương render các link có data-ch="<số chương>".
export default function ReadChapterMarks({ slug }: { slug: string }) {
  useEffect(() => {
    let read: Set<number>
    try {
      read = new Set<number>(JSON.parse(localStorage.getItem(`bm-read:${slug}`) || '[]'))
    } catch { return }
    if (read.size === 0) return

    document.querySelectorAll<HTMLElement>('[data-ch]').forEach((el) => {
      const n = Number(el.getAttribute('data-ch'))
      if (read.has(n)) {
        el.classList.add('opacity-60')
        if (!el.querySelector('[data-read-badge]')) {
          const badge = document.createElement('span')
          badge.setAttribute('data-read-badge', '')
          badge.textContent = '✓ đã đọc'
          badge.className = 'text-[10px] text-primary font-semibold flex-shrink-0 ml-2'
          const target = el.querySelector('[data-ch-title]') || el
          target.appendChild(badge)
        }
      }
    })
  }, [slug])

  return null
}
