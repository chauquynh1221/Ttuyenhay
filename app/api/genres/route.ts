import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Genre from '@/models/Genre'

// GET /api/genres - Get all genres
export async function GET() {
  try {
    await dbConnect()

    const genres = await Genre.find()
      .sort({ name: 1 })
      .select('-__v')
      .lean()

    return NextResponse.json({
      success: true,
      data: genres,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/genres - Create new genre
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const genre = await Genre.create(body)

    return NextResponse.json({
      success: true,
      data: genre,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
