import api from "./api";

/**
 * Comment Service
 * Xử lý các API liên quan đến bình luận
 */

/**
 * Lấy danh sách bình luận theo phòng
 * @param {number} roomId - ID phòng
 * @returns {Promise<Object>} Danh sách bình luận
 */
export const getCommentsByRoom = async (roomId) => {
  try {
    console.log("📥 [Comment] Đang lấy bình luận cho phòng:", roomId);

    const response = await api.get(
      `/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`
    );

    console.log("✅ [Comment] Response:", response.data);

    return {
      success: true,
      comments: response.data.content || [],
      message: response.data.message || "Lấy danh sách bình luận thành công",
    };
  } catch (error) {
    console.error("❌ [Comment] Lỗi lấy bình luận:", error);
    return {
      success: false,
      comments: [],
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
    if (
      !commentData.maPhong ||
      !commentData.maNguoiBinhLuan ||
      !commentData.noiDung
    ) {
      throw new Error("Thiếu thông tin bắt buộc để bình luận");
    }

    if (
      commentData.saoBinhLuan &&
      (commentData.saoBinhLuan < 1 || commentData.saoBinhLuan > 5)
    ) {
      throw new Error("Số sao phải từ 1 đến 5");
    }

    const response = await api.post("/api/binh-luan", commentData);

    console.log("✅ [Comment] Bình luận thành công:", response.data);

    return {
      success: true,
      comment: response.data.content,
      message: response.data.message || "Thêm bình luận thành công",
    };
  } catch (error) {
    console.error("❌ [Comment] Lỗi thêm bình luận:", error);

    if (error.response) {
      return {
        success: false,
        message:
          error.response.data?.message ||
          error.message ||
          "Không thể thêm bình luận",
        error: error.response.data,
      };
    }

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
    };
  }
};
