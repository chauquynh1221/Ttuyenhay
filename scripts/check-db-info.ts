import { config } from 'dotenv'
// Nạp MONGODB_URI từ .env.local / .env (KHÔNG hardcode credentials)
config({ path: '.env.local' })
config({ path: '.env' })

import mongoose from 'mongoose'
import Truyen from '../models/Truyen'
import Chapter from '../models/Chapter'
import Genre from '../models/Genre'

async function main() {
  console.log('🔌 MongoDB Connection String:')
  console.log(`   ${process.env.MONGODB_URI}`)
  console.log('')

  await mongoose.connect(process.env.MONGODB_URI!)

  console.log('✅ Connected to MongoDB')
  console.log(`   Database name: ${mongoose.connection.db.databaseName}`)
  console.log('')

  // Get collections
  const collections = await mongoose.connection.db.listCollections().toArray()
  console.log('📂 Collections:')
  collections.forEach(col => console.log(`   - ${col.name}`))
  console.log('')

  // Count documents
  const truyenCount = await Truyen.countDocuments()
  const chapterCount = await Chapter.countDocuments()
  const genreCount = await Genre.countDocuments()

  console.log('📊 Document counts:')
  console.log(`   Truyen (stories): ${truyenCount}`)
  console.log(`   Chapters: ${chapterCount}`)
  console.log(`   Genres: ${genreCount}`)
  console.log('')

  // Sample data
  const sampleTruyen = await Truyen.findOne().lean()
  if (sampleTruyen) {
    console.log('📖 Sample Truyen:')
    console.log(`   Title: ${sampleTruyen.title}`)
    console.log(`   Slug: ${sampleTruyen.slug}`)
    console.log(`   ID: ${sampleTruyen._id}`)
  }

  await mongoose.connection.close()
}

main().catch(console.error)
