"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const blogDetails: Record<string, {
  id: number;
  title: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}> = {
  "1": {
    id: 1,
    title: "10 Điểm Đến Du Lịch Không Thể Bỏ Qua Tại Việt Nam 2024",
    category: "Du Lịch",
    author: "Nguyễn Văn A",
    date: "15/12/2024",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200",
    tags: ["Du lịch", "Việt Nam", "Khám phá"],
    content: [
      "Việt Nam là một đất nước giàu bản sắc văn hóa và sở hữu nhiều cảnh quan thiên nhiên tuyệt đẹp. Từ vùng núi phía Bắc đến vùng đồng bằng sông Cửu Long phía Nam, mỗi miền đều có những điểm đến độc đáo riêng.",
      "1. **Vịnh Hạ Long** - Kỳ quan thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi. Bạn có thể tham gia tour du thuyền 2-3 ngày để khám phá vẻ đẹp huyền bí của vịnh.",
      "2. **Phố cổ Hội An** - Di sản văn hóa thế giới với kiến trúc cổ kính, đèn lồng rực rỡ và ẩm thực đặc sắc. Đừng quên thả đèn hoa đăng trên sông Thu Bồn vào tối rằm.",
      "3. **Sapa** - Thiên đường ruộng bậc thang tuyệt đẹp, nơi bạn có thể trải nghiệm văn hóa của các dân tộc thiểu số và chinh phục đỉnh Fansipan.",
      "4. **Phú Quốc** - Đảo ngọc với bãi biển trong xanh, hệ sinh thái rừng nhiệt đới và các resort cao cấp. Tháng 11-4 là thời điểm lý tưởng nhất để ghé thăm.",
      "5. **Đà Lạt** - Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thích hợp cho những chuyến du lịch lãng mạn hoặc nghỉ dưỡng.",
      "6. **Ninh Bình** - 'Vịnh Hạ Long trên cạn' với phong cảnh sông núi hùng vĩ, hang động kỳ thú và các di tích lịch sử văn hóa.",
      "7. **Nha Trang** - Thiên đường biển đảo với nhiều hoạt động thể thao dưới nước, hải sản tươi ngon và cuộc sống về đêm sôi động.",
      "8. **Đà Nẵng** - Thành phố đáng sống với cầu Rồng, Bà Nà Hills, Ngũ Hành Sơn và bãi biển Mỹ Khê tuyệt đẹp.",
      "9. **Huế** - Cố đô với di sản văn hóa phong phú, ẩm thực cung đình tinh tế và sông Hương thơ mộng.",
      "10. **Mũi Né** - Điểm đến lý tưởng cho những ai yêu thích hoạt động lướt ván diều, với đồi cát đỏ, đồi cát trắng và suối Tiên độc đáo."
    ]
  },
  "2": {
    id: 2,
    title: "Hướng Dẫn Đặt Phòng Thông Minh: Tiết Kiệm Chi Phí Du Lịch",
    category: "Mẹo Hay",
    author: "Trần Thị B",
    date: "12/12/2024",
    readTime: "7 phút đọc",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
    tags: ["Mẹo", "Đặt phòng", "Tiết kiệm"],
    content: [
      "Việc đặt phòng thông minh không chỉ giúp bạn tiết kiệm chi phí mà còn đảm bảo chất lượng chỗ ở. Dưới đây là những mẹo hữu ích từ kinh nghiệm thực tế.",
      "**1. Đặt phòng sớm hoặc last minute**",
      "Đặt phòng trước 2-3 tháng thường có giá tốt nhất, đặc biệt trong mùa cao điểm. Ngược lại, đặt phòng last minute (1-2 ngày trước) cũng có thể nhận được giá ưu đãi nếu khách sạn còn nhiều phòng trống.",
      "**2. So sánh giá trên nhiều nền tảng**",
      "Đừng chỉ xem giá trên một website. Hãy so sánh trên nhiều nền tảng như Booking, Agoda, Airbnb và website chính thức của khách sạn. Đôi khi đặt trực tiếp còn rẻ hơn.",
      "**3. Tận dụng các chương trình khuyến mãi**",
      "Theo dõi các ngày lễ, chương trình flash sale, mã giảm giá từ ngân hàng hoặc ví điện tử. Đăng ký nhận email từ các nền tảng đặt phòng để không bỏ lỡ ưu đãi.",
      "**4. Đọc kỹ review từ khách trước**",
      "Review là yếu tố quan trọng nhất để đánh giá chất lượng thực tế. Hãy đọc cả review tích cực và tiêu cực, chú ý đến những review mới nhất.",
      "**5. Chọn thời điểm đặt phòng phù hợp**",
      "Tránh đặt phòng vào cuối tuần hoặc ngày lễ khi giá thường cao hơn. Các ngày giữa tuần thường có giá tốt hơn 20-30%.",
      "**6. Linh hoạt với địa điểm**",
      "Nếu không bắt buộc phải ở trung tâm, hãy xem xét các khu vực lân cận. Giá rẻ hơn nhưng chất lượng vẫn đảm bảo, kết hợp với phương tiện di chuyển sẽ tiết kiệm được nhiều chi phí.",
      "**7. Đặt phòng kèm gói combo**",
      "Nhiều nền tảng cung cấp gói combo phòng + vé máy bay hoặc phòng + tour với giá ưu đãi hơn đặt riêng lẻ.",
      "Với những mẹo trên, bạn có thể tiết kiệm 30-50% chi phí đặt phòng mà vẫn đảm bảo chất lượng nghỉ dưỡng tuyệt vời!"
    ]
  },
  "3": {
    id: 3,
    title: "Top 5 Homestay Đẹp Nhất Đà Lạt Cho Kỳ Nghỉ Lãng Mạn",
    category: "Khám Phá",
    author: "Lê Văn C",
    date: "10/12/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200",
    tags: ["Đà Lạt", "Homestay", "Lãng mạn"],
    content: [
      "Đà Lạt luôn là điểm đến yêu thích của các cặp đôi nhờ khí hậu mát mẻ, cảnh quan thơ mộng và không khí lãng mạn. Dưới đây là 5 homestay đẹp nhất dành cho kỳ nghỉ của bạn.",
      "**1. Ana Mandara Villas Đà Lạt**",
      "Khu villa sang trọng với kiến trúc Pháp cổ điển, view hồ Xuân Hương tuyệt đẹp. Phòng ốc rộng rãi, trang bị đầy đủ tiện nghi hiện đại. Giá từ 5.000.000đ/đêm.",
      "**2. Dalat Wonder Resort**",
      "Nằm trong rừng thông thơ mộng, resort có hồ bơi vô cực view toàn cảnh thành phố. Thích hợp cho những ai muốn tận hưởng không gian riêng tư. Giá từ 3.500.000đ/đêm.",
      "**3. The Woolly's Đà Lạt**",
      "Homestay phong cách Bắc Âu ấm cúng với lò sưởi, sân vườn hoa lavender. Chủ nhà thân thiện, phục vụ bữa sáng ngon miệng. Giá từ 1.200.000đ/đêm.",
      "**4. Memory Đà Lạt**",
      "Homestay mang phong cách vintage, góc chụp hình 'sống ảo' cực đẹp. Có khu vườn rộng với nhiều loại hoa. Giá từ 800.000đ/đêm.",
      "**5. Dalat De Charme Village**",
      "Khu nghỉ dưỡng nhỏ xinh với các căn biệt thự riêng biệt, view đồi chè xanh mướt. Có nhà hàng phục vụ ẩm thực Pháp-Việt. Giá từ 4.000.000đ/đêm.",
      "**Lưu ý khi đặt homestay ở Đà Lạt:**",
      "- Nên đặt trước ít nhất 1 tháng vào mùa cao điểm (Tết, lễ, mùa hoa)",
      "- Kiểm tra kỹ vị trí, một số homestay ở xa trung tâm cần phương tiện di chuyển",
      "- Hỏi rõ về chính sách hủy phòng và các dịch vụ kèm theo",
      "- Mang theo áo ấm vì Đà Lạt lạnh quanh năm, đặc biệt vào buổi sáng và tối"
    ]
  }
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const post = blogDetails[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Không tìm thấy bài viết</p>
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Quay lại Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[400px] bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg hover:bg-white transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Quay lại</span>
          </Link>
        </div>

        {/* Category Badge */}
        <div className="absolute top-8 right-8">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-lg">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Article Header */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">Tác giả</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {post.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-gray-700 leading-relaxed mb-6 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                  }}
                />
              ))}
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Chia sẻ bài viết:</h3>
              <div className="flex gap-4">
                {["Facebook", "Twitter", "LinkedIn", "Copy Link"].map((platform) => (
                  <button
                    key={platform}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-16 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài Viết Liên Quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(blogDetails)
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
                >
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <span className="text-sm text-blue-600 font-medium">{relatedPost.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {relatedPost.date}</span>
                      <span>⏱️ {relatedPost.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
