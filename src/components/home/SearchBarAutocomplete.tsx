"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { getLocations } from "@/lib/locationService";
import { searchWithoutAccents } from "@/lib/utils";

type LocationItem = {
  id: number;
  tenViTri?: string;
  tinhThanh?: string;
  quocGia?: string;
  hinhAnh?: string;
};

export default function SearchBarAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load locations on mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const res = (await getLocations()) as any;
        if (res.success) {
          setLocations(res.locations || []);
        } else {
          // Silently fail - locations will just be empty
          console.warn("⚠️ Không thể tải danh sách vị trí:", res.message);
        }
      } catch (err) {
        // Silently fail - locations will just be empty
        console.warn("⚠️ Lỗi khi tải danh sách vị trí:", err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
  }, []);

  // Filter locations based on query (hỗ trợ không dấu)
  useEffect(() => {
    if (!query.trim()) {
      setFilteredLocations([]);
      setIsOpen(false);
    } else {
      const filtered = locations.filter((loc) => {
        const searchText = `${loc.tenViTri || ""} ${loc.tinhThanh || ""} ${loc.quocGia || ""}`.trim();
        return searchWithoutAccents(searchText, query);
      });
      setFilteredLocations(filtered.slice(0, 6));
      setIsOpen(filtered.length > 0);
    }
  }, [query, locations]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationItem) => {
    const locationText = `${loc.tenViTri || ""}${loc.tinhThanh ? `, ${loc.tinhThanh}` : ""}${loc.quocGia ? `, ${loc.quocGia}` : ""}`.trim();
    
    // Sử dụng flushSync để force update state ngay lập tức
    flushSync(() => {
      setQuery(locationText);
      setIsOpen(false);
    });
    
    // Delay navigation để người dùng thấy text đã được chọn
    setTimeout(() => {
      router.push(
        `/search?location=${loc.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Tìm location từ query nếu có
    const selectedLocation = locations.find(
      (loc) => query.toLowerCase().includes(loc.tenViTri?.toLowerCase() || "") ||
               query.toLowerCase().includes(loc.tinhThanh?.toLowerCase() || "")
    );
    
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());
    if (selectedLocation) {
      params.append("location", selectedLocation.id.toString());
    } else if (query.trim()) {
      // Nếu có query nhưng không tìm thấy location, vẫn truyền keyword
      params.append("keyword", query.trim());
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-4">
          {/* Location with Autocomplete */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Địa điểm
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setIsOpen(true)}
                placeholder="Tìm kiếm điểm đến"
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-400"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Autocomplete Dropdown */}
            {isOpen && filteredLocations.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">
                    Đang tải...
                  </div>
                ) : (
                  <ul className="py-2">
                    {filteredLocations.map((loc) => (
                      <li key={loc.id}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectLocation(loc);
                          }}
                          className="w-full px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors text-left"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
                            {loc.hinhAnh ? (
                              <img
                                src={loc.hinhAnh}
                                alt={loc.tenViTri || "Location"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
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
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {loc.tenViTri}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {loc.tinhThanh}, {loc.quocGia}
                            </div>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Check In */}
          <div className="space-y-2">
            <label
              htmlFor="checkIn"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nhận phòng
            </label>
            <input
              type="date"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>

          {/* Check Out */}
          <div className="space-y-2">
            <label
              htmlFor="checkOut"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Trả phòng
            </label>
            <input
              type="date"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label
              htmlFor="guests"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Khách
            </label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value={1}>1 khách</option>
              <option value={2}>2 khách</option>
              <option value={3}>3 khách</option>
              <option value={4}>4 khách</option>
              <option value={5}>5 khách</option>
              <option value={6}>6+ khách</option>
            </select>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Location with Autocomplete */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label
              htmlFor="location-mobile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Địa điểm
            </label>
            <div className="relative">
              <input
                type="text"
                id="location-mobile"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setIsOpen(true)}
                placeholder="Tìm kiếm điểm đến"
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200 text-gray-900 font-medium placeholder-gray-400"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Mobile Autocomplete Dropdown */}
            {isOpen && filteredLocations.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                <ul className="py-2">
                  {filteredLocations.map((loc) => (
                    <li key={loc.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelectLocation(loc);
                        }}
                        className="w-full px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors text-left"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
                          {loc.hinhAnh ? (
                            <img
                              src={loc.hinhAnh}
                              alt={loc.tenViTri || "Location"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-gray-400"
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
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {loc.tenViTri}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {loc.tinhThanh}, {loc.quocGia}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Date and Guests Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Check In */}
            <div className="space-y-2">
              <label
                htmlFor="checkIn-mobile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nhận phòng
              </label>
              <input
                type="date"
                id="checkIn-mobile"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>

            {/* Check Out */}
            <div className="space-y-2">
              <label
                htmlFor="checkOut-mobile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Trả phòng
              </label>
              <input
                type="date"
                id="checkOut-mobile"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label
              htmlFor="guests-mobile"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Khách
            </label>
            <select
              id="guests-mobile"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
            >
              <option value={1}>1 khách</option>
              <option value={2}>2 khách</option>
              <option value={3}>3 khách</option>
              <option value={4}>4 khách</option>
              <option value={5}>5 khách</option>
              <option value={6}>6+ khách</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Tìm kiếm</span>
          </button>
        </div>
      </form>
    </div>
  );
}
