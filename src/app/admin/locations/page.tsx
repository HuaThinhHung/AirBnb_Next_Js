"use client";

import { useState, useEffect, useRef } from "react";
import { getLocationsPagedSearch, deleteLocation } from "@/lib/locationService";
import Link from "next/link";

interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12; // Tăng lên 12 items mỗi trang để hiển thị nhiều hơn
  const topRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Fetch locations
  const fetchLocations = async (page = 1, keyword = "") => {
    setLoading(true);
    const result = (await getLocationsPagedSearch({
      pageIndex: page,
      pageSize,
      keyword,
    })) as {
      success: boolean;
      locations: Location[];
      pagination?: {
        totalPages: number;
        totalRow: number;
      };
      totalPages?: number;
      totalCount?: number;
    };

    if (result.success) {
      // Đảm bảo chỉ lấy đúng số lượng items theo pageSize
      const limitedLocations = result.locations.slice(0, pageSize);
      setLocations(limitedLocations);
      setTotalPages(result.pagination?.totalPages || result.totalPages || 1);
      setTotalCount(result.pagination?.totalRow || result.totalCount || 0);
      setCurrentPage(page);
      const suggestionList = result.locations
        .map(
          (loc) =>
            `${loc.id} - ${loc.tenViTri}, ${loc.tinhThanh || ""}`.trim()
        )
        .slice(0, 20);
      setSearchSuggestions(suggestionList);
    }
    setLoading(false);
  };

  // Search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchLocations(1, searchKeyword);
  };

  // Reset
  const handleReset = () => {
    setSearchKeyword("");
    setCurrentPage(1);
    fetchLocations(1, "");
  };

  // Delete
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vị trí "${name}"?`)) return;

    const result = (await deleteLocation(id)) as {
      success: boolean;
      message?: string;
    };
    if (result.success) {
      alert("✅ Xóa vị trí thành công!");
      fetchLocations(currentPage, searchKeyword);
    } else {
      alert("❌ Lỗi: " + (result.message || "Không thể xóa vị trí"));
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchLocations(page, searchKeyword);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Scroll to top khi chuyển trang
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  // Render pagination - Modern Style
  const renderPagination = () => {
    if (totalCount === 0 || totalPages <= 1) return null;

    return (
      <div className="bg-white border border-gray-200 px-6 py-4 rounded-lg shadow-sm mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Info */}
          <div className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>
            {" - "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>
            {" trong tổng số "}
            <span className="font-semibold text-gray-900">{totalCount}</span>
            {" vị trí"}
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {/* First Page */}
            <button
              onClick={() => {
                handlePageChange(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1 || totalPages <= 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
              title="Trang đầu"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Previous */}
            <button
              onClick={() => {
                handlePageChange(Math.max(1, currentPage - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1 || totalPages <= 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
            >
              ← Trước
            </button>

            {/* Page Numbers */}
            {totalPages > 0 && (
              <div className="flex items-center gap-1">
                {(() => {
                  const pages: number[] = [];
                  const maxVisible = 5;

                  if (totalPages <= maxVisible) {
                    // Hiển thị tất cả các trang nếu <= 5
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Logic hiển thị trang thông minh
                    if (currentPage <= 3) {
                      // Gần đầu: 1, 2, 3, 4, 5
                      for (let i = 1; i <= 5; i++) {
                        pages.push(i);
                      }
                    } else if (currentPage >= totalPages - 2) {
                      // Gần cuối: ... n-4, n-3, n-2, n-1, n
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Ở giữa: ... p-1, p, p+1 ...
                      pages.push(1);
                      if (currentPage > 4) pages.push(-1); // Dấu ...
                      for (
                        let i = currentPage - 1;
                        i <= currentPage + 1;
                        i++
                      ) {
                        pages.push(i);
                      }
                      if (currentPage < totalPages - 3) pages.push(-1); // Dấu ...
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((pageNum, idx) => {
                    if (pageNum === -1) {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          handlePageChange(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`min-w-[40px] px-3 py-2 border rounded-md font-medium transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
              </div>
            )}

            {/* Next */}
            <button
              onClick={() => {
                handlePageChange(Math.min(totalPages, currentPage + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages || totalPages <= 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
            >
              Sau →
            </button>

            {/* Last Page */}
            <button
              onClick={() => {
                handlePageChange(totalPages);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages || totalPages <= 1}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
              title="Trang cuối"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll Target */}
      <div ref={topRef} className="h-0" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📍 Quản lý vị trí
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalCount > 0 ? (
                <>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, totalCount)} trong tổng số{" "}
                  {totalCount} vị trí
                </>
              ) : (
                "Chưa có vị trí nào"
              )}
            </p>
          </div>
          <Link
            href="/admin/locations/create"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            + Thêm vị trí mới
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm theo tên vị trí, tỉnh thành hoặc quốc gia..."
              list="locations-suggestions"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              🔍 Tìm
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              ✕ Reset
            </button>
          </div>
        <datalist id="locations-suggestions">
          {searchSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        </div>

        {/* Grid View */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải...</p>
            </div>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-gray-600 text-lg">Không tìm thấy vị trí nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {location.hinhAnh ? (
                    <img
                      src={location.hinhAnh}
                      alt={location.tenViTri}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                      <span className="text-6xl">🏙️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    ID: {location.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                    {location.tenViTri}
                  </h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>🏙️</span>
                      <span className="truncate">{location.tinhThanh}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>🌍</span>
                      <span className="truncate">{location.quocGia}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/admin/locations/${location.id}`}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                    <Link
                      href={`/admin/locations/${location.id}/edit`}
                      className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(location.id, location.tenViTri)
                      }
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && locations.length > 0 && renderPagination()}
      </div>
    </div>
  );
}
