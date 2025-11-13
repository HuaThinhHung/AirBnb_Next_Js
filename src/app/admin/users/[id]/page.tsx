"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, uploadAvatar } from "@/lib/userService";
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

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    const result = (await getUserById(Number(userId))) as {
      success: boolean;
      user?: User;
      message?: string;
    };
    if (result.success) {
      setUser(result.user || null);
    } else {
      alert("Không tìm thấy người dùng");
      router.push("/admin/users");
    }
    setLoading(false);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    setUploading(true);
    const result = (await uploadAvatar(file)) as {
      success: boolean;
      avatar?: string;
      message?: string;
    };
    setUploading(false);

    if (result.success) {
      alert("Upload avatar thành công!");
      // Update user avatar in state
      if (user) {
        setUser({ ...user, avatar: result.avatar || user.avatar });
      }
      fetchUser(); // Refresh user data
    } else {
      alert("Lỗi upload: " + result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Không tìm thấy người dùng</p>
          <Link
            href="/admin/users"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Quay lại danh sách
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
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết người dùng
          </h1>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Quay lại danh sách
            </Link>
            <Link
              href={`/admin/users/${userId}/edit`}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Avatar</h2>

              <div className="text-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 mx-auto mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-6xl mx-auto mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="inline-block bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    {uploading ? "Đang upload..." : "📷 Upload Avatar"}
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Ảnh JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Trạng thái
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vai trò:</span>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giới tính:</span>
                  <span className="font-medium text-gray-900">
                    {user.gender ? "👨 Nam" : "👩 Nữ"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Thông tin cá nhân
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-semibold text-gray-700">
                    Họ và tên:
                  </div>
                  <div className="col-span-2 text-gray-900 font-medium">
                    {user.name}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Email */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-semibold text-gray-700">
                    Email:
                  </div>
                  <div className="col-span-2 text-gray-900">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Phone */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-semibold text-gray-700">
                    Số điện thoại:
                  </div>
                  <div className="col-span-2 text-gray-900">
                    {user.phone || "Chưa cập nhật"}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Birthday */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-semibold text-gray-700">
                    Ngày sinh:
                  </div>
                  <div className="col-span-2 text-gray-900">
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Chưa cập nhật"}
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* ID */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-semibold text-gray-700">
                    User ID:
                  </div>
                  <div className="col-span-2 text-gray-900 font-mono">
                    #{user.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Hành động
              </h2>
              <div className="flex gap-3">
                <Link
                  href={`/admin/users/${userId}/edit`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Chỉnh sửa thông tin
                </Link>
                <button
                  onClick={() => {
                    alert(
                      "⚠️ Chức năng xóa người dùng chưa được hỗ trợ bởi API AirBnb"
                    );
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 font-semibold rounded-lg transition-colors cursor-not-allowed opacity-50"
                  title="API không hỗ trợ xóa user"
                >
                  Xóa người dùng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
