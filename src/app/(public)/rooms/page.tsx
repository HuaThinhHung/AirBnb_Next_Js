"use client";

import { useEffect, useState } from "react";
import RoomCard from "@/components/home/RoomCard";
import { getRooms } from "@/lib/roomService";

export default function SearchPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Các trường tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bed, setBed] = useState("");

  // Gọi API lấy danh sách phòng từ Cybersoft
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = (await getRooms()) as {
          success: boolean;
          rooms: any[];
          message?: string;
        };

        if (result.success) {
          console.log("Đã lấy được phòng:", result.rooms);
          setRooms(result.rooms);
          setFilteredRooms(result.rooms);
        } else {
          setError(result.message || "Không thể lấy dữ liệu phòng");
        }
      } catch (err: any) {
        console.error("Lỗi fetch rooms:", err);
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Hàm lọc dữ liệu
  useEffect(() => {
    let result = rooms;

    if (searchTerm) {
      result = result.filter((r) =>
        r.tenPhong.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (bedroom) {
      result = result.filter((r) => r.phongNgu === Number(bedroom));
    }

    if (bed) {
      result = result.filter((r) => r.giuong === Number(bed));
    }

    setFilteredRooms(result);
  }, [searchTerm, bedroom, bed, rooms]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Thanh tìm kiếm */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          🔍 Tìm kiếm phòng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tên phòng */}
          <input
            type="text"
            placeholder="Nhập tên phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Số phòng ngủ */}
          <input
            type="number"
            placeholder="Số phòng ngủ"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Số giường */}
          <input
            type="number"
            placeholder="Số giường"
            value={bed}
            onChange={(e) => setBed(e.target.value)}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Danh sách phòng */}
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-center text-red-500">Lỗi: {error}</p>
      ) : filteredRooms.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy phòng nào</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.tenPhong}
              location={room.moTa}
              price={room.giaTien}
              rating={4.5}
              reviews={10}
              image={room.hinhAnh}
              amenities={[
                `${room.khach} khách`,
                `${room.phongNgu} phòng ngủ`,
                `${room.giuong} giường`,
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
