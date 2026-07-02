import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Điều khoản sử dụng' }

export default function Page() {
  return (
    <LegalPage
      title="Điều khoản sử dụng"
      sections={[
        { heading: '1. Chấp nhận điều khoản', body: 'Khi truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.' },
        { heading: '2. Nội dung', body: 'Website là nền tảng đọc truyện phi lợi nhuận phục vụ mục đích học tập, giải trí. Bản quyền nội dung thuộc về tác giả. Chúng tôi không sở hữu các tác phẩm được đăng tải.' },
        { heading: '3. Tài khoản người dùng', body: 'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình và mọi hoạt động phát sinh từ tài khoản. Vui lòng thông báo nếu phát hiện truy cập trái phép.' },
        { heading: '4. Hành vi bị cấm', body: 'Nghiêm cấm đăng tải nội dung vi phạm pháp luật, spam, hoặc gây ảnh hưởng tới hoạt động của hệ thống và người dùng khác.' },
        { heading: '5. Thay đổi điều khoản', body: 'Chúng tôi có thể cập nhật điều khoản bất kỳ lúc nào. Việc tiếp tục sử dụng đồng nghĩa với việc bạn chấp nhận các thay đổi.' },
      ]}
    />
  )
}
