'use client'

const BASE_OPTIONS = [50, 100, 200, 400, 500]

// Chọn số bản ghi / trang. Giá trị lưu ở localStorage (sticky) — xem hook useAdminPageSize.
export default function AdminPageSize({ limit, onLimit }: { limit: number; onLimit: (n: number) => void }) {
  const options = BASE_OPTIONS.includes(limit) ? BASE_OPTIONS : [limit, ...BASE_OPTIONS].sort((a, b) => a - b)
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted whitespace-nowrap">
      Hiển thị
      <select
        value={limit}
        onChange={e => onLimit(Number(e.target.value))}
        className="form-control h-9 w-auto text-sm"
        aria-label="Số bản ghi mỗi trang"
      >
        {options.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      / trang
    </label>
  )
}
