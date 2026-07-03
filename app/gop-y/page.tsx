import Breadcrumb from '@/components/Breadcrumb'
import GopYForm from './GopYForm'

export const metadata = { title: 'Góp ý - Báo lỗi' }

export default function GopYPage() {
  return (
    <div className="container py-6 max-w-3xl">
      <Breadcrumb items={[{ label: 'Góp ý - Báo lỗi' }]} />
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Góp ý &amp; Báo lỗi</h1>
        <p className="text-muted mb-6">
          Bạn phát hiện lỗi, thiếu nội dung, hay có ý tưởng giúp website tốt hơn? Hãy cho chúng tôi biết.
        </p>

        <GopYForm />

        <div className="mt-6 pt-6 border-t border-border flex items-start gap-3 p-4 bg-surface-2 border border-border rounded-lg">
          <span className="text-2xl">🐞</span>
          <div>
            <div className="font-semibold text-foreground">Báo lỗi chương cụ thể</div>
            <p className="text-sm text-muted">Dùng nút <b className="text-foreground">Báo lỗi</b> ngay trong trang đọc chương để gửi nhanh nhất — chúng tôi sẽ nhận đúng chương bạn đang đọc.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
