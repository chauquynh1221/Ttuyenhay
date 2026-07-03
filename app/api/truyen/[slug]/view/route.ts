import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

// POST /api/truyen/[slug]/view — tăng lượt xem, dedupe theo cookie (6 giờ) để chống bơm view khi refresh.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const cookieName = `vw_${slug}`.slice(0, 60)
        if (req.cookies.get(cookieName)) {
            return NextResponse.json({ success: true, counted: false })
        }

        await dbConnect()
        await Truyen.updateOne({ slug }, { $inc: { views: 1 } })

        const res = NextResponse.json({ success: true, counted: true })
        res.cookies.set(cookieName, '1', {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 6 * 60 * 60, // 6 giờ
            path: '/',
        })
        return res
    } catch {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
