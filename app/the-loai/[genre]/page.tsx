import TruyenCard from '@/components/TruyenCard'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import Sidebar from '@/components/Sidebar'
import GenrePageClient from './GenrePage'
import dbConnect from '@/lib/mongodb'
import Genre from '@/models/Genre'

interface PageProps {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { genre: genreSlug } = await params
  const { page = '1', sort = 'updatedAt' } = await searchParams
  const currentPage = parseInt(page)

  // Fetch genre info from database
  await dbConnect()
  const genreDoc = await Genre.findOne({ slug: genreSlug }).lean()
  const genreName = genreDoc?.name || genreSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Fetch data from API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const sortParam = sort === 'rating' ? 'rating' : sort === 'views' ? 'views' : sort === 'createdAt' ? 'createdAt' : 'updatedAt'
  const res = await fetch(
    `${baseUrl}/api/truyen?genre=${encodeURIComponent(genreName)}&page=${page}&limit=20&sort=${sortParam}&order=desc`,
    { cache: 'no-store' }
  )

  let truyenData = { data: [], pagination: { pages: 1 } }
  if (res.ok) {
    const json = await res.json()
    if (json.success) {
      truyenData = json
    }
  }

  const mockData = {
    items: truyenData.data,
    totalPages: truyenData.pagination.pages,
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Breadcrumb items={[{ label: `Thể loại: ${genreName}` }]} />

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="title-list flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm sm:text-base">
            <span className="font-bold">THỂ LOẠI: {genreName.toUpperCase()}</span>
            <GenrePageClient genre={genreSlug} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6 my-6">
            {mockData.items.map((truyen) => (
              <TruyenCard key={truyen.id} {...truyen} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={mockData.totalPages}
            baseUrl={`/the-loai/${genreSlug}`}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-[27%]">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
