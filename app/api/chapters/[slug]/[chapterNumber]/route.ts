import { NextResponse } from 'next/server'

// ⛔ ĐÃ VÔ HIỆU HOÁ — chống scrape.
// Endpoint này trước đây trả full nội dung chương dạng JSON công khai (không auth,
// không rate-limit) → mỏ vàng cho bot cào. Nội dung giờ CHỈ phục vụ qua trang đọc (SSR),
// không có JSON công khai. Nếu cần API nội bộ, phải thêm auth + rate-limit trước.
export async function GET() {
  return NextResponse.json({ error: 'Endpoint không khả dụng' }, { status: 403 })
}
