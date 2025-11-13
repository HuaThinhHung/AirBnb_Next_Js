"use client";

import { useState } from "react";
import SearchBarAutocomplete from "./SearchBarAutocomplete";
import LocationSearchDropdown from "./LocationSearchDropdown";
import GuestsDropdown from "./GuestsDropdown";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(1);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          {/* Fallback nếu video không load được */}
          Your browser does not support the video tag.
        </video>

        {/* Overlay tối để text dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Tìm Nơi Lưu Trú
            <span className="block text-blue-300">Hoàn Hảo</span>
          </h1>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-52 h-30 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30 bg-white/10">
              <img
                src="/logo.png"
                alt="Airbnb Clone Logo"
                className="w-full h-full object-contain rounded-2xl"
                style={{
                  imageRendering: "-webkit-optimize-contrast",
                  filter:
                    "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(10deg)",
                }}
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Khám phá những nơi lưu trú tuyệt vời trên khắp thế giới. Từ căn hộ
            ấm cúng đến biệt thự sang trọng, tìm chỗ ở hoàn hảo cho chuyến phiêu
            lưu tiếp theo của bạn.
          </p>

          {/* Search Bar with Autocomplete */}
          <div className="max-w-5xl mx-auto mb-12">
            <SearchBarAutocomplete />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                10K+
              </div>
              <div className="text-blue-200 drop-shadow">Chỗ Ở</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                50+
              </div>
              <div className="text-blue-200 drop-shadow">Quốc Gia</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                1M+
              </div>
              <div className="text-blue-200 drop-shadow">Khách Hài Lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
