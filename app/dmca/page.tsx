import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'DMCA' }

export default function Page() {
  return (
    <LegalPage
      title="Thông báo DMCA"
      sections={[
        { heading: 'Tôn trọng bản quyền', body: 'Chúng tôi tôn trọng quyền sở hữu trí tuệ của người khác và yêu cầu người dùng cũng làm như vậy.' },
        { heading: 'Gỡ bỏ nội dung vi phạm', body: 'Nếu bạn là chủ sở hữu bản quyền và cho rằng một nội dung trên website vi phạm quyền của mình, vui lòng gửi yêu cầu gỡ bỏ kèm: thông tin tác phẩm, đường dẫn vi phạm, và bằng chứng quyền sở hữu.' },
        { heading: 'Liên hệ', body: 'Gửi yêu cầu DMCA tới email: contact@truyenfull.example. Chúng tôi sẽ xử lý và gỡ bỏ nội dung hợp lệ trong thời gian sớm nhất.' },
      ]}
    />
  )
}
