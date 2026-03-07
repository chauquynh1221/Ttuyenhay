'use client'

import Link from 'next/link'

interface ViewToggleProps {
  currentView: string
  query: string
}

export default function ViewToggle({ currentView, query }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/tim-kiem?q=${encodeURIComponent(query)}&view=list`}
        className={`btn btn-default text-xs px-3 py-1 ${currentView === 'list' ? 'bg-primary text-white' : ''}`}
      >
        📋 Danh sách
      </Link>
      <Link
        href={`/tim-kiem?q=${encodeURIComponent(query)}&view=grid`}
        className={`btn btn-default text-xs px-3 py-1 ${currentView === 'grid' ? 'bg-primary text-white' : ''}`}
      >
        🔲 Lưới
      </Link>
    </div>
  )
}

