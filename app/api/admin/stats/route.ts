import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import User from '@/models/User'
import Comment from '@/models/Comment'
import Chapter from '@/models/Chapter'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await dbConnect()

    const [truyenCount, userCount, commentCount, chapterCount, topViews] = await Promise.all([
        Truyen.countDocuments(),
        User.countDocuments(),
        Comment.countDocuments(),
        Chapter.countDocuments(),
        Truyen.find().sort({ views: -1 }).limit(5)
            .select('title slug views rating totalChapters').lean(),
    ])

    // Total views all truyen
    const viewsAggregate = await Truyen.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
    ])
    const totalViews = viewsAggregate[0]?.total || 0

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })

    return NextResponse.json({
        success: true,
        stats: {
            truyenCount,
            userCount,
            commentCount,
            chapterCount,
            totalViews,
            newUsers,
        },
        topViews,
    })
}
