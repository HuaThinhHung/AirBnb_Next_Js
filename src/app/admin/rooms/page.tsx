"use client";

import { useState, useEffect } from "react";
import { getRooms, deleteRoom } from "@/lib/roomService";
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

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 10; // Hiển thị đúng 10 items mỗi trang

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [currentPage, searchTerm, selectedLocation]);

  // Đảm bảo currentPage không vượt quá totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const fetchLocations = async () => {
    const result = (await getLocations()) as {
      success: boolean;
      locations: Location[];
    };
    if (result.success) {
      setLocations(result.locations);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    
    // Nếu có filter location, cần fetch tất cả phòng để filter và phân trang đúng
    if (selectedLocation) {
      // Fetch tất cả phòng để filter theo location
      const allRoomsResult = (await getRooms({
        pageIndex: 1,
        pageSize: 1000, // Lấy nhiều để có đủ dữ liệu filter
        keyword: searchTerm,
      })) as {
        success: boolean;
        rooms: Room[];
        pagination?: { totalPages: number; totalRow: number };
      };

      if (allRoomsResult.success) {
        // Filter theo location
        const filteredRooms = allRoomsResult.rooms.filter(
          (room) => room.maViTri === selectedLocation
        );

        // Phân trang client-side cho filtered results
        const totalFiltered = filteredRooms.length;
        const totalPages = Math.ceil(totalFiltered / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

        setRooms(paginatedRooms);
        setTotalPages(totalPages || 1);
        setTotalRows(totalFiltered);
      }
    } else {
      // Không filter location, dùng server-side pagination
      const result = (await getRooms({
        pageIndex: currentPage,
        pageSize: pageSize,
        keyword: searchTerm,
      })) as {
        success: boolean;
        rooms: Room[];
        pagination?: { totalPages: number; totalRow: number };
      };

      if (result.success) {
        // Đảm bảo chỉ lấy đúng số lượng items theo pageSize
        const limitedRooms = result.rooms.slice(0, pageSize);
        setRooms(limitedRooms);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalRows(result.pagination?.totalRow || 0);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (roomId: number, roomName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa phòng "${roomName}"?`)) return;

    const result = (await deleteRoom(roomId)) as {
      success: boolean;
      message?: string;
    };
    if (result.success) {
      alert("✅ Xóa phòng thành công!");
      fetchRooms();
    } else {
      alert("❌ Lỗi: " + (result.message || "Không thể xóa phòng"));
    }
  };

  const getLocationName = (maViTri: number) => {
    const location = locations.find((loc) => loc.id === maViTri);
    return location
      ? `${location.tenViTri}, ${location.tinhThanh}`
      : "Chưa có vị trí";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalRows > 0 ? (
                <>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, totalRows)} của {totalRows}{" "}
                  phòng
                </>
              ) : (
                "Chưa có phòng nào"
              )}
            </p>
          </div>
          <Link
            href="/admin/rooms/create"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm phòng mới
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên phòng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {/* Filter by Location */}
          <select
            value={selectedLocation || ""}
            onChange={(e) => {
              setSelectedLocation(
                e.target.value ? Number(e.target.value) : null
              );
              setCurrentPage(1);
            }}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">📍 Tất cả vị trí</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.tenViTri}, {location.tinhThanh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-xl text-gray-600">Không tìm thấy phòng nào</p>
            <Link
              href="/admin/rooms/create"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Thêm phòng mới
            </Link>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-500px)] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24 bg-gray-50">
                          Hình ảnh
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          Thông tin phòng
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-48 bg-gray-50">
                          Vị trí
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-32 bg-gray-50">
                          Giá/đêm
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-32 bg-gray-50">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                    {rooms.map((room) => (
                      <tr
                        key={room.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          {room.hinhAnh ? (
                            <img
                              src={room.hinhAnh}
                              alt={room.tenPhong}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                              <svg
                                className="w-7 h-7 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900 mb-1 text-sm">
                            {room.tenPhong}
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {room.khach} khách
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              {room.phongNgu} phòng ngủ
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                              {room.giuong} giường
                            </span>
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                />
                              </svg>
                              {room.phongTam} phòng tắm
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: #{room.id}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-xs text-gray-700 line-clamp-2">
                              {getLocationName(room.maViTri)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-bold text-blue-600 text-xs">
                            {formatPrice(room.giaTien)}
                          </div>
                          <div className="text-xs text-gray-500">mỗi đêm</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link
                              href={`/admin/rooms/${room.id}`}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                              title="Xem chi tiết"
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
                              href={`/admin/rooms/${room.id}/edit`}
                              className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                              title="Chỉnh sửa"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(room.id, room.tenPhong)
                              }
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Xóa"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination - Luôn hiển thị nếu có dữ liệu */}
            {totalRows > 0 && totalPages > 0 && (
              <div className="bg-white border border-gray-200 px-6 py-4 rounded-lg shadow-sm relative z-20 mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Info */}
                  <div className="text-sm text-gray-600">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                      {(currentPage - 1) * pageSize + 1}
                    </span>
                    {" - "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(currentPage * pageSize, totalRows)}
                    </span>
                    {" trong tổng số "}
                    <span className="font-semibold text-gray-900">
                      {totalRows}
                    </span>
                    {" phòng"}
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {/* First Page */}
                    <button
                      onClick={() => {
                        setCurrentPage(1);
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
                        setCurrentPage((p) => {
                          const newPage = Math.max(1, p - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return newPage;
                        });
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
                                  setCurrentPage(pageNum);
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
                        setCurrentPage((p) => {
                          const newPage = Math.min(totalPages, p + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return newPage;
                        });
                      }}
                      disabled={currentPage === totalPages || totalPages <= 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors cursor-pointer"
                    >
                      Sau →
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={() => {
                        setCurrentPage(totalPages);
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
