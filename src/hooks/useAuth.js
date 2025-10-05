"use client";

import { useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated,
} from "@/lib/authService";

// Development config
const DEV_MODE = true; // Set to false to disable dev mode
const MOCK_ADMIN = {
  id: 999,
  name: "Admin Dev",
  email: "admin@dev.local",
  role: "ADMIN",
  phone: "0000000000",
  gender: true,
};

/**
 * Custom Hook quản lý Authentication State
 * Cung cấp các function và state để xử lý đăng nhập, đăng ký, đăng xuất
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Kiểm tra và load thông tin user khi component mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔧 DEVELOPMENT MODE: Bypass authentication
        if (DEV_MODE) {
          console.log("🔧 DEV MODE: Using mock admin user");
          console.log("Mock user:", MOCK_ADMIN);
          setUser(MOCK_ADMIN);
          setLoading(false);
          return;
        }

        if (isAuthenticated()) {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.user);
          } else {
            // Token không hợp lệ, xóa khỏi localStorage
            logoutService();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra authentication:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Hàm đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập { email, password }
   * @returns {Promise<Object>} Kết quả đăng nhập
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const result = await loginService(credentials);

      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi đăng nhập";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Hàm đăng ký
   * @param {Object} userData - Thông tin đăng ký
   * @returns {Promise<Object>} Kết quả đăng ký
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await registerService(userData);

      if (result.success) {
        // Sau khi đăng ký thành công, có thể tự động đăng nhập
        // Hoặc redirect user đến trang đăng nhập
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi đăng ký";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Hàm đăng xuất
   * @returns {Object} Kết quả đăng xuất
   */
  const logout = useCallback(() => {
    try {
      const result = logoutService();
      setUser(null);
      setError(null);
      return result;
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi đăng xuất";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, []);

  /**
   * Refresh thông tin user
   * @returns {Promise<Object>} Kết quả refresh
   */
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCurrentUser();

      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || "Có lỗi xảy ra khi refresh user";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
};

/**
 * Hook đơn giản để kiểm tra authentication status
 * @returns {boolean} true nếu đã đăng nhập
 */
export const useIsAuthenticated = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  return authenticated;
};
