import { NextResponse } from 'next/server'

// ⛔ ĐÃ VÔ HIỆU HOÁ — chống scrape (xem chú thích ở app/api/chapters/[slug]/[chapterNumber]/route.ts).
// Nội dung chương chỉ phục vụ qua trang đọc (SSR), không trả JSON công khai.
export async function GET() {
  return NextResponse.json({ error: 'Endpoint không khả dụng' }, { status: 403 })
}
