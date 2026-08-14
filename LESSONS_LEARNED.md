# BỘ NGUYÊN TẮC RÚT KINH NGHIỆM VÀ TIÊU CHUẨN KỸ THUẬT QUỐC TẾ (LESSONS LEARNED & ARCHITECTURAL GUIDELINES)

Tài liệu này ghi lại toàn bộ các bài học kiến trúc cốt lõi, nguyên tắc chống tái phát lỗi (Anti-Regression Rules) và chuẩn mực kỹ thuật khắt khe nhất để đảm bảo hệ thống phần mềm luôn hoạt động trơn tru, mã nguồn sạch sẽ (Clean Code), không trùng lặp, dễ nâng cấp và bảo trì.

---

## I. NGUYÊN TẮC KIẾN TRÚC & CHỐNG TÁI PHÁT LỖI (ANTI-REGRESSION RULES)

### 1. Tách Rời Hoàn Toàn Xác Thực Máy Chủ (Google OAuth) Khỏi Client Đám Mây (Firebase SDK)
* **Bài học**: Không bao giờ được dùng Client Firebase SDK làm điều kiện tiên quyết (blocking prerequisite) để đăng nhập người dùng.
* **Quy chuẩn**:
  - Khi Google Identity Services (GIS) trả về `response.credential` (Google ID Token), client gửi trực tiếp lên máy chủ Express qua `/api/auth/google-login`.
  - Máy chủ sử dụng `google-auth-library` để verify ID token độc lập, cấp phát JWT phiên làm việc và lưu session vào SQLite cục bộ.
  - Kết nối Firebase Client / Firestore chỉ đóng vai trò đồng bộ dữ liệu ngầm ở chế độ phụ trợ (background sync). Nếu Firebase SDK chưa tải được hoặc máy tính offline, quá trình đăng nhập và học tập **vẫn phải diễn ra bình thường 100%**.

### 2. Nguyên Tắc Khởi Tạo Giao Diện Ngay Lập Tức (Instant UI Initialization)
* **Bài học**: Không bao giờ để giao diện chờ đợi (block) các cuộc gọi mạng I/O trước khi hiển thị dữ liệu ban đầu.
* **Quy chuẩn**:
  - Màn hình chào mừng (Splash Screen) phải kích hoạt đồng hồ (`initSplashClock`), châm ngôn (`displayRandomSplashQuote`), và lời chào (`initSplashGreeting`) **ngay khi DOMContentLoaded** mà không cần chờ kết quả kiểm tra mạng hoặc phiên đăng nhập.
  - Luôn có dữ liệu dự phòng (fallback placeholder) cho Avatar, Tên học sinh, và Số liệu học tập thay vì để rỗng hoặc hiện chữ mặc định chung chung.

### 3. Tự Trị Đóng Gói Hoàn Toàn (Zero-Config Seeding)
* **Bài học**: Người dùng cài đặt phần mềm trên bất kỳ máy tính mới nào phải sử dụng được ngay lập tức 100%, không được bắt người dùng cấu hình thủ công hoặc kẹt ở màn hình setup rỗng.
* **Quy chuẩn**:
  - CSDL SQLite trên máy tính mới tự động khởi tạo sẵn (seeding) hồ sơ 3 học sinh:
    1. **Trần Bình Minh** (ID: `std_htsj4gbmo`, Lớp 6) - Mặc định
    2. **Trần Bảo Ngọc** (ID: `std_baongoc`, Lớp 1)
    3. **Trần Đức Phúc** (ID: `std_tyc0gfnkz`, Lớp 4)
    4. Mã PIN phụ huynh mặc định: `123456`.
  - Cấu hình Firebase Web, Google Client ID phải luôn có hardcoded fallback trong mã nguồn, không được trả về rỗng hay undefined.

### 4. Đóng Gói Tài Nguyên Ngoại Tuyến & Cơ Chế Dự Phòng (Offline First & CDN Fallback)
* **Bài học**: Không được phụ thuộc đơn lẻ vào CDN bên ngoài cho các thành phần cốt lõi (Font chữ, Icon, SDK).
* **Quy chuẩn**:
  - Tất cả thư viện (FontAwesome, KaTeX, SweetAlert2, Firebase SDK) phải có file cục bộ trong thư mục `css/lib/` và `js/lib/` kèm CDN dự phòng.
  - Đường dẫn font `@font-face` phải khớp 100% tên tệp trên đĩa (`fa-v4compatibility.woff2`, `fa-solid-900.woff2`, `fa-brands-400.woff2`).

### 5. Quản Lý Trạng Thái & Bộ Nhớ Sạch Sẽ (State Isolation & Clean Memory)
* **Bài học**: Khi chuyển đổi học sinh hoặc tải lại bài thi, trạng thái bài tập cũ có thể bị rò rỉ trong RAM.
* **Quy chuẩn**:
  - Mỗi khi chuyển học sinh hoặc gọi `loadProgress()`, luôn reset sạch `this.state = { ...this.getDefaultState(), ...(serverData || {}) }`.
  - Hủy tất cả listener Firestore cũ `this._firestoreUnsubscribe()` trước khi đăng ký listener mới.

---

## II. TIÊU CHUẨN VIẾT CODE SẠCH (CLEAN CODE STANDARDS)
1. **Không trùng lặp mã (DRY - Don't Repeat Yourself)**: Mọi logic xác thực, gọi API hoặc định dạng đều quy về 1 hàm duy nhất.
2. **Xử lý lỗi bất đồng bộ phòng thủ (Defensive Async)**: Mọi hàm async/await đều phải có try/catch kèm fallback, không làm văng ứng dụng (unhandled rejection).
3. **Tuân thủ Semantic Versioning**: Mỗi lần cập nhật nâng số phiên bản và thời gian đồng bộ trên toàn bộ hệ thống.
4. **Bảo toàn dữ liệu học tập**: Mọi thao tác gộp dữ liệu (merge) đều phải giữ điểm số cao nhất và bảo toàn 100% dữ liệu môn Toán và Tiếng Anh của học sinh.
