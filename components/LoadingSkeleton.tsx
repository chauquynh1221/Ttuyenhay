export function SkeletonCard() {
    return (
        <div className="card overflow-hidden">
            <div className="aspect-[2/3] skeleton" />
            <div className="p-2 space-y-1.5">
                <div className="h-3 skeleton rounded w-4/5" />
                <div className="h-3 skeleton rounded w-2/3" />
                <div className="h-2.5 skeleton rounded w-1/2" />
            </div>
        </div>
    )
}

export function SkeletonListItem() {
    return (
        <div className="flex gap-3 p-3">
            <div className="w-12 h-16 skeleton rounded flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 skeleton rounded w-4/5" />
                <div className="h-3 skeleton rounded w-3/5" />
                <div className="h-2.5 skeleton rounded w-2/5" />
            </div>
        </div>
    )
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className={`h-3 skeleton rounded ${i === lines - 1 ? 'w-3/5' : 'w-full'}`} />
            ))}
        </div>
    )
}
