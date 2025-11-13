"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, deleteBooking } from "@/lib/bookingService";
import { getRoomById } from "@/lib/roomService";
import { getUserById } from "@/lib/userService";
import Link from "next/link";

interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

interface Room {
  id: number;
  tenPhong: string;
  giaTien: number;
  hinhAnh: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    setLoading(true);

    // Fetch booking
    const bookingResult = (await getBookingById(Number(bookingId))) as {
      success: boolean;
      booking: Booking;
    };

    if (bookingResult.success && bookingResult.booking) {
      setBooking(bookingResult.booking);

      // Fetch room
      const roomResult = (await getRoomById(bookingResult.booking.maPhong)) as {
        success: boolean;
        room: Room;
      };
      if (roomResult.success) {
        setRoom(roomResult.room);
      }

      // Fetch user
      const userResult = (await getUserById(
        bookingResult.booking.maNguoiDung
      )) as {
        success: boolean;
        user: User;
      };
      if (userResult.success) {
        setUser(userResult.user);
      }
    } else {
      alert("Không tìm thấy đặt phòng");
      router.push("/admin/bookings");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa đặt phòng #${booking?.id}?`)) return;

    const result = (await deleteBooking(Number(bookingId))) as {
      success: boolean;
      message?: string;
    };
    if (result.success) {
      alert("✅ Xóa đặt phòng thành công!");
      router.push("/admin/bookings");
    } else {
      alert("❌ Lỗi: " + result.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.ngayDen);
    const checkOut = new Date(booking.ngayDi);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    return room.giaTien * calculateNights();
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

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Không tìm thấy đặt phòng</p>
          <Link
            href="/admin/bookings"
            className="text-blue-600 hover:underline mt-4 inline-block"
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
              Chi tiết đặt phòng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Mã đặt phòng: #{booking.id}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Quay lại
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
            >
              Xóa đặt phòng
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Room Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Card */}
            {room && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Thông tin phòng
                </h2>
                <div className="flex gap-4">
                  {room.hinhAnh ? (
                    <img
                      src={room.hinhAnh}
                      alt={room.tenPhong}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                      <svg
                        className="w-16 h-16 text-blue-600"
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
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {room.tenPhong}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Mã phòng: #{room.id}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(room.giaTien)} / đêm
                    </p>
                    <Link
                      href={`/admin/rooms/${room.id}`}
                      className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xem chi tiết phòng →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* User Info */}
            {user && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-semibold text-gray-900">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  )}
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Xem hồ sơ người dùng →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right - Booking Details */}
          <div className="space-y-6">
            {/* Dates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Thời gian lưu trú
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nhận phòng</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.ngayDen)}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-1">Trả phòng</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.ngayDi)}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-1">Tổng số đêm</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {calculateNights()} đêm
                  </p>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Khách</h2>
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-blue-600"
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
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {booking.soLuongKhach}
                  </p>
                  <p className="text-sm text-gray-500">Số lượng khách</p>
                </div>
              </div>
            </div>

            {/* Total */}
            {room && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Tổng chi phí
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {formatPrice(room.giaTien)} x {calculateNights()} đêm
                    </span>
                    <span className="font-semibold">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <div className="border-t-2 border-blue-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
