"use client";

import { useState, useEffect } from "react";
import { getUsers } from "@/lib/userService";
import { getRooms } from "@/lib/roomService";
import { getLocations } from "@/lib/locationService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalLocations: 0,
    totalBookings: 0,
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    // Fetch all data
    const [usersResult, roomsResult, locationsResult] = await Promise.all([
      getUsers(),
      getRooms(),
      getLocations(),
    ]);

    setStats({
      totalUsers: usersResult.success ? usersResult.users.length : 0,
      totalRooms: roomsResult.success ? roomsResult.rooms.length : 0,
      totalLocations: locationsResult.success
        ? locationsResult.locations.length
        : 0,
      totalBookings: 0, // Would need booking API
    });

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const statsCards = [
    {
      title: "Người dùng",
      value: stats.totalUsers,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      link: "/admin/users",
    },
    {
      title: "Phòng",
      value: stats.totalRooms,
      icon: "🏠",
      color: "from-green-500 to-green-600",
      link: "/admin/rooms",
    },
    {
      title: "Vị trí",
      value: stats.totalLocations,
      icon: "📍",
      color: "from-purple-500 to-purple-600",
      link: "/admin/locations",
    },
    {
      title: "Đặt phòng",
      value: stats.totalBookings,
      icon: "📅",
      color: "from-orange-500 to-orange-600",
      link: "/admin/bookings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Tổng quan hệ thống
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý và theo dõi hoạt động của nền tảng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                Cập nhật thông tin
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Xin chào, {user?.name || "Admin"} 👋
              </h2>
              <p className="text-blue-100 text-lg">
                Chào mừng bạn quay trở lại với trang quản trị AirBnb
              </p>
            </div>
            <div className="text-6xl">🎉</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))
            : statsCards.map((stat, index) => (
                <Link
                  key={index}
                  href={stat.link}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 p-6 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </Link>
              ))}
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📊 Thống kê đặt phòng theo vị trí
            </h3>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-center">
                <div className="text-5xl mb-4">📈</div>
                <p className="text-gray-600 font-medium">
                  Biểu đồ sẽ hiển thị ở đây
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Tích hợp Chart.js hoặc Recharts
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🔔 Hoạt động gần đây
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: "👤",
                  text: "Người dùng mới đăng ký",
                  time: "5 phút trước",
                  color: "blue",
                },
                {
                  icon: "🏠",
                  text: "Phòng mới được thêm",
                  time: "15 phút trước",
                  color: "green",
                },
                {
                  icon: "📅",
                  text: "Đặt phòng thành công",
                  time: "30 phút trước",
                  color: "purple",
                },
                {
                  icon: "📍",
                  text: "Cập nhật vị trí mới",
                  time: "1 giờ trước",
                  color: "orange",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            ⚡ Thao tác nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/users/create"
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-blue-500 rounded-xl hover:bg-blue-50 transition-all group"
            >
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center text-3xl transition-colors">
                👤
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 text-center">
                Thêm người dùng
              </span>
            </Link>

            <Link
              href="/admin/rooms"
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-green-500 rounded-xl hover:bg-green-50 transition-all group"
            >
              <div className="w-16 h-16 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center text-3xl transition-colors">
                🏠
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 text-center">
                Quản lý phòng
              </span>
            </Link>

            <Link
              href="/admin/locations"
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-purple-500 rounded-xl hover:bg-purple-50 transition-all group"
            >
              <div className="w-16 h-16 bg-purple-100 group-hover:bg-purple-200 rounded-full flex items-center justify-center text-3xl transition-colors">
                📍
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 text-center">
                Quản lý vị trí
              </span>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-orange-500 rounded-xl hover:bg-orange-50 transition-all group"
            >
              <div className="w-16 h-16 bg-orange-100 group-hover:bg-orange-200 rounded-full flex items-center justify-center text-3xl transition-colors">
                📅
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 text-center">
                Quản lý đặt phòng
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
