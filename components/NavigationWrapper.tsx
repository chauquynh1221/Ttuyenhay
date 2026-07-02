import Navigation from './Navigation'
import dbConnect from '@/lib/mongodb'
import GenreModel from '@/models/Genre'

interface GenreNav { _id: string; name: string; slug: string }

// Query DB trực tiếp (ổn định hơn fetch self-API khi SSR / trên Vercel).
async function getGenres(): Promise<GenreNav[]> {
  try {
    await dbConnect()
    const genres = await GenreModel.find({}).sort({ name: 1 }).select('name slug').lean() as any[]
    return genres.map((g) => ({ _id: g._id.toString(), name: g.name, slug: g.slug }))
  } catch (e) {
    console.error('Error fetching genres:', e)
    return []
  }
}

export default async function NavigationWrapper() {
  const genres = await getGenres()
  return <Navigation genres={genres} />
}
