// Helper dùng chung cho các API route.

// Escape ký tự đặc biệt regex → chống ReDoS / regex injection khi nhét input vào $regex.
export function escapeRegex(s: string): string {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Kẹp trần limit phân trang (mặc định 20, tối đa 100) + guard NaN.
export function clampLimit(raw: string | null, def = 20, max = 100): number {
  const n = parseInt(raw || '', 10)
  if (!Number.isFinite(n) || n < 1) return def
  return Math.min(n, max)
}

// Trang hợp lệ ≥ 1.
export function parsePage(raw: string | null): number {
  const n = parseInt(raw || '', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

// Loại bỏ thẻ HTML + trim → chống stored-XSS khi lưu nội dung người dùng.
export function sanitizeText(s: unknown): string {
  return String(s ?? '').replace(/<[^>]*>/g, '').trim()
}

// Lấy origin THẬT của request (proto + host) từ header proxy.
// Dùng cho OAuth/redirect → không phụ thuộc NEXTAUTH_URL bị điền sai (tránh "quay về localhost").
export function getRequestOrigin(req: Request): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const fwdProto = req.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  const proto = fwdProto || (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https')
  if (host) return `${proto}://${host}`
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

// Lấy IP client từ header (dùng cho rate-limit).
export function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}
