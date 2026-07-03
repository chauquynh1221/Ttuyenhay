import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadImage, isCloudinaryReady } from '@/lib/cloudinary'

// POST /api/upload — upload ảnh lên Cloudinary
//   FormData: file (bắt buộc), type = 'avatar' | 'cover'
//   - avatar: cần đăng nhập   |   cover: cần admin
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        if (!isCloudinaryReady()) {
            return NextResponse.json({ error: 'Cloudinary chưa được cấu hình' }, { status: 503 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const type = (formData.get('type') as string) || 'avatar'

        if (type === 'cover' && user.role !== 'admin') {
            return NextResponse.json({ error: 'Không có quyền' }, { status: 403 })
        }
        if (!file) return NextResponse.json({ error: 'Thiếu file' }, { status: 400 })
        if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Chỉ chấp nhận ảnh' }, { status: 400 })
        if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Ảnh tối đa 5MB' }, { status: 400 })

        const bytes = Buffer.from(await file.arrayBuffer())
        const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`
        const folder = type === 'cover' ? 'bongmeow/covers' : 'bongmeow/avatars'
        const url = await uploadImage(dataUri, folder)

        return NextResponse.json({ success: true, url })
    } catch (e) {
        console.error('Upload error:', e)
        return NextResponse.json({ error: 'Lỗi upload' }, { status: 500 })
    }
}
