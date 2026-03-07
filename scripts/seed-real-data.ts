// Set environment variables FIRST before any imports
process.env.MONGODB_URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

import mongoose from 'mongoose'
import Truyen from '../models/Truyen'
import Chapter from '../models/Chapter'
import Genre from '../models/Genre'

// Real story data from truyenfull.vision
const realStories = [
  {
    title: "Mỹ Dung Sư Xuyên Qua Làm Nông Phụ Làm Giàu Nuôi Con",
    slug: "my-dung-su-xuyen-qua-lam-nong-phu-lam-giau-nuoi-con",
    author: "Unknown",
    url: "https://truyenfull.vision/my-dung-su-xuyen-qua-lam-nong-phu-lam-giau-nuoi-con",
    genres: ["Ngôn Tình", "Xuyên Không"],
  },
  {
    title: "Lưu Đày Thần Y Mang Theo Không Gian Chạy Nạn",
    slug: "luu-day-than-y-mang-theo-khong-gian-chay-nan",
    author: "Unknown",
    url: "https://truyenfull.vision/luu-day-than-y-mang-theo-khong-gian-chay-nan",
    genres: ["Ngôn Tình", "Cổ Đại"],
  },
  {
    title: "Thần Đạo Đan Tôn",
    slug: "than-dao-dan-ton-6060282",
    author: "Cô Đơn Địa Phi",
    url: "https://truyenfull.vision/than-dao-dan-ton-6060282/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Linh Vũ Thiên Hạ",
    slug: "linh-vu-thien-ha",
    author: "Vũ Phong",
    url: "https://truyenfull.vision/linh-vu-thien-ha/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Đấu Phá Thương Khung",
    slug: "truyen-dau-pha-thuong-khung",
    author: "Thiên Tàm Thổ Đậu",
    url: "https://truyenfull.vision/truyen-dau-pha-thuong-khung/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Thế Giới Hoàn Mỹ",
    slug: "the-gioi-hoan-my",
    author: "Thần Đông",
    url: "https://truyenfull.vision/the-gioi-hoan-my/",
    genres: ["Huyền Huyễn", "Tiên Hiệp"],
  },
  {
    title: "Phàm Nhân Tu Tiên",
    slug: "pham-nhan-tu-tien",
    author: "Vong Ngữ",
    url: "https://truyenfull.vision/pham-nhan-tu-tien/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Mê Vợ Không Lối Về",
    slug: "me-vo-khong-loi-ve-982891",
    author: "Chiêu Tài Tiến Bảo",
    url: "https://truyenfull.vision/me-vo-khong-loi-ve-982891/",
    genres: ["Ngôn Tình", "Đô Thị"],
  },
  {
    title: "Tiên Nghịch",
    slug: "tien-nghich",
    author: "Nhĩ Căn",
    url: "https://truyenfull.vision/tien-nghich/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Cô Vợ Ngọt Ngào Có Chút Bất Lương",
    slug: "co-vo-ngot-ngao-co-chut-bat-luong-vo-moi-bat-luong-co-chut-ngot",
    author: "Quẫn Quẫn Hữu Yêu",
    url: "https://truyenfull.vision/co-vo-ngot-ngao-co-chut-bat-luong-vo-moi-bat-luong-co-chut-ngot/",
    genres: ["Ngôn Tình", "Đô Thị"],
  },
  {
    title: "Đế Bá",
    slug: "de-ba",
    author: "Yếm Bút Tiêu Sinh",
    url: "https://truyenfull.vision/de-ba/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Nhất Niệm Vĩnh Hằng",
    slug: "nhat-niem-vinh-hang",
    author: "Nhĩ Căn",
    url: "https://truyenfull.vision/nhat-niem-vinh-hang/",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Ta Thầu Ao Cá, Sau Lại Câu Được Cả Tổ Tông Loài Cá",
    slug: "ta-thau-ao-ca-sau-lai-cau-duoc-ca-to-tong-loai-ca",
    author: "Kỳ Dị Quả",
    url: "https://truyenfull.vision/ta-thau-ao-ca-sau-lai-cau-duoc-ca-to-tong-loai-ca/",
    genres: ["Ngôn Tình", "Hiện Đại"],
  },
  {
    title: "Vừa Mở Miệng Liền Mất Tiếng",
    slug: "vua-mo-mieng-lien-mat-tieng",
    author: "Mạnh Chi Vãn",
    url: "https://truyenfull.vision/vua-mo-mieng-lien-mat-tieng/",
    genres: ["Ngôn Tình", "Hiện Đại"],
  },
  {
    title: "Cẩm Nang Sinh Tồn Của Kẻ Mê Ăn Ở Cổ Đại",
    slug: "cam-nang-sinh-ton-cua-ke-me-an-o-co-dai",
    author: "Unknown",
    url: "https://truyenfull.vision/cam-nang-sinh-ton-cua-ke-me-an-o-co-dai",
    genres: ["Ngôn Tình", "Cổ Đại"],
  },
  {
    title: "Trở Lại Thập Niên 70: Gả Cho Nam Xứng Xui Xẻo",
    slug: "tro-lai-thap-nien-70-ga-cho-nam-xung-xui-xeo",
    author: "Unknown",
    url: "https://truyenfull.vision/tro-lai-thap-nien-70-ga-cho-nam-xung-xui-xeo",
    genres: ["Ngôn Tình", "Trọng Sinh"],
  },
  {
    title: "Xuyên Thành Nữ Chính Làm Nông",
    slug: "xuyen-thanh-nu-chinh-lam-nong",
    author: "Unknown",
    url: "https://truyenfull.vision/xuyen-thanh-nu-chinh-lam-nong",
    genres: ["Ngôn Tình", "Xuyên Không"],
  },
  {
    title: "Thập Niên 70: Xuyên Thành Đầu Quả Tim Của Vai Ác",
    slug: "thap-nien-70-xuyen-thanh-dau-qua-tim-cua-vai-ac",
    author: "Unknown",
    url: "https://truyenfull.vision/thap-nien-70-xuyen-thanh-dau-qua-tim-cua-vai-ac",
    genres: ["Ngôn Tình", "Xuyên Không"],
  },
  {
    title: "Trọng Sinh Nữ Thầy Phong Thuỷ - Thiên Sơn Trà Tân Quán",
    slug: "trong-sinh-nu-thay-phong-thuy-thien-son-tra-tan-quan",
    author: "Unknown",
    url: "https://truyenfull.vision/trong-sinh-nu-thay-phong-thuy-thien-son-tra-tan-quan",
    genres: ["Ngôn Tình", "Trọng Sinh"],
  },
  {
    title: "Chỉ Yêu Riêng Mình Em - Dạ Tử Sân",
    slug: "chi-yeu-rieng-minh-em-da-tu-san",
    author: "Dạ Tử Sân",
    url: "https://truyenfull.vision/chi-yeu-rieng-minh-em-da-tu-san",
    genres: ["Ngôn Tình", "Đô Thị"],
  },
  {
    title: "Xuyên Về Cổ Đại Làm Tiểu Cô Nương Lợi Hại",
    slug: "xuyen-ve-co-dai-lam-tieu-co-nuong-loi-hai",
    author: "Unknown",
    url: "https://truyenfull.vision/xuyen-ve-co-dai-lam-tieu-co-nuong-loi-hai",
    genres: ["Ngôn Tình", "Xuyên Không"],
  },
  {
    title: "Mẹ Kế Ở Cổ Đại Làm Cá Mặn",
    slug: "me-ke-o-co-dai-lam-ca-man",
    author: "Unknown",
    url: "https://truyenfull.vision/me-ke-o-co-dai-lam-ca-man",
    genres: ["Ngôn Tình", "Cổ Đại"],
  },
  {
    title: "Thập Niên 70: Cuộc Sống Hạnh Phúc Trên Đảo",
    slug: "thap-nien-70-cuoc-song-hanh-phuc-tren-dao",
    author: "Unknown",
    url: "https://truyenfull.vision/thap-nien-70-cuoc-song-hanh-phuc-tren-dao",
    genres: ["Ngôn Tình", "Hiện Đại"],
  },
  {
    title: "Ta Dựa Vào Y Thuật Tung Hoành Tu Tiên Giới",
    slug: "ta-dua-vao-y-thuat-tung-hoanh-tu-tien-gioi",
    author: "Unknown",
    url: "https://truyenfull.vision/ta-dua-vao-y-thuat-tung-hoanh-tu-tien-gioi",
    genres: ["Tiên Hiệp", "Huyền Huyễn"],
  },
  {
    title: "Thập Niên: Tiểu Mỹ Nhân Ngọt Ngào Và Mềm Mại Của Đại Lão Sống Trên Đảo",
    slug: "thap-nien-tieu-my-nhan-ngot-ngao-va-mem-mai-cua-dai-lao-song-tren-dao",
    author: "Unknown",
    url: "https://truyenfull.vision/thap-nien-tieu-my-nhan-ngot-ngao-va-mem-mai-cua-dai-lao-song-tren-dao",
    genres: ["Ngôn Tình", "Hiện Đại"],
  },
  {
    title: "Trọng Sinh Trở Lại, Cướp Lại Gia Tài",
    slug: "trong-sinh-tro-lai-cuop-lai-gia-tai",
    author: "Unknown",
    url: "https://truyenfull.vision/trong-sinh-tro-lai-cuop-lai-gia-tai",
    genres: ["Ngôn Tình", "Trọng Sinh"],
  },
  {
    title: "Xuyên Không Ta Trở Thành Sủng Thê Của Quyền Thần",
    slug: "xuyen-khong-ta-tro-thanh-sung-the-cua-quyen-than",
    author: "Unknown",
    url: "https://truyenfull.vision/xuyen-khong-ta-tro-thanh-sung-the-cua-quyen-than",
    genres: ["Ngôn Tình", "Xuyên Không"],
  },
  {
    title: "Kiếm Lai",
    slug: "kiem-lai",
    author: "Unknown",
    url: "https://truyenfull.vision/kiem-lai",
    genres: ["Kiếm Hiệp", "Tiên Hiệp"],
  },
  {
    title: "Chuyện Buồn Nhỏ Mang Tên Yêu Thầm",
    slug: "chuyen-buon-nho-mang-ten-yeu-tham",
    author: "Mạnh Chi Vãn",
    url: "https://truyenfull.vision/chuyen-buon-nho-mang-ten-yeu-tham/",
    genres: ["Ngôn Tình", "Hiện Đại"],
  },
  {
    title: "Viện Điều Dưỡng Tam Giới - Túy Ẩm Trường Ca",
    slug: "vien-dieu-duong-tam-gioi-tuy-am-truong-ca",
    author: "Túy Ẩm Trường Ca",
    url: "https://truyenfull.vision/vien-dieu-duong-tam-gioi-tuy-am-truong-ca/",
    genres: ["Huyền Huyễn", "Tiên Hiệp"],
  },
]

const genres = [
  { name: 'Tiên Hiệp', slug: 'tien-hiep', description: 'Thể loại tiên hiệp tu tiên' },
  { name: 'Kiếm Hiệp', slug: 'kiem-hiep', description: 'Thể loại kiếm hiệp giang hồ' },
  { name: 'Ngôn Tình', slug: 'ngon-tinh', description: 'Truyện tình cảm lãng mạn' },
  { name: 'Đô Thị', slug: 'do-thi', description: 'Cuộc sống đô thị hiện đại' },
  { name: 'Huyền Huyễn', slug: 'huyen-huyen', description: 'Huyền ảo kỳ ảo' },
  { name: 'Xuyên Không', slug: 'xuyen-khong', description: 'Xuyên việt thời gian' },
  { name: 'Trọng Sinh', slug: 'trong-sinh', description: 'Tái sinh trở lại' },
  { name: 'Cung Đấu', slug: 'cung-dau', description: 'Tranh đấu trong cung' },
  { name: 'Dị Giới', slug: 'di-gioi', description: 'Thế giới khác' },
  { name: 'Cổ Đại', slug: 'co-dai', description: 'Cổ đại' },
  { name: 'Hiện Đại', slug: 'hien-dai', description: 'Hiện đại' },
]

async function main() {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ Connected to MongoDB successfully')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Genre.deleteMany({})
    await Truyen.deleteMany({})
    await Chapter.deleteMany({})

    // Seed genres
    console.log('📚 Seeding genres...')
    await Genre.insertMany(genres)
    console.log('✅ Created ' + genres.length + ' genres')

    // Seed stories with real data
    console.log('📖 Seeding truyen...')
    const truyenDocs = await Truyen.insertMany(realStories.map((story, index) => ({
      title: story.title,
      slug: story.slug,
      author: story.author,
      description: `Nội dung ${story.title}...`,
      genres: story.genres,
      status: index % 3 === 0 ? 'completed' : 'ongoing',
      views: Math.floor(Math.random() * 10000000) + 500000,
      rating: 7.5 + Math.random() * 2,
      reviewCount: Math.floor(Math.random() * 5000) + 100,
      totalChapters: 0, // Will be updated after scraping
      isHot: index < 10,
      isFull: index % 3 === 0,
      isNew: index % 5 === 0,
    })))

    console.log('✅ Created ' + truyenDocs.length + ' truyen')

    console.log('\n✨ Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - Genres: ' + genres.length)
    console.log('   - Truyen: ' + truyenDocs.length)
    console.log('\n📝 Next step: Run "npm run scrape" to fetch full content from truyenfull.vision')

    // Close connection
    await mongoose.connection.close()
    console.log('\n✅ Database connection closed')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

// Run the script
main()
