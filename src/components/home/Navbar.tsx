"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Kiểm tra user từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <nav className="bg-white/95 shadow-md border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AirBnb
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Trang chủ
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              <Link
                href="/search"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Tìm kiếm
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              <Link
                href="/rooms"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Phòng
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Giới thiệu
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Liên hệ
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-200 relative group"
              >
                Blog
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* User Profile Link */}
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user?.name || "User"}
                    </span>
                  </Link>

                  {/* Admin Link (chỉ hiện nếu role = ADMIN) */}
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      Quản trị
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-red-50 border border-gray-200 hover:border-red-200"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-blue-50 border border-gray-200 hover:border-blue-200"
                  >
                    Đăng nhập
                  </Link>

                  {/* Register Button */}
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-blue-50 inline-flex items-center justify-center p-3 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-100 shadow-lg">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Trang chủ
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Tìm kiếm
            </Link>
            <Link
              href="/rooms"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Phòng
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Liên hệ
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            >
              Blog
            </Link>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* Mobile User Profile */}
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Xin chào,</p>
                      <p className="font-bold text-gray-900">{user?.name}</p>
                    </div>
                  </Link>

                  {/* Mobile Admin Link */}
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white block px-4 py-3 rounded-xl text-base font-semibold text-center"
                    >
                      Quản trị
                    </Link>
                  )}

                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 hover:bg-red-50 block w-full px-4 py-3 rounded-xl text-base font-semibold border border-red-200 text-center"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Login Button */}
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block px-4 py-3 rounded-xl text-base font-semibold text-center border border-gray-200"
                  >
                    Đăng nhập
                  </Link>

                  {/* Mobile Register Button */}
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white block px-4 py-3 rounded-xl text-base font-semibold text-center shadow-md"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
