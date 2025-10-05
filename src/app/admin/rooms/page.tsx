"use client";

import { useState, useEffect } from "react";
import {
  getRooms,
  deleteRoom,
  createRoom,
  updateRoom,
} from "@/lib/roomService";
import { getLocations } from "@/lib/locationService";

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
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 1,
  });

  // 🔧 BYPASS MODE: Load dữ liệu trực tiếp, không check auth
  useEffect(() => {
    loadRooms();
    loadLocations();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = (await getRooms()) as {
        success: boolean;
        rooms: Room[];
        message?: string;
      };

      if (result.success) {
        setRooms(result.rooms);
      } else {
        setError(result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const result = (await getLocations()) as {
        success: boolean;
        locations: Location[];
      };

      if (result.success) {
        setLocations(result.locations);
      }
    } catch (err) {
      console.error("Lỗi tải vị trí:", err);
    }
  };

  // Xử lý xóa phòng
  const handleDeleteRoom = async (roomId: number, roomName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng "${roomName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(roomId);

      const result = (await deleteRoom(roomId)) as {
        success: boolean;
        message?: string;
      };

      if (result.success) {
        loadRooms();
        alert("Xóa phòng thành công!");
      } else {
        alert(`Lỗi: ${result.message || "Không thể xóa phòng"}`);
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa phòng");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Mở modal thêm/sửa
  const openModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        tenPhong: room.tenPhong,
        khach: room.khach,
        phongNgu: room.phongNgu,
        giuong: room.giuong,
        phongTam: room.phongTam,
        moTa: room.moTa,
        giaTien: room.giaTien,
        mayGiat: room.mayGiat,
        banLa: room.banLa,
        tivi: room.tivi,
        dieuHoa: room.dieuHoa,
        wifi: room.wifi,
        bep: room.bep,
        doXe: room.doXe,
        hoBoi: room.hoBoi,
        banUi: room.banUi,
        maViTri: room.maViTri,
      });
    } else {
      setEditingRoom(null);
      setFormData({
        tenPhong: "",
        khach: 1,
        phongNgu: 1,
        giuong: 1,
        phongTam: 1,
        moTa: "",
        giaTien: 0,
        mayGiat: false,
        banLa: false,
        tivi: false,
        dieuHoa: false,
        wifi: false,
        bep: false,
        doXe: false,
        hoBoi: false,
        banUi: false,
        maViTri: locations[0]?.id || 1,
      });
    }
    setShowModal(true);
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      let result;
      if (editingRoom) {
        result = (await updateRoom(editingRoom.id, formData)) as {
          success: boolean;
          message?: string;
        };
      } else {
        result = (await createRoom(formData)) as {
          success: boolean;
          message?: string;
        };
      }

      if (result.success) {
        alert(
          editingRoom
            ? "Cập nhật phòng thành công!"
            : "Tạo phòng mới thành công!"
        );
        setShowModal(false);
        loadRooms();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (err) {
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) =>
    room.tenPhong.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Phòng
              </h1>
              <p className="text-gray-600">
                Danh sách tất cả phòng trong hệ thống
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              + Thêm phòng mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phòng..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Lỗi</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                {/* Room Image */}
                <div className="h-48 bg-gray-200">
                  <img
                    src={
                      room.hinhAnh ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={room.tenPhong}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                </div>

                {/* Room Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {room.tenPhong}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {room.moTa}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="text-gray-600">👥 {room.khach} khách</div>
                    <div className="text-gray-600">🛏️ {room.giuong} giường</div>
                    <div className="text-gray-600">
                      🚪 {room.phongNgu} phòng ngủ
                    </div>
                    <div className="text-gray-600">
                      🚿 {room.phongTam} phòng tắm
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-xl font-bold text-blue-600 mb-4">
                    ${room.giaTien}
                    <span className="text-sm text-gray-500">/đêm</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(room)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id, room.tenPhong)}
                      disabled={deleteLoading === room.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {deleteLoading === room.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy phòng nào</p>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa Phòng */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tên phòng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên phòng *
                  </label>
                  <input
                    type="text"
                    value={formData.tenPhong}
                    onChange={(e) =>
                      setFormData({ ...formData, tenPhong: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.moTa}
                    onChange={(e) =>
                      setFormData({ ...formData, moTa: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Grid 4 cột */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số khách
                    </label>
                    <input
                      type="number"
                      value={formData.khach}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          khach: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phòng ngủ
                    </label>
                    <input
                      type="number"
                      value={formData.phongNgu}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phongNgu: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giường
                    </label>
                    <input
                      type="number"
                      value={formData.giuong}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          giuong: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phòng tắm
                    </label>
                    <input
                      type="number"
                      value={formData.phongTam}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phongTam: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Giá và Vị trí */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá tiền ($/đêm) *
                    </label>
                    <input
                      type="number"
                      value={formData.giaTien}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          giaTien: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vị trí *
                    </label>
                    <select
                      value={formData.maViTri}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maViTri: parseInt(e.target.value),
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.tenViTri} - {location.tinhThanh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tiện nghi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tiện nghi
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                      { key: "mayGiat", label: "Máy giặt" },
                      { key: "banLa", label: "Bàn là" },
                      { key: "tivi", label: "Tivi" },
                      { key: "dieuHoa", label: "Điều hòa" },
                      { key: "wifi", label: "Wifi" },
                      { key: "bep", label: "Bếp" },
                      { key: "doXe", label: "Đỗ xe" },
                      { key: "hoBoi", label: "Hồ bơi" },
                      { key: "banUi", label: "Bàn ủi" },
                    ].map((amenity) => (
                      <label
                        key={amenity.key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            formData[
                              amenity.key as keyof typeof formData
                            ] as boolean
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [amenity.key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : editingRoom
                      ? "Cập nhật"
                      : "Tạo mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
