import api from "./api";

/**
 * Room Service
 * Xử lý các API liên quan đến phòng
 */

/**
 * Lấy danh sách tất cả phòng (có phân trang)
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.pageIndex - Trang hiện tại (mặc định: 1)
 * @param {number} params.pageSize - Số lượng items mỗi trang (mặc định: 10)
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @returns {Promise<Object>} Danh sách phòng + phân trang
 */
export const getRooms = async (params = {}) => {
  try {
    const pageIndex = params.pageIndex || 1;
    const pageSize = params.pageSize || 10;
    const keyword = params.keyword || "";

    console.log("📦 Đang lấy danh sách phòng...", { pageIndex, pageSize, keyword });

    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });
    if (keyword) queryParams.append("keyword", keyword);

    const url = `/api/phong-thue?${queryParams.toString()}`;
    const response = await api.get(url);

    console.log("✅ Response từ API:", response.data);

    const content = response.data.content;
    const rooms = content?.data || content || [];

    const pagination = content?.pageIndex
      ? {
          pageIndex: content.pageIndex,
          pageSize: content.pageSize,
          totalRow: content.totalRow,
          totalPages: Math.ceil(content.totalRow / content.pageSize),
        }
      : {
          pageIndex,
          pageSize,
          totalRow: rooms.length,
          totalPages: 1,
        };

    return {
      success: true,
      rooms,
      pagination,
      message: response.data.message || "Lấy danh sách phòng thành công",
    };
  } catch (error) {
    // Chỉ log error nếu không phải network error (để tránh spam console)
    if (error.response) {
      console.error("❌ Lỗi lấy danh sách phòng:", error.response.status, error.response.data);
    } else if (error.request && !error.message?.includes("Network error")) {
      console.warn("⚠️ Không thể kết nối đến server để lấy danh sách phòng");
    }
    
    return {
      success: false,
      rooms: [],
      message: error.message || "Không thể lấy danh sách phòng. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};


/**
 * Lấy thông tin chi tiết phòng theo ID
 * @param {string|number} roomId - ID của phòng
 * @returns {Promise<Object>} Thông tin phòng
 */
export const getRoomById = async (roomId) => {
  try {
    console.log("Đang lấy thông tin phòng...", roomId);

    const response = await api.get(`/api/phong-thue/${roomId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      room: response.data.content,
      message: response.data.message || "Lấy thông tin phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể lấy thông tin phòng",
    };
  }
};

/**
 * Lấy danh sách phòng theo vị trí
 * @param {string|number} locationId - ID của vị trí
 * @returns {Promise<Object>} Danh sách phòng
 */
export const getRoomsByLocation = async (locationId) => {
  try {
    console.log("Đang lấy danh sách phòng theo vị trí...", locationId);

    const response = await api.get(
      `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`
    );

    console.log("Response từ API:", response.data);

    return {
      success: true,
      rooms: response.data.content || [],
      message: response.data.message || "Lấy danh sách phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách phòng theo vị trí:", error);
    return {
      success: false,
      rooms: [],
      message: error.message || "Không thể lấy danh sách phòng",
    };
  }
};

/**
 * Tìm kiếm phòng
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {Object} params - Tham số bổ sung
 * @returns {Promise<Object>} Kết quả tìm kiếm
 */
export const searchRooms = async (keyword, params = {}) => {
  try {
    console.log("Đang tìm kiếm phòng...", { keyword, params });

    const searchParams = {
      keyword,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
    };

    return await getRooms(searchParams);
  } catch (error) {
    console.error("Lỗi tìm kiếm phòng:", error);
    return {
      success: false,
      rooms: [],
      message: error.message || "Không thể tìm kiếm phòng",
    };
  }
};

/**
 * Tạo phòng mới (Admin only)
 * @param {Object} roomData - Dữ liệu phòng
 * @returns {Promise<Object>} Kết quả tạo phòng
 */
export const createRoom = async (roomData) => {
  try {
    console.log("Đang tạo phòng mới...", roomData);

    const response = await api.post("/api/phong-thue", roomData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      room: response.data.content,
      message: response.data.message || "Tạo phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi tạo phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể tạo phòng",
    };
  }
};

/**
 * Cập nhật thông tin phòng (Admin only)
 * @param {string|number} roomId - ID của phòng
 * @param {Object} roomData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    console.log("Đang cập nhật phòng...", { roomId, roomData });

    const response = await api.put(`/api/phong-thue/${roomId}`, roomData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      room: response.data.content,
      message: response.data.message || "Cập nhật phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật phòng",
    };
  }
};

/**
 * Xóa phòng (Admin only)
 * @param {string|number} roomId - ID của phòng
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteRoom = async (roomId) => {
  try {
    console.log("Đang xóa phòng...", roomId);

    const response = await api.delete(`/api/phong-thue/${roomId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      message: response.data.message || "Xóa phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi xóa phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa phòng",
    };
  }
};

/**
 * Upload hình ảnh phòng (Admin only)
 * @param {string|number} roomId - ID của phòng
 * @param {File} imageFile - File hình ảnh
 * @returns {Promise<Object>} Kết quả upload
 */
export const uploadRoomImage = async (roomId, imageFile) => {
  try {
    console.log("Đang upload hình ảnh phòng...", { roomId, imageFile });

    const formData = new FormData();
    formData.append("formFile", imageFile);

    const response = await api.post(
      `/api/phong-thue/upload-hinh-phong?maPhong=${roomId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Response từ API:", response.data);

    return {
      success: true,
      image: response.data.content,
      message: response.data.message || "Upload hình ảnh thành công",
    };
  } catch (error) {
    console.error("Lỗi upload hình ảnh:", error);
    return {
      success: false,
      message: error.message || "Không thể upload hình ảnh",
    };
  }
};
