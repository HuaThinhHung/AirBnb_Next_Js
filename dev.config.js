/**
 * Development Configuration
 * Cấu hình cho môi trường development
 */

const devConfig = {
  // Bật development mode để bypass authentication
  // Set to true để sử dụng mock admin user
  DEV_MODE: true,

  // Mock admin user for development
  MOCK_ADMIN: {
    id: 999,
    name: "Admin Dev",
    email: "admin@dev.local",
    role: "ADMIN",
    phone: "0000000000",
    gender: true,
  },

  // API Configuration
  API_URL: "https://airbnbnew.cybersoft.edu.vn",
  TOKEN_CYBERSOFT:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjIyLzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2OTA0MDAwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY5MTkxMjAwfQ.kBKKhbMMH6Pqm5TdwA9DOp9z6srHiyc9KnYL_084PPo",
};

module.exports = devConfig;
