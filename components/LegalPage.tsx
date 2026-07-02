import Breadcrumb from '@/components/Breadcrumb'

export default function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <div className="container py-6 max-w-3xl">
      <Breadcrumb items={[{ label: title }]} />
      <article className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-base font-bold text-foreground mb-2">{s.heading}</h2>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="text-xs text-muted-2 mt-8 pt-4 border-t border-border">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </p>
      </article>
    </div>
  )
}
