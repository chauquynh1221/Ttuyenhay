'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './Toast'

interface FavoriteButtonProps {
    truyenId: string
    currentChapter?: number
}

export default function FavoriteButton({ truyenId, currentChapter = 1 }: FavoriteButtonProps) {
    const [isFav, setIsFav] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [burst, setBurst] = useState<{ id: number; dx: number; dy: number; e: string }[]>([])
    const router = useRouter()
    const toast = useToast()

    const fireBurst = () => {
        const parts = Array.from({ length: 9 }, (_, k) => {
            const ang = (k / 9) * Math.PI * 2
            return { id: Date.now() + k, dx: Math.cos(ang) * 42, dy: Math.sin(ang) * 42 - 8, e: k % 2 ? '🐾' : '💗' }
        })
        setBurst(parts)
        setTimeout(() => setBurst([]), 780)
    }

    useEffect(() => {
        // Kiểm tra user đã đăng nhập chưa + đã yêu thích chưa
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(async d => {
                if (!d.user) { setLoading(false); return }
                setLoggedIn(true)
                // Lấy danh sách bookmark
                const bsRes = await fetch('/api/bookshelf')
                const bsData = await bsRes.json()
                if (bsData.bookmarks) {
                    const found = bsData.bookmarks.find((b: any) => {
                        const bid = b.truyenId?._id || b.truyenId
                        return bid?.toString() === truyenId
                    })
                    setIsFav(!!found)
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [truyenId])

    const handleToggle = async () => {
        if (!loggedIn) {
            router.push('/dang-nhap')
            return
        }

        setLoading(true)
        try {
            if (isFav) {
                await fetch(`/api/bookshelf?truyenId=${truyenId}`, { method: 'DELETE' })
                setIsFav(false)
                toast('Đã bỏ khỏi yêu thích 🐾')
            } else {
                await fetch('/api/bookshelf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ truyenId, currentChapter }),
                })
                setIsFav(true)
                fireBurst()
                toast('Đã thêm vào yêu thích, meo~ 🐾')
            }
        } catch (error) {
            console.error('Favorite toggle error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`btn btn-default w-full gap-2 relative disabled:opacity-50 ${isFav
                    ? 'bg-primary-soft text-primary border-primary'
                    : 'hover:text-primary'
                }`}
            title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
            {burst.map((p) => (
                <span key={p.id} className="burst-particle text-sm" style={{ ['--dx' as any]: `${p.dx}px`, ['--dy' as any]: `${p.dy}px` }}>{p.e}</span>
            ))}
            <svg
                className="w-4 h-4"
                fill={isFav ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            {loading ? '...' : isFav ? 'Đã yêu thích' : 'Yêu thích'}
        </button>
    )
}
