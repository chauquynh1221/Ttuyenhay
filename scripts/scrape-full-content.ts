// Set environment variables FIRST before any imports
process.env.MONGODB_URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

import mongoose from 'mongoose'
import Truyen from '../models/Truyen'
import Chapter from '../models/Chapter'

// Utility function to delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Function to fetch HTML content with retry logic
async function fetchHTML(url: string, retries = 3): Promise<string> {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers })

      if (response.status === 503) {
        // Rate limited - wait longer before retry
        const waitTime = (i + 1) * 5000 // 5s, 10s, 15s
        console.log(`   ⏳ Rate limited, waiting ${waitTime/1000}s before retry ${i+1}/${retries}...`)
        await delay(waitTime)
        continue
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.text()
    } catch (error) {
      if (i === retries - 1) {
        console.error(`   ❌ Error fetching ${url}:`, error)
        return ''
      }
      // Wait before retry
      await delay((i + 1) * 2000)
    }
  }

  return ''
}

// Parse chapter list from story page
function parseChapterList(html: string): { number: number; title: string; url: string }[] {
  const chapters: { number: number; title: string; url: string }[] = []

  // Find all chapter links - truyenfull uses simple <a href="...chuong-X...">Chương X</a>
  const chapterRegex = /<a[^>]*href="([^"]*\/chuong-\d+\/?[^"]*)"[^>]*>(.*?)<\/a>/gi
  const matches = [...html.matchAll(chapterRegex)]

  for (let i = 0; i < matches.length; i++) {
    const url = matches[i][1]
    const title = matches[i][2].replace(/<[^>]*>/g, '').trim()

    // Extract chapter number from URL
    const chapterNumberMatch = url.match(/chuong-(\d+)/i)
    const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1]) : i + 1

    chapters.push({
      number: chapterNumber,
      title: title,
      url: url.startsWith('http') ? url : `https://truyenfull.vision${url}`
    })
  }

  return chapters
}

// Parse chapter content from chapter page
function parseChapterContent(html: string): string {
  // Find content using regex to handle multiple class names
  // Look for <div class="..." where classes include "chapter-c"
  const divRegex = /<div[^>]*class="[^"]*chapter-c[^"]*"[^>]*>/i
  const match = html.match(divRegex)

  if (!match) {
    return ''
  }

  const startMarker = match[0]
  const startIndex = html.indexOf(startMarker)

  if (startIndex === -1) {
    return ''
  }

  // Find the matching closing </div>
  let depth = 1
  let currentIndex = startIndex + startMarker.length
  let endIndex = -1

  while (currentIndex < html.length && depth > 0) {
    const nextOpenIndex = html.indexOf('<div', currentIndex)
    const nextCloseIndex = html.indexOf('</div>', currentIndex)

    if (nextCloseIndex === -1) break

    if (nextOpenIndex !== -1 && nextOpenIndex < nextCloseIndex) {
      depth++
      currentIndex = nextOpenIndex + 4
    } else {
      depth--
      if (depth === 0) {
        endIndex = nextCloseIndex
        break
      }
      currentIndex = nextCloseIndex + 6
    }
  }

  if (endIndex === -1) {
    return ''
  }

  let content = html.substring(startIndex + startMarker.length, endIndex)

  // Clean up HTML
  content = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<hr[^>]*>/gi, '\n\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/gi, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()

  return content
}

// Scrape all chapters for a story
async function scrapeStory(truyen: any) {
  console.log(`\n📖 Scraping: ${truyen.title}`)
  console.log(`   Slug: ${truyen.slug}`)

  // Construct story URL
  const storyUrl = `https://truyenfull.vision/${truyen.slug}/`
  console.log(`   URL: ${storyUrl}`)

  // Fetch story page to get chapter list
  console.log(`   Fetching story page...`)
  const storyHtml = await fetchHTML(storyUrl)

  if (!storyHtml) {
    console.log(`   ❌ Failed to fetch story page`)
    return
  }

  // Parse chapter list
  const chapterList = parseChapterList(storyHtml)
  console.log(`   Found ${chapterList.length} chapters`)

  if (chapterList.length === 0) {
    console.log(`   ⚠️  No chapters found, skipping...`)
    return
  }

  // Check existing chapters
  const existingChapters = await Chapter.find({ truyenId: truyen._id })
  const existingChapterNumbers = new Set(existingChapters.map(c => c.chapterNumber))

  // Scrape each chapter
  let scrapedCount = 0
  let skippedCount = 0

  for (let i = 0; i < chapterList.length; i++) {
    const chapterInfo = chapterList[i]

    // Skip if chapter already exists with content
    if (existingChapterNumbers.has(chapterInfo.number)) {
      const existing = existingChapters.find(c => c.chapterNumber === chapterInfo.number)
      if (existing && existing.content && existing.content.length > 100) {
        skippedCount++
        if (i % 50 === 0) {
          console.log(`   Progress: ${i + 1}/${chapterList.length} (${skippedCount} skipped, ${scrapedCount} scraped)`)
        }
        continue
      }
    }

    // Fetch chapter content
    const chapterHtml = await fetchHTML(chapterInfo.url)

    if (!chapterHtml) {
      console.log(`   ⚠️  Failed to fetch chapter ${chapterInfo.number}`)
      continue
    }

    // Parse content
    const content = parseChapterContent(chapterHtml)

    if (!content || content.length < 50) {
      console.log(`   ⚠️  No content found for chapter ${chapterInfo.number}`)
      continue
    }

    // Calculate word count
    const wordCount = content.trim().split(/\s+/).length

    // Save or update chapter
    try {
      await Chapter.findOneAndUpdate(
        { truyenId: truyen._id, chapterNumber: chapterInfo.number },
        {
          truyenId: truyen._id,
          chapterNumber: chapterInfo.number,
          title: chapterInfo.title,
          content: content,
          wordCount: wordCount,
          views: 0
        },
        { upsert: true, new: true }
      )

      scrapedCount++

      // Log progress every 50 chapters
      if ((i + 1) % 50 === 0 || i === chapterList.length - 1) {
        console.log(`   Progress: ${i + 1}/${chapterList.length} (${skippedCount} skipped, ${scrapedCount} scraped)`)
      }

    } catch (error) {
      console.error(`   ❌ Error saving chapter ${chapterInfo.number}:`, error)
    }

    // Delay between requests to avoid overwhelming the server
    // Random delay between 2-4 seconds to appear more human-like
    const randomDelay = 2000 + Math.random() * 2000
    await delay(randomDelay)
  }

  // Update total chapters count
  await Truyen.findByIdAndUpdate(truyen._id, {
    totalChapters: chapterList.length
  })

  console.log(`   ✅ Completed: ${scrapedCount} chapters scraped, ${skippedCount} skipped`)
}

// Main function
async function main() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ Connected to MongoDB\n')

    // Get all stories
    const stories = await Truyen.find().sort({ createdAt: 1 }).lean()
    console.log(`📚 Found ${stories.length} stories to scrape\n`)

    if (stories.length === 0) {
      console.log('No stories found in database!')
      process.exit(0)
    }

    // Scrape each story
    for (let i = 0; i < stories.length; i++) {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`Story ${i + 1}/${stories.length}`)
      console.log('='.repeat(80))

      await scrapeStory(stories[i])

      // Delay between stories (longer to reduce rate limiting)
      await delay(5000) // 5 seconds between stories
    }

    console.log('\n' + '='.repeat(80))
    console.log('🎉 Scraping completed!')
    console.log('='.repeat(80))

    // Close connection
    await mongoose.connection.close()
    console.log('\n✅ Database connection closed')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()
