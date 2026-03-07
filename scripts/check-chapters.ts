process.env.MONGODB_URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

import mongoose from 'mongoose'
import Chapter from '../models/Chapter'

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!)

  const total = await Chapter.countDocuments()
  const withContent = await Chapter.countDocuments({
    content: { $exists: true, $ne: '' },
    $expr: { $gt: [{ $strLenCP: "$content" }, 100] }
  })

  console.log('📊 Chapter Statistics:')
  console.log(`   Total chapters: ${total}`)
  console.log(`   Chapters with content (>100 chars): ${withContent}`)

  // Get sample chapter
  const sample = await Chapter.findOne({ content: { $exists: true, $ne: '' } })
    .select('truyenId chapterNumber title content')
    .lean()

  if (sample) {
    console.log(`\n📖 Sample chapter:`)
    console.log(`   Chapter ${sample.chapterNumber}: ${sample.title}`)
    console.log(`   Content length: ${sample.content?.length || 0} characters`)
    console.log(`   First 200 chars: ${sample.content?.substring(0, 200)}...`)
  }

  await mongoose.connection.close()
}

main().catch(console.error)
