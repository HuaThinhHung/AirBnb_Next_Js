"use client";

import { useState, useEffect, useRef } from "react";
import { getAllBookings } from "@/lib/bookingService";
import Link from "next/link";

interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 10;
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm]);

  // Scroll to top khi chuyển trang
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    const result = (await getAllBookings()) as {
      success: boolean;
      bookings: Booking[];
    };

    if (result.success) {
      let filteredBookings = result.bookings;

      // Client-side search
      if (searchTerm) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            booking.id.toString().includes(searchTerm) ||
            booking.maPhong.toString().includes(searchTerm) ||
            booking.maNguoiDung.toString().includes(searchTerm)
        );
      }

      // Client-side pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

      setBookings(paginatedBookings);
      setTotalRows(filteredBookings.length);
      setTotalPages(Math.ceil(filteredBookings.length / pageSize));
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getBookingStatus = (ngayDen: string, ngayDi: string) => {
    const today = new Date();
    const checkIn = new Date(ngayDen);
    const checkOut = new Date(ngayDi);

    if (today < checkIn) {
      return { label: "Sắp đến", color: "bg-blue-100 text-blue-700" };
    } else if (today >= checkIn && today <= checkOut) {
      return { label: "Đang ở", color: "bg-green-100 text-green-700" };
    } else {
      return { label: "Đã hoàn thành", color: "bg-gray-100 text-gray-700" };
    }
  };

  const calculateNights = (ngayDen: string, ngayDi: string) => {
    const checkIn = new Date(ngayDen);
    const checkOut = new Date(ngayDi);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              Quản lý đặt phòng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalRows > 0 ? (
                <>
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, totalRows)} của {totalRows}{" "}
                  đặt phòng
                </>
              ) : (
                "Chưa có đặt phòng nào"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo ID, Mã phòng, Mã người dùng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl text-gray-600">
              Không tìm thấy đặt phòng nào
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Mã phòng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Người đặt
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày đến
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày đi
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                        Số đêm
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                        Khách
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-28">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {bookings.map((booking) => {
                      const status = getBookingStatus(
                        booking.ngayDen,
                        booking.ngayDi
                      );
                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <span className="text-sm font-mono text-gray-900">
                              #{booking.id}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/admin/rooms/${booking.maPhong}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Phòng #{booking.maPhong}
                            </Link>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/admin/users/${booking.maNguoiDung}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              User #{booking.maNguoiDung}
                            </Link>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(booking.ngayDen)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(booking.ngayDi)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                              {calculateNights(booking.ngayDen, booking.ngayDi)}{" "}
                              đêm
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {booking.soLuongKhach}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                href={`/admin/bookings/${booking.id}`}
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white border-t border-gray-200 px-6 py-4 mt-6 rounded-b-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Info */}
                  <div className="text-sm text-gray-600">
                    Trang{" "}
                    <span className="font-semibold text-gray-900">
                      {currentPage}
                    </span>{" "}
                    của{" "}
                    <span className="font-semibold text-gray-900">
                      {totalPages}
                    </span>
                  </div>

                  {/* Pagination Buttons - Compact Style */}
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                    >
                      ← Trước
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[40px] px-3 py-2 border rounded-md font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                    >
                      Sau →
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
