'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface NItem { slug: string; title: string; cover: string; newCount: number; latest: number }

export default function NotificationBell() {
  const [enabled, setEnabled] = useState(true) // false khi chưa đăng nhập → ẩn chuông
  const [items, setItems] = useState<NItem[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const load = () => {
    fetch('/api/notifications')
      .then((r) => {
        if (r.status === 401) { setEnabled(false); return null }
        return r.json()
      })
      .then((d) => { if (d?.success) setItems(d.items || []) })
      .catch(() => { })
  }

  // Tải lúc mount + poll mỗi 90s
  useEffect(() => {
    load()
    const t = setInterval(load, 90000)
    return () => clearInterval(t)
  }, [])

  // Đóng khi bấm ngoài
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const markAll = async () => {
    setItems([])
    try { await fetch('/api/notifications/seen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }) }) } catch { }
  }

  if (!enabled) return null
  const count = items.length

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Thông báo"
        className="relative grid place-items-center w-9 h-9 rounded-full text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-fg text-[10px] font-bold">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-surface border border-border rounded-xl shadow-pop z-[70] overflow-hidden animate-scale-in origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-bold text-foreground">Chương mới</p>
            {count > 0 && (
              <button onClick={markAll} className="text-xs text-primary hover:underline">Đánh dấu đã đọc</button>
            )}
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-2">
              Chưa có chương mới từ truyện bạn theo dõi.
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {items.map((it) => (
                <Link
                  key={it.slug}
                  href={`/truyen/${it.slug}/${it.latest}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition-colors"
                >
                  <div className="w-9 h-12 rounded bg-surface-3 overflow-hidden flex-shrink-0">
                    {it.cover && <img src={it.cover} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = '0' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{it.title}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">+{it.newCount} chương mới</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link href="/tu-sach#theo-doi" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-center text-sm font-semibold text-primary border-t border-border hover:bg-surface-2 transition-colors">
            Xem tất cả truyện theo dõi
          </Link>
        </div>
      )}
    </div>
  )
}
