"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRoomsByLocation } from "@/lib/roomService";
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

export default function RoomsByLocationPage() {
  const params = useParams();
  const locationId = params?.locationId as string;

  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [priceRange, setPriceRange] = useState<string>("all");
  const [roomType, setRoomType] = useState<string>("all");
  const [guests, setGuests] = useState<string>("all");
  const [amenities, setAmenities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch location info
        const locRes = await getLocationById(Number(locationId));
        if (locRes.success && locRes.location) {
          setLocation(locRes.location);
        }

        // Fetch rooms
        const roomsRes = await getRoomsByLocation(Number(locationId));
        if (roomsRes.success) {
          setRooms(roomsRes.rooms || []);
        } else {
          setError(roomsRes.message || "Không thể tải danh sách phòng");
        }
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationId]);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    let result = rooms.slice();

    // Price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      result = result.filter((r) => {
        if (max) return r.giaTien >= min && r.giaTien <= max;
        return r.giaTien >= min;
      });
    }

    // Room type (bedrooms)
    if (roomType !== "all") {
      const numBedrooms = Number(roomType);
      result = result.filter((r) => (r.phongNgu || 0) >= numBedrooms);
    }

    // Guests
    if (guests !== "all") {
      const numGuests = Number(guests);
      result = result.filter((r) => (r.khach || 0) >= numGuests);
    }

    // Amenities
    if (amenities.length > 0) {
      result = result.filter((r) => {
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

    return result;
  }, [rooms, priceRange, roomType, guests, amenities]);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">Đang tải phòng...</p>
        </div>
      </div>
    );
  }

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
                  : "Chỗ ở"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRooms.length} chỗ ở • {location?.quocGia}
              </p>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setPriceRange("all")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "all"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Tất cả giá
            </button>
            <button
              onClick={() => setPriceRange("0-500000")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "0-500000"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              Dưới 500K
            </button>
            <button
              onClick={() => setPriceRange("500000-1000000")}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all ${
                priceRange === "500000-1000000"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
              }`}
            >
              500K - 1M
            </button>
            <button
              onClick={() => setPriceRange("1000000-999999999")}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rooms List - Left Side */}
          <div className="space-y-4">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-xl text-gray-600 font-medium">
                  Không có phòng phù hợp
                </p>
                <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc của bạn</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100 hover:shadow-lg group"
                >
                  {/* Image */}
                  <div className="w-1/3 flex-shrink-0">
                    <div className="relative h-40 rounded-xl overflow-hidden">
                      <img
                        src={
                          room.hinhAnh ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400"
                        }
                        alt={room.tenPhong}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600">
                          {room.tenPhong}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          <svg
                            className="w-4 h-4 text-gray-900"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold">4.9</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {room.moTa || "Phòng tuyệt vời cho kỳ nghỉ của bạn"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        {room.khach && <span>{room.khach} khách</span>}
                        {room.phongNgu && (
                          <>
                            <span>•</span>
                            <span>{room.phongNgu} phòng ngủ</span>
                          </>
                        )}
                        {room.giuong && (
                          <>
                            <span>•</span>
                            <span>{room.giuong} giường</span>
                          </>
                        )}
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {room.wifi && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            Wifi
                          </span>
                        )}
                        {room.bep && (
                          <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                            Bếp
                          </span>
                        )}
                        {room.dieuHoa && (
                          <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full">
                            Điều hòa
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          {room.giaTien.toLocaleString()}₫
                        </span>
                        <span className="text-sm text-gray-600"> / đêm</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Map - Right Side (Sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-36 h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-20 h-20 text-blue-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-700 font-semibold text-lg">Bản đồ</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {location?.tenViTri}, {location?.tinhThanh}
                  </p>
                  <p className="text-gray-400 text-xs mt-4">
                    (Google Maps integration sẽ được thêm vào)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

