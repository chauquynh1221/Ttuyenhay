'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import CatLogo from '@/components/CatLogo'

export default function DangNhapPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Đăng nhập thất bại')
                return
            }

            // Reload để server component cập nhật state
            router.push('/')
            router.refresh()
        } catch {
            setError('Lỗi kết nối, vui lòng thử lại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg flex items-start justify-center px-4 pt-6 pb-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
                        <CatLogo className="w-9 h-9" />
                        Bongmeow
                    </Link>
                    <p className="text-muted text-sm mt-2">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
                </div>

                {/* Card */}
                <div className="card rounded-xl shadow-sm p-8">
                    <h1 className="text-xl font-bold text-foreground mb-6">Đăng nhập</h1>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-primary-soft text-primary border border-border rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Login */}
                    <Suspense fallback={null}>
                        <GoogleLoginButton label="Đăng nhập bằng Google" />
                    </Suspense>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-2 font-medium">hoặc</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/90 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                required
                                className="form-control"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground/90 mb-1.5">Mật khẩu</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-[rgb(var(--primary))]" />
                                <span className="text-foreground/90">Ghi nhớ đăng nhập</span>
                            </label>
                            <Link href="/quen-mat-khau" className="text-primary hover:underline">Quên mật khẩu?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted">
                        Chưa có tài khoản?{' '}
                        <Link href="/dang-ky" className="text-primary font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
