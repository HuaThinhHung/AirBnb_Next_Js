"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      description: "Tổng quan",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Người dùng",
      path: "/admin/users",
      description: "Quản lý Users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Vị trí",
      path: "/admin/locations",
      description: "Quản lý Locations",
      icon: (
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "Phòng",
      path: "/admin/rooms",
      description: "Quản lý Rooms",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      title: "Đặt phòng",
      path: "/admin/bookings",
      description: "Quản lý Bookings",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      title: "Cài đặt",
      path: "/admin/settings",
      description: "Settings",
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AirBnb
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => onClose()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div
                className={`${
                  isActive(item.path)
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${
                    isActive(item.path) ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </p>
                <p
                  className={`text-xs ${
                    isActive(item.path) ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Trang chủ</p>
              <p className="text-xs text-gray-500">Quay về website</p>
            </div>
          </Link>
        </nav>
      </aside>
    </>
  );
}
