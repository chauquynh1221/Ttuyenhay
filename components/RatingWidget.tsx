'use client'

import { useState, useEffect } from 'react'
import { useToast } from './Toast'

interface RatingWidgetProps {
    truyenId: string
}

const LABELS: Record<number, string> = {
    1: 'Rất tệ', 2: 'Tệ', 3: 'Kém', 4: 'Dưới TB', 5: 'Trung bình',
    6: 'Khá', 7: 'Tốt', 8: 'Rất tốt', 9: 'Xuất sắc', 10: 'Tuyệt vời'
}

export default function RatingWidget({ truyenId }: RatingWidgetProps) {
    const [avg, setAvg] = useState(0)
    const [count, setCount] = useState(0)
    const [userScore, setUserScore] = useState<number | null>(null)
    const [hovered, setHovered] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const toast = useToast()

    useEffect(() => {
        Promise.all([
            fetch('/api/auth/me').then(r => r.json()),
            fetch(`/api/rating?truyenId=${truyenId}`).then(r => r.json()),
        ]).then(([authData, ratingData]) => {
            setLoggedIn(!!authData.user)
            if (ratingData.success) {
                setAvg(ratingData.avg)
                setCount(ratingData.count)
                setUserScore(ratingData.userScore)
            }
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [truyenId])

    const handleRate = async (score: number) => {
        if (!loggedIn) { window.location.href = '/dang-nhap'; return }
        if (submitting) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ truyenId, score }),
            })
            const data = await res.json()
            if (data.success) {
                setAvg(data.avg)
                setCount(data.count)
                setUserScore(data.userScore)
                toast(`Đã đánh giá ${score}/10`)
            }
        } catch (error) {
            console.error('Rating error:', error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="h-20 bg-surface-2 rounded-lg animate-pulse" />

    const displayScore = hovered ?? userScore

    return (
        <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">⭐ Đánh giá truyện</h3>
                <div className="text-right">
                    <span className="text-xl font-bold text-primary">{avg || '—'}</span>
                    <span className="text-xs text-muted-2">/10 ({count.toLocaleString()} đánh giá)</span>
                </div>
            </div>

            {/* Star bar (1-10) */}
            <div className="flex gap-1 mb-2" onMouseLeave={() => setHovered(null)}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(star => {
                    const filled = displayScore !== null ? star <= displayScore : star <= avg
                    return (
                        <button
                            key={star}
                            onMouseEnter={() => loggedIn && setHovered(star)}
                            onClick={() => handleRate(star)}
                            disabled={submitting}
                            className="flex-1 group"
                            title={LABELS[star]}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className={`w-full h-5 transition-colors ${filled
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-border fill-border'
                                    } ${loggedIn ? 'group-hover:text-yellow-300 group-hover:fill-yellow-300' : ''}`}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    )
                })}
            </div>

            {/* Label + user state */}
            <div className="text-center text-xs">
                {!loggedIn && (
                    <p className="text-muted-2">
                        <a href="/dang-nhap" className="text-primary hover:underline">Đăng nhập</a> để đánh giá
                    </p>
                )}
                {loggedIn && userScore && !hovered && (
                    <p className="text-muted">Bạn đã đánh giá: <span className="font-semibold text-primary">{userScore}/10</span> — {LABELS[userScore]}</p>
                )}
                {hovered && (
                    <p className="text-muted">{LABELS[hovered]} — <span className="font-semibold text-primary">{hovered}/10</span></p>
                )}
                {loggedIn && !userScore && !hovered && (
                    <p className="text-muted-2">Di chuột để chọn điểm</p>
                )}
            </div>
        </div>
    )
}
