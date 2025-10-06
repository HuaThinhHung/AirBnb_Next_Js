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
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
              Khám Phá Địa Điểm
            </h1>
            <p className="text-xl text-gray-600">
              Tìm kiếm và khám phá những điểm đến tuyệt vời trên toàn thế giới
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="max-w-2xl">
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Tìm kiếm địa điểm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
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
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập tên vị trí, tỉnh thành hoặc quốc gia..."
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-semibold text-lg">
              Đang tìm kiếm...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
            <p className="text-red-700 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Locations Grid */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg">
                Tìm thấy{" "}
                <span className="font-bold text-gray-900">
                  {locations.length}
                </span>{" "}
                địa điểm
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={
                        loc.hinhAnh ||
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800"
                      }
                      alt={loc.tenViTri || "Location"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                        {loc.tenViTri || "Vị trí"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/90">
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
                        <span className="text-sm font-medium drop-shadow">
                          {loc.tinhThanh}, {loc.quocGia}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={`/search/${loc.id}`}
                        className="text-center px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200"
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/rooms?location=${loc.id}`}
                        className="text-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Xem phòng
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {locations.length === 0 && (
              <div className="text-center py-20">
                <div className="text-7xl mb-6">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy địa điểm
                </h3>
                <p className="text-gray-600 text-lg">
                  Thử thay đổi từ khóa tìm kiếm của bạn
                </p>
              </div>
            )}

            {/* Pagination */}
            {locTotalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
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
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                >
                  ← Trước
                </button>
                <div className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md">
                  {locPage} / {locTotalPages}
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
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
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
