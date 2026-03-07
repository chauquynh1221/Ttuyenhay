'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface GenrePageClientProps {
  genre: string
}

export default function GenrePageClient({ genre }: GenrePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'updatedAt')

  useEffect(() => {
    const currentSort = searchParams.get('sort') || 'updatedAt'
    setSortBy(currentSort)
  }, [searchParams])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    setSortBy(newSort)

    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.delete('page') // Reset to page 1 when sorting changes

    router.push(`/the-loai/${genre}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 text-xs font-normal normal-case w-full sm:w-auto">
      <span className="text-gray-500 flex-shrink-0">Sắp xếp:</span>
      <select
        className="form-control h-8 text-xs flex-1 sm:flex-initial min-w-0"
        value={sortBy}
        onChange={handleSortChange}
      >
        <option value="updatedAt">Mới cập nhật</option>
        <option value="createdAt">Mới đăng</option>
        <option value="views">Lượt xem</option>
        <option value="rating">Đánh giá</option>
      </select>
    </div>
  )
}
