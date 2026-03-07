'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

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
        <div className="min-h-screen bg-[#F3F1EE] flex items-start justify-center px-4 pt-6 pb-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#1C1C1C]">
                        <span className="w-9 h-9 bg-[#C0392B] rounded-lg flex items-center justify-center text-white font-bold text-sm">Đ</span>
                        ĐỌC TRUYỆN
                    </Link>
                    <p className="text-[#888] text-sm mt-2">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-sm p-8">
                    <h1 className="text-xl font-bold text-[#1C1C1C] mb-6">Đăng nhập</h1>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Login */}
                    <Suspense fallback={null}>
                        <GoogleLoginButton label="Đăng nhập bằng Google" />
                    </Suspense>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#E5E0D8]" />
                        <span className="text-xs text-[#AAA] font-medium">hoặc</span>
                        <div className="flex-1 h-px bg-[#E5E0D8]" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#444] mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="your@email.com"
                                required
                                className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#444] mb-1.5">Mật khẩu</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                required
                                className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-[#C0392B]" />
                                <span className="text-[#666]">Ghi nhớ đăng nhập</span>
                            </label>
                            <Link href="/quen-mat-khau" className="text-[#C0392B] hover:underline">Quên mật khẩu?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#C0392B] text-white font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#E5E0D8] text-center text-sm text-[#888]">
                        Chưa có tài khoản?{' '}
                        <Link href="/dang-ky" className="text-[#C0392B] font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
