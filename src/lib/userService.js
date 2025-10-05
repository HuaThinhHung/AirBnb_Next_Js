import api from "./api";

/**
 * User Management Service
 * Xử lý các API liên quan đến quản lý user
 */

/**
 * Lấy danh sách users với pagination (chỉ admin)
 * @param {Object} params - Tham số phân trang { pageIndex, pageSize, keyword }
 * @returns {Promise<Object>} Danh sách users và thông tin pagination
 */
export const getUsers = async (params = {}) => {
  try {
    const { pageIndex = 1, pageSize = 10, keyword = "" } = params;

    const response = await api.get("/api/users/phan-trang-tim-kiem", {
      params: {
        pageIndex,
        pageSize,
        keyword,
      },
    });

    // Backend có thể trả về cấu trúc khác nhau
    const data = response.data.content || response.data;

    return {
      success: true,
      users: data.data || data,
      pagination: {
        pageIndex: data.pageIndex || pageIndex,
        pageSize: data.pageSize || pageSize,
        totalRow: data.totalRow || 0,
        totalPages:
          data.totalPage || Math.ceil((data.totalRow || 0) / pageSize),
      },
      message: "Lấy danh sách users thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách users:", error);
    return {
      success: false,
      users: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPages: 0,
      },
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể lấy danh sách users",
    };
  }
};

/**
 * Lấy danh sách tất cả users (chỉ admin)
 * @returns {Promise<Object>} Danh sách users
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return {
      success: true,
      users: response.data.content || response.data,
      message: "Lấy danh sách users thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách users:", error);
    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể lấy danh sách users",
    };
  }
};

/**
 * Lấy thông tin user theo ID
 * @param {number} userId - ID của user
 * @returns {Promise<Object>} Thông tin user
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return {
      success: true,
      user: response.data.content || response.data,
      message: "Lấy thông tin user thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể lấy thông tin user",
    };
  }
};

/**
 * Update thông tin user
 * @param {number} userId - ID của user
 * @param {Object} userData - Dữ liệu update
 * @returns {Promise<Object>} Kết quả update
 */
export const updateUser = async (userId, userData) => {
  try {
    console.log("Updating user:", userId, userData);

    const response = await api.put(`/api/users/${userId}`, userData);

    return {
      success: true,
      user: response.data.content || response.data,
      message: "Cập nhật user thành công",
    };
  } catch (error) {
    console.error("Lỗi update user:", error);
    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể cập nhật user",
    };
  }
};

/**
 * Update role của user (chỉ admin)
 * @param {number} userId - ID của user
 * @param {string} role - Role mới ("USER" hoặc "ADMIN")
 * @returns {Promise<Object>} Kết quả update
 */
export const updateUserRole = async (userId, role) => {
  try {
    console.log(`Updating user ${userId} role to ${role}`);

    // Thử endpoint update user bình thường
    const response = await api.put(`/api/users/${userId}`, { role });

    return {
      success: true,
      user: response.data.content || response.data,
      message: `Cập nhật role thành ${role} thành công`,
    };
  } catch (error) {
    console.error("Lỗi update role:", error);
    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể cập nhật role. Backend có thể không hỗ trợ update role từ API.",
    };
  }
};

/**
 * Xóa user (chỉ admin)
 * @param {number} userId - ID của user cần xóa
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users`, {
      params: { id: userId },
    });

    return {
      success: true,
      message: "Xóa user thành công",
    };
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    return {
      success: false,
      message:
        error.response?.data?.content || error.message || "Không thể xóa user",
    };
  }
};

/**
 * Tạo admin user trực tiếp (nếu backend hỗ trợ)
 * @param {Object} userData - Thông tin user
 * @returns {Promise<Object>} Kết quả tạo admin
 */
export const createAdminUser = async (userData) => {
  try {
    // Thử endpoint tạo admin nếu backend có
    // Thường backend sẽ có endpoint riêng cho admin
    const response = await api.post("/api/admin/users", {
      ...userData,
      role: "ADMIN",
    });

    return {
      success: true,
      user: response.data.content || response.data,
      message: "Tạo admin user thành công",
    };
  } catch (error) {
    console.error("Lỗi tạo admin user:", error);

    // Nếu endpoint không tồn tại, trả về message hướng dẫn
    if (error.response?.status === 404) {
      return {
        success: false,
        message:
          "Backend không hỗ trợ API tạo admin. Vui lòng liên hệ backend team hoặc tạo admin trực tiếp trong database.",
      };
    }

    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể tạo admin user",
    };
  }
};

/**
 * Search users
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Promise<Object>} Danh sách users tìm được
 */
export const searchUsers = async (keyword) => {
  try {
    const response = await api.get("/api/users/search", {
      params: { keyword },
    });

    return {
      success: true,
      users: response.data.content || response.data,
      message: "Tìm kiếm user thành công",
    };
  } catch (error) {
    console.error("Lỗi tìm kiếm users:", error);
    return {
      success: false,
      message:
        error.response?.data?.content ||
        error.message ||
        "Không thể tìm kiếm users",
    };
  }
};
