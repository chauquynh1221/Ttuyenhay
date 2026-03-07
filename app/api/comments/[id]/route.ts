import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

// DELETE /api/comments/[id] — xoá comment (chỉ chủ comment hoặc admin)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        await dbConnect()
        const { id } = await params

        const comment = await Comment.findById(id)
        if (!comment) return NextResponse.json({ error: 'Bình luận không tồn tại' }, { status: 404 })

        const isOwner = comment.userId
            ? comment.userId.toString() === currentUser.userId
            : false  // guest comments không thuộc về ai ngoài admin
        const isAdmin = currentUser.role === 'admin'

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Không có quyền xoá' }, { status: 403 })
        }

        await comment.deleteOne()
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE comment error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST /api/comments/[id]/like — toggle like
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        await dbConnect()
        const { id } = await params
        const userObjId = new mongoose.Types.ObjectId(currentUser.userId)

        const comment = await Comment.findById(id)
        if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const alreadyLiked = comment.likedBy.some((uid: any) => uid.toString() === currentUser.userId)

        if (alreadyLiked) {
            comment.likedBy = comment.likedBy.filter((uid: any) => uid.toString() !== currentUser.userId)
            comment.likes = Math.max(0, comment.likes - 1)
        } else {
            comment.likedBy.push(userObjId)
            comment.likes += 1
        }

        await comment.save()
        return NextResponse.json({ success: true, likes: comment.likes, liked: !alreadyLiked })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
