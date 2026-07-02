import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-[13px] text-muted mb-4 overflow-x-auto no-scrollbar">
      <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">Trang chủ</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1 min-w-0">
          <span className="text-muted-2 px-0.5">›</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors whitespace-nowrap">{item.label}</Link>
          ) : (
            <span className="text-foreground font-medium truncate">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
