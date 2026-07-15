import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import { escapeRegex, clampLimit, parsePage } from '@/lib/apiHelpers'

// Kết quả trả về giống hệt payload cũ của /api/truyen & /api/search
export interface TruyenListResult {
  data: any[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

function str(v: unknown): string | null {
  return v == null ? null : String(v)
}

// Chuyển lean docs (có ObjectId/Date) thành plain object thuần — an toàn để truyền vào Client Component
function serialize(docs: any[]): any[] {
  return JSON.parse(JSON.stringify(docs))
}

interface QueryTruyenOpts {
  page?: string | number | null
  limit?: string | number | null
  genre?: string | null
  status?: string | null
  isHot?: string | boolean | null
  isFull?: string | boolean | null
  isNew?: string | boolean | null
  sort?: string | null
  order?: string | null
  since?: string | null
}

// Query danh sách truyện THẲNG DB (thay cho việc tự fetch /api/truyen qua HTTP).
// Dùng được ở Server Component (không cần base URL) → không lỗi trên Vercel + nhanh hơn.
export async function queryTruyen(opts: QueryTruyenOpts = {}): Promise<TruyenListResult> {
  await dbConnect()
  const page = parsePage(str(opts.page))
  const limit = clampLimit(str(opts.limit))
  const sort = str(opts.sort) || 'updatedAt'
  const order = str(opts.order) || 'desc'

  const query: any = {}
  if (opts.genre) query.genres = opts.genre
  if (opts.status) query.status = opts.status
  if (opts.isHot === true || opts.isHot === 'true') query.isHot = true
  if (opts.isFull === true || opts.isFull === 'true') query.isFull = true
  if (opts.isNew === true || opts.isNew === 'true') query.isNew = true
  if (opts.since) query.updatedAt = { $gte: new Date(opts.since) }

  const sortObj: any = {}
  const sortField = sort.startsWith('-') ? sort.slice(1) : sort
  sortObj[sortField] = order === 'desc' ? -1 : 1

  const skip = (page - 1) * limit
  const [truyen, total] = await Promise.all([
    Truyen.find(query).sort(sortObj).limit(limit).skip(skip).select('-__v').lean(),
    Truyen.countDocuments(query),
  ])

  return {
    data: serialize(truyen),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }
}

interface SearchTruyenOpts {
  q?: string | null
  genre?: string | null
  status?: string | null
  sort?: string | null
  page?: string | number | null
  limit?: string | number | null
}

// Tìm kiếm truyện THẲNG DB (thay cho việc tự fetch /api/search qua HTTP).
export async function searchTruyen(opts: SearchTruyenOpts = {}): Promise<TruyenListResult> {
  await dbConnect()
  const q = (str(opts.q) || '').trim()
  const genre = str(opts.genre) || ''
  const status = str(opts.status) || ''
  const sort = str(opts.sort) || 'relevance'
  const page = parsePage(str(opts.page))
  const limit = clampLimit(str(opts.limit))
  const skip = (page - 1) * limit

  const filter: any = {}
  if (q) {
    // Cho phép tìm cả có dấu lẫn không dấu
    const normalized = q.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
    const patterns = [...new Set([normalized, q])].map(escapeRegex)
    filter.$or = patterns.flatMap((p: string) => [
      { title: { $regex: p, $options: 'i' } },
      { author: { $regex: p, $options: 'i' } },
    ])
  }
  if (genre) filter.genres = { $in: [genre] }
  if (status === 'full') filter.isFull = true
  else if (status === 'ongoing') filter.isFull = { $ne: true }

  let sortQuery: any = { views: -1 }
  if (sort === 'newest') sortQuery = { createdAt: -1 }
  else if (sort === 'updated') sortQuery = { updatedAt: -1 }
  else if (sort === 'chapters') sortQuery = { totalChapters: -1 }
  else if (sort === 'rating') sortQuery = { rating: -1 }

  const [truyen, total] = await Promise.all([
    Truyen.find(filter).sort(sortQuery).limit(limit).skip(skip).select('-__v').lean(),
    Truyen.countDocuments(filter),
  ])

  return {
    data: serialize(truyen),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }
}
