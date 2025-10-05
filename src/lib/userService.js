import api from "./api";

/**
 * User Service
 * Xử lý các API liên quan đến người dùng
 */

/**
 * Lấy thông tin người dùng hiện tại (từ localStorage)
 * @returns {Object|null} Thông tin user hoặc null
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("❌ Lỗi parse user data:", error);
    return null;
  }
};

/**
 * Lấy danh sách tất cả người dùng
 * @returns {Promise<Object>} Danh sách người dùng
 */
export const getUsers = async () => {
  try {
    console.log("📥 [User] Đang lấy danh sách người dùng...");

    const response = await api.get("/api/users");

    console.log("✅ [User] Response:", response.data);

    return {
      success: true,
      users: response.data.content || [],
      message: response.data.message || "Lấy danh sách người dùng thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi lấy danh sách:", error);
    return {
      success: false,
      users: [],
      message: error.message || "Không thể lấy danh sách người dùng",
    };
  }
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Thông tin người dùng
 */
export const getUserById = async (userId) => {
  try {
    console.log("📥 [User] Đang lấy thông tin user:", userId);

    const response = await api.get(`/api/users/${userId}`);

    console.log("✅ [User] Response:", response.data);

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Lấy thông tin người dùng thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi lấy thông tin:", error);
    return {
      success: false,
      user: null,
      message: error.message || "Không thể lấy thông tin người dùng",
    };
  }
};

/**
 * Tìm kiếm người dùng theo tên
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Promise<Object>} Kết quả tìm kiếm
 */
export const searchUsers = async (keyword) => {
  try {
    console.log("🔍 [User] Đang tìm kiếm:", keyword);

    const response = await api.get(`/api/users/search/${keyword}`);

    console.log("✅ [User] Kết quả:", response.data);

    return {
      success: true,
      users: response.data.content || [],
      message: response.data.message || "Tìm kiếm thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi tìm kiếm:", error);
    return {
      success: false,
      users: [],
      message: error.message || "Không thể tìm kiếm người dùng",
    };
  }
};

/**
 * Phân trang và tìm kiếm người dùng
 * @param {number} pageIndex - Số trang (bắt đầu từ 1)
 * @param {number} pageSize - Số lượng item mỗi trang
 * @param {string} keyword - Từ khóa tìm kiếm (optional)
 * @returns {Promise<Object>} Kết quả phân trang
 */
export const getUsersPaginated = async (
  pageIndex = 1,
  pageSize = 10,
  keyword = ""
) => {
  try {
    console.log("📄 [User] Đang lấy trang:", { pageIndex, pageSize, keyword });

    const response = await api.get("/api/users/phan-trang-tim-kiem", {
      params: {
        pageIndex,
        pageSize,
        keyword: keyword || undefined, // Không gửi nếu empty
      },
    });

    console.log("✅ [User] Response phân trang:", response.data);

    return {
      success: true,
      users: response.data.content?.data || [],
      totalCount: response.data.content?.totalRow || 0,
      pageIndex: response.data.content?.pageIndex || pageIndex,
      pageSize: response.data.content?.pageSize || pageSize,
      totalPages: Math.ceil((response.data.content?.totalRow || 0) / pageSize),
      message: response.data.message || "Lấy dữ liệu thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi phân trang:", error);
    return {
      success: false,
      users: [],
      totalCount: 0,
      totalPages: 0,
      message: error.message || "Không thể lấy dữ liệu phân trang",
    };
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {number} userId - ID người dùng
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateUser = async (userId, userData) => {
  try {
    console.log("📝 [User] Đang cập nhật:", { userId, userData });

    const response = await api.put(`/api/users/${userId}`, userData);

    console.log("✅ [User] Cập nhật thành công:", response.data);

    // Update localStorage if updating current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem("user", JSON.stringify(response.data.content));
    }

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Cập nhật thông tin thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi cập nhật:", error);

    if (error.response) {
      return {
        success: false,
        message:
          error.response.data?.message || error.message || "Không thể cập nhật",
        error: error.response.data,
      };
    }

    return {
      success: false,
      message:
        error.message || "Không thể cập nhật thông tin. Vui lòng thử lại.",
    };
  }
};

/**
 * Xóa người dùng (Admin only)
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Kết quả xóa
 *
 * ⚠️ LƯU Ý: API AirBnb không hỗ trợ DELETE user
 * Đây chỉ là mock function để demo UI
 */
export const deleteUser = async (userId) => {
  try {
    console.log("🗑️ [User] Đang xóa:", userId);

    // ⚠️ API không có endpoint DELETE user
    // Giả lập thành công để demo
    console.warn("⚠️ API không hỗ trợ DELETE /api/users/{id}");

    return {
      success: false,
      message: "Chức năng xóa người dùng chưa được hỗ trợ bởi API",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi xóa:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa người dùng",
    };
  }
};

/**
 * Upload avatar người dùng
 * @param {File} file - File ảnh
 * @returns {Promise<Object>} URL ảnh
 */
export const uploadAvatar = async (file) => {
  try {
    console.log("📤 [User] Đang upload avatar...");

    const formData = new FormData();
    formData.append("formFile", file);

    const response = await api.post("/api/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ [User] Upload thành công:", response.data);

    return {
      success: true,
      avatar: response.data.content,
      message: response.data.message || "Upload avatar thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi upload:", error);
    return {
      success: false,
      message: error.message || "Không thể upload avatar",
    };
  }
};

/**
 * Lấy danh sách booking của user
 * @param {number} userId - ID người dùng
 * @returns {Promise<Object>} Danh sách booking
 */
export const getUserBookings = async (userId) => {
  try {
    console.log("📥 [User] Đang lấy danh sách booking của user:", userId);

    const response = await api.get(
      `/api/dat-phong/lay-theo-nguoi-dung/${userId}`
    );

    console.log("✅ [User] Bookings:", response.data);

    return {
      success: true,
      bookings: response.data.content || [],
      message: response.data.message || "Lấy danh sách đặt phòng thành công",
    };
  } catch (error) {
    console.error("❌ [User] Lỗi lấy bookings:", error);
    return {
      success: false,
      bookings: [],
      message: error.message || "Không thể lấy danh sách đặt phòng",
    };
  }
};
