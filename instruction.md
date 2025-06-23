# Tài liệu hướng dẫn dự án Tracking Money

## 1. Giới thiệu dự án
Tracking Money là ứng dụng quản lý chi tiêu cá nhân hiện đại, hỗ trợ người Việt với giao diện đẹp, thân thiện di động, đa chức năng: quản lý ví, giao dịch, báo cáo, danh mục, tài khoản, chuyển tiền, v.v. Ứng dụng sử dụng Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, PWA, tối ưu cho mobile-first, hỗ trợ đa ví, phân loại thu/chi, báo cáo trực quan, xác thực bảo mật.

## 2. Cấu trúc dự án
```
tracking-money/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Trang chủ (Dashboard)
│   │   ├── wallet/page.tsx         # Quản lý ví
│   │   ├── add/page.tsx            # Thêm giao dịch
│   │   ├── reports/page.tsx        # Báo cáo
│   │   ├── account/page.tsx        # Tài khoản
│   │   ├── categories/page.tsx     # Quản lý danh mục
│   │   ├── add-wallet/page.tsx     # Thêm ví
│   │   ├── transfer/page.tsx       # Chuyển tiền
│   │   ├── auth/signin/page.tsx    # Đăng nhập
│   │   ├── auth/signup/page.tsx    # Đăng ký
│   │   └── api/                    # Các endpoint API
│   ├── components/                 # UI components, form, nav, ...
│   ├── lib/                        # Tiện ích, prisma, auth
│   ├── types/                      # Định nghĩa type
│   └── middleware.ts               # Middleware Next.js
├── prisma/                         # Schema & seed DB
├── database/                       # SQL scripts
├── public/                         # Static assets, manifest
├── ...
```

## 3. Các màn hình chính
- **Trang chủ (Dashboard):** Hiển thị số dư tổng, các ví, giao dịch gần đây, quick actions.
- **Quản lý ví:** Danh sách ví, số dư, loại ví, thêm/sửa/xóa ví.
- **Thêm giao dịch:** Form thêm thu nhập/chi tiêu, chọn danh mục, ghi chú.
- **Báo cáo:** Thống kê thu/chi, tiết kiệm, biểu đồ theo danh mục, ví, thời gian.
- **Tài khoản:** Thông tin cá nhân, số ngày sử dụng, số ví, số giao dịch, đăng xuất.
- **Quản lý danh mục:** CRUD danh mục thu/chi, icon, màu sắc, tìm kiếm, lọc.
- **Thêm ví:** Form tạo ví mới, chọn loại ví, số dư ban đầu, mô tả.
- **Chuyển tiền:** Form chuyển khoản giữa các ví, nhập số tiền, ghi chú.
- **Đăng nhập/Đăng ký:** Xác thực người dùng, tạo tài khoản, đăng nhập, đăng xuất.

## 4. Chức năng chính
- Quản lý nhiều ví (tiền mặt, ngân hàng, thẻ, tiết kiệm, ví điện tử...)
- Thêm/sửa/xóa giao dịch thu nhập, chi tiêu
- Thống kê báo cáo theo thời gian, danh mục, ví
- Quản lý danh mục thu/chi (CRUD)
- Chuyển tiền giữa các ví
- Đăng ký, đăng nhập, đăng xuất, bảo mật
- Responsive/mobile-first, PWA, hỗ trợ tiếng Việt, định dạng VNĐ

## 5. API chi tiết
### Xác thực & Tài khoản
- `POST /api/auth/signup` — Đăng ký tài khoản mới (email, password, fullName)
- `POST /api/auth/[...nextauth]` — Đăng nhập (NextAuth credentials)
- `POST /api/auth/logout` — Đăng xuất
- `GET  /api/account` — Lấy thông tin tài khoản hiện tại

### Ví
- `GET  /api/wallets` — Lấy danh sách ví, tổng số dư, chi tiết từng ví
- `POST /api/wallets` — Tạo ví mới (name, walletType, initialBalance, description)
- `GET  /api/wallet-types` — Lấy danh sách loại ví

### Giao dịch & Báo cáo
- `GET  /api/dashboard` — Dữ liệu dashboard: tổng số dư, ví, giao dịch gần đây
- `GET  /api/reports?period=month|week|year` — Báo cáo thu/chi, tiết kiệm, breakdown theo danh mục, ví, trend

### Danh mục
- `GET  /api/categories` — Lấy danh sách danh mục (mặc định + user)
- `POST /api/categories` — Tạo danh mục mới (name, icon, color)
- `PATCH /api/categories/[id]` — Sửa danh mục (name, icon, color)
- `DELETE /api/categories/[id]` — Xóa danh mục (chỉ danh mục user tạo)

### Khác
- `GET  /api/test-db` — Kiểm tra kết nối database, trả về số lượng loại ví, danh mục mặc định, thông tin demo user

## 6. Công nghệ sử dụng
- Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons, PWA, Prisma ORM, PostgreSQL/MySQL, React hooks, NextAuth, ...

---
*File này tự động sinh bởi AI dựa trên source code thực tế. Có thể bổ sung chi tiết hơn nếu cần.*