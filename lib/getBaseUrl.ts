import { headers } from 'next/headers'

// Base URL THẬT của request (dùng cho thẻ OG/canonical). Ưu tiên env, nếu không thì lấy từ header
// → đúng domain trên Vercel, không bị kẹt 'localhost'.
export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    if (host) {
      const proto = h.get('x-forwarded-proto') || (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https')
      return `${proto}://${host}`
    }
  } catch {
    /* headers() không khả dụng ngoài request scope → dùng fallback */
  }
  return 'http://localhost:3000'
}
