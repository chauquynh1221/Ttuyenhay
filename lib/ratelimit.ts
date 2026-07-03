// Rate-limit in-memory dùng chung cho API route nhạy cảm (login/register/comment/report).
// ⚠️ Trên serverless/Vercel bộ nhớ KHÔNG chia sẻ giữa instance → đây là lớp cơ bản.
// Muốn chặt chẽ hãy dùng Upstash Ratelimit hoặc Cloudflare Rate Limiting.

const buckets = new Map<string, number[]>()

/**
 * Trả về true nếu ĐÃ vượt ngưỡng (bị chặn).
 * @param key   khoá định danh (vd `login:<ip>`)
 * @param max   số lần tối đa trong cửa sổ
 * @param windowMs  độ dài cửa sổ (ms)
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  buckets.set(key, arr)

  // Dọn rác định kỳ
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t > windowMs)) buckets.delete(k)
    }
  }
  return arr.length > max
}
