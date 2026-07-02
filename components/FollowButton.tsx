'use client'

import { useState, useEffect } from 'react'
import { useToast } from './Toast'

interface FollowButtonProps {
    slug: string
    title: string
}

export default function FollowButton({ slug, title }: FollowButtonProps) {
    const [following, setFollowing] = useState(false)
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        fetch(`/api/follow/${slug}`)
            .then(r => r.json())
            .then(d => setFollowing(d.following))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [slug])

    const toggle = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/follow/${slug}`, { method: 'POST' })
            if (res.status === 401) { window.location.href = '/dang-nhap'; return }
            const data = await res.json()
            if (data.following !== undefined) {
                setFollowing(data.following)
                toast(data.following ? 'Đã theo dõi, meo~ 🐾' : 'Đã bỏ theo dõi 🐾')
            }
        } catch { }
        finally { setLoading(false) }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={following ? `Bỏ theo dõi ${title}` : `Theo dõi ${title}`}
            className={`btn btn-default gap-1.5
        ${following
                    ? 'bg-primary-soft text-primary border-primary'
                    : 'hover:text-primary'
                } disabled:opacity-50`}
        >
            <svg style={{ width: 16, height: 16 }} fill={following ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {loading ? '...' : following ? 'Đang theo dõi' : 'Theo dõi'}
        </button>
    )
}
