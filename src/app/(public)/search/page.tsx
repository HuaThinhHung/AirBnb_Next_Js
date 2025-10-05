"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocationsPagedSearch } from "@/lib/locationService";
import type { LocationsResponse } from "@/types/api";

type LocationItem = {
  id: number;
  tenViTri?: string;
  tinhThanh?: string;
  quocGia?: string;
  hinhAnh?: string;
};

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [locPage, setLocPage] = useState(1);
  const [locTotalPages, setLocTotalPages] = useState(1);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const loadLocations = async (pageIndex = 1) => {
      setLoading(true);
      setError(null);
      const res = (await getLocationsPagedSearch({
        pageIndex,
        pageSize: 12,
        keyword,
      })) as LocationsResponse;
      if (!mounted) return;
      if (res.success) {
        setLocations(res.locations || []);
        setLocTotalPages(res.pagination?.totalPages || 1);
      } else setError(res.message || "Không thể tải danh sách vị trí");
      setLoading(false);
    };
    loadLocations(1);
    return () => {
      mounted = false;
    };
  }, []);

  // Reload when keyword changes
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const res = (await getLocationsPagedSearch({
        pageIndex: 1,
        pageSize: 12,
        keyword,
      })) as LocationsResponse;
      if (!mounted) return;
      if (res.success) {
        setLocations(res.locations || []);
        setLocPage(1);
        setLocTotalPages(res.pagination?.totalPages || 1);
      } else {
        setLocations([]);
        setLocTotalPages(1);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Khám phá các địa điểm tuyệt vời
          </h1>
          <p className="text-lg text-gray-600">
            Tìm kiếm địa điểm yêu thích của bạn trên toàn thế giới
          </p>
        </div>

        {/* Search Filter */}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Tìm kiếm địa điểm
            </h2>
          </div>

          <div className="max-w-2xl">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Từ khóa
            </label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập tên vị trí, tỉnh thành, quốc gia..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <p className="text-red-700 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        loc.hinhAnh ||
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800"
                      }
                      alt={loc.tenViTri || "Location"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {loc.tenViTri || "Vị trí"}
                      </h3>
                      <p className="text-white/90 text-sm font-medium flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {loc.tinhThanh} • {loc.quocGia}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <svg
                          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
                          <p className="text-sm font-semibold text-gray-900">
                            {loc.tenViTri}
                          </p>
                          <p className="text-sm text-gray-600">
                            {loc.tinhThanh}, {loc.quocGia}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/search/${loc.id}`}
                        className="flex-1 text-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200"
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/rooms/${loc.id}`}
                        className="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Xem phòng
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {!locations.length && (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl text-gray-600 font-medium">
                    Không tìm thấy vị trí phù hợp
                  </p>
                  <p className="text-gray-500 mt-2">
                    Thử thay đổi từ khóa tìm kiếm của bạn
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {locTotalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={locPage === 1}
                  onClick={async () => {
                    const newPage = Math.max(1, locPage - 1);
                    const res = (await getLocationsPagedSearch({
                      pageIndex: newPage,
                      pageSize: 12,
                      keyword,
                    })) as LocationsResponse;
                    if (res.success) {
                      setLocations(res.locations || []);
                      setLocPage(newPage);
                      setLocTotalPages(res.pagination?.totalPages || 1);
                    }
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  ← Trước
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-md">
                  Trang {locPage} / {locTotalPages}
                </div>
                <button
                  disabled={locPage === locTotalPages}
                  onClick={async () => {
                    const newPage = Math.min(locTotalPages, locPage + 1);
                    const res = (await getLocationsPagedSearch({
                      pageIndex: newPage,
                      pageSize: 12,
                      keyword,
                    })) as LocationsResponse;
                    if (res.success) {
                      setLocations(res.locations || []);
                      setLocPage(newPage);
                      setLocTotalPages(res.pagination?.totalPages || 1);
                    }
                  }}
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
