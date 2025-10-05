"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getRooms } from "@/lib/roomService";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [keyword, setKeyword] = useState("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [beds, setBeds] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc"
  >("priceAsc");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = (await getRooms({ pageSize: 100 })) as {
          success: boolean;
          rooms: any[];
          message?: string;
        };
        if (result.success) {
          setRooms(result.rooms);
        } else {
          setError(result.message || "Không thể lấy dữ liệu phòng");
        }
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filtered = useMemo(() => {
    let list = rooms.slice();
    const q = keyword.trim().toLowerCase();
    if (q)
      list = list.filter(
        (r) =>
          r.tenPhong?.toLowerCase().includes(q) ||
          r.moTa?.toLowerCase().includes(q)
      );
    if (bedrooms)
      list = list.filter((r) => (r.phongNgu || 0) >= Number(bedrooms));
    if (beds) list = list.filter((r) => (r.giuong || 0) >= Number(beds));
    if (maxPrice)
      list = list.filter((r) => (r.giaTien || 0) <= Number(maxPrice));
    if (guests) list = list.filter((r) => (r.khach || 0) >= Number(guests));

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
  }, [rooms, keyword, bedrooms, beds, maxPrice, guests, sortBy]);

  // Paginated results
  const paginatedRooms = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Khám phá các phòng đẹp
          </h1>
          <p className="text-xl text-gray-600">
            Tìm phòng hoàn hảo cho chuyến đi của bạn với {rooms.length} lựa chọn
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
          </div>

          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Tìm kiếm phòng
              </label>
              <input
                type="text"
                placeholder="Nhập tên phòng hoặc mô tả..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔄 Sắp xếp theo
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
              >
                <option value="priceAsc">💰 Giá tăng dần</option>
                <option value="priceDesc">💎 Giá giảm dần</option>
                <option value="nameAsc">🔤 Tên A-Z</option>
                <option value="nameDesc">🔤 Tên Z-A</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-5 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👥 Số khách (tối thiểu)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 2"
                value={guests}
                onChange={(e) => {
                  setGuests(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🛏️ Phòng ngủ (tối thiểu)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 1"
                value={bedrooms}
                onChange={(e) => {
                  setBedrooms(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🛌 Giường (tối thiểu)
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 1"
                value={beds}
                onChange={(e) => {
                  setBeds(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💵 Giá tối đa (₫)
              </label>
              <input
                type="number"
                placeholder="10,000,000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
              />
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-5 pt-5 border-t border-gray-200 text-center">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 text-lg">
                {filtered.length}
              </span>{" "}
              <span className="font-medium">
                phòng phù hợp với tìm kiếm của bạn
              </span>
            </p>
          </div>
        </div>

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
            <div className="text-7xl mb-6">🏠</div>
            <p className="text-2xl text-gray-800 font-bold mb-2">
              Không tìm thấy phòng nào
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Thử điều chỉnh các bộ lọc của bạn
            </p>
            <button
              onClick={() => {
                setKeyword("");
                setBedrooms("");
                setBeds("");
                setMaxPrice("");
                setGuests("");
                setPage(1);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Xóa tất cả bộ lọc
            </button>
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
