'use client'

import { useState, useEffect } from 'react'

interface AdminPagerProps {
  page: number
  totalPages: number
  onPage: (n: number) => void
  total?: number
  unit?: string
}

// Pager admin: Đầu / Trước / nhảy-tới-trang / Sau / Cuối — đỡ phải bấm "Sau" nhiều lần
export default function AdminPager({ page, totalPages, onPage, total, unit = 'mục' }: AdminPagerProps) {
  const [jump, setJump] = useState(String(page))
  useEffect(() => { setJump(String(page)) }, [page])

  if (totalPages <= 1) return null

  const clamp = (n: number) => Math.min(Math.max(1, n), totalPages)
  const commitJump = () => {
    const n = clamp(parseInt(jump, 10) || 1)
    setJump(String(n))
    if (n !== page) onPage(n)
  }

  const btn = 'btn btn-default btn-sm px-2'
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-2 gap-3 flex-wrap">
      <span className="text-xs text-muted">
        Trang {page} / {totalPages}{typeof total === 'number' ? ` (${total} ${unit})` : ''}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(1)} disabled={page <= 1} className={btn} title="Trang đầu">« Đầu</button>
        <button onClick={() => onPage(page - 1)} disabled={page <= 1} className={btn}>‹ Trước</button>
        <div className="flex items-center gap-1 px-1">
          <input
            type="number" min={1} max={totalPages} value={jump}
            onChange={e => setJump(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitJump() } }}
            onBlur={commitJump}
            className="form-control h-8 w-16 text-center text-xs"
            aria-label="Nhảy tới trang"
          />
          <span className="text-xs text-muted whitespace-nowrap">/ {totalPages}</span>
        </div>
        <button onClick={() => onPage(page + 1)} disabled={page >= totalPages} className={btn}>Sau ›</button>
        <button onClick={() => onPage(totalPages)} disabled={page >= totalPages} className={btn} title="Trang cuối">Cuối »</button>
      </div>
    </div>
  )
}
