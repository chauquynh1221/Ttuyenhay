import Breadcrumb from '@/components/Breadcrumb'

export const metadata = { title: 'Góp ý - Báo lỗi' }

export default function GopYPage() {
  return (
    <div className="container py-6 max-w-3xl">
      <Breadcrumb items={[{ label: 'Góp ý - Báo lỗi' }]} />
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Góp ý &amp; Báo lỗi</h1>
        <p className="text-muted mb-6">
          Bạn phát hiện chương lỗi, thiếu nội dung, hay có ý tưởng giúp website tốt hơn? Hãy cho chúng tôi biết.
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-surface-2 border border-border rounded-lg">
            <span className="text-2xl">📧</span>
            <div>
              <div className="font-semibold text-foreground">Email</div>
              <a href="mailto:contact@truyenfull.example" className="text-primary hover:underline text-sm">contact@truyenfull.example</a>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-surface-2 border border-border rounded-lg">
            <span className="text-2xl">🐞</span>
            <div>
              <div className="font-semibold text-foreground">Báo lỗi chương</div>
              <p className="text-sm text-muted">Dùng nút <b className="text-foreground">Báo lỗi</b> ngay trong trang đọc chương để gửi nhanh nhất — chúng tôi sẽ nhận đúng chương bạn đang đọc.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-surface-2 border border-border rounded-lg">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-foreground">Đề xuất tính năng</div>
              <p className="text-sm text-muted">Mọi góp ý về giao diện, tính năng đều được hoan nghênh. Gửi qua email ở trên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
