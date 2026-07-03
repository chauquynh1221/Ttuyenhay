'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

interface Me { userId: string; name: string; email: string; avatar?: string; emailVerified?: boolean }

export default function TaiKhoanPage() {
    const router = useRouter()
    const toast = useToast()
    const [me, setMe] = useState<Me | null>(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingPw, setSavingPw] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
            if (d?.user) { setMe(d.user); setName(d.user.name); setAvatar(d.user.avatar || '') }
            else router.push('/dang-nhap?redirect=/tai-khoan')
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [router])

    const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('type', 'avatar')
            const r = await fetch('/api/upload', { method: 'POST', body: fd })
            const d = await r.json()
            if (r.ok) { setAvatar(d.url); toast('Đã tải ảnh lên') }
            else toast(d.error || 'Upload thất bại', 'error')
        } finally { setUploading(false) }
    }

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingProfile(true)
        const r = await fetch('/api/auth/me', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, avatar }),
        })
        setSavingProfile(false)
        if (r.ok) { toast('Đã lưu hồ sơ'); router.refresh() }
        else { const d = await r.json(); toast(d.error || 'Lưu thất bại', 'error') }
    }

    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (pw.next.length < 6) { toast('Mật khẩu mới tối thiểu 6 ký tự', 'error'); return }
        if (pw.next !== pw.confirm) { toast('Mật khẩu nhập lại không khớp', 'error'); return }
        setSavingPw(true)
        const r = await fetch('/api/auth/me', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
        })
        setSavingPw(false)
        if (r.ok) { toast('Đã đổi mật khẩu'); setPw({ current: '', next: '', confirm: '' }) }
        else { const d = await r.json(); toast(d.error || 'Đổi mật khẩu thất bại', 'error') }
    }

    if (loading) return <div className="container py-10 text-center text-muted-2">Đang tải...</div>
    if (!me) return null

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-foreground mb-6">Tài khoản</h1>

            {!me.emailVerified && (
                <div className="mb-6 px-4 py-3 bg-[rgb(var(--warning)/0.14)] text-[rgb(var(--warning))] rounded-lg text-sm">
                    Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư để xác thực.
                </div>
            )}

            {/* Hồ sơ */}
            <form onSubmit={saveProfile} className="card p-6 mb-6 space-y-4">
                <h2 className="font-bold text-foreground">Hồ sơ</h2>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-2 grid place-items-center flex-shrink-0">
                        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-primary">{name.charAt(0).toUpperCase()}</span>}
                    </div>
                    <div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
                        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-default btn-sm">
                            {uploading ? 'Đang tải...' : 'Đổi ảnh đại diện'}
                        </button>
                        <p className="text-xs text-muted-2 mt-1.5">JPG/PNG, tối đa 5MB</p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Tên hiển thị</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="form-control" maxLength={50} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Email</label>
                    <input value={me.email} disabled className="form-control opacity-60" />
                </div>
                <button type="submit" disabled={savingProfile} className="btn btn-primary">{savingProfile ? 'Đang lưu...' : 'Lưu hồ sơ'}</button>
            </form>

            {/* Đổi mật khẩu */}
            <form onSubmit={savePassword} className="card p-6 space-y-4">
                <h2 className="font-bold text-foreground">Đổi mật khẩu</h2>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Mật khẩu hiện tại</label>
                    <input type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} className="form-control" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Mật khẩu mới</label>
                    <input type="password" value={pw.next} onChange={e => setPw({ ...pw, next: e.target.value })} className="form-control" placeholder="Tối thiểu 6 ký tự" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Nhập lại mật khẩu mới</label>
                    <input type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} className="form-control" />
                </div>
                <button type="submit" disabled={savingPw} className="btn btn-primary">{savingPw ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
            </form>
        </div>
    )
}
