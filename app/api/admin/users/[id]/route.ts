import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await dbConnect()
    const { id } = await params
    const { role } = await req.json()
    if (!['admin', 'user'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ success: true, user })
}
