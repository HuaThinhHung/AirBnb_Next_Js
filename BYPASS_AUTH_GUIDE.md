# 🔧 Bypass Authentication - Development Mode

## ✅ ĐÃ SETUP XONG!

Authentication đã được bypass hoàn toàn. Bạn có thể truy cập tất cả trang admin mà **KHÔNG CẦN ĐĂNG NHẬP**.

## 🚀 Quick Start

```bash
# Chạy dev server
npm run dev

# Truy cập trực tiếp các trang admin:
# http://localhost:3000/admin/rooms        ✅ Quản lý phòng
# http://localhost:3000/admin/users        ✅ Quản lý users
# http://localhost:3000/admin/bookings     ✅ Quản lý bookings
# http://localhost:3000/admin/dashboard    ✅ Dashboard
```

**Không cần login, không cần register, không cần token!**

---

## 📋 Những gì đã được bypass

### 1. ✅ `useAuth` Hook

**File:** `src/hooks/useAuth.js`

Hook này giờ luôn trả về:

- `user`: Mock admin user (ID: 999, role: "ADMIN")
- `isAuthenticated`: true
- `loading`: false

```javascript
// Bất kỳ component nào dùng useAuth đều nhận được mock admin
const { user, isAuthenticated } = useAuth();
console.log(user); // { id: 999, name: "Admin Dev", role: "ADMIN" }
```

### 2. ✅ Admin Layout

**File:** `src/app/admin/layout.tsx`

Đã loại bỏ:

- ❌ Check authentication
- ❌ Check role admin
- ❌ Redirect về login
- ❌ Loading state

Giờ chỉ render UI trực tiếp!

### 3. ✅ Admin Rooms Page

**File:** `src/app/admin/rooms/page.tsx`

Đã loại bỏ:

- ❌ Check authentication
- ❌ Check role admin
- ❌ Redirect về login

Load data ngay khi component mount!

---

## 🎨 Focus vào UI/UX

Giờ bạn có thể tập trung 100% vào:

### ✨ Render Rooms

- Hiển thị danh sách phòng
- Thêm, sửa, xóa phòng
- Upload hình ảnh
- Tìm kiếm và filter

### 🎯 UI Components

- Design room cards
- Modal thêm/sửa phòng
- Pagination
- Responsive design

### 📊 Data Management

- CRUD operations
- State management
- API integration
- Error handling

---

## 🔍 Debug Mode

Console sẽ hiển thị các messages hữu ích:

```javascript
// Khi load useAuth
🔧 BYPASS MODE: Using mock admin user

// Khi fake login (nếu có component login)
🔧 BYPASS: Fake login

// Khi fake register
🔧 BYPASS: Fake register
```

---

## 📁 Cấu trúc Files

```
src/
├── hooks/
│   └── useAuth.js              ✅ BYPASS - Luôn trả về admin
├── app/
│   └── admin/
│       ├── layout.tsx          ✅ BYPASS - Không check auth
│       └── rooms/
│           └── page.tsx        ✅ BYPASS - Không check auth
└── lib/
    ├── roomService.js          ✅ Giữ nguyên - API calls
    ├── locationService.js      ✅ Giữ nguyên - API calls
    └── userService.js          ✅ Giữ nguyên - API calls
```

---

## ⚡ API Calls vẫn hoạt động

Mặc dù bypass authentication, các API calls vẫn hoạt động bình thường:

```javascript
// ✅ Vẫn gọi API thật
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/lib/roomService";

// ✅ Token từ dev.config.js được dùng
const rooms = await getRooms();
```

---

## 🛠️ Nếu cần enable lại authentication

### Cách 1: Sử dụng real API (tương lai)

Trong `src/hooks/useAuth.js`, uncomment code real API:

```javascript
// Uncomment để dùng real API
// import { login as loginService, ... } from "@/lib/authService";
```

### Cách 2: Conditional bypass

Thêm flag trong `dev.config.js`:

```javascript
const devConfig = {
  BYPASS_AUTH: true, // Set false để enable auth
};
```

---

## 💡 Tips

### 1. Nếu gặp lỗi "user is not defined"

→ Check xem component có import `useAuth` không

```javascript
import { useAuth } from "@/hooks/useAuth";
const { user } = useAuth();
```

### 2. Nếu muốn thay đổi mock user

Edit trong `src/hooks/useAuth.js`:

```javascript
const MOCK_ADMIN = {
  id: 999,
  name: "Your Name", // Đổi tên
  email: "you@email.com", // Đổi email
  role: "ADMIN", // Giữ ADMIN
};
```

### 3. Nếu cần test với user khác role

Tạm thời đổi role trong mock:

```javascript
role: "USER"; // Test với role USER
```

---

## 🎯 Workflow hiện tại

```
1. npm run dev
   ↓
2. Vào http://localhost:3000/admin/rooms
   ↓
3. useAuth tự động set admin user
   ↓
4. Layout render trực tiếp (no check)
   ↓
5. Page load rooms từ API
   ↓
6. Bạn làm việc thoải mái! 🎉
```

---

## 📞 FAQ

**Q: Tại sao vẫn thấy code authentication trong project?**
A: Code vẫn ở đó nhưng đã được bypass. Giữ lại để sau này có thể enable.

**Q: API có cần token không?**
A: Có, nhưng token được lấy từ `dev.config.js` tự động.

**Q: Có ảnh hưởng đến production không?**
A: Không, đây chỉ là setup development. Production cần config riêng.

**Q: Nếu muốn test login flow thật?**
A: Bạn sẽ cần restore code cũ hoặc implement lại khi cần.

---

## ✅ Tóm tắt

- ✅ Không cần login
- ✅ Không cần register
- ✅ Không cần token từ localStorage
- ✅ Truy cập admin pages trực tiếp
- ✅ Focus 100% vào render rooms
- ✅ API calls vẫn hoạt động bình thường

**Happy coding! 🚀**
