'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  autoFocus?: boolean
  onSubmitted?: () => void
}

export default function SearchBar({ autoFocus, onSubmitted }: Props) {
  const [q, setQ] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    router.push(`/tim-kiem?q=${encodeURIComponent(query)}`)
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="relative w-full" role="search">
      <input
        ref={inputRef}
        type="search"
        className="w-full h-10 pl-4 pr-11 text-sm rounded-full bg-surface-2 text-foreground border border-border
                   outline-none transition-colors placeholder:text-muted-2
                   focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/15"
        placeholder="Tìm truyện, tác giả..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
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
  )
}
