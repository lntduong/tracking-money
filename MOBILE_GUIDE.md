# Mobile Setup Guide - Tracking Money

## ✅ Đã được cấu hình

### 1. **PWA (Progressive Web App)**
- App có thể được cài đặt trên điện thoại như ứng dụng native
- Chạy ở chế độ fullscreen (standalone)
- Có icon và splash screen tùy chỉnh

### 2. **Viewport & Meta Tags**
- Responsive design tối ưu cho mobile
- Ngăn zoom khi focus vào input
- Theme color cho mobile browsers
- Safe area support cho iPhone có notch

### 3. **Font Be Vietnam Pro**
- Hỗ trợ tiếng Việt hoàn chỉnh
- Tất cả trọng lượng từ 100-900
- Tối ưu hiển thị trên mobile

### 4. **Touch Optimizations**
- Loại bỏ tap highlights
- Better touch response
- Prevent accidental zooms

## 🎯 Cách sử dụng

### **Safe Area Classes (cho iPhone có notch)**
```jsx
<div className="safe-area-top">Content ở trên</div>
<div className="safe-area-bottom">Content ở dưới</div>
```

### **Mobile-First Responsive Design**
```jsx
// Tailwind mobile-first approach
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-lg md:text-xl lg:text-2xl">
    Title responsive
  </h1>
</div>
```

### **Touch-Friendly Buttons**
```jsx
<button className="min-h-[44px] px-4 py-2 text-base">
  Nút bấm dễ chạm
</button>
```

## 📱 PWA Installation

Người dùng có thể cài đặt app bằng cách:
1. Mở app trong browser
2. Tap "Share" button (iOS) hoặc menu (Android)
3. Chọn "Add to Home Screen"

## 🎨 Icons cần tạo

Bạn cần tạo các icon sau trong folder `public/`:
- `icon-192x192.png` (192×192px)
- `icon-512x512.png` (512×512px)
- `apple-touch-icon.png` (180×180px)

## 🔧 Recommendations

### **Input Fields**
- Sử dụng `inputmode` attribute cho keyboard phù hợp:
```jsx
<input type="text" inputMode="numeric" /> // Bàn phím số
<input type="email" inputMode="email" />   // Bàn phím email
```

### **Navigation**
- Sử dụng bottom navigation cho mobile
- Thumb-friendly zone (dưới cùng màn hình)

### **Gestures**
- Swipe để delete/archive
- Pull to refresh
- Long press cho context menu

## 🚀 Next Steps

1. Tạo và thêm app icons
2. Test PWA installation
3. Implement mobile-specific UI patterns
4. Add offline support (service worker)
5. Optimize performance cho mobile networks