import api from "./api";

/**
 * Booking Service
 * Xử lý các API liên quan đến đặt phòng
 */

/**
 * Đặt phòng
 * @param {Object} bookingData - Dữ liệu đặt phòng
 * @param {number} bookingData.maPhong - ID phòng
 * @param {string} bookingData.ngayDen - Ngày check-in (YYYY-MM-DD)
 * @param {string} bookingData.ngayDi - Ngày check-out (YYYY-MM-DD)
 * @param {number} bookingData.soLuongKhach - Số lượng khách
 * @param {number} bookingData.maNguoiDung - ID người dùng
 * @returns {Promise<Object>} Kết quả đặt phòng
 */
export const createBooking = async (bookingData) => {
  try {
    console.log("📤 [Booking] Đang gửi yêu cầu đặt phòng:", bookingData);

    // Validate data trước khi gửi
    if (
      !bookingData.maPhong ||
      !bookingData.ngayDen ||
      !bookingData.ngayDi ||
      !bookingData.maNguoiDung
    ) {
      throw new Error("Thiếu thông tin bắt buộc để đặt phòng");
    }

    // Validate ngày
    const checkIn = new Date(bookingData.ngayDen);
    const checkOut = new Date(bookingData.ngayDi);

    if (checkOut <= checkIn) {
      throw new Error("Ngày trả phòng phải sau ngày nhận phòng");
    }

    const response = await api.post("/api/dat-phong", bookingData);

    console.log("✅ [Booking] Response thành công:", response.data);

    return {
      success: true,
      booking: response.data.content,
      message: response.data.message || "Đặt phòng thành công",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.error("❌ [Booking] Lỗi đặt phòng:", error);

    // Log chi tiết hơn
    if (error.response) {
      console.error("Response Error:", error.response.data);
      return {
        success: false,
        message:
          error.response.data?.message ||
          error.message ||
          "Không thể đặt phòng",
        statusCode: error.response.status,
        error: error.response.data,
      };
    }

    return {
      success: false,
      message: error.message || "Không thể đặt phòng. Vui lòng thử lại.",
    };
  }
};

/**
 * Lấy danh sách đặt phòng theo người dùng
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Danh sách đặt phòng
 */
export const getBookingsByUser = async (userId) => {
  try {
    console.log("Đang lấy danh sách đặt phòng...", userId);

    const response = await api.get(
      `/api/dat-phong/lay-theo-nguoi-dung/${userId}`
    );

    console.log("Response từ API:", response.data);

    return {
      success: true,
      bookings: response.data.content || [],
      message: response.data.message || "Lấy danh sách đặt phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách đặt phòng:", error);
    return {
      success: false,
      bookings: [],
      message: error.message || "Không thể lấy danh sách đặt phòng",
    };
  }
};

/**
 * Lấy thông tin đặt phòng theo ID
 * @param {number} bookingId - ID đặt phòng
 * @returns {Promise<Object>} Thông tin đặt phòng
 */
export const getBookingById = async (bookingId) => {
  try {
    console.log("Đang lấy thông tin đặt phòng...", bookingId);

    const response = await api.get(`/api/dat-phong/${bookingId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      booking: response.data.content,
      message: response.data.message || "Lấy thông tin đặt phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin đặt phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể lấy thông tin đặt phòng",
    };
  }
};

/**
 * Cập nhật đặt phòng
 * @param {number} bookingId - ID đặt phòng
 * @param {Object} bookingData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    console.log("Đang cập nhật đặt phòng...", { bookingId, bookingData });

    const response = await api.put(`/api/dat-phong/${bookingId}`, bookingData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      booking: response.data.content,
      message: response.data.message || "Cập nhật đặt phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật đặt phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật đặt phòng",
    };
  }
};

/**
 * Xóa đặt phòng
 * @param {number} bookingId - ID đặt phòng
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteBooking = async (bookingId) => {
  try {
    console.log("Đang xóa đặt phòng...", bookingId);

    const response = await api.delete(`/api/dat-phong/${bookingId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      message: response.data.message || "Xóa đặt phòng thành công",
    };
  } catch (error) {
    console.error("Lỗi xóa đặt phòng:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa đặt phòng",
    };
  }
};
