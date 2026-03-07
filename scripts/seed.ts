// Set environment variables FIRST before any imports
process.env.MONGODB_URI = 'mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true&w=majority'

import mongoose from 'mongoose'
import Truyen from '../models/Truyen'
import Chapter from '../models/Chapter'
import Genre from '../models/Genre'

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
  { name: 'Võng Du', slug: 'vong-du', description: 'Game online' },
]

const truyenData = [
  {
    title: 'Tiên Nghịch',
    slug: 'tien-nghich',
    author: 'Nhĩ Căn',
    description: 'Thuận vi phàm, nghịch vi tiên, chỉ tại tâm trung nhất niệm gian. Tu chân giới dịch sinh dịch tử, đạo tâm bất cố, tiến nhập tu tiên, cầu đắc trường sinh bất lão, tinh tuyệt đỉnh cao.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 15000000,
    rating: 9.0,
    reviewCount: 4227,
    totalChapters: 2143,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Đấu Phá Thương Khung',
    slug: 'dau-pha-thuong-khung',
    author: 'Thiên Tàm Thổ Đậu',
    description: 'Đây là thế giới thuộc về Đấu Khí, không có ma pháp hoa tiếu rườm rà, có chỉ là Đấu Khí đơn thuần cương mãnh phồn thịnh!',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 25000000,
    rating: 9.2,
    reviewCount: 8500,
    totalChapters: 1648,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Toàn Chức Pháp Sư',
    slug: 'toan-chuc-phap-su',
    author: 'Loạn',
    description: 'Tỉnh dậy trong một thế giới hoàn toàn xa lạ, Mo Fan phát hiện mình đã xuyên không, trở thành một học sinh trung học.',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 12000000,
    rating: 8.8,
    reviewCount: 3200,
    totalChapters: 3169,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Ngã Là Tà Đế',
    slug: 'nga-la-ta-de',
    author: 'Hoả Hỏa',
    description: 'Ta là Tà Đế, đạp trên thiên hạ, duy ta độc tôn!',
    genres: ['Kiếm Hiệp', 'Tiên Hiệp'],
    status: 'ongoing' as const,
    views: 8500000,
    rating: 8.7,
    reviewCount: 2100,
    totalChapters: 1520,
    isHot: true,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Nguyên Tôn',
    slug: 'nguyen-ton',
    author: 'Thiên Tàm Thổ Đậu',
    description: 'Thiên địa làm lò, vạn vật làm đồng, âm dương làm than, tạo hóa vi công!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 9800000,
    rating: 8.9,
    reviewCount: 2800,
    totalChapters: 1524,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Thần Ấn Vương Tọa',
    slug: 'than-an-vuong-toa',
    author: 'Đường Gia Tam Thiếu',
    description: 'Khi nhân loại đang sống trong nguy cơ tuyệt chủng, có sáu Thánh Điện dựng lên ngọn cờ bảo vệ nhân loại.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 7200000,
    rating: 8.6,
    reviewCount: 1900,
    totalChapters: 1042,
    isHot: false,
    isFull: true,
  },
  {
    title: 'Vạn Cổ Thần Đế',
    slug: 'van-co-than-de',
    author: 'Phi Thiên Ngư',
    description: 'Thiên tài tu luyện một đời, không ngờ bị hại chết bởi bạn thân. Trọng sinh về ngàn năm trước.',
    genres: ['Huyền Huyễn', 'Xuyên Không'],
    status: 'ongoing' as const,
    views: 6500000,
    rating: 8.5,
    reviewCount: 1500,
    totalChapters: 4730,
    isHot: false,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Ta Là Đại Thần Tiên',
    slug: 'ta-la-dai-than-tien',
    author: 'Hồ Thuyết Bát Đạo',
    description: 'Xuyên việt tu tiên thế giới, thành vi nhất đại tu tiên đại năng.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'ongoing' as const,
    views: 5800000,
    rating: 8.4,
    reviewCount: 1200,
    totalChapters: 850,
    isHot: true,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Bàn Long',
    slug: 'ban-long',
    author: 'Ngã Cật Tây Hồng Thị',
    description: 'Câu chuyện về Linley - một thiên tài tu luyện trong đại lục.',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 11000000,
    rating: 9.1,
    reviewCount: 4500,
    totalChapters: 807,
    isHot: false,
    isFull: true,
  },
  {
    title: 'Hoàn Mỹ Thế Giới',
    slug: 'hoan-my-the-gioi',
    author: 'Thần Đông',
    description: 'Một hạt bụi có thể lấp đầy biển, một cọng cỏ chém đứt mặt trời, mặt trăng và các vì sao.',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    status: 'completed' as const,
    views: 13500000,
    rating: 9.3,
    reviewCount: 5200,
    totalChapters: 1798,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Võ Luyện Đỉnh Phong',
    slug: 'vo-luyen-dinh-phong',
    author: 'Mạc Mạc',
    description: 'Võ đạo đỉnh phong, là cô độc, là tịch mịch, là trường cửu vô tận.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'ongoing' as const,
    views: 4200000,
    rating: 8.3,
    reviewCount: 980,
    totalChapters: 3800,
    isHot: false,
    isFull: false,
  },
  {
    title: 'Nhất Niệm Vĩnh Hằng',
    slug: 'nhat-niem-vinh-hang',
    author: 'Nhĩ Căn',
    description: 'Một niệm thành biển, một niệm hóa tang điền. Một niệm chém thiên kiêu.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 7800000,
    rating: 8.8,
    reviewCount: 2400,
    totalChapters: 1316,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Phàm Nhân Tu Tiên',
    slug: 'pham-nhan-tu-tien',
    author: 'Vong Ngữ',
    description: 'Một kẻ phàm nhân bình thường, tiến vào giang hồ một cách tình cờ.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 16000000,
    rating: 9.4,
    reviewCount: 6800,
    totalChapters: 2400,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Độc Tôn',
    slug: 'doc-ton',
    author: 'Hoạch Lộc',
    description: 'Thiên địa gian, duy độc tôn!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'ongoing' as const,
    views: 3900000,
    rating: 8.2,
    reviewCount: 850,
    totalChapters: 1200,
    isHot: false,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Cửu Tinh Độc Tôn',
    slug: 'cuu-tinh-doc-ton',
    author: 'Thiếu Quân',
    description: 'Chín ngôi sao độc tôn, đạp trên thiên hạ.',
    genres: ['Huyền Huyễn', 'Võng Du'],
    status: 'ongoing' as const,
    views: 5200000,
    rating: 8.5,
    reviewCount: 1400,
    totalChapters: 980,
    isHot: true,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Tu La Vũ Thần',
    slug: 'tu-la-vu-than',
    author: 'Thiện Lương Đích Mì Phong',
    description: 'Tu La chiến thần, vũ động thiên hạ!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 8900000,
    rating: 8.9,
    reviewCount: 2600,
    totalChapters: 1523,
    isHot: false,
    isFull: true,
  },
  {
    title: 'Tuyệt Thế Vũ Hồn',
    slug: 'tuyet-the-vu-hon',
    author: 'Cực Phẩm Yêu Ma',
    description: 'Vũ hồn tuyệt thế, xưng bá thiên hạ!',
    genres: ['Huyền Huyễn', 'Kiếm Hiệp'],
    status: 'ongoing' as const,
    views: 4500000,
    rating: 8.4,
    reviewCount: 1100,
    totalChapters: 2100,
    isHot: false,
    isFull: false,
  },
  {
    title: 'Thái Cổ Thần Vương',
    slug: 'thai-co-than-vuong',
    author: 'Tịnh Vô Ngân',
    description: 'Thái cổ thời đại, thần vương giáng thế!',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    status: 'ongoing' as const,
    views: 6200000,
    rating: 8.6,
    reviewCount: 1650,
    totalChapters: 1800,
    isHot: true,
    isFull: false,
  },
  {
    title: 'Vạn Giới Thần Chủ',
    slug: 'van-gioi-than-chu',
    author: 'Đông Man',
    description: 'Vạn giới chi chủ, duy ta độc tôn!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'ongoing' as const,
    views: 3500000,
    rating: 8.3,
    reviewCount: 920,
    totalChapters: 650,
    isHot: false,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Hồng Hoang Chi Lực Sĩ',
    slug: 'hong-hoang-chi-luc-si',
    author: 'Đại Lực Kim Cang Chưởng',
    description: 'Xuyên việt vào thời kỳ Hồng Hoang, trở thành một lực sĩ.',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'ongoing' as const,
    views: 2800000,
    rating: 8.1,
    reviewCount: 680,
    totalChapters: 890,
    isHot: false,
    isFull: false,
  },
  {
    title: 'Linh Vực',
    slug: 'linh-vuc',
    author: 'Nghịch Thương',
    description: 'Vương giả linh vực, xưng tôn thiên hạ!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 10200000,
    rating: 9.0,
    reviewCount: 3800,
    totalChapters: 1366,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Đại Chúa Tể',
    slug: 'dai-chua-te',
    author: 'Thiên Tàm Thổ Đậu',
    description: 'Đại thiên chi chủ, duy ta chúa tể!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 14500000,
    rating: 9.2,
    reviewCount: 5800,
    totalChapters: 1560,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Ngự Thiên',
    slug: 'ngu-thien',
    author: 'Phong Thanh Dương',
    description: 'Ngự giá thanh thiên, phá tán hư không!',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    status: 'ongoing' as const,
    views: 5600000,
    rating: 8.5,
    reviewCount: 1380,
    totalChapters: 1450,
    isHot: false,
    isFull: false,
  },
  {
    title: 'Thần Mộ',
    slug: 'than-mo',
    author: 'Thần Mộ',
    description: 'Thần thánh trường miên, bí ẩn thần mộ!',
    genres: ['Huyền Huyễn', 'Xuyên Không'],
    status: 'completed' as const,
    views: 9500000,
    rating: 8.8,
    reviewCount: 3200,
    totalChapters: 987,
    isHot: false,
    isFull: true,
  },
  {
    title: 'Võ Động Càn Khôn',
    slug: 'vo-dong-can-khon',
    author: 'Thiên Tàm Thổ Đậu',
    description: 'Càn khôn vận chuyển, võ đạo vĩnh hằng!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'completed' as const,
    views: 17200000,
    rating: 9.1,
    reviewCount: 7200,
    totalChapters: 1339,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Tu Chân Thế Giới',
    slug: 'tu-chan-the-gioi',
    author: 'Ngã Cật Tây Hồng Thị',
    description: 'Tu chân chi đạo, đắc đạo thành tiên!',
    genres: ['Tiên Hiệp', 'Huyền Huyễn'],
    status: 'completed' as const,
    views: 8700000,
    rating: 8.7,
    reviewCount: 2500,
    totalChapters: 1205,
    isHot: false,
    isFull: true,
  },
  {
    title: 'Thiên Đạo Đồ Thư Quán',
    slug: 'thien-dao-do-thu-quan',
    author: 'Dương Trân',
    description: 'Đồ thư quán chứa vạn quyển thiên thư, học được một là xưng bá!',
    genres: ['Huyền Huyễn', 'Võng Du'],
    status: 'ongoing' as const,
    views: 4800000,
    rating: 8.6,
    reviewCount: 1250,
    totalChapters: 1680,
    isHot: true,
    isFull: false,
    isNew: true,
  },
  {
    title: 'Đế Bá',
    slug: 'de-ba',
    author: 'Yếm Bút Tiêu Sinh',
    description: 'Đế vương chi đạo, xưng bá vạn cổ!',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    status: 'completed' as const,
    views: 11800000,
    rating: 9.0,
    reviewCount: 4100,
    totalChapters: 1842,
    isHot: true,
    isFull: true,
  },
  {
    title: 'Huyền Thiên Chí Tôn',
    slug: 'huyen-thien-chi-ton',
    author: 'Quan Phong',
    description: 'Huyền thiên thế giới, chí tôn vô địch!',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    status: 'ongoing' as const,
    views: 3200000,
    rating: 8.2,
    reviewCount: 780,
    totalChapters: 920,
    isHot: false,
    isFull: false,
  },
  {
    title: 'Long Vương Truyền Thuyết',
    slug: 'long-vuong-truyen-thuyet',
    author: 'Phong Thanh Dương',
    description: 'Long tộc truyền thuyết, long vương tái thế!',
    genres: ['Huyền Huyễn', 'Xuyên Không'],
    status: 'ongoing' as const,
    views: 6800000,
    rating: 8.7,
    reviewCount: 1900,
    totalChapters: 1550,
    isHot: true,
    isFull: false,
  },
]

const sampleChapterContent = `Thuận vi phàm, nghịch vi tiên, chỉ tại tâm trung nhất niệm gian…

Tu chân giới dịch sinh dịch tử, đạo tâm bất cố, tiến nhập tu tiên, cầu đắc trường sinh bất lão, tinh tuyệt đỉnh cao.

Vương gia ở đất Triệu, nam có cố Hằng. Cổ Hằng này từ tên tuổi mà nói rất hoành, nhưng trong thực tế, lại là mỗi bề rộng chỉ năm trượng, mỗi bề dài chỉ ba mươi trượng một bình địa.

Nhìn từ trên không đi xuống, ở nơi này tất cả người đều không thể ở dưới mặt đất trồng lương thực, mà là phải theo đường đất dốc đứng lên xuống mà đến nửa sườn núi sau đó mới phát hiện ở đó có mấy khối đất bằng phẳng dùng để trồng trọt.

Đó là một ngày hạ chí, mặt trời vừa mới nhô lên đầu, ở phía đông của cổ Hằng, một thanh niên mười lăm tuổi mặc áo vải thô màu xanh đậm đang cầm cây cuốc ở ruộng lúa cật lực làm việc.

Mồ hôi từ từ chảy xuống, nhỏ giọt trên mặt đất, phát ra âm thanh nhẹ.

Thanh niên này tên là Vương Lâm, từ khi sinh ra là người của cổ Hằng, cha mẹ đều là nông dân, gia cảnh bình thường. Chỉ có một điểm, lại là ở trong cổ Hằng mỗi người đều biết, đó chính là thanh niên này từ nhỏ đã thông minh hơn người, mười tuổi đọc sách, mười hai tuổi chính là đọc xong ở trong thôn tất cả sách, và cũng vì vậy mà được người trong làng coi trọng.

Vương Lâm từ từ đứng thẳng người, lau mồ hôi, nhìn về phía mặt trời, trong mắt lộ ra ánh sáng kiên định. Hắn biết, cơ hội của hắn đã đến.`

async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('✅ Connected to MongoDB successfully')

    console.log('🗑️  Clearing existing data...')
    await Genre.deleteMany({})
    await Truyen.deleteMany({})
    await Chapter.deleteMany({})

    console.log('📚 Seeding genres...')
    await Genre.insertMany(genres)
    console.log(`✅ Created ${genres.length} genres`)

    console.log('📖 Seeding truyen...')
    const createdTruyen = await Truyen.insertMany(truyenData)
    console.log(`✅ Created ${createdTruyen.length} truyen`)

    console.log('📝 Seeding chapters (10 chapters per truyen)...')
    let totalChapters = 0

    for (const truyen of createdTruyen) {
      const chapters = []
      const numChapters = Math.min(10, truyen.totalChapters)

      for (let i = 1; i <= numChapters; i++) {
        chapters.push({
          truyenId: truyen._id,
          chapterNumber: i,
          title: `Chương ${i}`,
          content: sampleChapterContent,
          wordCount: sampleChapterContent.split(/\s+/).length,
          views: Math.floor(Math.random() * 10000),
        })
      }

      await Chapter.insertMany(chapters)
      totalChapters += chapters.length
    }

    console.log(`✅ Created ${totalChapters} chapters`)

    console.log('✨ Seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Genres: ${genres.length}`)
    console.log(`   - Truyen: ${createdTruyen.length}`)
    console.log(`   - Chapters: ${totalChapters}`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()
