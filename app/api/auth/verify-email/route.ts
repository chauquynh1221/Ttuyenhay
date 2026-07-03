import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// GET /api/auth/verify-email?token=... — xác thực email rồi redirect về trang chủ
export async function GET(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const token = req.nextUrl.searchParams.get('token')
    if (!token) return NextResponse.redirect(`${baseUrl}/?verify=invalid`)

    try {
        await dbConnect()
        const user = await User.findOne({ emailVerifyToken: token, emailVerifyExpires: { $gt: new Date() } })
        if (!user) return NextResponse.redirect(`${baseUrl}/?verify=invalid`)

        user.emailVerified = true
        user.emailVerifyToken = undefined
        user.emailVerifyExpires = undefined
        await user.save()

        return NextResponse.redirect(`${baseUrl}/?verify=success`)
    } catch {
        return NextResponse.redirect(`${baseUrl}/?verify=error`)
    }
}
