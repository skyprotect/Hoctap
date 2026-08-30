# M07 BASELINE SNAPSHOT — HOC TAP CODEBASE
**Thời gian ghi nhận:** 30/08/2026 16:30  
**Trạng thái Git ban đầu:** Branch `main`, clean working tree  

---

## 1. THỐNG KÊ DÒNG MÃ NGUỒN (SOURCE CODE METRICS)

| Loại Tệp | Số Lượng Tệp | Tổng Số Dòng (LOC) | Dung Lượng |
| :--- | :--- | :--- | :--- |
| **JavaScript (.js, .mjs)** | 121 | 78,956 | ~3.8 MB |
| **TypeScript (.ts)** | 28 | 3,813 | ~142 KB |
| **Cascading Style Sheets (.css)** | 4 | 8,002 | ~215 KB |
| **HTML (.html)** | 5 | 6,677 | ~380 KB |
| **JSON (.json)** | 296 | 132,837 | ~4.2 MB |
| **Khác (md, sh, iss, cs, vbs, etc.)** | 65 | 6,850 | ~250 KB |
| **TỔNG CỘNG MÃ NGUỒN (SOURCE CODE)** | **557** | **237,135** | **~9.0 MB** |

*(Ghi chú: Không tính các tệp nhị phân như CSDL SQLite `database.db`, video/âm thanh `.mp3`, ảnh `.png`, font chữ `.woff2` và tài liệu PDF `.pdf`).*

---

## 2. DANH SÁCH CÁC TỆP MÃ NGUỒN LỚN NHẤT TRƯỚC REFACTOR

| # | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng | Nhận Định Trùng Lặp & Xử Lý |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `data/grade_6/math/generator.js` | 10,294 | 713.3 KB | **LIVE (Canonical Source of Truth)** cho Toán 6 |
| 2 | `js/questions-v3.js` | 10,288 | 713.0 KB | **DUPLICATE** của `data/grade_6/math/generator.js` -> **XÓA** |
| 3 | `js/english_data.js` | 9,942 | 704.8 KB | Chứa 8.000 dòng trùng với `data/grade_*/english/lessons.js` -> **Tối ưu hóa** |
| 4 | `package-lock.json` | 8,009 | 283.9 KB | NPM Dependency Tree |
| 5 | `css/style.css` | 7,124 | 183.5 KB | CSS Monolith |
| 6 | `js/game.js` | 6,420 | 297.1 KB | Động cơ Game Tower Defense 2D Canvas |
| 7 | `js/lessons.js` | 4,526 | 352.9 KB | Cấu trúc chương mục bài học |
| 8 | `data/grade_6/english/lessons.js` | 3,670 | 354.5 KB | **LIVE (Canonical)** Chương trình Tiếng Anh Lớp 6 |
| 9 | `js/lib/mermaid.min.js` | 3,588 | 3.48 MB | Thư viện bên thứ ba (Minified) |
| 10 | `student.html` | 3,553 | 244.7 KB | Giao diện SPA chính cho học sinh |
| 11 | `js/parent.js` | 2,956 | 145.1 KB | Logic phụ huynh |
| 12 | `data/grade_4/english/lessons.js` | 2,724 | 96.9 KB | **LIVE (Canonical)** Chương trình Tiếng Anh Lớp 4 |
| 13 | `scripts/build/generate_math_json.js` | 2,652 | 97.8 KB | Script chuyển đổi câu hỏi |
| 14 | `data/grade_1/english/lessons.js` | 1,660 | 50.1 KB | **LIVE (Canonical)** Chương trình Tiếng Anh Lớp 1 |
| 15 | `parent.html` | 1,397 | 84.7 KB | Giao diện bảng điều khiển phụ huynh |
| 16 | `js/question-generator-worker.js` | 1,308 | 55.9 KB | Worker sinh đề ngầm |
| 17 | `data/grade_6/math/exam7991.js` | 1,217 | 71.6 KB | **LIVE (Canonical)** Đề thi 7991 Toán 6 |
| 18 | `js/questions-7991.js` | 1,217 | 71.6 KB | **DUPLICATE** của `data/grade_6/math/exam7991.js` -> **XÓA** |
| 19 | `data/grade_1/math/generator.js` | 1,106 | 63.2 KB | **LIVE (Canonical)** Toán Lớp 1 |
| 20 | `js/questions-v1.js` | 1,100 | 63.0 KB | **DUPLICATE** của `data/grade_1/math/generator.js` -> **XÓA** |
| 21 | `data/grade_4/math/generator.js` | 1,060 | 58.8 KB | **LIVE (Canonical)** Toán Lớp 4 |
| 22 | `js/questions-v4.js` | 1,054 | 58.6 KB | **DUPLICATE** của `data/grade_4/math/generator.js` -> **XÓA** |

---

## 3. KẾT QUẢ KIỂM THỬ BAN ĐẦU (TEST & BUILD RESULTS)

- **Test Runner:** Jest v29.7.0
- **Số lượng Test Suites:** 7 passed, 7 total
- **Số lượng Tests:** 46 passed, 46 total
- **TypeScript Typecheck (`npx tsc --noEmit`):** PASS (0 errors)
