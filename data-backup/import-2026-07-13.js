// Xóa data giả + import 85 truyện đam mỹ thật
const mongoose = require('c:/code/truyen full/truyenfull-clone/node_modules/mongoose')
const fs = require('fs')

const URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

const GENRE_DESCRIPTIONS = {
  'Đam Mỹ': 'Truyện tình cảm nam x nam',
  'Đoản Văn': 'Truyện ngắn, đọc nhanh trong một lần',
  'ABO': 'Thế giới quan Alpha - Beta - Omega',
  'Xuyên Không': 'Nhân vật chính xuyên đến thế giới khác',
  'Xuyên Thư': 'Xuyên vào trong tiểu thuyết, sách truyện',
  'Hệ Thống': 'Nhân vật chính mang theo hệ thống nhiệm vụ',
  'Cổ Đại': 'Bối cảnh cổ trang, cung đình, giang hồ',
  'Hiện Đại': 'Bối cảnh đô thị hiện đại',
  'Tu Tiên': 'Tu chân luyện đạo, phi thăng thành tiên',
  'Giới Giải Trí': 'Showbiz, minh tinh, phim ảnh',
  'Học Đường': 'Thanh xuân vườn trường, ký túc xá',
  'Hắc Bang': 'Xã hội đen, thế giới ngầm',
  'Mạt Thế': 'Tận thế, sinh tồn, tang thi',
  'Linh Dị': 'Ma quỷ, tâm linh, kỳ bí',
  'Trọng Sinh': 'Sống lại, làm lại cuộc đời',
  'Tổng Tài': 'Chủ tịch, giám đốc, giới thương trường',
  'Chủ Công': 'Truyện kể từ góc nhìn của công',
}

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

async function main() {
  const stories = JSON.parse(fs.readFileSync('stories.json', 'utf8'))
  await mongoose.connect(URI)
  const db = mongoose.connection.db

  // ===== 1. XÓA DATA GIẢ =====
  console.log('=== XÓA DATA GIẢ ===')
  for (const col of ['truyens', 'chapters', 'genres', 'ratings', 'follows', 'comments', 'chapterreports']) {
    const r = await db.collection(col).deleteMany({})
    console.log(`${col}: xóa ${r.deletedCount}`)
  }
  const ur = await db.collection('users').updateMany({}, { $set: { bookmarks: [], readingHistory: [] } })
  console.log(`users: dọn bookmarks/readingHistory của ${ur.modifiedCount} tài khoản (giữ nguyên tài khoản)`)

  // ===== 2. TẠO THỂ LOẠI =====
  const genreSet = new Set()
  stories.forEach(s => s.genres.forEach(g => genreSet.add(g)))
  const now = new Date()
  const genreDocs = [...genreSet].map(name => ({
    name,
    slug: slugify(name),
    description: GENRE_DESCRIPTIONS[name] || '',
    createdAt: now,
    updatedAt: now,
  }))
  await db.collection('genres').insertMany(genreDocs)
  console.log(`\n=== TẠO ${genreDocs.length} THỂ LOẠI ===`)
  console.log([...genreSet].join(', '))

  // ===== 3. IMPORT TRUYỆN + CHƯƠNG =====
  console.log('\n=== IMPORT TRUYỆN ===')
  let chTotal = 0
  for (const s of stories) {
    const date = new Date(s.sourceModified + 'T12:00:00Z')
    const truyenDoc = {
      title: s.title,
      slug: s.slug,
      author: s.author,
      description: s.description,
      genres: s.genres,
      status: 'completed',
      views: 0,
      rating: 0,
      reviewCount: 0,
      totalChapters: s.chapters.length,
      isHot: false,
      isFull: true,
      isNew: true,
      createdAt: date,
      updatedAt: date,
    }
    const ins = await db.collection('truyens').insertOne(truyenDoc)
    const chapterDocs = s.chapters.map((c, i) => ({
      truyenId: ins.insertedId,
      chapterNumber: i + 1,
      title: c.title,
      content: c.content,
      wordCount: c.content.trim().split(/\s+/).length,
      views: 0,
      createdAt: date,
      updatedAt: date,
    }))
    await db.collection('chapters').insertMany(chapterDocs)
    chTotal += chapterDocs.length
  }
  console.log(`Đã import ${stories.length} truyện, ${chTotal} chương`)

  // ===== 4. KIỂM TRA =====
  console.log('\n=== KIỂM TRA SAU IMPORT ===')
  for (const col of ['truyens', 'chapters', 'genres', 'users']) {
    console.log(`${col}: ${await db.collection(col).countDocuments()}`)
  }
  // slug trùng?
  const dupSlugs = await db.collection('truyens').aggregate([
    { $group: { _id: '$slug', n: { $sum: 1 } } }, { $match: { n: { $gt: 1 } } },
  ]).toArray()
  console.log('slug trùng:', dupSlugs.length)
  // chương mồ côi?
  const sample = await db.collection('truyens').findOne({ slug: 'doi-tuong-ket-hon-la-tinh-dich-tu-nho' })
  const sampleCh = await db.collection('chapters').countDocuments({ truyenId: sample._id })
  console.log(`mẫu "${sample.title}": totalChapters=${sample.totalChapters}, chương thực tế=${sampleCh}`)

  await mongoose.disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
