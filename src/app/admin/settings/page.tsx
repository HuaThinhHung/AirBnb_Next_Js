"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (section: string) => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    alert(`✅ Đã lưu cài đặt ${section} thành công!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý cấu hình và tùy chỉnh hệ thống
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin chung */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Thông tin chung
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên khách sạn
                </label>
                <input
                  type="text"
                  defaultValue="AirBnb Việt Nam"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  defaultValue="admin@airbnb.vn"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue="0123 456 789"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  rows={2}
                  defaultValue="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <button
                onClick={() => handleSave("Thông tin chung")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Cài đặt đặt phòng */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Cài đặt đặt phòng
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Giờ nhận phòng
                </label>
                <input
                  type="time"
                  defaultValue="14:00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Giờ trả phòng
                </label>
                <input
                  type="time"
                  defaultValue="12:00"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chính sách hủy phòng
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                  <option>Miễn phí hủy trong 24 giờ</option>
                  <option>Miễn phí hủy trong 48 giờ</option>
                  <option>Miễn phí hủy trong 7 ngày</option>
                  <option>Không hoàn tiền khi hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Thời gian đặt tối thiểu (đêm)
                </label>
                <input
                  type="number"
                  defaultValue="1"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <button
                onClick={() => handleSave("Đặt phòng")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Thông báo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Cài đặt thông báo
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Email thông báo
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Nhận email khi có đặt phòng mới
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    SMS thông báo
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Nhận SMS cho các trường hợp khẩn cấp
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Thông báo đẩy
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Nhận thông báo trong trang quản trị
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button
                onClick={() => handleSave("Thông báo")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Bảo mật */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Bảo mật tài khoản
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Lưu ý bảo mật:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Mật khẩu phải có ít nhất 8 ký tự</li>
                      <li>Bao gồm chữ hoa, chữ thường và số</li>
                      <li>Không chia sẻ mật khẩu với người khác</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSave("Bảo mật")}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>

          {/* Ngôn ngữ & Tiền tệ */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Ngôn ngữ & Tiền tệ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ngôn ngữ mặc định
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                  <option>🇻🇳 Tiếng Việt</option>
                  <option>🇬🇧 English</option>
                  <option>🇯🇵 日本語</option>
                  <option>🇰🇷 한국어</option>
                  <option>🇨🇳 中文</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Đơn vị tiền tệ
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                  <option>VND (₫) - Việt Nam Đồng</option>
                  <option>USD ($) - US Dollar</option>
                  <option>EUR (€) - Euro</option>
                  <option>JPY (¥) - Japanese Yen</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={() => handleSave("Ngôn ngữ & Tiền tệ")}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
