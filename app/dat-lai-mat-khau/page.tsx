'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import CatLogo from '@/components/CatLogo'

function ResetForm() {
    const router = useRouter()
    const token = useSearchParams().get('token') || ''
    const [form, setForm] = useState({ password: '', confirm: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [done, setDone] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (form.password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
        if (form.password !== form.confirm) { setError('Mật khẩu nhập lại không khớp'); return }
        setLoading(true)
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: form.password }),
            })
            const d = await res.json()
            if (!res.ok) { setError(d.error || 'Có lỗi xảy ra'); return }
            setDone(true)
            setTimeout(() => router.push('/dang-nhap'), 1800)
        } catch { setError('Lỗi kết nối, vui lòng thử lại') }
        finally { setLoading(false) }
    }

    if (!token) {
        return <p className="text-sm text-muted">Liên kết không hợp lệ. <Link href="/quen-mat-khau" className="text-primary hover:underline">Yêu cầu lại</Link></p>
    }
    if (done) {
        return <p className="text-sm text-foreground/90">✅ Đổi mật khẩu thành công! Đang chuyển tới trang đăng nhập...</p>
    }

    return (
        <>
            <p className="text-sm text-muted mb-6">Nhập mật khẩu mới cho tài khoản của bạn.</p>
            {error && <div className="mb-4 px-4 py-3 bg-primary-soft text-primary border border-border rounded-lg text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Mật khẩu mới</label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Tối thiểu 6 ký tự" className="form-control" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Nhập lại mật khẩu</label>
                    <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required placeholder="Nhập lại" className="form-control" />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
            </form>
        </>
    )
}

export default function DatLaiMatKhauPage() {
    return (
        <div className="min-h-screen bg-bg flex items-start justify-center px-4 pt-6 pb-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
                        <CatLogo className="w-9 h-9" /> Bongmeow
                    </Link>
                </div>
                <div className="card rounded-xl p-8">
                    <h1 className="text-xl font-bold text-foreground mb-2">Đặt lại mật khẩu</h1>
                    <Suspense fallback={<p className="text-sm text-muted">Đang tải...</p>}>
                        <ResetForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
