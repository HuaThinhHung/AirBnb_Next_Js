"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getLocationById,
  uploadLocationImage,
  deleteLocation,
} from "@/lib/locationService";
import Link from "next/link";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, [locationId]);

  const fetchLocation = async () => {
    setLoading(true);
    const result = (await getLocationById(Number(locationId))) as {
      success: boolean;
      location: Location;
    };

    if (result.success) {
      setLocation(result.location);
    } else {
      alert("Không tìm thấy vị trí");
      router.push("/admin/locations");
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
    const result = (await uploadLocationImage(Number(locationId), file)) as {
      success: boolean;
      message?: string;
    };
    setUploading(false);

    if (result.success) {
      alert("✅ Upload ảnh thành công!");
      fetchLocation();
    } else {
      alert("❌ Lỗi: " + (result.message || "Không thể upload ảnh"));
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa vị trí "${location?.tenViTri}"?`))
      return;

    const result = (await deleteLocation(Number(locationId))) as {
      success: boolean;
      message?: string;
    };
    if (result.success) {
      alert("✅ Xóa vị trí thành công!");
      router.push("/admin/locations");
    } else {
      alert("❌ Lỗi: " + (result.message || "Không thể xóa vị trí"));
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

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Không tìm thấy vị trí</p>
          <Link
            href="/admin/locations"
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
              📍 Chi tiết vị trí
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {location.id}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/locations"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Quay lại
            </Link>
            <Link
              href={`/admin/locations/${locationId}/edit`}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              ✏️ Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hình ảnh</h2>

            <div className="mb-4">
              {location.hinhAnh ? (
                <img
                  src={location.hinhAnh}
                  alt={location.tenViTri}
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                  <span className="text-6xl">🏙️</span>
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

          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Thông tin chi tiết
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-semibold text-gray-700">ID:</div>
                <div className="col-span-2 text-gray-900 font-mono">
                  #{location.id}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-semibold text-gray-700">
                  Tên vị trí:
                </div>
                <div className="col-span-2 text-gray-900 font-medium text-lg">
                  {location.tenViTri}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-semibold text-gray-700">
                  Tỉnh/Thành:
                </div>
                <div className="col-span-2 text-gray-900">
                  🏙️ {location.tinhThanh}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-semibold text-gray-700">
                  Quốc gia:
                </div>
                <div className="col-span-2 text-gray-900">
                  🌍 {location.quocGia}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-semibold text-gray-700">
                  Hình ảnh:
                </div>
                <div className="col-span-2 text-gray-900 text-sm break-all">
                  {location.hinhAnh ? (
                    <a
                      href={location.hinhAnh}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {location.hinhAnh.substring(0, 50)}...
                    </a>
                  ) : (
                    <span className="text-gray-500">Chưa có ảnh</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Hành động</h2>
          <div className="flex gap-3">
            <Link
              href={`/admin/locations/${locationId}/edit`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              ✏️ Chỉnh sửa thông tin
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              🗑️ Xóa vị trí
            </button>
          </div>
        </div>

        {/* Rooms in this location */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                🏠 Phòng tại vị trí này
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Xem danh sách phòng thuộc vị trí này
              </p>
            </div>
            <Link
              href={`/admin/rooms?location=${locationId}`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Xem phòng →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
