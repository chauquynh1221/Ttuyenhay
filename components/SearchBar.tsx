'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  autoFocus?: boolean
  onSubmitted?: () => void
}

interface Sug { _id: string; title: string; slug: string; author?: string; coverImage?: string }

export default function SearchBar({ autoFocus, onSubmitted }: Props) {
  const [q, setQ] = useState('')
  const [sugs, setSugs] = useState<Sug[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Gợi ý theo thời gian thực (debounce 220ms, huỷ request cũ)
  useEffect(() => {
    const query = q.trim()
    if (query.length < 2) { setSugs([]); setOpen(false); return }
    const ctrl = new AbortController()
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => { if (d.success) { setSugs(d.data || []); setOpen(true); setActive(-1) } })
        .catch(() => { })
    }, 220)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [q])

  // Đóng khi bấm ngoài
  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const goSearch = () => {
    const query = q.trim()
    if (!query) return
    router.push(`/tim-kiem?q=${encodeURIComponent(query)}`)
    setOpen(false)
    onSubmitted?.()
  }
  const goStory = (slug: string) => {
    router.push(`/truyen/${slug}`)
    setOpen(false); setQ('')
    onSubmitted?.()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || sugs.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(sugs.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); goStory(sugs[active].slug) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); goSearch() }} role="search">
        <input
          ref={inputRef}
          type="search"
          className="w-full h-10 pl-4 pr-11 text-sm rounded-full bg-surface-2 text-foreground border border-border
                     outline-none transition-colors placeholder:text-muted-2
                     focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
          placeholder="Tìm truyện, tác giả..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => { if (sugs.length) setOpen(true) }}
          autoComplete="off"
          aria-label="Tìm kiếm truyện"
        />
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="absolute right-1 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full text-muted hover:text-primary transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {open && sugs.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-border rounded-xl shadow-pop overflow-hidden z-[80] animate-scale-in origin-top">
          {sugs.map((s, i) => (
            <button
              key={s._id}
              onClick={() => goStory(s.slug)}
              onMouseEnter={() => setActive(i)}
              className={`flex items-center gap-3 w-full px-3 py-2 text-left transition-colors ${i === active ? 'bg-surface-2' : ''}`}
            >
              <div className="w-9 h-12 rounded bg-surface-3 overflow-hidden flex-shrink-0">
                {s.coverImage && <img src={s.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = '0' }} />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground line-clamp-1">{s.title}</p>
                {s.author && <p className="text-xs text-muted-2 line-clamp-1">{s.author}</p>}
              </div>
            </button>
          ))}
          <button onClick={goSearch} className="w-full px-3 py-2.5 text-sm font-semibold text-primary border-t border-border hover:bg-surface-2 transition-colors text-left">
            Xem tất cả kết quả cho “{q.trim()}” →
          </button>
        </div>
      )}
    </div>
  )
}
