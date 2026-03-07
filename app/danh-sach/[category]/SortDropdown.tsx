'use client'

import { useRouter } from 'next/navigation'

interface SortDropdownProps {
    category: string
    currentSort?: string
    currentOrder?: string
}

const sortOptions = [
    { label: 'Mới cập nhật', sort: 'updatedAt', order: 'desc' },
    { label: 'Mới đăng', sort: 'createdAt', order: 'desc' },
    { label: 'Lượt xem nhiều nhất', sort: 'views', order: 'desc' },
    { label: 'Đánh giá cao nhất', sort: 'rating', order: 'desc' },
]

export default function SortDropdown({ category, currentSort, currentOrder }: SortDropdownProps) {
    const router = useRouter()
    const currentValue = currentSort ? `${currentSort}_${currentOrder || 'desc'}` : 'updatedAt_desc'

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sort, order] = e.target.value.split('_')
        router.push(`/danh-sach/${category}?sort=${sort}&order=${order}`)
    }

    return (
        <div className="flex items-center gap-2 text-sm font-normal normal-case">
            <span className="text-[#888] flex-shrink-0">Sắp xếp:</span>
            <select
                className="h-8 px-2 text-[13px] text-[#1C1C1C] bg-white border border-[#D8D3CB] rounded-md focus:outline-none focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] cursor-pointer min-w-[160px]"
                value={currentValue}
                onChange={handleChange}
            >
                {sortOptions.map((opt) => (
                    <option key={opt.sort} value={`${opt.sort}_${opt.order}`}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
