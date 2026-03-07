process.env.MONGODB_URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

import mongoose from 'mongoose'
import Truyen from '../models/Truyen'

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!)

  const slug = 'ta-thau-ao-ca-sau-lai-cau-duoc-ca-to-tong-loai-ca'

  console.log(`🔍 Tìm truyện với slug: ${slug}\n`)

  const truyen = await Truyen.findOne({ slug }).lean()

  if (truyen) {
    console.log('✅ Tìm thấy truyện:')
    console.log(`   Title: ${truyen.title}`)
    console.log(`   Slug: ${truyen.slug}`)
    console.log(`   ID: ${truyen._id}`)
  } else {
    console.log('❌ Không tìm thấy truyện')

    // List all stories
    const allStories = await Truyen.find().select('title slug').limit(10).lean()
    console.log('\n📚 10 truyện đầu tiên trong database:')
    allStories.forEach(s => {
      console.log(`   - ${s.title} (${s.slug})`)
    })
  }

  await mongoose.connection.close()
}

main().catch(console.error)
