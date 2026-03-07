'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const doSearch = (q: string) => {
    const query = q.trim()
    if (query) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(searchQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      doSearch(inputRef.current?.value || searchQuery)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        ref={inputRef}
        type="search"
        className="w-full h-9 sm:h-10 px-4 pr-10 text-sm text-gray-800 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-[#C0392B] transition-all placeholder-gray-400"
        placeholder="Tìm kiếm truyện..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C0392B] transition-colors p-1"
        aria-label="Tìm kiếm"
      >
        <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}
