"use client";

import { useState } from "react";
import { createBooking } from "@/lib/bookingService";

export default function TestBookingPage() {
  const [formData, setFormData] = useState({
    maPhong: 1,
    ngayDen: "",
    ngayDi: "",
    soLuongKhach: 1,
    maNguoiDung: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log("📤 Sending booking data:", formData);
      const res = await createBooking(formData);

      console.log("📥 Response:", res);
      setResult(res);

      if (!res.success) {
        setError(res.message);
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("ma") || name.includes("so") ? Number(value) : value,
    }));
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test API Đặt Phòng
            </h1>
            <p className="text-gray-600">POST /api/dat-phong</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã Phòng *
                </label>
                <input
                  type="number"
                  name="maPhong"
                  value={formData.maPhong}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ID phòng"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Lượng Khách *
                </label>
                <input
                  type="number"
                  name="soLuongKhach"
                  value={formData.soLuongKhach}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Số khách"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Đến (Check-in) *
                </label>
                <input
                  type="date"
                  name="ngayDen"
                  value={formData.ngayDen}
                  onChange={handleChange}
                  required
                  min={minDate}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Đi (Check-out) *
                </label>
                <input
                  type="date"
                  name="ngayDi"
                  value={formData.ngayDi}
                  onChange={handleChange}
                  required
                  min={formData.ngayDen || minDate}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã Người Dùng *
                </label>
                <input
                  type="number"
                  name="maNguoiDung"
                  value={formData.maNguoiDung}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ID người dùng"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Gửi Đặt Phòng"}
            </button>
          </form>

          {/* Request Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">📤 Request Data:</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">
                {result.success ? "✅ Success Response:" : "❌ Error Response:"}
              </h3>
              <div
                className={`p-6 rounded-lg ${
                  result.success
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-red-50 border-2 border-red-200"
                }`}
              >
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {/* API Docs */}
          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">
              📚 API Documentation
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-blue-900">Endpoint:</p>
              <code className="bg-blue-100 px-2 py-1 rounded">
                POST https://airbnbnew.cybersoft.edu.vn/api/dat-phong
              </code>

              <p className="font-semibold text-blue-900 mt-4">Headers:</p>
              <code className="bg-blue-100 px-2 py-1 rounded block">
                TokenCybersoft: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </code>

              <p className="font-semibold text-blue-900 mt-4">Request Body:</p>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
                {`{
  "maPhong": 1,
  "ngayDen": "2025-01-20",
  "ngayDi": "2025-01-22",
  "soLuongKhach": 2,
  "maNguoiDung": 1
}`}
              </pre>

              <p className="font-semibold text-blue-900 mt-4">
                Response (Success):
              </p>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
                {`{
  "statusCode": 200,
  "content": {
    "id": 123,
    "maPhong": 1,
    "ngayDen": "2025-01-20T00:00:00",
    "ngayDi": "2025-01-22T00:00:00",
    "soLuongKhach": 2,
    "maNguoiDung": 1
  },
  "message": "Đặt phòng thành công"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
