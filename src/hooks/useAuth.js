"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * 🔧 SIMPLE AUTH HOOK - BYPASS AUTHENTICATION
 * Version đơn giản để bypass authentication cho development
 * Luôn trả về mock admin user, không cần login
 */

// Mock admin user - luôn sẵn sàng
const MOCK_ADMIN = {
  id: 999,
  name: "Admin Dev",
  email: "admin@dev.local",
  role: "ADMIN",
  phone: "0000000000",
  gender: true,
};

export const useAuth = () => {
  const [user, setUser] = useState(MOCK_ADMIN);
  const [loading, setLoading] = useState(false); // Không loading
  const [error, setError] = useState(null);

  // Luôn set user ngay lập tức
  useEffect(() => {
    console.log("🔧 BYPASS MODE: Using mock admin user");
    setUser(MOCK_ADMIN);
  }, []);

  // Fake login function (không làm gì cả, chỉ return success)
  const login = useCallback(async (credentials) => {
    console.log("🔧 BYPASS: Fake login", credentials);
    setUser(MOCK_ADMIN);
    return {
      success: true,
      user: MOCK_ADMIN,
      message: "Bypass login successful",
    };
  }, []);

  // Fake register function
  const register = useCallback(async (userData) => {
    console.log("🔧 BYPASS: Fake register", userData);
    setUser(MOCK_ADMIN);
    return {
      success: true,
      user: MOCK_ADMIN,
      message: "Bypass register successful",
    };
  }, []);

  // Fake logout function
  const logout = useCallback(() => {
    console.log("🔧 BYPASS: Fake logout");
    // Không logout thật, vẫn giữ user
    return {
      success: true,
      message: "Bypass logout",
    };
  }, []);

  // Fake refresh function
  const refreshUser = useCallback(async () => {
    console.log("🔧 BYPASS: Fake refresh");
    return {
      success: true,
      user: MOCK_ADMIN,
    };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State - luôn có user, không loading, luôn authenticated
    user: MOCK_ADMIN,
    loading: false,
    error: null,
    isAuthenticated: true,

    // Actions - tất cả đều fake
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
};

/**
 * Hook đơn giản để kiểm tra authentication status
 * Luôn trả về true
 */
export const useIsAuthenticated = () => {
  return true;
};
