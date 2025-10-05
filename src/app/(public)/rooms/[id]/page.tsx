"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById } from "@/lib/roomService";
import { getLocationById } from "@/lib/locationService";

interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
}

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetail();
    }
  }, [roomId]);

  const fetchRoomDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = (await getRoomById(roomId)) as {
        success: boolean;
        room: Room;
        message?: string;
      };

      if (result.success) {
        setRoom(result.room);

        // Fetch location info
        const locationResult = (await getLocationById(result.room.maViTri)) as {
          success: boolean;
          location: Location;
        };

        if (locationResult.success) {
          setLocation(locationResult.location);
        }
      } else {
        setError(result.message || "Không thể tải thông tin phòng");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const amenities = room
    ? [
        { icon: "🧺", label: "Máy giặt", available: room.mayGiat },
        { icon: "🔥", label: "Bàn là", available: room.banLa },
        { icon: "📺", label: "Tivi", available: room.tivi },
        { icon: "❄️", label: "Điều hòa", available: room.dieuHoa },
        { icon: "📶", label: "Wifi", available: room.wifi },
        { icon: "🍳", label: "Bếp", available: room.bep },
        { icon: "🚗", label: "Đỗ xe", available: room.doXe },
        { icon: "🏊", label: "Hồ bơi", available: room.hoBoi },
        { icon: "👔", label: "Bàn ủi", available: room.banUi },
      ]
    : [];

  const defaultImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Lỗi</h2>
          <p>{error || "Không tìm thấy phòng"}</p>
          <button
            onClick={() => router.push("/rooms")}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quay lại danh sách phòng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={imageError || !room.hinhAnh ? defaultImage : room.hinhAnh}
          alt={room.tenPhong}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => router.push("/rooms")}
          className="absolute top-6 left-6 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          ← Quay lại
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Location */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {room.tenPhong}
              </h1>
              {location && (
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  <span>
                    {location.tenViTri}, {location.tinhThanh},{" "}
                    {location.quocGia}
                  </span>
                </div>
              )}
            </div>

            {/* Room Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-sm text-gray-600">Khách</div>
                <div className="text-xl font-bold text-gray-900">
                  {room.khach}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🚪</div>
                <div className="text-sm text-gray-600">Phòng ngủ</div>
                <div className="text-xl font-bold text-gray-900">
                  {room.phongNgu}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🛏️</div>
                <div className="text-sm text-gray-600">Giường</div>
                <div className="text-xl font-bold text-gray-900">
                  {room.giuong}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🚿</div>
                <div className="text-sm text-gray-600">Phòng tắm</div>
                <div className="text-xl font-bold text-gray-900">
                  {room.phongTam}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả</h2>
              <p className="text-gray-700 leading-relaxed">{room.moTa}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tiện nghi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      amenity.available
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        amenity.available ? "text-green-900" : "text-gray-500"
                      }`}
                    >
                      {amenity.label}
                    </span>
                    {amenity.available && (
                      <span className="ml-auto text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${room.giaTien}
                  <span className="text-lg font-normal text-gray-600">
                    /đêm
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nhận phòng
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày trả phòng
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số khách
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {Array.from({ length: room.khach }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} khách
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <button
                onClick={() => alert("Chức năng đặt phòng đang phát triển")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Đặt phòng ngay
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Bạn sẽ không bị tính phí ngay lúc này
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
