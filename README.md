This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🏠 Airbnb Clone Project

### 🔧 Development Mode (Quick Access to Admin)

**Để truy cập trang admin nhanh chóng khi develop:**

1. Mở file `src/hooks/useAuth.js`
2. Tìm dòng: `const DEV_MODE = true;`
3. Đảm bảo `DEV_MODE = true`
4. Chạy `npm run dev`
5. Truy cập: `http://localhost:3000/admin`

**Lưu ý**: Nhớ đổi `DEV_MODE = false` trước khi commit!

📖 Xem chi tiết: [DEV_MODE_GUIDE.md](./DEV_MODE_GUIDE.md)

---

### 🔐 Test Accounts (Production)

**Admin Account 1:**

- Email: `admin123@gmail.com`
- Password: `HuaHung123`

**Admin Account 2:**

- Email: `admin1234@gmail.com`
- Password: `Admin123`

---

### 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/           # Admin pages
│   │   ├── users/       # User management
│   │   └── layout.tsx   # Admin layout with protection
│   └── page.tsx         # Home page
├── components/
│   ├── home/            # Home page components
│   └── admin/           # Admin components
├── lib/
│   ├── api.js           # Axios instance
│   ├── authService.js   # Auth API calls
│   └── userService.js   # User API calls
└── hooks/
    └── useAuth.js       # Authentication hook
```

---

### 🚀 Features

- ✅ User Authentication (Login/Register)
- ✅ Admin Dashboard
- ✅ User Management (CRUD)
- ✅ Role-based Access Control
- ✅ Development Mode for quick testing
- ✅ Responsive Design with Tailwind CSS

---

### 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **API**: Cybersoft Airbnb API

admin123@gmail.com
HuaHung123

admin1234@gmail.com
Admin123

admin12345@gmail.com
admin12345
