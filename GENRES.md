# Hướng dẫn quản lý thể loại (Genres)

## Tổng quan

Hệ thống thể loại đã được cải tiến để lấy dữ liệu từ database thay vì hard-code, giúp dễ dàng quản lý và mở rộng.

## Cấu trúc

### Database Model
- **File**: `models/Genre.ts`
- **Schema**:
  - `name`: Tên thể loại (VD: "Tiên Hiệp")
  - `slug`: URL-friendly slug (VD: "tien-hiep")
  - `description`: Mô tả thể loại (optional)
  - `createdAt`, `updatedAt`: Timestamps

### API Endpoints
- **GET** `/api/genres`: Lấy danh sách tất cả thể loại
- **POST** `/api/genres`: Tạo thể loại mới

### Components
1. **NavigationWrapper** (`components/NavigationWrapper.tsx`):
   - Server component fetch dữ liệu thể loại
   - Truyền data xuống Navigation component

2. **Navigation** (`components/Navigation.tsx`):
   - Client component hiển thị menu dropdown
   - Nhận `genres` từ props thay vì hard-code

3. **GenrePageClient** (`app/the-loai/[genre]/GenrePage.tsx`):
   - Client component xử lý sắp xếp
   - Tùy chọn: Mới cập nhật, Mới đăng, Lượt xem, Đánh giá

### Utilities
- **slugify** (`lib/slugify.ts`):
  - Chuyển đổi text tiếng Việt thành slug
  - Xử lý dấu tiếng Việt đúng cách
  - VD: "Tiên Hiệp" → "tien-hiep"

## Quản lý thể loại

### Thêm thể loại mới

#### Cách 1: Sử dụng script seed
```bash
# Chỉnh sửa file scripts/seed-genres.ts
# Thêm thể loại mới vào mảng genres
# Chạy lại script
npm run seed-genres
```

#### Cách 2: Sử dụng API
```bash
curl -X POST http://localhost:3000/api/genres \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tên thể loại",
    "slug": "ten-the-loai",
    "description": "Mô tả thể loại"
  }'
```

### Xem danh sách thể loại
```bash
curl http://localhost:3000/api/genres
```

## Tính năng

### 1. Dynamic Genre List
- Thể loại được load từ database
- Tự động cập nhật khi thêm/xóa/sửa trong DB
- Không cần restart server

### 2. SEO-friendly URLs
- Sử dụng slug thay vì tên có dấu
- VD: `/the-loai/tien-hiep` thay vì `/the-loai/Tiên Hiệp`

### 3. Sorting trong trang thể loại
- Mới cập nhật (updatedAt)
- Mới đăng (createdAt)
- Lượt xem (views)
- Đánh giá (rating)

### 4. Vietnamese Slug Support
- Chuyển đổi dấu tiếng Việt sang ASCII
- Xử lý ký tự đặc biệt
- Giữ tính nhất quán trong toàn bộ hệ thống

## Cấu trúc URL

```
/the-loai/[slug]              → Trang thể loại
/the-loai/[slug]?page=2       → Phân trang
/the-loai/[slug]?sort=views   → Sắp xếp theo lượt xem
/the-loai/[slug]?page=2&sort=rating → Kết hợp
```

## Danh sách thể loại hiện tại

40 thể loại đã được seed:
- Tiên Hiệp, Kiếm Hiệp, Ngôn Tình, Đô Thị, Huyền Huyễn
- Xuyên Không, Trọng Sinh, Cung Đấu, Nữ Cường, Điền Văn
- Đam Mỹ, Bách Hợp, Hài Hước, Trinh Thám, Võng Du
- Khoa Huyễn, Hệ Thống, Linh Dị, Quân Sự, Lịch Sử
- Đồng Nhân, Nữ Phụ, Cổ Đại, Học Đường, Gia Đấu
- Sủng, Hắc Bang, Dị Giới, Dị Năng, Huyết Tộc
- Mạt Thế, Quan Trường, Sắc, Tu Chân, Dã Sử
- Anime, Viễn Tưởng, Cạnh Kỹ, Sưu Tầm, Truyện Teen

## Lưu ý khi phát triển

1. **Luôn sử dụng hàm slugify** khi tạo slug từ tên thể loại
2. **Cache API response** để giảm tải database (NavigationWrapper đã cache 1 giờ)
3. **Validate slug** khi nhận từ URL params
4. **Fallback** khi không tìm thấy thể loại trong DB
