"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById } from "@/lib/roomService";
import { getLocationById } from "@/lib/locationService";
import { createBooking } from "@/lib/bookingService";
import { getCommentsByRoom, createComment } from "@/lib/commentService";
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
  hinhAnh: string;
}

interface Comment {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiBinhLuan?: string;
  avatar?: string;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalRows, setCommentTotalRows] = useState(0);
  const commentPageSize = 5;

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (roomId) {
      fetchRoomDetail();
      fetchComments();
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchComments();
    }
  }, [commentPage, roomId]);

  const fetchRoomDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = (await getRoomById(roomId)) as {
        success: boolean;
        room: Room;
        message?: string;
      };

      if (result.success) {
        setRoom(result.room);

        const locationResult = (await getLocationById(result.room.maViTri)) as {
          success: boolean;
          location: Location;
        };

        if (locationResult.success) {
          setLocation(locationResult.location);
        }
      } else {
        setError(result.message || "Không thể tải thông tin phòng");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    const result = (await getCommentsByRoom(Number(roomId), {
      pageIndex: commentPage,
      pageSize: commentPageSize,
    })) as {
      success: boolean;
      comments: Comment[];
      pagination?: { totalPages: number; totalRow: number };
      message?: string;
    };
    if (result.success) {
      setComments(result.comments);
      setCommentTotalPages(result.pagination?.totalPages || 1);
      setCommentTotalRows(result.pagination?.totalRow || 0);
    }
    setLoadingComments(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để bình luận");
      router.push("/login");
      return;
    }

    // Kiểm tra token
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error("Lỗi parse user data:", error);
      alert("Lỗi dữ liệu người dùng. Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }

    // Kiểm tra user ID
    const userId = user.id || user.maNguoiDung;
    if (!userId) {
      console.error("User object:", user);
      alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }

    setSubmittingComment(true);

    const commentData = {
      maPhong: Number(roomId),
      maNguoiBinhLuan: userId,
      noiDung: commentText.trim(),
      saoBinhLuan: commentRating,
      ngayBinhLuan: new Date().toISOString().split("T")[0],
    };

    console.log("📤 [Comment] Submitting comment:", commentData);

    try {
      const result = (await createComment(commentData)) as {
        success: boolean;
        comment?: Comment;
        message?: string;
      };
      setSubmittingComment(false);

      if (result.success) {
        setCommentText("");
        setCommentRating(5);
        setCommentPage(1); // Reset về trang đầu sau khi thêm comment
        fetchComments(); // Reload comments
        alert("Đã thêm bình luận!");
      } else {
        // Nếu lỗi đã được xử lý bởi API interceptor (redirect), không hiển thị alert nữa
        if ((result as any).alreadyHandled) {
          // API interceptor đã xử lý redirect, không cần làm gì thêm
          return;
        }
        
        // Nếu lỗi liên quan đến token nhưng chưa được xử lý, redirect đến login
        if ((result as any).requiresLogin || 
            result.message?.includes("token") || 
            result.message?.includes("hết hạn") ||
            result.message?.includes("đăng nhập")) {
          // Chỉ hiển thị alert nếu chưa có alert từ interceptor
          if (!document.body.getAttribute('data-token-expired')) {
            alert(result.message);
          }
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else {
          alert("Lỗi: " + result.message);
        }
      }
    } catch (error) {
      setSubmittingComment(false);
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    return nights * room.giaTien;
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Vui lòng đăng nhập để đặt phòng");
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    setBookingLoading(true);

    const bookingData = {
      maPhong: Number(roomId),
      ngayDen: checkIn,
      ngayDi: checkOut,
      soLuongKhach: guests,
      maNguoiDung: user.id,
    };

    const result = (await createBooking(bookingData)) as {
      success: boolean;
      booking?: unknown;
      message?: string;
    };
    setBookingLoading(false);

    if (result.success) {
      setBookingSuccess(true);
      alert("Đặt phòng thành công!");
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } else {
      alert("Đặt phòng thất bại: " + result.message);
    }
  };

  const amenities = room
    ? [
        { icon: "🧺", label: "Máy giặt", available: room.mayGiat },
        { icon: "🔥", label: "Bàn là", available: room.banLa },
        { icon: "📺", label: "Tivi", available: room.tivi },
        { icon: "❄️", label: "Điều hòa", available: room.dieuHoa },
        { icon: "📶", label: "Wifi", available: room.wifi },
        { icon: "🍳", label: "Bếp", available: room.bep },
        { icon: "🚗", label: "Đỗ xe", available: room.doXe },
        { icon: "🏊", label: "Hồ bơi", available: room.hoBoi },
        { icon: "👔", label: "Bàn ủi", available: room.banUi },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Đang tải thông tin phòng...
          </p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Không tìm thấy phòng"}</p>
          <Link href="/rooms" className="text-blue-600 hover:underline">
            Quay lại danh sách phòng
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/rooms" className="text-gray-500 hover:text-gray-900">
              Phòng
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{room.tenPhong}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">{room.tenPhong}</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {location
              ? `${location.tenViTri}, ${location.tinhThanh}, ${location.quocGia}`
              : "Đang tải..."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={
                  room.hinhAnh ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
                }
                alt={room.tenPhong}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Toàn bộ căn hộ
              </h2>
              <div className="flex items-center gap-6 text-gray-700 mb-6">
                <span className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="font-medium text-gray-900">
                    {room.khach} khách
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span>🛏️</span>
                  <span className="font-medium text-gray-900">
                    {room.phongNgu} phòng ngủ
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span>🛌</span>
                  <span className="font-medium text-gray-900">
                    {room.giuong} giường
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span>🚿</span>
                  <span className="font-medium text-gray-900">
                    {room.phongTam} phòng tắm
                  </span>
                </span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{room.moTa}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tiện nghi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      amenity.available
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium text-gray-900">
                      {amenity.label}
                    </span>
                    {amenity.available && (
                      <span className="ml-auto text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Bình luận ({commentTotalRows > 0 ? commentTotalRows : comments.length})
              </h2>

              {/* Add Comment Form */}
              <form
                onSubmit={handleSubmitComment}
                className="mb-8 p-6 bg-gray-50 rounded-xl"
              >
                <h3 className="font-semibold text-gray-900 mb-4">
                  Thêm bình luận
                </h3>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Đánh giá
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(star)}
                        className="text-3xl focus:outline-none"
                      >
                        {star <= commentRating ? "⭐" : "☆"}
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {commentRating} sao
                    </span>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingComment ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </form>

              {/* Comments List */}
              {loadingComments ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </p>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {comment.tenNguoiBinhLuan?.charAt(0).toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {comment.tenNguoiBinhLuan ||
                                `User ${comment.maNguoiBinhLuan}`}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(
                                comment.ngayBinhLuan
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                {i < comment.saoBinhLuan ? "⭐" : "☆"}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {comment.noiDung}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments Pagination */}
              {commentTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCommentPage((p) => Math.max(1, p - 1))}
                    disabled={commentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                  >
                    ← Trước
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, commentTotalPages) }, (_, i) => {
                    let pageNum;
                    if (commentTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (commentPage <= 3) {
                      pageNum = i + 1;
                    } else if (commentPage >= commentTotalPages - 2) {
                      pageNum = commentTotalPages - 4 + i;
                    } else {
                      pageNum = commentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCommentPage(pageNum)}
                        className={`min-w-[40px] px-3 py-2 border rounded-md font-medium transition-colors ${
                          commentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCommentPage((p) => Math.min(commentTotalPages, p + 1))
                    }
                    disabled={commentPage === commentTotalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    {room.giaTien.toLocaleString()}₫
                  </span>
                  <span className="text-gray-600"> / đêm</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-gray-900 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-gray-900">4.9</span>
                  <span className="text-gray-500 text-sm">
                    ({comments.length})
                  </span>
                </div>
              </div>

              {bookingSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ✓ Đặt phòng thành công!
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nhận phòng
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={minDate}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Trả phòng
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || minDate}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Số khách
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  >
                    {Array.from({ length: room.khach }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} khách
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-gray-900 font-medium">
                    <span>
                      {room.giaTien.toLocaleString()}₫ x {nights} đêm
                    </span>
                    <span>{(room.giaTien * nights).toLocaleString()}₫</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString()}₫</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading || !checkIn || !checkOut}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {bookingLoading ? "Đang xử lý..." : "Đặt phòng"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Bạn vẫn chưa bị trừ tiền
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
