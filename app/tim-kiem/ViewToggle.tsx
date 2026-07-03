'use client'

import Link from 'next/link'

interface ViewToggleProps {
  currentView: string
  query: string
  genre?: string
  status?: string
  sort?: string
}

// Đổi kiểu xem NHƯNG giữ nguyên bộ lọc genre/status/sort.
export default function ViewToggle({ currentView, query, genre = '', status = '', sort = '' }: ViewToggleProps) {
  const build = (view: string) => {
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (genre) p.set('genre', genre)
    if (status) p.set('status', status)
    if (sort) p.set('sort', sort)
    p.set('view', view)
    return `/tim-kiem?${p.toString()}`
  }
  return (
    <div className="flex items-center gap-2">
      <Link href={build('list')} className={`btn btn-default text-xs px-3 py-1 ${currentView === 'list' ? 'bg-primary text-primary-fg' : ''}`}>
        📋 Danh sách
      </Link>
      <Link href={build('grid')} className={`btn btn-default text-xs px-3 py-1 ${currentView === 'grid' ? 'bg-primary text-primary-fg' : ''}`}>
        🔲 Lưới
      </Link>
    </div>
  )
}
