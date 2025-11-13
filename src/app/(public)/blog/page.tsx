"use client";

import React, { useState } from "react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "10 Điểm Đến Du Lịch Không Thể Bỏ Qua Tại Việt Nam 2024",
    excerpt: "Khám phá những địa điểm du lịch tuyệt vời nhất Việt Nam với cảnh quan thiên nhiên hùng vĩ và văn hóa độc đáo...",
    category: "Du Lịch",
    author: "Nguyễn Văn A",
    date: "15/12/2024",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800",
    tags: ["Du lịch", "Việt Nam", "Khám phá"]
  },
  {
    id: 2,
    title: "Hướng Dẫn Đặt Phòng Thông Minh: Tiết Kiệm Chi Phí Du Lịch",
    excerpt: "Những mẹo hay giúp bạn đặt được phòng ưng ý với giá tốt nhất. Tìm hiểu cách săn deal và thời điểm đặt phòng...",
    category: "Mẹo Hay",
    author: "Trần Thị B",
    date: "12/12/2024",
    readTime: "7 phút đọc",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    tags: ["Mẹo", "Đặt phòng", "Tiết kiệm"]
  },
  {
    id: 3,
    title: "Top 5 Homestay Đẹp Nhất Đà Lạt Cho Kỳ Nghỉ Lãng Mạn",
    excerpt: "Đà Lạt luôn là điểm đến lý tưởng cho những ai yêu thích sự lãng mạn. Cùng khám phá 5 homestay đẹp nhất...",
    category: "Khám Phá",
    author: "Lê Văn C",
    date: "10/12/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800",
    tags: ["Đà Lạt", "Homestay", "Lãng mạn"]
  },
  {
    id: 4,
    title: "Kinh Nghiệm Du Lịch Phú Quốc: Ăn Gì, Ở Đâu, Chơi Gì?",
    excerpt: "Phú Quốc - đảo ngọc của Việt Nam với biển xanh, cát trắng. Chia sẻ kinh nghiệm chi tiết về ăn uống...",
    category: "Kinh Nghiệm",
    author: "Phạm Thị D",
    date: "08/12/2024",
    readTime: "10 phút đọc",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800",
    tags: ["Phú Quốc", "Biển", "Kinh nghiệm"]
  },
  {
    id: 5,
    title: "Checklist Chuẩn Bị Cho Chuyến Du Lịch Hoàn Hảo",
    excerpt: "Danh sách những thứ cần chuẩn bị trước khi đi du lịch để có một chuyến đi trọn vẹn và tránh bỏ sót...",
    category: "Hướng Dẫn",
    author: "Hoàng Văn E",
    date: "05/12/2024",
    readTime: "4 phút đọc",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800",
    tags: ["Hướng dẫn", "Checklist", "Chuẩn bị"]
  },
  {
    id: 6,
    title: "Những Trải Nghiệm Độc Đáo Chỉ Có Tại Sapa",
    excerpt: "Sapa không chỉ có ruộng bậc thang đẹp mà còn nhiều trải nghiệm văn hóa độc đáo của các dân tộc thiểu số...",
    category: "Khám Phá",
    author: "Ngô Thị F",
    date: "03/12/2024",
    readTime: "8 phút đọc",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800",
    tags: ["Sapa", "Văn hóa", "Trải nghiệm"]
  },
  {
    id: 7,
    title: "Ẩm Thực Đường Phố Sài Gòn: Những Món Ăn Phải Thử",
    excerpt: "Sài Gòn nổi tiếng với văn hóa ẩm thực đường phố phong phú. Cùng khám phá những món ăn đặc trưng...",
    category: "Ẩm Thực",
    author: "Đỗ Văn G",
    date: "01/12/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    tags: ["Sài Gòn", "Ẩm thực", "Đường phố"]
  },
  {
    id: 8,
    title: "Du Lịch Bụi Miền Bắc: Hành Trình 7 Ngày Khó Quên",
    excerpt: "Chia sẻ hành trình du lịch bụi miền Bắc trong 7 ngày với chi phí tiết kiệm nhưng đầy trải nghiệm...",
    category: "Kinh Nghiệm",
    author: "Vũ Thị H",
    date: "28/11/2024",
    readTime: "12 phút đọc",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800",
    tags: ["Miền Bắc", "Du lịch bụi", "Hành trình"]
  }
];

const categories = ["Tất cả", "Du Lịch", "Mẹo Hay", "Khám Phá", "Kinh Nghiệm", "Hướng Dẫn", "Ẩm Thực"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog Du Lịch
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Khám phá những bài viết hữu ích về du lịch, mẹo đặt phòng và trải nghiệm độc đáo
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{filteredPosts.length}</span> bài viết
          </p>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>📅 {post.date}</span>
                      <span>⏱️ {post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Đăng Ký Nhận Tin Mới Nhất
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nhận những bài viết mới nhất về du lịch, mẹo hay và ưu đãi đặc biệt qua email của bạn
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
