"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLocation } from "@/lib/locationService";
import Link from "next/link";

export default function CreateLocationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
    hinhAnh: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = (await createLocation(formData)) as {
      success: boolean;
      message?: string;
    };
    setLoading(false);

    if (result.success) {
      alert("✅ Thêm vị trí thành công!");
      router.push("/admin/locations");
    } else {
      setError(result.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            📍 Thêm vị trí mới
          </h1>
          <Link
            href="/admin/locations"
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
                placeholder="Ví dụ: Quận 1, Bãi biển Nha Trang, ..."
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
                placeholder="Ví dụ: Hồ Chí Minh, Đà Nẵng, ..."
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
                placeholder="Ví dụ: Việt Nam"
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
                placeholder="https://example.com/image.jpg (Tùy chọn)"
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Có thể để trống và upload ảnh sau
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
                      (e.target as HTMLImageElement).src = "";
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
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? "Đang lưu..." : "✅ Thêm vị trí"}
              </button>
              <Link
                href="/admin/locations"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
