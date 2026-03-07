import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Rating from '@/models/Rating'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/rating?truyenId=xxx — lấy rating trung bình + user's rating
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const truyenId = searchParams.get('truyenId')
        if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

        const currentUser = await getCurrentUser()

        const [stats, userRating] = await Promise.all([
            Rating.aggregate([
                { $match: { truyenId: new mongoose.Types.ObjectId(truyenId) } },
                { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } },
            ]),
            currentUser
                ? Rating.findOne({ truyenId, userId: currentUser.userId }).lean()
                : Promise.resolve(null),
        ])

        return NextResponse.json({
            success: true,
            avg: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0,
            count: stats[0]?.count || 0,
            userScore: (userRating as any)?.score || null,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST /api/rating — đánh giá (tạo mới hoặc cập nhật)
export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        await dbConnect()
        const { truyenId, score } = await req.json()

        if (!truyenId || !score) return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 })
        if (score < 1 || score > 10) return NextResponse.json({ error: 'Điểm từ 1-10' }, { status: 400 })

        // Kiểm tra truyện tồn tại
        const truyen = await Truyen.findById(truyenId)
        if (!truyen) return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })

        // Upsert rating
        await Rating.findOneAndUpdate(
            { truyenId: new mongoose.Types.ObjectId(truyenId), userId: new mongoose.Types.ObjectId(currentUser.userId) },
            { score },
            { upsert: true, new: true }
        )

        // Tính lại rating trung bình và cập nhật Truyen
        const stats = await Rating.aggregate([
            { $match: { truyenId: new mongoose.Types.ObjectId(truyenId) } },
            { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } },
        ])

        if (stats.length > 0) {
            await Truyen.findByIdAndUpdate(truyenId, {
                rating: Math.round(stats[0].avg * 10) / 10,
                reviewCount: stats[0].count,
            })
        }

        return NextResponse.json({
            success: true,
            avg: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : score,
            count: stats[0]?.count || 1,
            userScore: score,
        })
    } catch (error) {
        console.error('POST rating error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
