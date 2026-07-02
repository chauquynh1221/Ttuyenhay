import Mascot from '@/components/Mascot'

export default function Loading() {
  return (
    <div className="container py-6">
      <div className="flex flex-col items-center justify-center py-6 mb-2">
        <Mascot pose="read" className="w-20 h-20 anim-float" />
        <span className="mt-1 text-sm text-muted font-medium">Đang lật trang, meo~</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {[0, 1].map((s) => (
            <div key={s} className="mb-8">
              <div className="h-6 w-40 skeleton mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="book-cover skeleton" />
                    <div className="h-4 w-full skeleton mt-2" />
                    <div className="h-3 w-2/3 skeleton mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[320px] space-y-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-64 skeleton rounded-lg" />)}
        </div>
      </div>
    </div>
  )
}
