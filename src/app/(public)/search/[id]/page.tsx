"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLocationById } from "@/lib/locationService";
import { getRoomsByLocation } from "@/lib/roomService";

type LocationDetail = {
  id: number;
  tenViTri?: string;
  tinhThanh?: string;
  quocGia?: string;
  hinhAnh?: string;
};

type RoomItem = {
  id: number;
  tenPhong: string;
  giaTien: number;
  hinhAnh?: string;
  moTa?: string;
  khach?: number;
  phongNgu?: number;
  giuong?: number;
};

export default function LocationDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Fetch location details
      const locRes = (await getLocationById(id)) as {
        success: boolean;
        location?: LocationDetail;
        message?: string;
      };
      if (!isMounted) return;

      if (locRes.success) {
        setLocation(locRes.location as LocationDetail);

        // Fetch rooms for this location
        setLoadingRooms(true);
        const roomsRes = (await getRoomsByLocation(Number(id))) as {
          success: boolean;
          rooms: RoomItem[];
          message?: string;
        };
        if (!isMounted) return;

        if (roomsRes.success) {
          setRooms(roomsRes.rooms.slice(0, 8) || []);
        }
        setLoadingRooms(false);
      } else {
        setError(locRes.message || "Không thể tải thông tin vị trí");
      }

      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/search"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Quay lại trang tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  if (!location) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/search"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Tìm kiếm
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {location.tenViTri}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] bg-gray-900">
        {location.hinhAnh ? (
          <img
            src={location.hinhAnh}
            alt={location.tenViTri || "Location"}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {location.tenViTri}
            </h1>
            <p className="text-xl text-white/90 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {location.tinhThanh}, {location.quocGia}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Rooms Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chỗ ở tại {location.tenViTri}
              </h2>
              <p className="text-gray-600 mt-1">{rooms.length} chỗ ở có sẵn</p>
            </div>
            <Link
              href={`/rooms?location=${location.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Xem tất cả phòng
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

          {loadingRooms ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="text-5xl mb-4">🏠</div>
              <p className="text-gray-600 text-lg">
                Chưa có phòng nào tại vị trí này
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
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
                    <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-lg">
                      <span className="text-sm font-bold text-gray-900">
                        {room.giaTien.toLocaleString()}₫
                      </span>
                      <span className="text-xs text-gray-600">/đêm</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {room.tenPhong}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-3">
                      {room.moTa || "Phòng tuyệt vời"}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {room.khach && <span>{room.khach} khách</span>}
                      {room.phongNgu && (
                        <>
                          <span>·</span>
                          <span>{room.phongNgu} phòng ngủ</span>
                        </>
                      )}
                      {room.giuong && (
                        <>
                          <span>·</span>
                          <span>{room.giuong} giường</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Thông tin về {location.tenViTri}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Vị trí</p>
                <p className="text-gray-600">{location.tenViTri}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Tỉnh/Thành phố</p>
                <p className="text-gray-600">{location.tinhThanh}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Quốc gia</p>
                <p className="text-gray-600">{location.quocGia}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Số chỗ ở</p>
                <p className="text-gray-600">{rooms.length} chỗ ở có sẵn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
