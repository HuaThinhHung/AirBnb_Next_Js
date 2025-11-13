import api from "./api";

/**
 * Location Service
 * Xử lý các API liên quan đến vị trí
 */

/**
 * Lấy danh sách tất cả vị trí
 * @returns {Promise<Object>} Danh sách vị trí
 */
export const getLocations = async () => {
  try {
    console.log("Đang lấy danh sách vị trí...");

    const response = await api.get("/api/vi-tri");

    console.log("Response từ API:", response.data);

    return {
      success: true,
      locations: response.data.content || [],
      message: response.data.message || "Lấy danh sách vị trí thành công",
    };
  } catch (error) {
    // Chỉ log error nếu không phải network error (để tránh spam console)
    if (error.response) {
      console.error("❌ Lỗi lấy danh sách vị trí:", error.response.status, error.response.data);
    } else if (error.request && !error.message?.includes("Network error")) {
      console.warn("⚠️ Không thể kết nối đến server để lấy danh sách vị trí");
    }
    
    return {
      success: false,
      locations: [],
      message: error.message || "Không thể lấy danh sách vị trí. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};

/**
 * Lấy danh sách vị trí có phân trang và tìm kiếm
 * @param {{ pageIndex?: number; pageSize?: number; keyword?: string }} params
 * @returns {Promise<Object>} Kết quả bao gồm danh sách và phân trang
 */
export const getLocationsPagedSearch = async (params = {}) => {
  try {
    const pageIndex =
      params.pageIndex && params.pageIndex > 0 ? params.pageIndex : 1;
    const pageSize =
      params.pageSize && params.pageSize > 0 ? params.pageSize : 12;
    const keyword = params.keyword || "";

    const query = new URLSearchParams();
    query.append("pageIndex", String(pageIndex));
    query.append("pageSize", String(pageSize));
    if (keyword) query.append("keyword", keyword);

    const url = `/api/vi-tri/phan-trang-tim-kiem?${query.toString()}`;
    const response = await api.get(url);

    const content = response.data?.content || {};
    const data = content.data || content || [];

    return {
      success: true,
      locations: Array.isArray(data) ? data : [],
      pagination: content.pageIndex
        ? {
            pageIndex: content.pageIndex,
            pageSize: content.pageSize,
            totalRow: content.totalRow,
            totalPages: Math.ceil(
              (content.totalRow || 0) / (content.pageSize || pageSize)
            ),
          }
        : null,
      message: response.data?.message || "Lấy danh sách vị trí thành công",
    };
  } catch (error) {
    // Chỉ log error nếu không phải network error (để tránh spam console)
    if (error.response) {
      console.error("❌ Lỗi lấy danh sách vị trí phân trang:", error.response.status, error.response.data);
    } else if (error.request && !error.message?.includes("Network error")) {
      console.warn("⚠️ Không thể kết nối đến server để lấy danh sách vị trí phân trang");
    }
    
    return {
      success: false,
      locations: [],
      message: error.message || "Không thể lấy danh sách vị trí. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};

/**
 * Lấy thông tin chi tiết vị trí theo ID
 * @param {string|number} locationId - ID của vị trí
 * @returns {Promise<Object>} Thông tin vị trí
 */
export const getLocationById = async (locationId) => {
  try {
    console.log("Đang lấy thông tin vị trí...", locationId);

    const response = await api.get(`/api/vi-tri/${locationId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      location: response.data.content,
      message: response.data.message || "Lấy thông tin vị trí thành công",
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin vị trí:", error);
    return {
      success: false,
      message: error.message || "Không thể lấy thông tin vị trí",
    };
  }
};

/**
 * Tạo vị trí mới (Admin only)
 * @param {Object} locationData - Dữ liệu vị trí
 * @returns {Promise<Object>} Kết quả tạo vị trí
 */
export const createLocation = async (locationData) => {
  try {
    console.log("Đang tạo vị trí mới...", locationData);

    const response = await api.post("/api/vi-tri", locationData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      location: response.data.content,
      message: response.data.message || "Tạo vị trí thành công",
    };
  } catch (error) {
    console.error("Lỗi tạo vị trí:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = 
        errorData?.message || 
        error.message || 
        "Không thể tạo vị trí";
      
      return {
        success: false,
        message: errorMessage,
        error: errorData,
        status: error.response.status,
      };
    }

    return {
      success: false,
      message: error.message || "Không thể tạo vị trí",
    };
  }
};

/**
 * Cập nhật thông tin vị trí (Admin only)
 * @param {string|number} locationId - ID của vị trí
 * @param {Object} locationData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateLocation = async (locationId, locationData) => {
  try {
    console.log("Đang cập nhật vị trí...", { locationId, locationData });

    const response = await api.put(`/api/vi-tri/${locationId}`, locationData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      location: response.data.content,
      message: response.data.message || "Cập nhật vị trí thành công",
    };
  } catch (error) {
    console.error("Lỗi cập nhật vị trí:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật vị trí",
    };
  }
};

/**
 * Xóa vị trí (Admin only)
 * @param {string|number} locationId - ID của vị trí
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteLocation = async (locationId) => {
  try {
    console.log("Đang xóa vị trí...", locationId);

    const response = await api.delete(`/api/vi-tri/${locationId}`);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      message: response.data.message || "Xóa vị trí thành công",
    };
  } catch (error) {
    console.error("Lỗi xóa vị trí:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa vị trí",
    };
  }
};

/**
 * Upload hình ảnh vị trí (Admin only)
 * @param {string|number} locationId - ID của vị trí
 * @param {File} imageFile - File hình ảnh
 * @returns {Promise<Object>} Kết quả upload
 */
export const uploadLocationImage = async (locationId, imageFile) => {
  try {
    console.log("Đang upload hình ảnh vị trí...", { locationId, imageFile });

    const formData = new FormData();
    formData.append("formFile", imageFile);

    const response = await api.post(
      `/api/vi-tri/upload-hinh-vitri?maViTri=${locationId}`,
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
