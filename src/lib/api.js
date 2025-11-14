import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AIRBNB_API_URL || "https://airbnbnew.cybersoft.edu.vn",
  headers: {
    "Content-Type": "application/json",
    TokenCybersoft: process.env.NEXT_PUBLIC_TOKEN_CYBERSOFT ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I",
  },
  timeout: 10000,
});

// Flag để tránh redirect nhiều lần
let isRedirecting = false;

// Request interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    // 🧠 Chỉ chạy khi có window và localStorage
    if (typeof window !== "undefined" && localStorage) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Safe error logging với type checking
    const errorData = error.response?.data || error.message || "Unknown error";
    const errorStatus = error.response?.status;
    const isNetworkError = error.request && !error.response;
    
    // Giữ nguyên error object để có thể truy cập error.response sau này
    if (error.response) {
      const { status, data } = error.response;
      // Xử lý nhiều cấu trúc response khác nhau
      let errorMessage = error.message;
      if (data) {
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.content) {
          // content có thể là string hoặc object
          errorMessage = typeof data.content === 'string' 
            ? data.content 
            : (data.content?.message || data.content?.toString() || error.message);
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' 
            ? data.error 
            : (data.error?.message || data.error?.toString() || error.message);
        }
      }
      
      // Tạo error mới nhưng giữ nguyên response
      const customError = new Error(errorMessage);
      customError.response = error.response;
      customError.status = status;
      
      // Tạo thông báo lỗi thân thiện dựa trên status code
      let friendlyMessage = errorMessage;
      
      switch (status) {
        case 400:
          friendlyMessage = errorMessage || "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
          break;
        case 401:
          friendlyMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          // Token hết hạn hoặc không hợp lệ - xóa token và redirect
          if (typeof window !== "undefined" && !isRedirecting) {
            isRedirecting = true;
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            // Chỉ redirect nếu không phải đang ở trang login
            if (!window.location.pathname.includes("/login")) {
              // Hiển thị alert trước khi redirect (chỉ một lần)
              if (!document.body.getAttribute('data-token-expired')) {
                alert(friendlyMessage);
                document.body.setAttribute('data-token-expired', 'true');
              }
              
              setTimeout(() => {
                isRedirecting = false;
                window.location.href = "/login";
              }, 500);
            } else {
              isRedirecting = false;
            }
          }
          break;
        case 403:
          // Kiểm tra nếu lỗi 403 liên quan đến token (hết hạn hoặc không hợp lệ)
          const errorMsgStr = typeof errorMessage === 'string' 
            ? errorMessage 
            : (errorMessage?.toString() || '');
          const isTokenError = 
            errorMsgStr.toLowerCase().includes("token") ||
            errorMsgStr.toLowerCase().includes("hết hạn") ||
            errorMsgStr.toLowerCase().includes("không đúng") ||
            errorMsgStr.toLowerCase().includes("expired") ||
            errorMsgStr.toLowerCase().includes("invalid");
          
          if (isTokenError) {
            friendlyMessage = "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
            if (typeof window !== "undefined" && !isRedirecting) {
              isRedirecting = true;
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              if (!window.location.pathname.includes("/login")) {
                if (!document.body.getAttribute('data-token-expired')) {
                  alert(friendlyMessage);
                  document.body.setAttribute('data-token-expired', 'true');
                }
                setTimeout(() => {
                  isRedirecting = false;
                  window.location.href = "/login";
                }, 500);
              } else {
                isRedirecting = false;
              }
            }
          } else {
            friendlyMessage = errorMessage || "Bạn không có quyền thực hiện hành động này.";
          }
          break;
        case 404:
          // Tạo thông báo lỗi thân thiện hơn dựa trên URL
          if (error.config?.url) {
            const url = error.config.url.toLowerCase();
            if (url.includes('/users/')) {
              friendlyMessage = "Không tìm thấy người dùng này. Có thể người dùng đã bị xóa hoặc không tồn tại.";
            } else if (url.includes('/rooms/')) {
              friendlyMessage = "Không tìm thấy phòng này. Có thể phòng đã bị xóa hoặc không tồn tại.";
            } else if (url.includes('/bookings/')) {
              friendlyMessage = "Không tìm thấy đặt phòng này. Có thể đặt phòng đã bị xóa hoặc không tồn tại.";
            } else if (url.includes('/locations/')) {
              friendlyMessage = "Không tìm thấy vị trí này. Có thể vị trí đã bị xóa hoặc không tồn tại.";
            } else {
              friendlyMessage = "Không tìm thấy tài nguyên yêu cầu.";
            }
          } else {
            friendlyMessage = errorMessage && errorMessage !== "Request failed with status code 404" 
              ? errorMessage 
              : "Không tìm thấy tài nguyên yêu cầu.";
          }
          break;
        case 500:
          friendlyMessage = errorMessage || "Lỗi máy chủ. Vui lòng thử lại sau.";
          break;
        default:
          friendlyMessage = errorMessage || "Đã xảy ra lỗi không xác định.";
      }
      
      customError.message = friendlyMessage;
      
      // Log lỗi với thông báo đã được xử lý (giảm verbosity cho 404)
      if (!isNetworkError) {
        if (status === 404) {
          // Chỉ log ngắn gọn cho 404 (thường là expected)
          console.warn(`⚠️ API ${status}: ${friendlyMessage}`);
        } else {
          // Log chi tiết cho các lỗi khác
          console.error(`❌ API Error (${status}):`, friendlyMessage);
          if (error.config?.url) {
            console.error(`   URL: ${error.config.method?.toUpperCase()} ${error.config.url}`);
          }
          
          // Log token info chỉ khi có server error (401, 403, etc.)
          if (typeof window !== "undefined" && (status === 401 || status === 403)) {
            const token = localStorage.getItem("authToken");
            console.log("🔑 Token in localStorage:", token ? "Exists" : "Missing");
            if (token) {
              console.log("🔑 Token length:", token.length);
              console.log("🔑 Token preview:", token.substring(0, 20) + "...");
            }
          }
        }
      }
      
      throw customError;
    } else if (error.request) {
      // Network error - không có response từ server
      const networkError = new Error("Network error. Please check your connection.");
      networkError.request = error.request;
      throw networkError;
    } else {
      // Lỗi khác (setup error, etc.)
      const setupError = error instanceof Error 
        ? error 
        : new Error(error.message || "An unexpected error occurred during request setup.");
      throw setupError;
    }
  }
);

export default api;
