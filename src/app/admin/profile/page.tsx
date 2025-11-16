"use client";

import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  uploadAvatar,
} from "@/lib/userService";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: boolean;
  role?: string;
  avatar?: string;
  address?: string;
}

type StoredUser = {
  id?: number;
  user?: {
    id?: number;
  };
  [key: string]: unknown;
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "true",
    address: "",
    avatar: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const localUser = getCurrentUser() as unknown as StoredUser | null;
      if (!localUser) {
        setLoading(false);
        setMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
      }
      const userId = localUser?.user?.id ?? localUser?.id;
      if (!userId) {
        setLoading(false);
        setMessage("Không hợp lệ ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }
      const result = (await getUserById(Number(userId))) as {
        success: boolean;
        user?: UserProfile;
        message?: string;
      };
      if (result.success && result.user) {
        const fetchedUser = result.user;
        setUser(fetchedUser);
        setFormData({
          name: fetchedUser.name || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
          birthday: fetchedUser.birthday
            ? fetchedUser.birthday.split("T")[0]
            : "",
          gender:
            typeof fetchedUser.gender === "boolean"
              ? String(fetchedUser.gender)
              : "true",
          address: fetchedUser.address || "",
          avatar: fetchedUser.avatar || "",
        });
        // Đồng bộ lại localStorage (dạng phẳng) + bắn sự kiện để Header cập nhật avatar
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(fetchedUser));
          window.dispatchEvent(new Event("user-updated"));
        }
      } else {
        setMessage(result.message || "Không thể tải thông tin người dùng.");
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) {
      setMessage("❌ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate file
    if (!file.type.startsWith("image/")) {
      setMessage("❌ Vui lòng chọn file ảnh hợp lệ (jpg, png...)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ File quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    setAvatarUploading(true);
    setMessage(null);
    const result = (await uploadAvatar(file)) as {
      success: boolean;
      avatar?: string;
      message?: string;
    };
    setAvatarUploading(false);

    if (result.success && result.avatar) {
      const newAvatar = result.avatar ?? "";

      // Sau khi upload file, gọi luôn updateUser để lưu avatar mới vào hồ sơ (giống public profile)
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday || null,
        gender: formData.gender === "true",
        avatar: newAvatar,
        address: formData.address,
      };

      const updateResult = (await updateUser(user.id, payload)) as {
        success: boolean;
        user?: UserProfile;
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

        setMessage("✅ Upload avatar thành công!");
      } else {
        setMessage(
          updateResult.message ||
            "❌ Upload thành công nhưng không thể lưu avatar mới."
        );
      }
    } else {
      setMessage(result.message || "❌ Không thể upload avatar.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birthday: formData.birthday || null,
      gender: formData.gender === "true",
      avatar: formData.avatar,
      address: formData.address,
    };
    const result = (await updateUser(user.id, payload)) as {
      success: boolean;
      message?: string;
      user?: UserProfile;
    };
    setSaving(false);
    if (result.success && result.user) {
    const updatedUser = result.user;
    setUser(updatedUser);
    // Đồng bộ lại formData (phòng trường hợp backend thay đổi dữ liệu)
    setFormData((prev) => ({
      ...prev,
      name: updatedUser.name || prev.name,
      email: updatedUser.email || prev.email,
      phone: updatedUser.phone || prev.phone,
      birthday: updatedUser.birthday
        ? updatedUser.birthday.split("T")[0]
        : prev.birthday,
      gender:
        typeof updatedUser.gender === "boolean"
          ? String(updatedUser.gender)
          : prev.gender,
      address: updatedUser.address || prev.address,
      avatar: updatedUser.avatar || prev.avatar,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));
    }

    setMessage("✅ Cập nhật hồ sơ thành công!");
    } else {
      setMessage(result.message || "❌ Không thể cập nhật hồ sơ.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 border-b-4 border-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-sm text-gray-700">
          Quản lý thông tin & avatar của tài khoản Admin
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-6 text-gray-900 sm:px-6">
        {message && (
          <div
            className={`p-4 rounded-xl ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-gray-900">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                {formData.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center text-sm text-gray-600">
                    Đang tải...
                  </div>
                )}
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                {formData.name || "Admin"}
              </p>
              <p className="text-sm text-gray-500">{user?.role || "Admin"}</p>

              <label className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-all">
                Thay đổi Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Profile form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                  <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="VD: 0987654321"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  rows={3}
                  placeholder="Nhập địa chỉ (nếu có)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  onClick={() => {
                    if (user) {
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        birthday: user.birthday
                          ? user.birthday.split("T")[0]
                          : "",
                        gender:
                          typeof user.gender === "boolean"
                            ? String(user.gender)
                            : "true",
                        address: user.address || "",
                        avatar: user.avatar || "",
                      });
                    }
                  }}
                >
                  Khôi phục
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

