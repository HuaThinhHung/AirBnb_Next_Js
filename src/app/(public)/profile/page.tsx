"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  getUserBookings,
  uploadAvatar,
} from "@/lib/userService";
import { logout } from "@/lib/authService";
import { useToast } from "@/components/ui/AppToastProvider";
import { getRoomById } from "@/lib/roomService";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

interface RoomInfo {
  id: number;
  tenPhong: string;
}

type StoredUser = {
  id?: number;
  user?: {
    id?: number;
  };
  [key: string]: unknown;
};

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomInfoMap, setRoomInfoMap] = useState<Map<number, RoomInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: true,
    avatar: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const localUser = getCurrentUser() as StoredUser | null;
      if (!localUser) {
        router.push("/login");
        return;
      }

      const userId = localUser?.user?.id ?? localUser?.id;
      if (!userId) {
        router.push("/login");
        return;
      }

      const result = (await getUserById(Number(userId))) as {
        success: boolean;
        user?: User;
        message?: string;
      };

      if (result.success && result.user) {
        const fetchedUser = result.user;
        setUser(fetchedUser);
        setFormData({
          name: fetchedUser.name || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
          birthday: fetchedUser.birthday || "",
          gender:
            fetchedUser.gender !== undefined && fetchedUser.gender !== null
              ? fetchedUser.gender
              : true,
          avatar: fetchedUser.avatar || "",
        });
        // Đồng bộ lại localStorage giống admin
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          window.dispatchEvent(new Event("user-updated"));
        }
        fetchUserBookings(fetchedUser.id);
      } else {
        router.push("/login");
      }
    };

    loadProfile();
  }, []);

  const fetchUserBookings = async (userId: number) => {
    setLoading(true);
    const result = (await getUserBookings(userId)) as {
      success: boolean;
      bookings: Booking[];
      message?: string;
    };
    if (result.success) {
      setBookings(result.bookings);
      
      // Fetch thông tin phòng cho mỗi booking
      const roomInfoPromises = result.bookings.map(async (booking) => {
        try {
          const roomResult = (await getRoomById(booking.maPhong)) as {
            success: boolean;
            room?: RoomInfo;
            message?: string;
          };
          if (roomResult.success && roomResult.room) {
            return {
              roomId: booking.maPhong,
              roomInfo: {
                id: roomResult.room.id,
                tenPhong: roomResult.room.tenPhong || `Phòng #${booking.maPhong}`,
              },
            };
          }
        } catch (error) {
          console.error(`Lỗi khi lấy thông tin phòng ${booking.maPhong}:`, error);
        }
        return null;
      });

      const roomInfos = await Promise.all(roomInfoPromises);
      const newRoomInfoMap = new Map<number, RoomInfo>();
      roomInfos.forEach((info) => {
        if (info) {
          newRoomInfoMap.set(info.roomId, info.roomInfo);
        }
      });
      setRoomInfoMap(newRoomInfoMap);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = (await updateUser(user.id, formData)) as {
      success: boolean;
      user?: User;
      message?: string;
    };
    if (result.success && result.user) {
      const updated = result.user as User;
      setUser(updated);
      setFormData((prev) => ({
        ...prev,
        name: updated.name || prev.name,
        email: updated.email || prev.email,
        phone: updated.phone || prev.phone,
        birthday: updated.birthday || prev.birthday,
        gender:
          updated.gender !== undefined && updated.gender !== null
            ? updated.gender
            : prev.gender,
      }));
      setIsEditing(false);

      // Ghi đè lại localStorage với user mới (dạng phẳng) để Header đọc avatar chuẩn
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updated));
        window.dispatchEvent(new Event("user-updated"));
      }

      showToast("Cập nhật thông tin thành công!", "success");
    } else {
      showToast(result.message || "Lỗi khi cập nhật thông tin", "error");
    }
  };

  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      router.push("/");
    } else {
      showToast(result.message || "Có lỗi xảy ra khi đăng xuất", "error");
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) return;
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file ảnh hợp lệ (jpg, png...)", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("File quá lớn! Vui lòng chọn ảnh dưới 5MB.", "error");
      return;
    }

    setAvatarUploading(true);
    const result = (await uploadAvatar(file)) as {
      success: boolean;
      avatar?: string;
      message?: string;
    };
    setAvatarUploading(false);

    if (result.success && result.avatar) {
      const newAvatar = result.avatar ?? "";

      // Sau khi upload file thành công, gọi luôn updateUser để lưu avatar mới giống admin
      if (!user) {
        showToast("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.", "error");
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday || null,
        gender: formData.gender,
        avatar: newAvatar,
      };

      const updateResult = (await updateUser(user.id, payload)) as {
        success: boolean;
        user?: User;
        message?: string;
      };

      if (updateResult.success && updateResult.user) {
        const updatedUser = updateResult.user;
        setUser(updatedUser);
        setFormData((prev) => ({
          ...prev,
          avatar: updatedUser.avatar || newAvatar,
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("user-updated"));
        }

        showToast("Upload avatar thành công!", "success");
      } else {
        showToast(
          updateResult.message || "Không thể lưu avatar mới, vui lòng thử lại.",
          "error"
        );
      }
    } else {
      showToast(result.message || "Không thể upload avatar.", "error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Xin chào, tôi là {user.name}
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                Bắt đầu tham gia vào 2021
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  User ID: #{user.id}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full md:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  {(() => {
                    const avatarUrl = formData.avatar || user.avatar;
                    return (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mx-auto overflow-hidden">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    );
                  })()}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                {avatarUploading && (
                  <p className="mt-4 text-xs text-gray-500">Đang upload ảnh...</p>
                )}

                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {user.email}
                  <span className="block text-xs text-gray-400 mt-1">
                    ID: #{user.id}
                  </span>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">
                        {user.email ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Điện thoại:</span>
                      <span className="font-medium text-gray-900">
                        {user.phone ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile Form */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Cập nhật thông tin
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Giới tính
                      </label>
                      <select
                        value={formData.gender ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value === "true",
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Ảnh đại diện
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={formData.avatar}
                          onChange={(e) =>
                            setFormData({ ...formData, avatar: e.target.value })
                          }
                          placeholder="Nhập URL hình ảnh"
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (event) => {
                              const file =
                                (event.target as HTMLInputElement).files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                setFormData({
                                  ...formData,
                                  avatar: reader.result as string,
                                });
                              };
                              reader.readAsDataURL(file);
                            };
                            input.click();
                          }}
                          className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-200"
                        >
                          Tải lên
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Dán URL ảnh hoặc tải ảnh từ máy (ảnh sẽ được lưu dưới dạng base64).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bookings Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Phòng đã thuê ({bookings.length})
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-gray-500 mb-4">
                    Bạn chưa có đặt phòng nào
                  </p>
                  <Link
                    href="/rooms"
                    className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Khám phá phòng
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const checkIn = new Date(booking.ngayDen);
                    const checkOut = new Date(booking.ngayDi);
                    const nights = Math.ceil(
                      (checkOut.getTime() - checkIn.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={booking.id}
                        className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">🏠</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {roomInfoMap.get(booking.maPhong)?.tenPhong || `Phòng #${booking.maPhong}`}
                            </h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              Đã xác nhận
                            </span>
                          </div>
                           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                             <div>
                               <span className="text-gray-500">ID đặt phòng:</span>
                               <p className="font-semibold text-gray-900">
                                 #{booking.id}
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500">Nhận phòng:</span>
                               <p className="font-semibold text-gray-900">
                                 {checkIn.toLocaleDateString("vi-VN")}
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500">Trả phòng:</span>
                               <p className="font-semibold text-gray-900">
                                 {checkOut.toLocaleDateString("vi-VN")}
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500">Số đêm:</span>
                               <p className="font-semibold text-gray-900">
                                 {nights} đêm
                               </p>
                             </div>
                             <div>
                               <span className="text-gray-500">Số khách:</span>
                               <p className="font-semibold text-gray-900">
                                 {booking.soLuongKhach} khách
                               </p>
                             </div>
                           </div>
                        </div>
                        <Link
                          href={`/rooms/${booking.maPhong}`}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Xem
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-4xl mb-2">🏠</div>
                <div className="text-3xl font-bold">{bookings.length}</div>
                <div className="text-blue-100 text-sm">Tổng đặt phòng</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-cyan-100 text-sm">Đánh giá</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="text-4xl mb-2">📅</div>
                <div className="text-3xl font-bold">2021</div>
                <div className="text-purple-100 text-sm">Năm tham gia</div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Xác minh danh tính
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Địa chỉ email
                      </p>
                      <p className="text-sm text-gray-500">Đã xác nhận</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xl">
                      ?
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Số điện thoại
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.phone ? "Đã xác nhận" : "Chưa xác nhận"}
                      </p>
                    </div>
                  </div>
                  {!user.phone && (
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">
                      Nhập số điện thoại
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
