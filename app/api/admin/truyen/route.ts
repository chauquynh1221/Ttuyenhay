import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách truyện (search, filter, pagination)
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { searchParams } = req.nextUrl
        const q = searchParams.get('q') || ''
        const genre = searchParams.get('genre') || ''
        const status = searchParams.get('status') || ''
        const sort = searchParams.get('sort') || 'updatedAt'
        const order = searchParams.get('order') === 'asc' ? 1 : -1
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        const filter: any = {}
        if (q.trim()) {
            filter.$or = [
                { title: { $regex: q.trim(), $options: 'i' } },
                { author: { $regex: q.trim(), $options: 'i' } },
                { slug: { $regex: q.trim(), $options: 'i' } },
            ]
        }
        if (genre) filter.genres = genre
        if (status) filter.status = status

        const [truyen, total] = await Promise.all([
            Truyen.find(filter)
                .sort({ [sort]: order })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Truyen.countDocuments(filter),
        ])

        return NextResponse.json({
            success: true,
            data: truyen.map((t: any) => ({ ...t, _id: t._id.toString() })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST — thêm truyện mới
export async function POST(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const body = await req.json()
        const { title, slug, author, description, coverImage, genres, status: st, isHot, isFull, isNew } = body

        if (!title || !slug || !author || !description) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (title, slug, author, description)' }, { status: 400 })
        }

        const exists = await Truyen.findOne({ slug: slug.toLowerCase() })
        if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })

        const truyen = await Truyen.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            author: author.trim(),
            description: description.trim(),
            coverImage: coverImage || '',
            genres: genres || [],
            status: st || 'ongoing',
            isHot: isHot || false,
            isFull: isFull || false,
            isNew: isNew !== false,  // mặc định true
        })

        return NextResponse.json({ success: true, truyen }, { status: 201 })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        console.error('Admin POST truyen error:', e)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — cập nhật truyện
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const body = await req.json()
        const { id, ...updates } = body
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        if (updates.slug) updates.slug = updates.slug.trim().toLowerCase()
        if (updates.title) updates.title = updates.title.trim()
        if (updates.author) updates.author = updates.author.trim()

        const truyen = await Truyen.findByIdAndUpdate(id, updates, { new: true })
        if (!truyen) return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })

        return NextResponse.json({ success: true, truyen })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa truyện + tất cả chương
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const truyen = await Truyen.findById(id)
        if (!truyen) return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })

        // Xóa tất cả chương liên quan
        await Chapter.deleteMany({ truyenId: id })
        await Truyen.findByIdAndDelete(id)

        return NextResponse.json({ success: true, message: `Đã xóa "${truyen.title}" và tất cả chương` })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
