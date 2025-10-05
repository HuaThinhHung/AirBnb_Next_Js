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

    // Trả về thông tin user
    return {
      success: true,
      user: response.data.content.user,
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
    console.log("Đang gửi request đăng ký...", {
      email: data.email,
      name: data.name,
      role: data.role || "USER",
    });

    const response = await api.post("/api/auth/signup", {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      birthday: data.birthday,
      gender: data.gender,
      role: data.role || "USER", // Mặc định là USER, có thể là ADMIN
    });

    console.log("Response từ API:", response.data);

    return {
      success: true,
      user: response.data.content,
      message: response.data.message || "Đăng ký thành công!",
    };
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return {
      success: false,
      message:
        error.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
    };
  }
};

/**
 * Đăng xuất user
 * Xóa token khỏi localStorage
 */
export const logout = () => {
  try {
    localStorage.removeItem("authToken");
    console.log("Đã đăng xuất và xóa token");
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
