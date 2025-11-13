"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById, updateRoom } from "@/lib/roomService";
import { getLocations } from "@/lib/locationService";
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

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 100000,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 0,
    hinhAnh: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
    fetchRoom();
  }, [roomId]);

  const fetchLocations = async () => {
    const result = (await getLocations()) as {
      success: boolean;
      locations: Location[];
    };
    if (result.success) {
      setLocations(result.locations);
    }
  };

  const fetchRoom = async () => {
    setLoading(true);
    const result = (await getRoomById(Number(roomId))) as {
      success: boolean;
      room: Room;
    };

    if (result.success && result.room) {
      setRoom(result.room);
      setFormData({
        tenPhong: result.room.tenPhong || "",
        khach: result.room.khach || 1,
        phongNgu: result.room.phongNgu || 1,
        giuong: result.room.giuong || 1,
        phongTam: result.room.phongTam || 1,
        moTa: result.room.moTa || "",
        giaTien: result.room.giaTien || 100000,
        mayGiat: result.room.mayGiat || false,
        banLa: result.room.banLa || false,
        tivi: result.room.tivi || false,
        dieuHoa: result.room.dieuHoa || false,
        wifi: result.room.wifi || false,
        bep: result.room.bep || false,
        doXe: result.room.doXe || false,
        hoBoi: result.room.hoBoi || false,
        banUi: result.room.banUi || false,
        maViTri: result.room.maViTri || 0,
        hinhAnh: result.room.hinhAnh || "",
      });
    } else {
      setError("Không tìm thấy phòng");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.maViTri === 0) {
      setError("Vui lòng chọn vị trí!");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = (await updateRoom(Number(roomId), formData)) as {
      success: boolean;
      message?: string;
    };
    setSubmitting(false);

    if (result.success) {
      alert("✅ Cập nhật thành công!");
      router.push(`/admin/rooms/${roomId}`);
    } else {
      setError(result.message || "Có lỗi xảy ra");
    }
  };

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

  if (error && !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link href="/admin/rooms" className="text-blue-600 hover:underline">
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
              🏠 Chỉnh sửa phòng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin: {room?.tenPhong}
            </p>
          </div>
          <Link
            href={`/admin/rooms/${roomId}`}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Quay lại
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên phòng */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tên phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tenPhong}
                  onChange={(e) =>
                    setFormData({ ...formData, tenPhong: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Vị trí */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Vị trí <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.maViTri}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maViTri: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  <option value={0}>-- Chọn vị trí --</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.tenViTri}, {location.tinhThanh},{" "}
                      {location.quocGia}
                    </option>
                  ))}
                </select>
              </div>

              {/* Giá tiền */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Giá tiền (VNĐ/đêm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.giaTien}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      giaTien: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Số khách */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Số khách
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.khach}
                  onChange={(e) =>
                    setFormData({ ...formData, khach: Number(e.target.value) })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Phòng ngủ */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Phòng ngủ
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.phongNgu}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phongNgu: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Giường */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Số giường
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.giuong}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      giuong: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Phòng tắm */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Phòng tắm
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.phongTam}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phongTam: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* Mô tả */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  value={formData.moTa}
                  onChange={(e) =>
                    setFormData({ ...formData, moTa: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Mô tả chi tiết về phòng..."
                />
              </div>

              {/* URL Hình ảnh */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  URL Hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.hinhAnh}
                  onChange={(e) =>
                    setFormData({ ...formData, hinhAnh: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-2 text-sm text-gray-500">
                  💡 Hoặc upload ảnh tại trang chi tiết sau khi lưu
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tiện nghi</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "wifi", label: "📶 Wifi", name: "wifi" },
                { key: "tivi", label: "📺 Tivi", name: "tivi" },
                { key: "dieuHoa", label: "❄️ Điều hòa", name: "dieuHoa" },
                { key: "bep", label: "🍳 Bếp", name: "bep" },
                { key: "mayGiat", label: "🧺 Máy giặt", name: "mayGiat" },
                { key: "banLa", label: "👔 Bàn là", name: "banLa" },
                { key: "banUi", label: "🪑 Bàn ủi", name: "banUi" },
                { key: "doXe", label: "🚗 Bãi đỗ xe", name: "doXe" },
                { key: "hoBoi", label: "🏊 Hồ bơi", name: "hoBoi" },
              ].map((amenity) => (
                <label
                  key={amenity.key}
                  className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData[amenity.key as keyof typeof formData] as boolean
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [amenity.key]: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-medium">
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {submitting ? "Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
            <Link
              href={`/admin/rooms/${roomId}`}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Hủy
            </Link>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">ℹ️</div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">Lưu ý:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Upload ảnh qua trang chi tiết để có chất lượng tốt hơn
                </li>
                <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
                <li>• Đảm bảo giá tiền và số lượng khách hợp lý</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
