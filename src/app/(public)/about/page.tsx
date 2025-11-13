"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Nền tảng đặt phòng trực tuyến hàng đầu Việt Nam, kết nối hàng
              triệu du khách với những trải nghiệm lưu trú tuyệt vời
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Câu Chuyện Của Chúng Tôi
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Được thành lập vào năm 2024, chúng tôi bắt đầu với một ý tưởng
                đơn giản: làm cho việc tìm kiếm và đặt chỗ ở trở nên dễ dàng và
                thuận tiện hơn cho mọi người.
              </p>
              <p>
                Ngày nay, chúng tôi tự hào là một trong những nền tảng đặt phòng
                trực tuyến phát triển nhanh nhất tại Việt Nam, với hàng nghìn
                chỗ ở được xác minh và hàng triệu lượt đặt phòng thành công mỗi
                năm.
              </p>
              <p>
                Sứ mệnh của chúng tôi là mang đến cho mọi người những trải
                nghiệm du lịch tuyệt vời thông qua việc kết nối họ với những chỗ
                ở độc đáo và chất lượng cao.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Cam Kết Chất Lượng",
                description:
                  "Mỗi chỗ ở đều được xác minh và đánh giá kỹ lưỡng để đảm bảo chất lượng tốt nhất cho khách hàng.",
              },
              {
                icon: "🤝",
                title: "Tin Cậy & Minh Bạch",
                description:
                  "Chúng tôi đặt sự tin tưởng của khách hàng lên hàng đầu với chính sách giá cả rõ ràng và dịch vụ hỗ trợ 24/7.",
              },
              {
                icon: "💡",
                title: "Sáng Tạo & Đổi Mới",
                description:
                  "Không ngừng cải tiến công nghệ và dịch vụ để mang đến trải nghiệm đặt phòng tốt nhất cho người dùng.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "10K+", label: "Chỗ Ở" },
              { number: "50K+", label: "Khách Hàng" },
              { number: "100K+", label: "Đặt Phòng" },
              { number: "4.8★", label: "Đánh Giá" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {[
              {
                name: "Hứa Thịnh Hưng",
                role: "Dev-1",
                image:
                  "https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-6/514586091_1454937598851305_6812281531904977493_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=BxiWGqantaIQ7kNvwEEQAYq&_nc_oc=Adl3wJFA_ZL7PnGOtJmtSbcMamzCtveYskC0qF26iWh0ynWNrgGYPTl4qlO4eHB9HUQICbQAACdtKEVvMmx0-1lN&_nc_zt=23&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=bx5POA-TjJGOPvVEwE6AgQ&oh=00_Afe4SoKcgze_lBMByXgJFbsnmwuJM8WGnR0ggArVZ-PWZQ&oe=68E9E51A",
              },
              {
                name: "Trần Gia Kiệt",
                role: "Dev-2",
                image:
                  "https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/472625037_1636788023913775_1664464095007845043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=YCdfpk_MDNIQ7kNvwHiQI5p&_nc_oc=Adkd6OO63fSJrcRyRYCFSV_NUlD6cOZ7EDFcoqTZuhl1Z0yNqK0o3115Ebdl0YpsMFr2Jjn_JB_0Epo2PReDngjf&_nc_zt=23&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=HXHYZMwbo0pPlGEv6u0ilQ&oh=00_Afe6QosEfZwnto0FMbxlBw9QGoDeginc03ooDTj86IE4qQ&oe=68E9B83E",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-full h-[500px] overflow-hidden bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn Sàng Bắt Đầu Chuyến Đi Của Bạn?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Khám phá hàng nghìn chỗ ở tuyệt vời và đặt phòng ngay hôm nay!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/rooms"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Khám Phá Chỗ Ở
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-gray-200"
            >
              Liên Hệ Chúng Tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
