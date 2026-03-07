'use client'

import { useState, useEffect, useCallback } from 'react'

interface Comment {
    _id: string
    userId: string
    userName: string
    content: string
    likes: number
    likedBy: string[]
    createdAt: string
    parentId: string | null
    replies?: Comment[]
}

function formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'vừa xong'
    if (mins < 60) return `${mins} phút trước`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs} giờ trước`
    const days = Math.floor(diff / 86400000)
    return `${days} ngày trước`
}

// ─── CommentItem tách hoàn toàn ra ngoài ────────────────────────────────────
interface CommentItemProps {
    comment: Comment
    isReply?: boolean
    currentUserId: string | null
    onLike: (id: string) => void
    onDelete: (id: string, parentId?: string) => void
    onReply?: (id: string, name: string) => void
    activeReplyId: string | null
}

function CommentItem({ comment, isReply = false, currentUserId, onLike, onDelete, onReply, activeReplyId }: CommentItemProps) {
    const isOwner = currentUserId && currentUserId === comment.userId
    const isActive = activeReplyId === comment._id

    return (
        <div className={isReply ? 'flex gap-2' : 'flex gap-3 group'}>
            <div className={`flex-shrink-0 ${isReply ? 'w-7 h-7' : 'w-8 h-8'} bg-[#C0392B] rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                {comment.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#1C1C1C]">{comment.userName}</span>
                    {!comment.userId && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Khách</span>}
                    <span className="text-xs text-[#AAA]">{formatTimeAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-[#444] leading-relaxed whitespace-pre-line break-words">{comment.content}</p>
                <div className="flex items-center gap-3 mt-1.5">
                    <button onClick={() => onLike(comment._id)}
                        className="flex items-center gap-1 text-xs text-[#AAA] hover:text-[#C0392B] transition-colors">
                        <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                        <span>Thích</span>
                    </button>

                    {!isReply && onReply && (
                        currentUserId ? (
                            <button onClick={() => onReply(isActive ? '' : comment._id, comment.userName)}
                                className={`text-xs transition-colors ${isActive ? 'text-[#C0392B] font-semibold' : 'text-[#AAA] hover:text-[#C0392B]'}`}>
                                💬 {isActive ? 'Hủy trả lời' : 'Trả lời'}
                            </button>
                        ) : (
                            <a href="/dang-nhap" className="text-xs text-[#AAA] hover:text-[#C0392B] transition-colors">
                                💬 Đăng nhập để trả lời
                            </a>
                        )
                    )}

                    {isOwner && (
                        <button onClick={() => onDelete(comment._id, comment.parentId ?? undefined)}
                            className="text-xs text-[#AAA] hover:text-red-600 transition-colors"
                            title="Xoá bình luận">
                            🗑 Xoá
                        </button>
                    )}
                </div>

                {/* Nested replies */}
                {(comment.replies || []).length > 0 && (
                    <div className="mt-3 space-y-3 border-l-2 border-[#E5E0D8] pl-3">
                        {comment.replies!.map(reply => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                isReply
                                currentUserId={currentUserId}
                                onLike={onLike}
                                onDelete={onDelete}
                                activeReplyId={activeReplyId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── ReplyForm tách riêng để tránh re-render issue ─────────────────────────
interface ReplyFormProps {
    replyingToName: string
    onSubmit: (content: string) => Promise<string | null>  // trả về lỗi string hoặc null nếu OK
    onCancel: () => void
}

function ReplyForm({ replyingToName, onSubmit, onCancel }: ReplyFormProps) {
    const [text, setText] = useState('')
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState('')

    const submit = async () => {
        if (!text.trim()) return
        setError('')
        setPosting(true)
        const err = await onSubmit(text)
        setPosting(false)
        if (err) {
            setError(err)
        } else {
            setText('')
        }
    }

    return (
        <div className="mt-3 ml-11 space-y-2">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`Trả lời ${replyingToName}...`}
                rows={2}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/15 resize-none transition-all"
            />
            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
            <div className="flex gap-2">
                <button onClick={submit} disabled={posting || !text.trim()}
                    className="px-3 py-1.5 bg-[#C0392B] text-white text-xs font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-50 transition-colors">
                    {posting ? 'Đang gửi...' : 'Gửi'}
                </button>
                <button onClick={onCancel}
                    className="px-3 py-1.5 text-xs border border-[#D8D3CB] rounded-lg hover:bg-gray-50 transition-colors">
                    Hủy
                </button>
            </div>
        </div>
    )
}

// ─── Main CommentSection ────────────────────────────────────────────────────
interface CommentSectionProps {
    truyenId: string
    chapterId?: string
}

export default function CommentSection({ truyenId, chapterId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [content, setContent] = useState('')
    const [guestName, setGuestName] = useState('')
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserName, setCurrentUserName] = useState<string | null>(null)
    const [error, setError] = useState('')
    // replyingTo: { id: commentId, name: userName } | null
    const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null)

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => {
            const uid = d.user?.userId || d.user?.id || null
            setCurrentUserId(uid ? uid.toString() : null)
            setCurrentUserName(d.user?.name || null)
        }).catch(() => { })
    }, [])

    const loadComments = useCallback(async (p = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ truyenId, page: p.toString() })
            if (chapterId) params.append('chapterId', chapterId)
            const res = await fetch(`/api/comments?${params}`)
            const data = await res.json()
            if (data.success) {
                setComments(p === 1 ? data.comments : (prev: Comment[]) => [...prev, ...data.comments])
                setTotal(data.pagination.total)
            }
        } finally {
            setLoading(false)
        }
    }, [truyenId, chapterId])

    useEffect(() => {
        setComments([])
        setPage(1)
        loadComments(1)
    }, [truyenId, chapterId])

    const handlePost = async () => {
        if (!content.trim()) return
        if (!currentUserId && !guestName.trim()) {
            setError('Vui lòng nhập tên để bình luận')
            return
        }
        setError('')
        setPosting(true)
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    truyenId,
                    chapterId: chapterId || null,
                    content,
                    parentId: null,
                    guestName: !currentUserId ? guestName.trim() : undefined,
                }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || 'Đăng thất bại'); return }
            setContent('')
            setComments(prev => [{ ...data.comment, replies: [] }, ...prev])
            setTotal(prev => prev + 1)
        } catch { setError('Lỗi kết nối') }
        finally { setPosting(false) }
    }

    const handleReplySubmit = useCallback(async (parentId: string, replyText: string): Promise<string | null> => {
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ truyenId, chapterId: chapterId || null, content: replyText, parentId }),
            })
            const data = await res.json()
            if (!res.ok) return data.error || 'Đăng trả lời thất bại'
            setComments(prev => prev.map(c =>
                c._id === parentId
                    ? { ...c, replies: [...(c.replies || []), { ...data.comment, replies: [] }] }
                    : c
            ))
            setReplyingTo(null)
            return null
        } catch {
            return 'Lỗi kết nối'
        }
    }, [truyenId, chapterId])

    const handleDelete = useCallback(async (commentId: string, parentId?: string) => {
        if (!confirm('Xoá bình luận này?')) return
        const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
        if (res.ok) {
            if (parentId) {
                setComments(prev => prev.map(c =>
                    c._id === parentId
                        ? { ...c, replies: (c.replies || []).filter(r => r._id !== commentId) }
                        : c
                ))
            } else {
                setComments(prev => prev.filter(c => c._id !== commentId))
                setTotal(prev => prev - 1)
            }
        }
    }, [])

    const handleLike = useCallback(async (commentId: string) => {
        if (!currentUserId) { window.location.href = '/dang-nhap'; return }
        const res = await fetch(`/api/comments/${commentId}`, { method: 'POST' })
        const data = await res.json()
        if (data.success) {
            const updateLike = (c: Comment) => c._id === commentId ? { ...c, likes: data.likes } : c
            setComments(prev => prev.map(c => ({
                ...updateLike(c),
                replies: (c.replies || []).map(updateLike),
            })))
        }
    }, [currentUserId])

    const handleReplyToggle = useCallback((id: string, name: string) => {
        setReplyingTo(prev => prev?.id === id ? null : { id, name })
    }, [])

    const loadMore = () => {
        const next = page + 1
        setPage(next)
        loadComments(next)
    }

    return (
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-5">
            <h2 className="text-base font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                💬 Bình luận
                <span className="text-sm font-normal text-[#AAA]">({total})</span>
            </h2>

            {/* Form đăng root comment */}
            <div className="mb-5 space-y-2">
                {!currentUserId && (
                    <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                        placeholder="Tên của bạn (không cần đăng nhập)..."
                        maxLength={30}
                        className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/15 transition-all" />
                )}
                {currentUserId && (
                    <div className="flex items-center gap-2 text-sm text-[#888]">
                        <div className="w-6 h-6 bg-[#C0392B] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {currentUserName?.charAt(0).toUpperCase()}
                        </div>
                        <span>Bình luận với tư cách <strong className="text-[#1C1C1C]">{currentUserName}</strong></span>
                    </div>
                )}
                <textarea value={content} onChange={e => setContent(e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn về truyện này..."
                    rows={3} maxLength={2000}
                    className="w-full px-3 py-2.5 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/15 transition-all resize-none" />
                {error && <p className="text-red-600 text-xs">{error}</p>}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#AAA]">{content.length}/2000</span>
                    <button onClick={handlePost} disabled={posting || !content.trim()}
                        className="px-4 py-2 bg-[#C0392B] text-white text-sm font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {posting ? 'Đang đăng...' : 'Đăng bình luận'}
                    </button>
                </div>
            </div>

            {/* Danh sách comment */}
            {loading && comments.length === 0 ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-8 h-8 bg-[#E5E0D8] rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-[#E5E0D8] rounded w-1/4" />
                                <div className="h-3 bg-[#E5E0D8] rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-[#AAA] text-sm">
                    Chưa có bình luận nào. Hãy là người đầu tiên! 🎉
                </div>
            ) : (
                <div className="space-y-5">
                    {comments.map(comment => (
                        <div key={comment._id}>
                            <CommentItem
                                comment={comment}
                                currentUserId={currentUserId}
                                onLike={handleLike}
                                onDelete={handleDelete}
                                onReply={handleReplyToggle}
                                activeReplyId={replyingTo?.id ?? null}
                            />
                            {/* ReplyForm được render ở level này, không bên trong CommentItem */}
                            {replyingTo?.id === comment._id && (
                                <ReplyForm
                                    replyingToName={replyingTo.name}
                                    onSubmit={(text) => handleReplySubmit(comment._id, text)}
                                    onCancel={() => setReplyingTo(null)}
                                />
                            )}
                        </div>
                    ))}

                    {comments.length < total && (
                        <button onClick={loadMore} disabled={loading}
                            className="w-full py-2.5 text-sm text-[#C0392B] border border-[#E5E0D8] rounded-lg hover:border-[#C0392B] hover:bg-[#FEF2F2] transition-colors disabled:opacity-50">
                            {loading ? 'Đang tải...' : `Xem thêm (${total - comments.length} bình luận)`}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
