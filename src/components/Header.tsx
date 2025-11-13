"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/authService";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    const result = logout();
    if (result.success) {
      setUser(null);
      setIsMenuOpen(false);
      router.push("/");
    } else {
      alert(result.message || "Có lỗi xảy ra khi đăng xuất");
    }
  };

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/search", label: "Tìm kiếm" },
    { href: "/rooms", label: "Phòng" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white/95 border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="max-w-[1760px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo Airbnb với màu xanh */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Airbnb Bélo Icon - màu xanh */}
            <svg
              className="w-9 h-9 text-blue-600 group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 1000 1000"
              fill="currentColor"
            >
              <path d="M499.3 736.7c-51-64-81-120.1-91-168.1-10-39-6-70 11-93 18-27 45-40 80-40s62 13 80 40c17 23 21 54 11 93-11 49-41 105-91 168.1zm362.2 43c-7 47-39 86-83 105-85 37-169.1-22-241.1-102 119.1-149.1 141.1-265.1 90-340.2-30-43-73-64-128.1-64-111 0-172.1 94-148.1 203.1 14 59 51 126.1 110 201.1-37 41-72 70-103 88-24 13-47 21-69 23-101 15-180.1-83-144.1-184.1 5-13 15-37 32-74l1-2c55-120.1 122.1-256.1 199.1-407.2l2-5 22-42c17-31 24-45 51-62 13-8 29-12 47-12 36 0 64 21 76 38 6 9 13 21 22 36l21 41 3 6c77 151.1 144.1 287.1 199.1 407.2l1 1 20 46 12 29c9.2 23.1 11.2 46.1 8.2 70.1zm46-90.1c-7-22-19-48-34-79v-1c-71-151.1-137.1-287.1-200.1-409.2l-4-6c-45-92-77-147.1-170.1-147.1-92 0-131.1 64-171.1 147.1l-3 6c-63 122.1-129.1 258.1-200.1 409.2v2l-21 46c-8 19-12 29-13 32-51 140.1 54 263.1 181.1 263.1 1 0 5 0 10-1h14c66-8 134.1-50 203.1-125.1 69 75 137.1 117.1 203.1 125.1h14c5 1 9 1 10 1 127.1.1 232.1-123 181.1-263.1z" />
            </svg>
            <span
              className="text-[24px] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight hidden sm:block"
              style={{
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              airbnb
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                style={{
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2.5 hover:bg-gray-50 px-4 py-2.5 rounded-full transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {user.name || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-blue-600 font-semibold transition-colors px-4 py-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 border border-gray-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-5 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-5 py-3.5 rounded-xl font-semibold text-[15px] transition-all ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile User Menu */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              {user ? (
                <div className="space-y-2.5">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-[15px]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold text-gray-900"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {user.name || "User"}
                      </div>
                      <div
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {user.email}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2.5">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-300 transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-5 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-md"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
