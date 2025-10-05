import api from "./api";

/**
 * User Service
 * Xử lý các API liên quan đến quản lý users
 */

/**
 * Lấy danh sách tất cả users
 * @param {Object} params - Tham số tìm kiếm
 * @param {number} params.pageIndex - Trang hiện tại (mặc định: 1)
 * @param {number} params.pageSize - Số lượng items per page (mặc định: 10)
 * @param {string} params.keyword - Từ khóa tìm kiếm
 * @returns {Promise<Object>} Danh sách users
 */
export const getUsers = async (params = {}) => {
  try {
    console.log("Đang lấy danh sách users...", params);

    const queryParams = new URLSearchParams({
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      ...(params.keyword && { keyword: params.keyword }),
    });

    const response = await api.get(`/api/users?${queryParams}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      users: response.data.content.data,
      pagination: {
        pageIndex: response.data.content.pageIndex,
        pageSize: response.data.content.pageSize,
        totalRow: response.data.content.totalRow,
        totalPages: Math.ceil(
          response.data.content.totalRow / response.data.content.pageSize
        ),
      },
      message: response.data.message || "Lấy danh sách users thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy danh sách users:", error);
    return {
      success: false,
      message: error.message || "Không thể lấy danh sách users",
    };
  }
};

/**
 * Lấy thông tin chi tiết user theo ID
 * @param {string|number} userId - ID của user
 * @returns {Promise<Object>} Thông tin user
 */
export const getUserById = async (userId) => {
  try {
    console.log("Đang lấy thông tin user...", userId);

    const response = await api.get(`/api/users/${userId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Lấy thông tin user thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
    return {
      success: false,
      message: error.message || "Không thể lấy thông tin user",
    };
  }
};

/**
 * Cập nhật thông tin user
 * @param {string|number} userId - ID của user
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateUser = async (userId, userData) => {
  try {
    console.log("Đang cập nhật user...", { userId, userData });

    const response = await api.put(`/api/users/${userId}`, userData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Cập nhật user thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật user:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật user",
    };
  }
};

/**
 * Xóa user
 * @param {string|number} userId - ID của user
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteUser = async (userId) => {
  try {
    console.log("Đang xóa user...", userId);

    const response = await api.delete(`/api/users/${userId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      message: response.data.message || "Xóa user thành công",
    };
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa user",
    };
  }
};

/**
 * Tìm kiếm users
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {Object} params - Tham số bổ sung
 * @returns {Promise<Object>} Kết quả tìm kiếm
 */
export const searchUsers = async (keyword, params = {}) => {
  try {
    console.log("Đang tìm kiếm users...", { keyword, params });

    const searchParams = {
      keyword,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
    };

    return await getUsers(searchParams);
  } catch (error) {
    console.error("Lỗi tìm kiếm users:", error);
    return {
      success: false,
      message: error.message || "Không thể tìm kiếm users",
    };
  }
};
