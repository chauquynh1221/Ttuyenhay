'use client'

import { useState, useEffect } from 'react'

const KEY = 'admin_pagesize'
const DEFAULT = 50
const MAX = 500

// Số bản ghi/trang cho các bảng admin — lưu localStorage nên sticky toàn phiên,
// tự giữ nguyên sau khi sửa xong quay lại. Trả [limit, setLimit, ready].
// `ready` = đã đọc xong localStorage → dùng để tránh fetch 2 lần lúc mount.
export function useAdminPageSize(): [number, (n: number) => void, boolean] {
  const [limit, setLimitState] = useState(DEFAULT)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem(KEY) || '', 10)
    if (saved && saved > 0) setLimitState(Math.min(MAX, saved))
    setReady(true)
  }, [])

  const setLimit = (n: number) => {
    const v = Math.min(MAX, Math.max(1, n))
    setLimitState(v)
    localStorage.setItem(KEY, String(v))
  }

  return [limit, setLimit, ready]
}
