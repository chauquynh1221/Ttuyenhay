// Load env variables FIRST before any other imports
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local first, then .env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Now import everything else
import dbConnect from '../lib/mongodb'
import Truyen from '../models/Truyen'
import * as cheerio from 'cheerio'

async function scrapeImageUrl(slug: string): Promise<string | null> {
  try {
    const url = `https://truyenfull.vision/${slug}/`
    console.log(`Fetching image from: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Tìm ảnh cover - ưu tiên meta tag og:image
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('.book img').attr('src') ||
                   $('.books img').attr('src') ||
                   $('.book-cover img').attr('src') ||
                   $('.book-img img').attr('src')

    if (imageUrl) {
      // Nếu là relative URL, thêm domain
      if (imageUrl.startsWith('/')) {
        imageUrl = `https://truyenfull.vision${imageUrl}`
      }
      console.log(`Found image: ${imageUrl}`)
      return imageUrl
    }

    console.log(`No image found for ${slug}`)
    return null
  } catch (error) {
    console.error(`Error scraping image for ${slug}:`, error)
    return null
  }
}

async function updateImages() {
  try {
    await dbConnect()
    console.log('Connected to MongoDB')

    // Lấy tất cả truyện chưa có ảnh
    const truyens = await Truyen.find({
      $or: [
        { coverImage: { $exists: false } },
        { coverImage: null },
        { coverImage: '' }
      ]
    })

    console.log(`Found ${truyens.length} truyện without images`)

    for (const truyen of truyens) {
      console.log(`\nProcessing: ${truyen.title} (${truyen.slug})`)

      // Cào ảnh
      const imageUrl = await scrapeImageUrl(truyen.slug)

      if (imageUrl) {
        // Cập nhật vào database
        await Truyen.updateOne(
          { _id: truyen._id },
          { $set: { coverImage: imageUrl } }
        )
        console.log(`✓ Updated image for ${truyen.title}`)
      } else {
        console.log(`✗ No image found for ${truyen.title}`)
      }

      // Delay 1-2 giây để không bị block
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    }

    console.log('\n✓ Done!')
    process.exit(0)
  } catch (error) {
    console.error('Error updating images:', error)
    process.exit(1)
  }
}

updateImages()
