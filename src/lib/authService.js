import api from "./api";

/**
 * Authentication Service
 * Xử lý các API liên quan đến đăng nhập, đăng ký
 */

/**
 * Đăng nhập user
 * @param {Object} data - Thông tin đăng nhập
 * @param {string} data.email - Email của user
 * @param {string} data.password - Mật khẩu của user
 * @returns {Promise<Object>} Thông tin user sau khi đăng nhập thành công
 */
export const login = async (data) => {
  try {
    console.log("Đang gửi request đăng nhập...", { email: data.email });

    const response = await api.post("/api/auth/signin", {
      email: data.email,
      password: data.password,
    });

    console.log("Response từ API:", response.data);

    // Lưu accessToken vào localStorage
    if (response.data?.content?.token) {
      localStorage.setItem("authToken", response.data.content.token);
      console.log("Đã lưu token vào localStorage");
    }

    // Lưu thông tin user để sử dụng
    const userData = response.data.content.user || response.data.content;
    console.log("User data:", userData);

    // Trả về thông tin user
    return {
      success: true,
      user: userData,
      token: response.data.content.token,
      message: response.data.message || "Đăng nhập thành công!",
    };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return {
      success: false,
      message:
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
    };
  }
};

/**
 * Đăng ký user mới
 * @param {Object} data - Thông tin đăng ký
 * @param {string} data.name - Tên của user
 * @param {string} data.email - Email của user
 * @param {string} data.password - Mật khẩu của user
 * @param {string} data.phone - Số điện thoại
 * @param {string} data.birthday - Ngày sinh (format: YYYY-MM-DD)
 * @param {boolean} data.gender - Giới tính (true: Nam, false: Nữ)
 * @param {string} data.role - Vai trò của user (mặc định: "USER")
 * @returns {Promise<Object>} Kết quả đăng ký
 */
export const register = async (data) => {
  try {
    // Validate dữ liệu trước khi gửi
    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.phone ||
      !data.birthday
    ) {
      return {
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      };
    }

    // Chuẩn hóa dữ liệu
    const registerData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone.trim(),
      birthday: data.birthday, // Format: YYYY-MM-DD
      gender: data.gender === true || data.gender === "true", // Đảm bảo là boolean
      role: data.role || "USER",
    };

    // Kiểm tra lại dữ liệu trước khi gửi
    if (
      !registerData.name ||
      !registerData.email ||
      !registerData.password ||
      !registerData.phone ||
      !registerData.birthday
    ) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc. Vui lòng kiểm tra lại.",
      };
    }

    console.log("Đang gửi request đăng ký...", {
      email: registerData.email,
      name: registerData.name,
      phone: registerData.phone,
      birthday: registerData.birthday,
      gender: registerData.gender,
      role: registerData.role,
    });

    console.log(
      "Raw data trước khi gửi:",
      JSON.stringify(registerData, null, 2)
    );

    const response = await api.post("/api/auth/signup", registerData);

    console.log("Response từ API:", response.data);

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Đăng ký thành công!",
    };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    // Xử lý lỗi chi tiết hơn
    let errorMessage = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";

    if (error.response?.data?.content) {
      // Kiểm tra nội dung lỗi cụ thể
      if (error.response.data.content.includes("Email đã tồn tại")) {
        errorMessage = "Email này đã được sử dụng. Vui lòng chọn email khác.";
      } else if (error.response.data.content.includes("đã tồn tại")) {
        errorMessage = error.response.data.content;
      } else {
        errorMessage = error.response.data.content;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 400) {
      errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
    } else if (error.response?.status === 409) {
      errorMessage = "Email đã được sử dụng. Vui lòng chọn email khác.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Đăng xuất user
 * Xóa tất cả token và user data khỏi localStorage
 */
export const logout = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("Đã đăng xuất và xóa tất cả dữ liệu");
    }
    return {
      success: true,
      message: "Đăng xuất thành công!",
    };
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi đăng xuất",
    };
  }
};

/**
 * Lấy thông tin user hiện tại từ token
 * @returns {Promise<Object>} Thông tin user
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "Chưa đăng nhập",
      };
    }

    const response = await api.get("/api/users/profile");
    return {
      success: true,
      user: response.data.content,
      message: "Lấy thông tin user thành công",
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
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean} true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("authToken");
  return !!token;
};
