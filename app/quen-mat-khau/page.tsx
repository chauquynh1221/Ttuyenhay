'use client'

import { useState } from 'react'
import Link from 'next/link'
import CatLogo from '@/components/CatLogo'

export default function QuenMatKhauPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) { const d = await res.json(); setError(d.error || 'Có lỗi xảy ra'); return }
            setSent(true)
        } catch { setError('Lỗi kết nối, vui lòng thử lại') }
        finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen bg-bg flex items-start justify-center px-4 pt-6 pb-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
                        <CatLogo className="w-9 h-9" /> Bongmeow
                    </Link>
                </div>

                <div className="card rounded-xl p-8">
                    <h1 className="text-xl font-bold text-foreground mb-2">Quên mật khẩu</h1>
                    {sent ? (
                        <div className="text-sm text-foreground/90 leading-relaxed">
                            <p className="mb-3">Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả mục Spam).</p>
                            <Link href="/dang-nhap" className="text-primary font-semibold hover:underline">← Về đăng nhập</Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-muted mb-6">Nhập email đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.</p>
                            {error && <div className="mb-4 px-4 py-3 bg-primary-soft text-primary border border-border rounded-lg text-sm">{error}</div>}
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" className="form-control" />
                                </div>
                                <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                    {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                                </button>
                            </form>
                            <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted">
                                <Link href="/dang-nhap" className="text-primary font-semibold hover:underline">← Về đăng nhập</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
