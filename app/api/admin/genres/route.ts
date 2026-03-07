import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Genre from '@/models/Genre'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách thể loại kèm count truyện
export async function GET() {
    try {
        await requireAdmin()
        await dbConnect()
        const genres = await Genre.find().sort({ name: 1 }).lean()

        // Đếm số truyện mỗi thể loại
        const genresWithCount = await Promise.all(
            genres.map(async (g: any) => ({
                ...g,
                _id: g._id.toString(),
                storyCount: await Truyen.countDocuments({ genres: g.name }),
            }))
        )
        return NextResponse.json({ success: true, genres: genresWithCount })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST — thêm thể loại mới
export async function POST(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { name, slug, description } = await req.json()
        if (!name || !slug) return NextResponse.json({ error: 'Thiếu tên hoặc slug' }, { status: 400 })

        const exists = await Genre.findOne({ $or: [{ name }, { slug }] })
        if (exists) return NextResponse.json({ error: 'Thể loại đã tồn tại' }, { status: 409 })

        const genre = await Genre.create({ name: name.trim(), slug: slug.trim().toLowerCase(), description: description?.trim() || '' })
        return NextResponse.json({ success: true, genre }, { status: 201 })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — cập nhật thể loại
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, name, slug, description } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const oldGenre = await Genre.findById(id)
        if (!oldGenre) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })

        // Nếu đổi tên → cập nhật cả trong Truyen.genres
        if (name && name !== oldGenre.name) {
            await Truyen.updateMany(
                { genres: oldGenre.name },
                { $set: { 'genres.$': name.trim() } }
            )
        }

        oldGenre.name = name?.trim() || oldGenre.name
        oldGenre.slug = slug?.trim().toLowerCase() || oldGenre.slug
        oldGenre.description = description?.trim() ?? oldGenre.description
        await oldGenre.save()

        return NextResponse.json({ success: true, genre: oldGenre })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa thể loại
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const count = await Truyen.countDocuments({ genres: (await Genre.findById(id))?.name })
        if (count > 0) return NextResponse.json({ error: `Không thể xóa — có ${count} truyện đang sử dụng thể loại này` }, { status: 409 })

        await Genre.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
