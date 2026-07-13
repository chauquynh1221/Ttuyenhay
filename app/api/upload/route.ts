import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadImage, isCloudinaryReady } from '@/lib/cloudinary'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Đuôi file cho phép khi lưu local (chặn svg vì có thể chứa script)
const LOCAL_EXT: Record<string, string> = {
    'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
    'image/gif': 'gif', 'image/avif': 'avif',
}

// POST /api/upload — upload ảnh
//   FormData: file (bắt buộc), type = 'avatar' | 'cover'
//   - avatar: cần đăng nhập   |   cover: cần admin
//   Có Cloudinary thì đẩy lên Cloudinary; chưa cấu hình thì lưu vào public/uploads
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

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
        let url: string

        if (isCloudinaryReady()) {
            const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`
            const folder = type === 'cover' ? 'bongmeow/covers' : 'bongmeow/avatars'
            url = await uploadImage(dataUri, folder)
        } else {
            const ext = LOCAL_EXT[file.type]
            if (!ext) return NextResponse.json({ error: 'Định dạng ảnh không hỗ trợ (dùng PNG/JPG/WebP/GIF)' }, { status: 400 })
            const sub = type === 'cover' ? 'covers' : 'avatars'
            const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`
            const dir = path.join(process.cwd(), 'public', 'uploads', sub)
            await mkdir(dir, { recursive: true })
            await writeFile(path.join(dir, name), bytes)
            url = `/uploads/${sub}/${name}`
        }

        return NextResponse.json({ success: true, url })
    } catch (e) {
        console.error('Upload error:', e)
        return NextResponse.json({ error: 'Lỗi upload' }, { status: 500 })
    }
}
