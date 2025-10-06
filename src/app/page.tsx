"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Hero from "@/components/home/Hero";
import SearchBarAutocomplete from "@/components/home/SearchBarAutocomplete";
import RoomCard from "@/components/home/RoomCard";
// import GoogleMap from "@/components/home/GoogleMap"; // Tạm tắt để tránh lỗi billing
import LocationCard from "@/components/home/LocationCard";
import PropertyTypeCard from "@/components/home/PropertyTypeCard";
import { getRooms } from "@/lib/roomService";
import { getLocations } from "@/lib/locationService";

import type { Room, Location } from "@/types/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // States cho locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Lấy danh sách phòng từ API Cybersoft
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        setError(null);

        const result = (await getRooms()) as {
          success: boolean;
          rooms: Room[];
          message?: string;
        };

        if (result.success) {
          console.log("✅ Đã lấy được phòng từ API:", result.rooms.length);
          // Lấy 4 phòng đầu tiên để hiển thị
          setRooms(result.rooms.slice(0, 4));
        } else {
          setError(result.message || "Không thể lấy dữ liệu phòng");
        }
      } catch (err) {
        console.error("❌ Lỗi fetch rooms:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  // Lấy danh sách vị trí từ API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);

        const result = (await getLocations()) as {
          success: boolean;
          locations: Location[];
          message?: string;
        };

        if (result.success) {
          console.log("✅ Đã lấy được vị trí từ API:", result.locations.length);
          // Lấy 8 vị trí đầu tiên để hiển thị
          setLocations(result.locations.slice(0, 8));
        } else {
          console.log("⚠️ Không thể lấy vị trí:", result.message);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch locations:", err);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Lan",
      location: "Hà Nội, Việt Nam",
      rating: 5,
      text: "Trải nghiệm tuyệt vời! Chỗ ở đúng như mô tả và chủ nhà rất nhiệt tình hỗ trợ.",
      avatar: "logo.png",
    },
    {
      id: 2,
      name: "Trần Minh Tuấn",
      location: "TP. Hồ Chí Minh, Việt Nam",
      rating: 5,
      text: "Vị trí hoàn hảo và chỗ ở rất đẹp. Chắc chắn sẽ đặt lại lần sau!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      id: 3,
      name: "Phạm Thu Hà",
      location: "Đà Nẵng, Việt Nam",
      rating: 5,
      text: "Dịch vụ xuất sắc và chỗ ở vượt quá mong đợi. Rất đáng để giới thiệu!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setNewsletterSuccess(true);
      setIsLoading(false);
      setNewsletterEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setNewsletterSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleViewAllProperties = () => {
    setIsLoading(true);
    // Simulate navigation
    setTimeout(() => {
      setIsLoading(false);
      alert("Redirecting to all properties...");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <Hero />

      {/* Khám phá những điểm đến gần đây */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Khám phá những điểm đến gần đây
          </h2>

          {loadingLocations ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải vị trí...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  id={location.id}
                  name={location.tenViTri}
                  province={location.tinhThanh}
                  country={location.quocGia}
                  image={location.hinhAnh}
                  distance={`${
                    Math.floor(Math.random() * 50) + 10
                  } phút lái xe`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ở bất cứ đâu */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Ở bất cứ đâu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <PropertyTypeCard
              title="Toàn bộ nhà"
              subtitle="Không gian riêng tư"
              image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
              count="2,641 nhà"
            />
            <PropertyTypeCard
              title="Chỗ ở độc đáo"
              subtitle="Những nơi đặc biệt"
              image="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop"
              count="1,214 chỗ ở"
            />
            <PropertyTypeCard
              title="Trang trại và thiên nhiên"
              subtitle="Gần gũi thiên nhiên"
              image="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"
              count="892 trang trại"
            />
            <PropertyTypeCard
              title="Cho phép mang theo thú cưng"
              subtitle="Thú cưng được chào đón"
              image="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop"
              count="3,451 chỗ ở"
            />
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Chỗ Ở Nổi Bật
            </h2>
            <p className="text-gray-600">
              Khám phá những chỗ ở đặc biệt được chúng tôi tuyển chọn kỹ lưỡng
              trên khắp thế giới
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingRooms ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-600 col-span-full py-12">
                {error}
              </p>
            ) : (
              rooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="group block bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        room.hinhAnh ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
                      }
                      alt={room.tenPhong}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-900">
                        ${room.giaTien}
                      </span>
                      <span className="text-xs text-gray-600">/night</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1">
                      {room.tenPhong}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {room.moTa || "Phòng tuyệt vời cho kỳ nghỉ của bạn"}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      <span className="flex items-center gap-1">
                        <span>{room.khach}</span>
                        <span className="text-xs">khách</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span>{room.phongNgu}</span>
                        <span className="text-xs">phòng ngủ</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span>{room.giuong}</span>
                        <span className="text-xs">giường</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <svg
                        className="w-4 h-4 text-gray-900 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900">
                        4.5
                      </span>
                      <span className="text-sm text-gray-500">
                        (10 reviews)
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Xem Tất Cả Chỗ Ở
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Đừng chỉ tin lời chúng tôi. Hãy xem những gì khách hàng hài lòng
              của chúng tôi nói về trải nghiệm của họ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-black">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-black">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-black italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-200 to-blue-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Cập Nhật Thông Tin Mới Nhất
          </h2>
          <p className="text-xl text-black mb-8">
            Nhận ưu đãi mới nhất, mẹo du lịch và các chương trình đặc biệt được
            gửi đến hộp thư của bạn.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-black focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng ký...</span>
                  </div>
                ) : (
                  "Đăng Ký"
                )}
              </button>
            </div>

            {newsletterSuccess && (
              <div className="mt-4 p-3 bg-green-200 text-green-900 rounded-lg animate-pulse">
                ✅ Đăng ký thành công! Cảm ơn bạn đã tham gia cùng chúng tôi.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Tại Sao Chọn Chúng Tôi?
              </h2>
              <p className="text-lg text-black mb-8">
                Chúng tôi cam kết mang đến cho bạn trải nghiệm du lịch tốt nhất.
                Nền tảng của chúng tôi kết nối bạn với những chỗ ở độc đáo và
                đảm bảo chuyến đi của bạn thật đáng nhớ.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-black">
                    Chỗ ở và chủ nhà đã xác minh
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-black">Hỗ trợ khách hàng 24/7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-black">Cam kết giá tốt nhất</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                >
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Về chúng tôi"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-black">Khách Hàng Hài Lòng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Liên Hệ Với Chúng Tôi
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Có câu hỏi? Chúng tôi rất muốn được lắng nghe. Gửi tin nhắn cho
              chúng tôi và chúng tôi sẽ phản hồi sớm nhất có thể.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      Điện thoại
                    </h3>
                    <p className="text-black">+84 (028) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">Email</h3>
                    <p className="text-black">lienhe@airbnbclone.vn</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      Địa chỉ
                    </h3>
                    <p className="text-black">
                      123 Đường Du Lịch, TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-black transition-colors duration-200"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-black transition-colors duration-200"
                    placeholder="email@cua.ban"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-black transition-colors duration-200"
                    placeholder="Nội dung tin nhắn của bạn"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  Gửi Tin Nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section - Tạm tắt để tránh lỗi billing */}
      {/* <GoogleMap /> */}
    </div>
  );
}
