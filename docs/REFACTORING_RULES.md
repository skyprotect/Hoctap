# HỌCTẬP SYSTEM — QUY CHUẨN REFACTORING & BẢO TRÌ CODEBASE

> **Phiên bản:** v13.39  
> **Áp dụng:** Toàn bộ AI Agents và Kỹ sư phát triển phần mềm

---

## 1. NGUYÊN TẮC BẢO VỆ SINGLE SOURCE OF TRUTH (SSOT)
- Mọi logic nghiệp vụ của Game Engine phải được viết trong thư mục `js/game/` và đóng gói qua `scripts/build/bundle_game.js`. Không được sửa code trực tiếp tại file bundle `js/game.js`.
- Mọi câu hỏi sinh Toán Lớp 6 phải được phát triển trong `data/grade_6/math/generators/` theo từng chương và đóng gói qua `scripts/build/bundle_math_g6.js`.
- Mọi định kiểu giao diện phải được chia vào các domain CSS trong `css/` (`tokens.css`, `base.css`, `layout.css`, `game.css`, `english.css`, `components.css`) và đóng gói qua `scripts/build/bundle_css.js`.

---

## 2. QUY TRÌNH KIỂM ĐỊNH QUALITY GATE
Trước khi thực hiện commit mã nguồn hoặc phát hành phiên bản mới, bắt buộc phải chạy bộ kiểm tra toàn diện:
```bash
node scripts/maintenance/check_integrity.js
```
Bộ kiểm tra này sẽ tự động thẩm định:
1. Tính hiện diện của 24 file module cấu trúc.
2. Tự động chạy lại 3 scripts đóng gói bundles (`bundle_game.js`, `bundle_math_g6.js`, `bundle_css.js`).
3. Kiểm tra cú pháp, LaTeX và tính duy nhất của 121 dạng bài Toán qua `test_syntax.js`.
4. Chạy toàn bộ 7 Jest Test Suites đảm bảo 100% test cases đạt yêu cầu.

---

## 3. QUY TẮC ĐỒNG BỘ BẢN SẠCH & PHÁT HÀNH
- Không bao giờ sửa đổi trực tiếp mã nguồn trong thư mục `HocTap_Clean`.
- Mọi sửa đổi phải thực hiện trên kho gốc `HocTap`, sau đó chạy:
```bash
node sync_clean.js
```
- Khi nâng phiên bản, cập nhật đồng bộ tại:
  - `version.json`
  - `installer.iss`
  - `student.html` (Splash Screen, Footer, Cachebusters `?v=...`)
  - `sw.js` (Service Worker cache key)
