"use client";

import { useState, useEffect, useRef } from "react";
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "@/lib/bookingService";
import { getRoomById } from "@/lib/roomService";
import { getLocationById } from "@/lib/locationService";
import Link from "next/link";

interface Booking {
  id: number;
  maPhong: number;
  hinhAnh?: string;
  tenPhong?: string;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

interface RoomAddress {
  [key: number]: string; // Cache địa chỉ theo maPhong
}

interface BookingMutationResult {
  success: boolean;
  message?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [roomAddresses, setRoomAddresses] = useState<RoomAddress>({});
  const [loadingAddresses, setLoadingAddresses] = useState<Set<number>>(new Set());
  const [roomImages, setRoomImages] = useState<Record<number, string>>({});
  const [roomNames, setRoomNames] = useState<Record<number, string>>({});
  const defaultRoomImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop";
  const pageSize = 10;
  const topRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    maPhong: "",
    maNguoiDung: "",
    ngayDen: "",
    ngayDi: "",
    soLuongKhach: 1,
  });

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await syncBookings();
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (allBookings.length === 0) return;
    applyFiltersAndPaginate(allBookings, searchTerm, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBookings, searchTerm, currentPage]);

  // Scroll to top khi chuyển trang
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  const buildSuggestions = (list: Booking[]) =>
    list
      .slice(0, 30)
      .map(
        (booking) =>
          `${booking.id} - Phòng ${booking.maPhong} - User ${booking.maNguoiDung}`
      );

  const applyFiltersAndPaginate = (
    source: Booking[],
    keyword: string,
    page: number
  ) => {
    const normalized = keyword.trim().toLowerCase();
    let filteredBookings = [...source];

    if (normalized) {
      const includesTerm = (value: string | number) =>
        value.toString().toLowerCase().includes(normalized);
      filteredBookings = filteredBookings.filter(
        (booking) =>
          includesTerm(booking.id) ||
          includesTerm(booking.maPhong) ||
          includesTerm(booking.maNguoiDung)
      );
    }

    const total = filteredBookings.length;
    const totalPagesCalc = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPagesCalc);
    const startIndex = (safePage - 1) * pageSize;
    const paginatedBookings = filteredBookings.slice(
      startIndex,
      startIndex + pageSize
    );

    setBookings(paginatedBookings);
    setTotalRows(total);
    setTotalPages(totalPagesCalc);
    setSearchSuggestions(buildSuggestions(filteredBookings));
    if (safePage !== page) {
      setCurrentPage(safePage);
    }
  };

  const syncBookings = async () => {
    setSyncing(true);
    try {
      const result = (await getAllBookings()) as {
        success: boolean;
        bookings: Booking[];
      };
      if (result.success) {
        setAllBookings(result.bookings || []);
        setLastSyncedAt(new Date().toLocaleString());
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    await syncBookings();
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

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: 0,
      maPhong: "",
      maNguoiDung: "",
      ngayDen: "",
      ngayDi: "",
      soLuongKhach: 1,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (booking: Booking) => {
    setIsEditing(true);
    setFormData({
      id: booking.id,
      maPhong: booking.maPhong.toString(),
      maNguoiDung: booking.maNguoiDung.toString(),
      ngayDen: booking.ngayDen.split("T")[0],
      ngayDi: booking.ngayDi.split("T")[0],
      soLuongKhach: booking.soLuongKhach,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm(`Bạn có chắc muốn xóa đặt phòng #${bookingId}?`)) return;
    const result = (await deleteBooking(bookingId)) as BookingMutationResult;
    if (result.success) {
      alert("✅ Xóa đặt phòng thành công!");
      await handleManualRefresh();
    } else {
      alert(result.message || "❌ Không thể xóa đặt phòng");
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "soLuongKhach" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!formData.maPhong || !formData.maNguoiDung) {
      return "Vui lòng nhập mã phòng và mã người dùng";
    }
    if (!formData.ngayDen || !formData.ngayDi) {
      return "Vui lòng chọn ngày đến và ngày đi";
    }
    if (new Date(formData.ngayDi) <= new Date(formData.ngayDen)) {
      return "Ngày đi phải sau ngày đến";
    }
    if (formData.soLuongKhach <= 0) {
      return "Số lượng khách phải lớn hơn 0";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      maPhong: Number(formData.maPhong),
      maNguoiDung: Number(formData.maNguoiDung),
      ngayDen: formData.ngayDen,
      ngayDi: formData.ngayDi,
      soLuongKhach: formData.soLuongKhach,
    };
    const result: BookingMutationResult = isEditing
      ? ((await updateBooking(formData.id, payload)) as BookingMutationResult)
      : ((await createBooking(payload)) as BookingMutationResult);

    setSaving(false);
    if (result.success) {
      alert(isEditing ? "✅ Cập nhật đặt phòng thành công!" : "✅ Thêm đặt phòng thành công!");
      setModalOpen(false);
      await handleManualRefresh();
    } else {
      setFormError(result.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const fetchRoomDetails = async (maPhong: number) => {
    const alreadyLoaded =
      roomAddresses[maPhong] && roomNames[maPhong] && roomImages[maPhong];
    if (alreadyLoaded || loadingAddresses.has(maPhong)) {
      return;
    }

    setLoadingAddresses((prev) => new Set(prev).add(maPhong));

    try {
      const roomResult = (await getRoomById(maPhong)) as {
        success: boolean;
        room?: { maViTri: number; tenPhong: string; hinhAnh?: string };
      };

      if (roomResult.success && roomResult.room) {
        const { maViTri, tenPhong, hinhAnh } = roomResult.room;

        if (tenPhong) {
          setRoomNames((prev) => ({ ...prev, [maPhong]: tenPhong }));
        }

        if (hinhAnh) {
          setRoomImages((prev) => ({ ...prev, [maPhong]: hinhAnh }));
        }

        const locationResult = (await getLocationById(roomResult.room.maViTri)) as {
          success: boolean;
          location?: { tenViTri: string; tinhThanh: string; quocGia: string };
        };

        if (locationResult.success && locationResult.location) {
          const address = `${locationResult.location.tenViTri}, ${locationResult.location.tinhThanh}, ${locationResult.location.quocGia}`;
          setRoomAddresses((prev) => ({
            ...prev,
            [maPhong]: address,
          }));
        }
      }
    } catch (error) {
      console.error(`Lỗi lấy địa chỉ phòng ${maPhong}:`, error);
    } finally {
      setLoadingAddresses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(maPhong);
        return newSet;
      });
    }
  };

  // Fetch addresses for all rooms when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      bookings.forEach((booking) => {
        fetchRoomDetails(booking.maPhong);
      });
    }
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll Target */}
      <div ref={topRef} className="h-0" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              {lastSyncedAt && (
                <>
                  {" "}
                  | Lần đồng bộ:{" "}
                  <span className="text-gray-700 font-medium">{lastSyncedAt}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={loading || syncing}
              className="px-5 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {syncing ? "Đang đồng bộ..." : "↻ Đồng bộ dữ liệu"}
            </button>
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              + Thêm đặt phòng
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo ID, Mã phòng, Mã người dùng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
              list="bookings-suggestions"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>
      <datalist id="bookings-suggestions">
        {searchSuggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6">
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
                <table className="w-full admin-responsive-table">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Phòng
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
                          <td className="px-4 py-4" data-label="ID">
                            <span className="text-sm font-mono text-gray-900">
                              #{booking.id}
                            </span>
                          </td>
                          <td className="px-4 py-4" data-label="Phòng">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                {loadingAddresses.has(booking.maPhong) ? (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    ...
                                  </div>
                                ) : (
                                  <img
                                    src={
                                      roomImages[booking.maPhong] ||
                                      defaultRoomImage
                                    }
                                    alt={
                                      roomNames[booking.maPhong] ||
                                      `Phòng #${booking.maPhong}`
                                    }
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/admin/rooms/${booking.maPhong}`}
                                  className="text-blue-600 hover:text-blue-800 font-semibold block mb-1"
                                >
                                  {roomNames[booking.maPhong] ||
                                    `Phòng #${booking.maPhong}`}
                                </Link>
                                {loadingAddresses.has(booking.maPhong) ? (
                                  <span className="text-xs text-gray-400">
                                    Đang tải...
                                  </span>
                                ) : roomAddresses[booking.maPhong] ? (
                                  <span className="text-xs text-gray-600 flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3 text-gray-400"
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
                                    {roomAddresses[booking.maPhong]}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4" data-label="Người đặt">
                            <Link
                              href={`/admin/users/${booking.maNguoiDung}`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              User #{booking.maNguoiDung}
                            </Link>
                          </td>
                          <td className="px-4 py-4" data-label="Ngày đến">
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
                          <td className="px-4 py-4" data-label="Ngày đi">
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
                          <td className="px-4 py-4 text-center" data-label="Số đêm">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                              {calculateNights(booking.ngayDen, booking.ngayDi)}{" "}
                              đêm
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center" data-label="Khách">
                            <span className="text-sm font-semibold text-gray-900">
                              {booking.soLuongKhach}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center" data-label="Trạng thái">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-4" data-label="Hành động">
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
                              <button
                                onClick={() => openEditModal(booking)}
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
                              </button>
                              <button
                                onClick={() => handleDelete(booking.id)}
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
              <div className="bg-white border-t border-gray-200 px-4 py-4 mt-6 rounded-b-lg sm:px-6">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditing ? "Chỉnh sửa đặt phòng" : "Thêm đặt phòng mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã phòng
                  </label>
                  <input
                    name="maPhong"
                    type="number"
                    value={formData.maPhong}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Nhập mã phòng"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã người dùng
                  </label>
                  <input
                    name="maNguoiDung"
                    type="number"
                    value={formData.maNguoiDung}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Nhập mã người dùng"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày đến
                  </label>
                  <input
                    name="ngayDen"
                    type="date"
                    value={formData.ngayDen}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày đi
                  </label>
                  <input
                    name="ngayDi"
                    type="date"
                    value={formData.ngayDi}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng khách
                </label>
                <input
                  name="soLuongKhach"
                  type="number"
                  value={formData.soLuongKhach}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  min={1}
                  required
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
