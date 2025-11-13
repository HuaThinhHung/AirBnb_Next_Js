import api from "./api";

/**
 * Comment Service
 * Xử lý các API liên quan đến bình luận
 */

/**
 * Lấy danh sách bình luận theo phòng
 * @param {number} roomId - ID phòng
 * @param {Object} params - Tham số phân trang (optional)
 * @param {number} params.pageIndex - Trang hiện tại (mặc định: 1)
 * @param {number} params.pageSize - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise<Object>} Danh sách bình luận + phân trang
 */
export const getCommentsByRoom = async (roomId, params = {}) => {
  try {
    const pageIndex = params.pageIndex || 1;
    const pageSize = params.pageSize || 10;
    
    console.log("📥 [Comment] Đang lấy bình luận cho phòng:", roomId, { pageIndex, pageSize });

    // Thử gọi API với phân trang nếu API hỗ trợ
    let url = `/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`;
    const queryParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
    });
    
    try {
      const response = await api.get(`${url}?${queryParams.toString()}`);
      console.log("✅ [Comment] Response với phân trang:", response.data);
      
      const content = response.data.content;
      const comments = content?.data || content || [];
      
      // Kiểm tra xem response có pagination info không
      if (content?.pageIndex) {
        return {
          success: true,
          comments,
          pagination: {
            pageIndex: content.pageIndex,
            pageSize: content.pageSize,
            totalRow: content.totalRow,
            totalPages: Math.ceil(content.totalRow / content.pageSize),
          },
          message: response.data.message || "Lấy danh sách bình luận thành công",
        };
      }
      
      // Nếu không có pagination info, thực hiện client-side pagination
      const totalRow = comments.length;
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComments = comments.slice(startIndex, endIndex);
      
      return {
        success: true,
        comments: paginatedComments,
        pagination: {
          pageIndex,
          pageSize,
          totalRow,
          totalPages: Math.ceil(totalRow / pageSize),
        },
        message: response.data.message || "Lấy danh sách bình luận thành công",
      };
    } catch (paginationError) {
      // Nếu API không hỗ trợ phân trang, fallback về cách cũ
      console.log("⚠️ [Comment] API không hỗ trợ phân trang, sử dụng fallback");
      const response = await api.get(url);
      console.log("✅ [Comment] Response:", response.data);
      
      const allComments = response.data.content || [];
      const totalRow = allComments.length;
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComments = allComments.slice(startIndex, endIndex);
      
      return {
        success: true,
        comments: paginatedComments,
        pagination: {
          pageIndex,
          pageSize,
          totalRow,
          totalPages: Math.ceil(totalRow / pageSize),
        },
        message: response.data.message || "Lấy danh sách bình luận thành công",
      };
    }
  } catch (error) {
    console.error("❌ [Comment] Lỗi lấy bình luận:", error);
    return {
      success: false,
      comments: [],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        totalRow: 0,
        totalPages: 0,
      },
      message: error.message || "Không thể lấy danh sách bình luận",
    };
  }
};

/**
 * Thêm bình luận mới
 * @param {Object} commentData - Dữ liệu bình luận
 * @param {number} commentData.maPhong - ID phòng
 * @param {number} commentData.maNguoiBinhLuan - ID người bình luận
 * @param {string} commentData.noiDung - Nội dung bình luận
 * @param {number} commentData.saoBinhLuan - Số sao đánh giá (1-5)
 * @param {string} commentData.ngayBinhLuan - Ngày bình luận (YYYY-MM-DD)
 * @returns {Promise<Object>} Kết quả thêm bình luận
 */
export const createComment = async (commentData) => {
  try {
    console.log("📤 [Comment] Đang gửi bình luận:", commentData);

    // Validate
    if (!commentData.maPhong) {
      throw new Error("Vui lòng chọn phòng để bình luận");
    }

    if (!commentData.maNguoiBinhLuan) {
      throw new Error("Vui lòng đăng nhập để bình luận");
    }

    if (!commentData.noiDung || commentData.noiDung.trim() === "") {
      throw new Error("Vui lòng nhập nội dung bình luận");
    }

    if (
      commentData.saoBinhLuan &&
      (commentData.saoBinhLuan < 1 || commentData.saoBinhLuan > 5)
    ) {
      throw new Error("Số sao đánh giá phải từ 1 đến 5");
    }

    const response = await api.post("/api/binh-luan", commentData);

    console.log("✅ [Comment] Bình luận thành công:", response.data);

    return {
      success: true,
      comment: response.data.content || response.data,
      message: response.data.message || "Thêm bình luận thành công",
    };
  } catch (error) {
    console.error("❌ [Comment] Lỗi thêm bình luận:", error);
    console.error("❌ [Comment] Error response:", error.response);
    console.error("❌ [Comment] Error status:", error.status);
    console.error("❌ [Comment] Error data:", error.response?.data);

    // Kiểm tra token trước khi xử lý lỗi
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      console.log("🔑 [Comment] Token exists:", !!token);
      console.log("🔑 [Comment] Token value:", token ? token.substring(0, 30) + "..." : "null");
      if (!token) {
        return {
          success: false,
          message: "Vui lòng đăng nhập lại để bình luận",
          requiresLogin: true,
        };
      }
    }

    // Xử lý lỗi từ API interceptor (error.response có thể không tồn tại)
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = 
        errorData?.message || 
        errorData?.content || 
        error.message || 
        "Không thể thêm bình luận";
      
      // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
      if (error.response.status === 401) {
        // API interceptor đã xử lý redirect, chỉ cần trả về message
        return {
          success: false,
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          error: errorData,
          requiresLogin: true,
          alreadyHandled: true, // Đánh dấu đã được xử lý bởi interceptor
        };
      }
      
      // Xử lý lỗi 403 cụ thể
      if (error.response.status === 403) {
        const isTokenExpired = 
          errorMessage?.toLowerCase().includes("token") ||
          errorMessage?.toLowerCase().includes("hết hạn") ||
          errorMessage?.toLowerCase().includes("không đúng") ||
          errorMessage?.toLowerCase().includes("expired") ||
          errorMessage?.toLowerCase().includes("invalid");
        
        // Nếu là lỗi token, API interceptor đã xử lý redirect
        if (isTokenExpired) {
          return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
            error: errorData,
            requiresLogin: true,
            alreadyHandled: true, // Đánh dấu đã được xử lý bởi interceptor
          };
        }
        
        // Nếu không phải lỗi token, trả về lỗi permission
        return {
          success: false,
          message: "Bạn không có quyền thực hiện hành động này.",
          error: errorData,
          requiresLogin: false,
        };
      }

      return {
        success: false,
        message: errorMessage,
        error: errorData,
      };
    }

    // Xử lý lỗi validation hoặc lỗi từ interceptor
    return {
      success: false,
      message: error.message || "Không thể thêm bình luận. Vui lòng thử lại.",
    };
  }
};

/**
 * Cập nhật bình luận
 * @param {number} commentId - ID bình luận
 * @param {Object} commentData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Kết quả cập nhật
 */
export const updateComment = async (commentId, commentData) => {
  try {
    console.log("📝 [Comment] Đang cập nhật bình luận:", {
      commentId,
      commentData,
    });

    const response = await api.put(`/api/binh-luan/${commentId}`, commentData);

    console.log("✅ [Comment] Cập nhật thành công:", response.data);

    return {
      success: true,
      comment: response.data.content,
      message: response.data.message || "Cập nhật bình luận thành công",
    };
  } catch (error) {
    console.error("❌ [Comment] Lỗi cập nhật:", error);
    return {
      success: false,
      message: error.message || "Không thể cập nhật bình luận",
      error: error.response?.data,
    };
  }
};

/**
 * Xóa bình luận
 * @param {number} commentId - ID bình luận
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteComment = async (commentId) => {
  try {
    console.log("🗑️ [Comment] Đang xóa bình luận:", commentId);

    const response = await api.delete(`/api/binh-luan/${commentId}`);

    console.log("✅ [Comment] Xóa thành công:", response.data);

    return {
      success: true,
      message: response.data.message || "Xóa bình luận thành công",
    };
  } catch (error) {
    console.error("❌ [Comment] Lỗi xóa:", error);
    return {
      success: false,
      message: error.message || "Không thể xóa bình luận",
      error: error.response?.data,
    };
  }
};
