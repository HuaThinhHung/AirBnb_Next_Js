"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getRooms, getRoomsByLocation } from "@/lib/roomService";
import { getLocationById } from "@/lib/locationService";

type RoomItem = {
  id: number;
  tenPhong: string;
  giaTien: number;
  hinhAnh?: string;
  moTa?: string;
  khach?: number;
  phongNgu?: number;
  giuong?: number;
  phongTam?: number;
  maViTri?: number;
  mayGiat?: boolean;
  banLa?: boolean;
  tivi?: boolean;
  dieuHoa?: boolean;
  wifi?: boolean;
  bep?: boolean;
  doXe?: boolean;
  hoBoi?: boolean;
};

type LocationInfo = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh?: string;
};

function RoomsContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationCache, setLocationCache] = useState<Map<number, LocationInfo>>(new Map());

  // filters
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc"
  >("priceAsc");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (locationParam) {
          const locationId = Number(locationParam);
          const locRes = (await getLocationById(locationId)) as {
            success: boolean;
            location: LocationInfo;
          };
          if (locRes.success && locRes.location) {
            setLocation(locRes.location);
          }

          const roomsRes = (await getRoomsByLocation(locationId)) as {
            success: boolean;
            rooms: RoomItem[];
            message?: string;
          };
          if (roomsRes.success) {
            setRooms(roomsRes.rooms || []);
          } else {
            setError(roomsRes.message || "Không thể lấy dữ liệu phòng");
          }
        } else {
          const result = (await getRooms({
            pageIndex: 1,
            pageSize: 100,
            keyword: "",
          })) as { success: boolean; rooms: RoomItem[]; message?: string };
          if (result.success) {
            setRooms(result.rooms || []);
          } else {
            setError(result.message || "Không thể lấy dữ liệu phòng");
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationParam]);

  // Fetch locations for rooms
  useEffect(() => {
    const fetchLocations = async () => {
      const uniqueLocationIds = new Set<number>();
      rooms.forEach((room) => {
        if (room.maViTri) {
          uniqueLocationIds.add(room.maViTri);
        }
      });

      const newCache = new Map(locationCache);
      const promises: Promise<void>[] = [];

      uniqueLocationIds.forEach((locationId) => {
        if (!newCache.has(locationId)) {
          promises.push(
            getLocationById(locationId)
              .then((res) => {
                if (res.success && res.location) {
                  newCache.set(locationId, res.location);
                }
              })
              .catch(() => {
                // Ignore errors for individual locations
              })
          );
        }
      });

      if (promises.length > 0) {
        await Promise.all(promises);
        setLocationCache(newCache);
      }
    };

    if (rooms.length > 0) {
      fetchLocations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  const getLocationName = (maViTri?: number): string => {
    if (!maViTri) return "Chưa có địa điểm";
    const loc = locationCache.get(maViTri);
    if (loc) {
      return `${loc.tenViTri}, ${loc.tinhThanh}`;
    }
    return "Đang tải...";
  };

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    if (keyword) {
      filtered = filtered.filter((room) =>
        room.tenPhong.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (priceRange === "under-50") {
      filtered = filtered.filter((r) => r.giaTien < 50);
    } else if (priceRange === "50-100") {
      filtered = filtered.filter((r) => r.giaTien >= 50 && r.giaTien <= 100);
    } else if (priceRange === "100-200") {
      filtered = filtered.filter((r) => r.giaTien > 100 && r.giaTien <= 200);
    } else if (priceRange === "over-200") {
      filtered = filtered.filter((r) => r.giaTien > 200);
    }

    if (bedrooms) {
      const bedroomsNum = Number(bedrooms);
      filtered = filtered.filter((r) => (r.phongNgu || 0) >= bedroomsNum);
    }

    if (guests) {
      const guestsNum = Number(guests);
      filtered = filtered.filter((r) => (r.khach || 0) >= guestsNum);
    }

    if (amenities.length > 0) {
      filtered = filtered.filter((room) => {
        return amenities.every((amenity) => {
          switch (amenity) {
            case "wifi":
              return room.wifi;
            case "dieuHoa":
              return room.dieuHoa;
            case "bep":
              return room.bep;
            case "hoBoi":
              return room.hoBoi;
            case "mayGiat":
              return room.mayGiat;
            case "tivi":
              return room.tivi;
            default:
              return true;
          }
        });
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === "priceAsc") return a.giaTien - b.giaTien;
      if (sortBy === "priceDesc") return b.giaTien - a.giaTien;
      if (sortBy === "nameAsc") return a.tenPhong.localeCompare(b.tenPhong);
      if (sortBy === "nameDesc") return b.tenPhong.localeCompare(a.tenPhong);
      return 0;
    });

    return filtered;
  }, [rooms, keyword, priceRange, bedrooms, guests, amenities, sortBy]);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const paginatedRooms = filteredRooms.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          {location ? (
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                {location.tenViTri}
              </h1>
              <p className="text-xl text-gray-600 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {location.tinhThanh}, {location.quocGia}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                Tất Cả Chỗ Ở
              </h1>
              <p className="text-xl text-gray-600">
                Khám phá hàng nghìn nơi lưu trú tuyệt vời
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tên phòng..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Mức giá
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">Tất cả</option>
                <option value="under-50">Dưới $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="over-200">Trên $200</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Phòng ngủ
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Tất cả</option>
                <option value="1">1+ phòng</option>
                <option value="2">2+ phòng</option>
                <option value="3">3+ phòng</option>
                <option value="4">4+ phòng</option>
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Số khách
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Tất cả</option>
                <option value="1">1+ khách</option>
                <option value="2">2+ khách</option>
                <option value="4">4+ khách</option>
                <option value="6">6+ khách</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Tiện nghi
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "wifi", label: "WiFi", icon: "📶" },
                { value: "dieuHoa", label: "Điều hòa", icon: "❄️" },
                { value: "bep", label: "Bếp", icon: "🍳" },
                { value: "hoBoi", label: "Hồ bơi", icon: "🏊" },
                { value: "mayGiat", label: "Máy giặt", icon: "🧺" },
                { value: "tivi", label: "TV", icon: "📺" },
              ].map((amenity) => (
                <button
                  key={amenity.value}
                  onClick={() => toggleAmenity(amenity.value)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    amenities.includes(amenity.value)
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {amenity.icon} {amenity.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filter */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => {
                setKeyword("");
                setPriceRange("all");
                setBedrooms("");
                setGuests("");
                setAmenities([]);
                setPage(1);
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-lg text-gray-700">
            <span className="text-3xl font-bold text-gray-900">
              {filteredRooms.length}
            </span>{" "}
            chỗ ở
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
          >
            <option value="priceAsc">Giá: Thấp → Cao</option>
            <option value="priceDesc">Giá: Cao → Thấp</option>
            <option value="nameAsc">Tên: A → Z</option>
            <option value="nameDesc">Tên: Z → A</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold text-lg">Đang tải...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <p className="text-red-700 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={
                        room.hinhAnh ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
                      }
                      alt={room.tenPhong}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-lg">
                      <span className="text-lg font-bold text-gray-900">
                        ${room.giaTien}
                      </span>
                      <span className="text-sm text-gray-600">/đêm</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {room.tenPhong}
                    </h3>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-3 text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                      <span className="text-sm font-medium text-gray-700 line-clamp-1">
                        {getLocationName(room.maViTri)}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {room.moTa || "Chỗ ở tuyệt vời"}
                    </p>

                    <div className="flex items-center gap-6 text-gray-600 border-t border-gray-100 pt-4 mb-4">
                      <span className="flex items-center gap-1.5">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-900">
                          {room.khach}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
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
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        <span className="font-semibold text-gray-900">
                          {room.phongNgu}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
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
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="font-semibold text-gray-900">
                          {room.giuong}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {room.wifi && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          WiFi
                        </span>
                      )}
                      {room.dieuHoa && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          AC
                        </span>
                      )}
                      {room.hoBoi && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          Pool
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {paginatedRooms.length === 0 && (
              <div className="text-center py-20">
                <div className="text-7xl mb-6">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy chỗ ở phù hợp
                </h3>
                <p className="text-gray-600 text-lg">
                  Thử điều chỉnh bộ lọc của bạn
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setPage(page - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  ← Trước
                </button>
                <div className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md">
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => {
                    setPage(page + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold text-lg">Đang tải...</p>
          </div>
        </div>
      }
    >
      <RoomsContent />
    </Suspense>
  );
}
