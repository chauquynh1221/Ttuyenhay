import Navigation from './Navigation'

interface Genre {
  _id: string
  name: string
  slug: string
}

async function getGenres(): Promise<Genre[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/genres`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      console.error('Failed to fetch genres')
      return []
    }

    const data = await res.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

export default async function NavigationWrapper() {
  const genres = await getGenres()

  return <Navigation genres={genres} />
}
