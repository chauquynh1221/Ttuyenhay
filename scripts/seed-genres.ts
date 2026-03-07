import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Genre from '../models/Genre'
import { slugify } from '../lib/slugify'

dotenv.config({ path: '.env.local' })

const genres = [
  'Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn',
  'Xuyên Không', 'Trọng Sinh', 'Cung Đấu', 'Nữ Cường', 'Điền Văn',
  'Đam Mỹ', 'Bách Hợp', 'Hài Hước', 'Trinh Thám', 'Võng Du',
  'Khoa Huyễn', 'Hệ Thống', 'Linh Dị', 'Quân Sự', 'Lịch Sử',
  'Đồng Nhân', 'Nữ Phụ', 'Cổ Đại', 'Học Đường', 'Gia Đấu',
  'Sủng', 'Hắc Bang', 'Dị Giới', 'Dị Năng', 'Huyết Tộc',
  'Mạt Thế', 'Quan Trường', 'Sắc', 'Tu Chân', 'Dã Sử',
  'Anime', 'Viễn Tưởng', 'Cạnh Kỹ', 'Sưu Tầm', 'Truyện Teen'
]

async function seedGenres() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing genres
    console.log('Clearing existing genres...')
    await Genre.deleteMany({})

    // Insert new genres
    console.log('Seeding genres...')
    const genreDocuments = genres.map(name => ({
      name,
      slug: slugify(name),
      description: `Thể loại ${name}`
    }))

    const result = await Genre.insertMany(genreDocuments)
    console.log(`✓ Successfully seeded ${result.length} genres`)

    // Display the seeded genres
    console.log('\nSeeded genres:')
    result.forEach(genre => {
      console.log(`  - ${genre.name} (${genre.slug})`)
    })

    await mongoose.connection.close()
    console.log('\nDatabase connection closed')
  } catch (error) {
    console.error('Error seeding genres:', error)
    process.exit(1)
  }
}

seedGenres()
