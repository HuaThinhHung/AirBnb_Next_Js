"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLocationById, updateLocation } from "@/lib/locationService";
import Link from "next/link";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();
  const locationId = params.id as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
    hinhAnh: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocation();
  }, [locationId]);

  const fetchLocation = async () => {
    setLoading(true);
    const result = (await getLocationById(Number(locationId))) as {
      success: boolean;
      location: Location;
    };

    if (result.success && result.location) {
      setLocation(result.location);
      setFormData({
        tenViTri: result.location.tenViTri || "",
        tinhThanh: result.location.tinhThanh || "",
        quocGia: result.location.quocGia || "",
        hinhAnh: result.location.hinhAnh || "",
      });
    } else {
      setError("Không tìm thấy vị trí");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = (await updateLocation(Number(locationId), formData)) as {
      success: boolean;
      location?: unknown;
      message?: string;
    };
    setSubmitting(false);

    if (result.success) {
      alert("✅ Cập nhật thành công!");
      router.push(`/admin/locations/${locationId}`);
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

  if (error && !location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <Link
            href="/admin/locations"
            className="text-blue-600 hover:underline"
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
              📍 Chỉnh sửa vị trí
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin: {location?.tenViTri}
            </p>
          </div>
          <Link
            href={`/admin/locations/${locationId}`}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Quay lại
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên vị trí */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tên vị trí <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tenViTri}
                onChange={(e) =>
                  setFormData({ ...formData, tenViTri: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Tên vị trí"
              />
            </div>

            {/* Tỉnh thành */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tinhThanh}
                onChange={(e) =>
                  setFormData({ ...formData, tinhThanh: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Tỉnh/Thành phố"
              />
            </div>

            {/* Quốc gia */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Quốc gia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.quocGia}
                onChange={(e) =>
                  setFormData({ ...formData, quocGia: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Quốc gia"
              />
            </div>

            {/* Hình ảnh URL */}
            <div>
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

            {/* Preview */}
            {formData.hinhAnh && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Preview
                </label>
                <div className="relative h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.hinhAnh}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {submitting ? "Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
              <Link
                href={`/admin/locations/${locationId}`}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Hủy
              </Link>
            </div>
          </form>
        </div>

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
                <li>• Tên vị trí nên ngắn gọn và dễ hiểu</li>
                <li>• Kiểm tra kỹ tên tỉnh/thành và quốc gia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
