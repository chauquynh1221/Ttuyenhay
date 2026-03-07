import Link from 'next/link'

interface TruyenItem {
  id: string
  title: string
  slug: string
  views?: number
  rating?: number
}

interface SidebarProps {
  topDaily?: TruyenItem[]
  topMonthly?: TruyenItem[]
  topAllTime?: TruyenItem[]
}

// Rank number colors: 1=đỏ, 2=cam, 3=vàng, còn lại = xám
function RankNumber({ n }: { n: number }) {
  const colors = ['#C0392B', '#D35400', '#D4AC0D']
  const color = n <= 3 ? colors[n - 1] : '#AAAAAA'
  return (
    <span className="w-6 text-center font-bold text-sm flex-shrink-0" style={{ color }}>
      {n}
    </span>
  )
}

function TopList({ items, showRating }: { items: TruyenItem[]; showRating?: boolean }) {
  if (items.length === 0) {
    return <div className="px-4 py-5 text-center text-sm text-[#AAA]">Đang cập nhật...</div>
  }
  return (
    <div>
      {items.map((truyen, index) => (
        <div
          key={truyen.id}
          className="flex items-start gap-2.5 px-3.5 py-2.5 border-b border-[#EEE9E0] last:border-b-0 hover:bg-[#F8F7F5] transition-colors"
        >
          <RankNumber n={index + 1} />
          <div className="flex-1 min-w-0">
            <Link
              href={`/truyen/${truyen.slug}`}
              className="block text-[13px] font-medium text-[#1C1C1C] hover:text-[#C0392B] line-clamp-2 leading-snug mb-0.5 transition-colors"
            >
              {truyen.title}
            </Link>
            {showRating && truyen.rating ? (
              <div className="text-[11px] text-[#AAA]">⭐ {truyen.rating.toFixed(1)}/10</div>
            ) : truyen.views ? (
              <div className="text-[11px] text-[#AAA]">{truyen.views.toLocaleString()} lượt xem</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function SidebarBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden shadow-sm">
      <div className="title-list mx-0 mb-0 rounded-none border-l-0 border-b border-[#E5E0D8]"
        style={{ borderLeft: '3px solid #C0392B', borderRadius: '0' }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default function Sidebar({ topDaily = [], topMonthly = [], topAllTime = [] }: SidebarProps) {
  return (
    <div className="space-y-4">
      <SidebarBox title="TOP NGÀY">
        <TopList items={topDaily} />
      </SidebarBox>

      <SidebarBox title="TOP THÁNG">
        <TopList items={topMonthly} />
      </SidebarBox>

      <SidebarBox title="TOP ALL TIME">
        <TopList items={topAllTime} showRating />
      </SidebarBox>

      {/* Quảng cáo placeholder */}
      <div className="bg-[#F8F7F5] border border-[#E5E0D8] rounded-lg p-4 text-center">
        <div className="text-xs text-[#AAA] uppercase tracking-wider mb-1">Quảng cáo</div>
        <div className="text-xs text-[#CCC]">Vị trí quảng cáo 300×250</div>
      </div>
    </div>
  )
}
