# Ứng Dụng Android Tablet Lock (Kiosk Mode)

Dự án này chứa mã nguồn ứng dụng Android giúp biến máy tính bảng Android thành thiết bị Kiosk bảo mật cao, tự động khóa màn hình và chỉ mở khóa khi học sinh nhập đúng **mã số bảo mật** được quy đổi từ thẻ mạ vàng.

---

## 🛠️ Yêu cầu hệ thống
- Máy tính bảng chạy hệ điều hành **Android 5.0 (API 21)** trở lên.
- Đã kích hoạt **Chế độ nhà phát triển (Developer Options)** và **Gỡ lỗi USB (USB Debugging)** trên máy tính bảng.
- Có cài đặt **Android Studio** hoặc **Gradle** trên máy tính để biên dịch file APK.

---

## 🚀 Hướng dẫn cài đặt & Thiết lập Device Owner (Khóa cứng Kiosk)

Để ngăn chặn học sinh thoát ứng dụng bằng phím Home, Back, Đa nhiệm hay tắt nguồn, ứng dụng bắt buộc phải được thiết lập làm **Device Owner** (Quản trị viên thiết bị cao nhất). Hãy làm theo các bước sau:

### Bước 1: Biên dịch và cài đặt APK
1. Mở dự án trong Android Studio hoặc dùng dòng lệnh biên dịch file APK:
   ```bash
   ./gradlew assembleDebug
   ```
2. Cài đặt file APK vừa tạo lên máy tính bảng Android:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Bước 2: Gỡ bỏ tất cả tài khoản Google trên Tablet (BẮT BUỘC)
*Trước khi đặt Device Owner, Android yêu cầu thiết bị không được chứa bất kỳ tài khoản người dùng hoặc tài khoản Google nào:*
1. Trên Tablet, vào **Cài đặt (Settings) -> Tài khoản (Accounts)**.
2. Xóa toàn bộ tài khoản Google, Samsung, v.v. đang đăng nhập. (Sau khi thiết lập Device Owner thành công, bạn có thể đăng nhập lại bình thường).

### Bước 3: Thiết lập quyền Device Owner qua ADB
Kết nối tablet với máy tính qua cáp USB, mở Command Prompt/Terminal và chạy lệnh sau:
```bash
adb shell dpm set-device-owner com.skyprotect.tabletlock/.AdminReceiver
```
**Kết quả mong muốn:**
> *Success: Device owner set to package com.skyprotect.tabletlock*

*(Nếu báo lỗi, hãy chắc chắn rằng bạn đã thực hiện đúng Bước 2 - xóa sạch tài khoản và các user phụ trên máy).*

---

## ⚙️ Cấu hình Firebase
Ứng dụng sử dụng **Firebase Realtime Database (RTDB)** để xác thực mã số bảo mật theo thời gian thực.
Mặc định ứng dụng kết nối tới Firebase RTDB tại:
`https://binhminhchamhoc-default-rtdb.firebaseio.com/`

*Nếu muốn thay đổi URL Firebase, vui lòng chỉnh sửa hằng số `FIREBASE_RTDB_URL` trong file [MainActivity.kt](file:///f:/KHQS/AntiGravity/HocTap/android_kiosk/app/src/main/java/com/skyprotect/tabletlock/MainActivity.kt).*

---

## 🔒 Cơ chế hoạt động của ứng dụng
1. **Màn hình khóa (MainActivity):** Tự động khởi chạy khi bật máy tính bảng. Ứng dụng gọi `startLockTask()` để khóa cứng màn hình. Học sinh không thể vuốt thanh trạng thái hoặc thoát ra ngoài.
2. **Xác thực mã PIN:** Nhập mã PIN 6 số do phần mềm PC sinh ra. Ứng dụng gọi REST API Firebase để kiểm tra.
3. **Kích hoạt giờ chơi:** Nếu mã đúng, chuyển trạng thái token thành `active` trên Firebase, tính toán thời gian hết hạn (`expiresAt`), mở khóa Kiosk (`stopLockTask()`) đưa học sinh ra ngoài sử dụng máy.
4. **Foreground Service (KioskService):** Chạy một thông báo ngầm và hiển thị một **bong bóng nổi (Floating Widget)** trên góc màn hình để đếm ngược thời gian.
5. **Tự động khóa lại:** Khi hết thời gian, ứng dụng tự động mở lại màn hình khóa Kiosk và gọi `startLockTask()` khóa cứng thiết bị.
