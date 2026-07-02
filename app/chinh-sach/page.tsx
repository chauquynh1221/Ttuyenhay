import LegalPage from '@/components/LegalPage'

export const metadata = { title: 'Chính sách bảo mật' }

export default function Page() {
  return (
    <LegalPage
      title="Chính sách bảo mật"
      sections={[
        { heading: '1. Thông tin thu thập', body: 'Chúng tôi thu thập email, tên hiển thị khi bạn đăng ký, cùng dữ liệu sử dụng như lịch sử đọc và tủ truyện để phục vụ trải nghiệm cá nhân hóa.' },
        { heading: '2. Mục đích sử dụng', body: 'Thông tin được dùng để xác thực tài khoản, lưu tiến trình đọc, đề xuất truyện phù hợp và cải thiện dịch vụ. Chúng tôi không bán dữ liệu cá nhân cho bên thứ ba.' },
        { heading: '3. Cookie', body: 'Website dùng cookie để duy trì đăng nhập và ghi nhớ tùy chọn hiển thị (giao diện sáng/tối, cài đặt đọc). Bạn có thể tắt cookie trong trình duyệt.' },
        { heading: '4. Bảo mật dữ liệu', body: 'Mật khẩu được mã hóa, phiên đăng nhập dùng cookie an toàn. Tuy nhiên không hệ thống nào an toàn tuyệt đối, hãy dùng mật khẩu mạnh.' },
        { heading: '5. Quyền của bạn', body: 'Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình bằng cách liên hệ qua trang Góp ý.' },
      ]}
    />
  )
}
