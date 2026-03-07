'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function DangKyPage() {
    const router = useRouter()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirm) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Đăng ký thất bại')
                return
            }

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
                    <p className="text-[#888] text-sm mt-2">Tạo tài khoản để lưu tủ sách của bạn</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-[#E5E0D8] shadow-sm p-8">
                    <h1 className="text-xl font-bold text-[#1C1C1C] mb-6">Đăng ký tài khoản</h1>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Signup */}
                    <Suspense fallback={null}>
                        <GoogleLoginButton label="Đăng ký bằng Google" />
                    </Suspense>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#E5E0D8]" />
                        <span className="text-xs text-[#AAA] font-medium">hoặc đăng ký bằng email</span>
                        <div className="flex-1 h-px bg-[#E5E0D8]" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#444] mb-1.5">Tên hiển thị</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Tên của bạn"
                                required minLength={2}
                                className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all"
                            />
                        </div>

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
                                placeholder="Tối thiểu 6 ký tự"
                                required minLength={6}
                                className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#444] mb-1.5">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={form.confirm}
                                onChange={e => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Nhập lại mật khẩu"
                                required
                                className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[#C0392B] text-white font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm mt-2"
                        >
                            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#E5E0D8] text-center text-sm text-[#888]">
                        Đã có tài khoản?{' '}
                        <Link href="/dang-nhap" className="text-[#C0392B] font-semibold hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
