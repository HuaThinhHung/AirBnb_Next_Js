"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById, uploadRoomImage, deleteRoom } from "@/lib/roomService";
import { getLocationById } from "@/lib/locationService";
import Link from "next/link";

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
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    setLoading(true);
    const result = (await getRoomById(Number(roomId))) as {
      success: boolean;
      room: Room;
    };

    if (result.success && result.room) {
      setRoom(result.room);

      // Fetch location
      const locationResult = (await getLocationById(result.room.maViTri)) as {
        success: boolean;
        location: Location;
      };
      if (locationResult.success) {
        setLocation(locationResult.location);
      }
    } else {
      alert("Không tìm thấy phòng");
      router.push("/admin/rooms");
    }
    setLoading(false);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    setUploading(true);
    const result = (await uploadRoomImage(Number(roomId), file)) as {
      success: boolean;
      message?: string;
    };
    setUploading(false);

    if (result.success) {
      alert("✅ Upload ảnh thành công!");
      fetchRoom();
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa phòng "${room?.tenPhong}"?`)) return;

    const result = (await deleteRoom(Number(roomId))) as {
      success: boolean;
      message?: string;
    };
    if (result.success) {
      alert("✅ Xóa phòng thành công!");
      router.push("/admin/rooms");
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const amenities = room
    ? [
        { key: "wifi", label: "📶 Wifi", value: room.wifi },
        { key: "tivi", label: "📺 Tivi", value: room.tivi },
        { key: "dieuHoa", label: "❄️ Điều hòa", value: room.dieuHoa },
        { key: "bep", label: "🍳 Bếp", value: room.bep },
        { key: "mayGiat", label: "🧺 Máy giặt", value: room.mayGiat },
        { key: "banLa", label: "👔 Bàn là", value: room.banLa },
        { key: "banUi", label: "🪑 Bàn ủi", value: room.banUi },
        { key: "doXe", label: "🚗 Bãi đỗ xe", value: room.doXe },
        { key: "hoBoi", label: "🏊 Hồ bơi", value: room.hoBoi },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Không tìm thấy phòng</p>
          <Link
            href="/admin/rooms"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🏠 Chi tiết phòng
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {room.id}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/rooms"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Quay lại
            </Link>
            <Link
              href={`/admin/rooms/${roomId}/edit`}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              ✏️ Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h2>

              <div className="mb-4">
                {room.hinhAnh ? (
                  <img
                    src={room.hinhAnh}
                    alt={room.tenPhong}
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <span className="text-6xl">🏠</span>
                  </div>
                )}
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center">
                  {uploading ? "Đang upload..." : "📷 Upload ảnh mới"}
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-2 text-center">
                JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin cơ bản
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {room.tenPhong}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">ID: #{room.id}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(room.giaTien)}
                    <span className="text-sm text-gray-500 font-normal">
                      {" "}
                      / đêm
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Vị trí</div>
                      <div className="font-semibold text-gray-900">
                        📍 {location?.tenViTri}, {location?.tinhThanh}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Quốc gia</div>
                      <div className="font-semibold text-gray-900">
                        🌍 {location?.quocGia}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-1">👥</div>
                      <div className="text-sm text-gray-600">Khách</div>
                      <div className="font-bold text-gray-900">
                        {room.khach}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-1">🛏️</div>
                      <div className="text-sm text-gray-600">Phòng ngủ</div>
                      <div className="font-bold text-gray-900">
                        {room.phongNgu}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-1">🛌</div>
                      <div className="text-sm text-gray-600">Giường</div>
                      <div className="font-bold text-gray-900">
                        {room.giuong}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl mb-1">🚿</div>
                      <div className="text-sm text-gray-600">Phòng tắm</div>
                      <div className="font-bold text-gray-900">
                        {room.phongTam}
                      </div>
                    </div>
                  </div>
                </div>

                {room.moTa && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600 mb-2">Mô tả</div>
                    <p className="text-gray-900">{room.moTa}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Tiện nghi
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.key}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 ${
                      amenity.value
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <span className="text-xl">
                      {amenity.value ? "✅" : "❌"}
                    </span>
                    <span className="font-medium text-gray-900">
                      {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Hành động
              </h2>
              <div className="flex gap-3">
                <Link
                  href={`/admin/rooms/${roomId}/edit`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  ✏️ Chỉnh sửa thông tin
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  🗑️ Xóa phòng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
