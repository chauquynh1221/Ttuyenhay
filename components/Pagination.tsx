import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

// FIX #7: Xóa window.innerWidth - không dùng được trong Server Component
// Luôn dùng 5 page buttons, responsive được xử lý bằng CSS (text nhỏ hơn)
export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Hỗ trợ cả 2 format baseUrl:
  //   '/danh-sach/truyen-hot'  → dùng ?page=N
  //   '/truyen/slug?'          → dùng &chapterPage=N (khi baseUrl kết thúc bằng '?')
  const getPageUrl = (page: number) => {
    if (baseUrl.endsWith('?')) {
      return `${baseUrl}chapterPage=${page}`
    }
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    // FIX #7: Bỏ window.innerWidth - luôn dùng maxVisible=5
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-6">
      <ul className="pagination text-xs sm:text-sm">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <li>
            <Link href={getPageUrl(currentPage - 1)} className="px-2 sm:px-3 py-1">
              <span className="hidden sm:inline">← Trước</span>
              <span className="sm:hidden">←</span>
            </Link>
          </li>
        ) : (
          <li className="opacity-50 cursor-not-allowed">
            <span className="px-2 sm:px-3 py-1">
              <span className="hidden sm:inline">← Trước</span>
              <span className="sm:hidden">←</span>
            </span>
          </li>
        )}

        {/* Page Numbers */}
        {renderPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-2 sm:px-3 py-1">...</span>
              </li>
            )
          }

          const pageNumber = page as number
          return (
            <li key={pageNumber} className={currentPage === pageNumber ? 'active' : ''}>
              <Link href={getPageUrl(pageNumber)} className="px-2 sm:px-3 py-1">
                {pageNumber}
              </Link>
            </li>
          )
        })}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <li>
            <Link href={getPageUrl(currentPage + 1)} className="px-2 sm:px-3 py-1">
              <span className="hidden sm:inline">Tiếp →</span>
              <span className="sm:hidden">→</span>
            </Link>
          </li>
        ) : (
          <li className="opacity-50 cursor-not-allowed">
            <span className="px-2 sm:px-3 py-1">
              <span className="hidden sm:inline">Tiếp →</span>
              <span className="sm:hidden">→</span>
            </span>
          </li>
        )}
      </ul>
    </div>
  )
}
