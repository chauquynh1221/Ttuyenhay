import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
// Resend cho phép dùng onboarding@resend.dev để test trước khi verify domain
const FROM = process.env.EMAIL_FROM || 'Bongmeow <onboarding@resend.dev>'

// Gửi email. Nếu chưa cấu hình RESEND_API_KEY → bỏ qua (không vỡ luồng), chỉ cảnh báo.
export async function sendMail(to: string, subject: string, html: string): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!resend) {
    console.warn('[mail] RESEND_API_KEY chưa cấu hình — bỏ qua gửi email tới', to)
    return { ok: false, skipped: true }
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    return { ok: true }
  } catch (e) {
    console.error('[mail] Gửi email lỗi:', e)
    return { ok: false }
  }
}

function shell(title: string, body: string): string {
  return `<div style="font-family:system-ui,Segoe UI,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1c202d">
    <h1 style="font-size:20px;margin:0 0 8px">🐾 Bongmeow</h1>
    <h2 style="font-size:16px;margin:0 0 12px;color:#333">${title}</h2>
    ${body}
    <p style="font-size:12px;color:#999;margin-top:24px">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
  </div>`
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#BB7714;color:#fff;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;margin:8px 0">${label}</a>`
}

export function passwordResetHtml(link: string): string {
  return shell('Đặt lại mật khẩu', `
    <p style="font-size:14px;line-height:1.6">Bấm nút bên dưới để đặt lại mật khẩu. Liên kết có hiệu lực trong 60 phút.</p>
    ${button(link, 'Đặt lại mật khẩu')}
    <p style="font-size:12px;color:#666;word-break:break-all">Hoặc mở liên kết: ${link}</p>`)
}

export function verifyEmailHtml(link: string): string {
  return shell('Xác thực địa chỉ email', `
    <p style="font-size:14px;line-height:1.6">Chào mừng tới Bongmeow! Bấm nút bên dưới để xác thực email của bạn.</p>
    ${button(link, 'Xác thực email')}
    <p style="font-size:12px;color:#666;word-break:break-all">Hoặc mở liên kết: ${link}</p>`)
}
