# FORENSIC BASELINE — HOC TAP CODEBASE
**Thời gian ghi nhận:** 30/08/2026 16:30  
**Hệ điều hành:** Windows  
**Nhánh Git:** `main` (Clean working tree)  

---

## 1. THỐNG KÊ TỔNG QUAN MÃ NGUỒN (SOURCE CODE METRICS)

| Loại Tệp | Số Lượng Tệp | Tổng Số Dòng (LOC) | Dung Lượng |
| :--- | :--- | :--- | :--- |
| **JavaScript (.js, .mjs)** | 121 | 78,956 | ~3.8 MB |
| **TypeScript (.ts)** | 28 | 3,813 | ~142 KB |
| **Cascading Style Sheets (.css)** | 4 | 8,002 | ~215 KB |
| **HTML (.html)** | 5 | 6,677 | ~380 KB |
| **JSON (.json)** | 296 | 132,837 | ~4.2 MB |
| **Khác (.md, .sh, .iss, .cs, .vbs)** | 65 | 6,850 | ~250 KB |
| **TỔNG CỘNG MÃ NGUỒN (TRACKED SOURCE)** | **557** | **237,135** | **~9.0 MB** |

---

## 2. TOP 30 TỆP MÃ NGUỒN LỚN NHẤT TRƯỚC REFACTOR

| # | Đường Dẫn Tệp | Số Dòng (LOC) | Dung Lượng (KB) | Phân Loại & Đánh Giá |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `data/grade_6/math/generator.js` | 10,294 | 713.3 | **LIVE (Canonical)** Sinh câu hỏi Toán Lớp 6 |
| 2 | `js/questions-v3.js` | 10,288 | 713.0 | **DUPLICATE** của `data/grade_6/math/generator.js` |
| 3 | `js/english_data.js` | 9,942 | 704.8 | Chứa ~8.000 dòng trùng lặp giáo trình Lớp 1, 4, 6 |
| 4 | `package-lock.json` | 8,009 | 283.9 | NPM Lockfile |
| 5 | `css/style.css` | 7,124 | 183.5 | Toàn bộ CSS Stylesheet ứng dụng |
| 6 | `js/game.js` | 6,420 | 297.1 | Động cơ Game Tower Defense Canvas 2D |
| 7 | `js/lessons.js` | 4,526 | 352.9 | Cây bài học, subtopics & liên kết video |
| 8 | `data/grade_6/english/lessons.js` | 3,670 | 354.5 | **LIVE (Canonical)** Giáo trình Tiếng Anh Lớp 6 |
| 9 | `js/lib/mermaid.min.js` | 3,588 | 3,481.5 | Thư viện bên thứ ba (Minified) |
| 10 | `student.html` | 3,553 | 244.7 | Giao diện SPA chính cho học sinh |
| 11 | `js/parent.js` | 2,956 | 145.1 | Quản lý bảng điều khiển phụ huynh |
| 12 | `data/grade_4/english/lessons.js` | 2,724 | 96.9 | **LIVE (Canonical)** Giáo trình Tiếng Anh Lớp 4 |
| 13 | `scripts/build/generate_math_json.js` | 2,652 | 97.8 | Script trích xuất bộ đề JSON |
| 14 | `logs/kiosk_lock.log` | 2,297 | 162.2 | File log ứng dụng Kiosk Lock |
| 15 | `data/grade_1/english/lessons.js` | 1,660 | 50.1 | **LIVE (Canonical)** Giáo trình Tiếng Anh Lớp 1 |
| 16 | `parent.html` | 1,397 | 84.7 | Giao diện bảng phụ huynh |
| 17 | `js/question-generator-worker.js` | 1,308 | 55.9 | Worker sinh câu hỏi ngầm |
| 18 | `data/grade_6/math/exam7991.js` | 1,217 | 71.6 | **LIVE (Canonical)** Đề thi 7991 Toán Lớp 6 |
| 19 | `js/questions-7991.js` | 1,217 | 71.6 | **DUPLICATE** của `data/grade_6/math/exam7991.js` |
| 20 | `data/grade_1/math/generator.js` | 1,106 | 63.2 | **LIVE (Canonical)** Sinh câu hỏi Toán Lớp 1 |
| 21 | `js/questions-v1.js` | 1,100 | 63.0 | **DUPLICATE** của `data/grade_1/math/generator.js` |
| 22 | `data/grade_4/math/generator.js` | 1,060 | 58.8 | **LIVE (Canonical)** Sinh câu hỏi Toán Lớp 4 |
| 23 | `data/math/grade6/chapter1_integers.json` | 1,059 | 26.5 | Bộ đề JSON Chương 1 Toán 6 |
| 24 | `js/questions-v4.js` | 1,054 | 58.6 | **DUPLICATE** của `data/grade_4/math/generator.js` |
| 25 | `data/math/grade6/chapter2_fractions.json` | 986 | 25.2 | Bộ đề JSON Chương 2 Toán 6 |
| 26 | `exams/pregen-bai-24.json` | 983 | 65.2 | Đề sinh sẵn Bài 24 |
| 27 | `data/math/grade6/chapter3_geometry.json` | 965 | 23.2 | Bộ đề JSON Chương 3 Toán 6 |
| 28 | `exams/pregen-l4-bai-61.json` | 949 | 57.7 | Đề sinh sẵn Lớp 4 Bài 61 |
| 29 | `kiosk_lock.cs` | 909 | 34.5 | Mã nguồn C# Kiosk Lock Windows |
| 30 | `exams/pregen-l4-bai-60.json` | 902 | 52.0 | Đề sinh sẵn Lớp 4 Bài 60 |

---

## 3. CÁC ỨNG VIÊN TRÙNG LẶP & MÃ CHẾT (DUPLICATE & DEAD CANDIDATES)

1. **Ngân hàng đề Toán duplicate trong `js/`**:
   - `js/questions-v3.js` (10.288 LOC) ≡ `data/grade_6/math/generator.js` (10.294 LOC)
   - `js/questions-v1.js` (1.100 LOC) ≡ `data/grade_1/math/generator.js` (1.106 LOC)
   - `js/questions-v4.js` (1.054 LOC) ≡ `data/grade_4/math/generator.js` (1.060 LOC)
   - `js/questions-7991.js` (1.217 LOC) ≡ `data/grade_6/math/exam7991.js` (1.217 LOC)
   - `js/questions-advanced.js` (626 LOC) ≡ `data/grade_6/math/advanced.js` (626 LOC)
   - `data/engine/question_engine.js` (224 LOC) ≡ Bản cũ của `js/engine/question-engine.js` (369 LOC)
2. **Dữ liệu Tiếng Anh trùng lặp trong `js/english_data.js`**:
   - ~8.000 dòng `ENGLISH_COURSE_DATA` trong `js/english_data.js` trùng khớp 100% với `data/grade_1/english/lessons.js`, `data/grade_4/english/lessons.js`, `data/grade_6/english/lessons.js`.
3. **Mã nháp / Rác tạm thời trong `scripts/scratch/`**:
   - 11 tệp nháp: `scratch.js`, `scratch2.js`, ..., `scratch8.js`, `fix_app.js`, `search_db_temp.js`, `test_start.vbs`.
