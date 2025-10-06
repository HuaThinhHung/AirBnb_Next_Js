"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [beds, setBeds] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
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

        // If location parameter exists, fetch by location
        if (locationParam) {
          const locationId = Number(locationParam);

          // Fetch location info
          const locRes = (await getLocationById(locationId)) as {
            success: boolean;
            location: LocationInfo;
          };
          if (locRes.success && locRes.location) {
            setLocation(locRes.location);
          }

          // Fetch rooms by location
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
          // Fetch all rooms
          const result = (await getRooms({ pageSize: 100 })) as {
            success: boolean;
            rooms: RoomItem[];
            message?: string;
          };
          if (result.success) {
            setRooms(result.rooms);
          } else {
            setError(result.message || "Không thể lấy dữ liệu phòng");
          }
        }
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locationParam]);

  const filtered = useMemo(() => {
    let list = rooms.slice();
    const q = keyword.trim().toLowerCase();
    if (q)
      list = list.filter(
        (r) =>
          r.tenPhong?.toLowerCase().includes(q) ||
          r.moTa?.toLowerCase().includes(q)
      );

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      list = list.filter((r) => {
        if (max) return r.giaTien >= min && r.giaTien <= max;
        return r.giaTien >= min;
      });
    }

    if (bedrooms)
      list = list.filter((r) => (r.phongNgu || 0) >= Number(bedrooms));
    if (beds) list = list.filter((r) => (r.giuong || 0) >= Number(beds));
    if (maxPrice)
      list = list.filter((r) => (r.giaTien || 0) <= Number(maxPrice));
    if (guests) list = list.filter((r) => (r.khach || 0) >= Number(guests));

    // Amenities filter
    if (amenities.length > 0) {
      list = list.filter((r) => {
        return amenities.every((amenity) => {
          switch (amenity) {
            case "wifi":
              return r.wifi;
            case "bep":
              return r.bep;
            case "dieuHoa":
              return r.dieuHoa;
            case "doXe":
              return r.doXe;
            case "hoBoi":
              return r.hoBoi;
            case "mayGiat":
              return r.mayGiat;
            default:
              return true;
          }
        });
      });
    }

    switch (sortBy) {
      case "priceAsc":
        list.sort((a, b) => a.giaTien - b.giaTien);
        break;
      case "priceDesc":
        list.sort((a, b) => b.giaTien - a.giaTien);
        break;
      case "nameAsc":
        list.sort((a, b) => a.tenPhong.localeCompare(b.tenPhong));
        break;
      case "nameDesc":
        list.sort((a, b) => b.tenPhong.localeCompare(a.tenPhong));
        break;
    }

    return list;
  }, [
    rooms,
    keyword,
    priceRange,
    bedrooms,
    beds,
    maxPrice,
    guests,
    amenities,
    sortBy,
  ]);

  // Paginated results
  const paginatedRooms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length]);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-20 z-40">
        <div className="max-w-[1760px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {location
                  ? `Chỗ ở tại ${location.tenViTri}, ${location.tinhThanh}`
                  : "Tất cả chỗ ở"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filtered.length} chỗ ở{location && ` • ${location.quocGia}`}
              </p>
            </div>
            {location && (
              <Link
                href="/rooms"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                ← Xem tất cả phòng
              </Link>
            )}
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setPriceRange("all");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "all"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Tất cả giá
            </button>
            <button
              onClick={() => {
                setPriceRange("0-500000");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "0-500000"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Dưới 500K
            </button>
            <button
              onClick={() => {
                setPriceRange("500000-1000000");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "500000-1000000"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              500K - 1M
            </button>
            <button
              onClick={() => {
                setPriceRange("1000000-999999999");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "1000000-999999999"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Trên 1M
            </button>

            <div className="w-px h-6 bg-gray-300"></div>

            <button
              onClick={() => toggleAmenity("wifi")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                amenities.includes("wifi")
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Wifi
            </button>
            <button
              onClick={() => toggleAmenity("bep")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                amenities.includes("bep")
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Bếp
            </button>
            <button
              onClick={() => toggleAmenity("dieuHoa")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                amenities.includes("dieuHoa")
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Điều hòa
            </button>
            <button
              onClick={() => toggleAmenity("doXe")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                amenities.includes("doXe")
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Đỗ xe
            </button>
            <button
              onClick={() => toggleAmenity("hoBoi")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                amenities.includes("hoBoi")
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Hồ bơi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1760px] mx-auto px-6 py-6">
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold text-lg">
              Đang tải phòng...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl text-center">
            <p className="text-red-700 font-semibold text-lg">
              ⚠️ Lỗi: {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-xl text-gray-600 font-medium">
              Không có phòng phù hợp
            </p>
            <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc của bạn</p>
          </div>
        ) : (
          <>
            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        room.hinhAnh ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800"
                      }
                      alt={room.tenPhong}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                      <p className="text-blue-600 font-bold text-lg">
                        {room.giaTien.toLocaleString()}₫
                      </p>
                      <p className="text-gray-600 text-xs font-medium text-center">
                        / đêm
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {room.tenPhong}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {room.moTa || "Phòng tuyệt vời cho kỳ nghỉ của bạn"}
                    </p>

                    {/* Amenities */}
                    <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                      {room.khach && (
                        <span className="flex items-center gap-1">
                          <span>👥</span>
                          <span className="font-medium">{room.khach}</span>
                        </span>
                      )}
                      {room.phongNgu && (
                        <span className="flex items-center gap-1">
                          <span>🛏️</span>
                          <span className="font-medium">{room.phongNgu}</span>
                        </span>
                      )}
                      {room.giuong && (
                        <span className="flex items-center gap-1">
                          <span>🛌</span>
                          <span className="font-medium">{room.giuong}</span>
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:from-blue-700 group-hover:to-cyan-700 text-white font-semibold transition-all duration-200">
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  ← Trước
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-md">
                  Trang {page} / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
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
