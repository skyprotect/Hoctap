# BÁO CÁO TỔNG QUAN HỆ THỐNG HỌC TIẾNG ANH (ENGLISH PRO)
## PHÂN TÍCH CHUYÊN SÂU CẤU TRÚC & CHỨC NĂNG PHẦN HỌC TIẾNG ANH LỚP 6

---

## MỤC LỤC
1. [Giới thiệu & Triết lý Thiết kế](#1-giới-thiệu--triết-lý-thiết-kế)
2. [Kiến trúc Phân tầng & Cơ chế Cô lập Dữ liệu](#2-kiến-trúc-phân-tầng--cơ-chế-cô-lập-dữ-liệu)
3. [Phân tích Chuyên sâu Cấu trúc Chương trình Tiếng Anh Lớp 6](#3-phân-tích-chuyên-sâu-cấu-trúc-chương-trình-tiếng-anh-lớp-6)
   - 3.1. [Chuẩn đầu ra & Định vị Năng lực](#31-chuẩn-đầu-ra--định-vị-năng-lực)
   - 3.2. [Cấu trúc 22 Chủ đề Học tập (Topics)](#32-cấu-trúc-22-chủ-đề-học-tập-topics)
   - 3.3. [Hệ thống Ngữ pháp & Ngân hàng Câu hỏi Chuyên đề](#33-hệ-thống-ngữ-pháp--ngân-hàng-câu-hỏi-chuyên-đề)
   - 3.4. [Hệ thống Kho Video Bài giảng SGK Tích hợp](#34-hệ-thống-kho-video-bài-giảng-sgk-tích-hợp)
4. [Phân tích Chi tiết 8 Phân hệ Chức năng Hiện hữu](#4-phân-tích-chi-tiết-8-phân-hệ-chức-năng-hiện-hữu)
   - 4.1. [Bản đồ Hành trình Học tập 4 Kỹ năng (Island Map & Quick Study Lab)](#41-bản-đồ-hành-trình-học-tập-4-kỹ-năng-island-map--quick-study-lab)
   - 4.2. [Bộ máy Luyện tập Tương tác Đa giác quan 4 Kỹ năng (Interactive Practice Engine)](#42-bộ-máy-luyện-tập-tương-tác-đa-giác-quan-4-kỹ-năng-interactive-practice-engine)
   - 4.3. [Đấu trường Từ vựng & AI Khuyến nghị Mục tiêu (Vocabulary Arena & Focus Target Practice)](#43-đấu-trường-từ-vựng--ai-khuyến-nghị-mục-tiêu-vocabulary-arena--focus-target-practice)
   - 4.4. [Trung tâm Khảo thí & Tạo Đề thi Chuẩn GDPT 2018 (Exam Center & PDF Export)](#44-trung-tâm-khảo-thí--tạo-đề-thi-chuẩn-gdpt-2018-exam-center--pdf-export)
   - 4.5. [Đấu trường Olympic Tiếng Anh Quốc gia (IOE Olympic Arena)](#45-đấu-trường-olympic-tiếng-anh-quốc-gia-ioe-olympic-arena)
   - 4.6. [Quản lý Chuyên đề Từ vựng Cá nhân hóa (Custom Vocabulary Topics)](#46-quản-lý-chuyên-đề-từ-vựng-cá-nhân-hóa-custom-vocabulary-topics)
   - 4.7. [Hồ sơ Chiến binh, Biểu đồ Radar & Gamification Thẻ 3D](#47-hồ-sơ-chiến-binh-biểu-đồ-radar--gamification-thẻ-3d)
   - 4.8. [Cổng Quản trị Phụ huynh cho Môn Tiếng Anh (Parent Dashboard Integration)](#48-cổng-quản-trị-phụ-huynh-cho-môn-tiếng-anh-parent-dashboard-integration)
5. [Cơ chế Nhận diện Giọng nói (Speech AI) & Phát âm Offline-First](#5-cơ-chế-nhận-diện-giọng-nói-speech-ai--phát-âm-offline-first)
6. [Đánh giá Tổng kết & Định hướng Phát triển Tiếp theo](#6-đánh-giá-tổng-kết--định-hướng-phát-triển-tiếp-theo)

---

## 1. Giới thiệu & Triết lý Thiết kế

Hệ thống học Tiếng Anh (**English Pro**) trong nền tảng học tập được xây dựng như một hệ sinh thái học ngoại ngữ toàn diện, hiện đại dành cho học sinh phổ thông. Hệ thống được thiết kế theo các tiêu chuẩn giáo dục quốc tế:
- **Khung năng lực Cambridge Young Learners & CEFR**:
  - Lớp 1: Trình độ *Pre-A1 Starters*
  - Lớp 4: Trình độ *A1 Movers*
  - **Lớp 6: Trình độ *A2 Flyers / KET / PET*** (mở rộng kiến thức Lớp 7 Nâng cao).
- **Mô hình 4 Kỹ năng Ngôn ngữ Học chuẩn mực**: Tích hợp chặt chẽ 4 kỹ năng **Nghe (Listening)**, **Nói (Speaking)**, **Đọc (Reading)**, và **Viết (Writing)** thay vì chỉ làm trắc nghiệm ngữ pháp thụ động.
- **Trải nghiệm Học tập Tương tác (Gamified Interactive Learning)**: Lấy cảm hứng từ các nền tảng học ngoại ngữ hàng đầu như *Duolingo*, *Monkey Stories*, kết hợp yếu tố nhập vai chiến binh: Trái tim mạng sống (Hearts), Chuỗi học tập (Streak), Điểm kinh nghiệm (XP), Thẻ kỹ năng 3D (Skill Cards), và Đấu trường quái vật từ vựng (Vocabulary Slayer).
- **Học tập Đa giác quan (Multi-sensory Contextual Learning)**: Mỗi từ vựng và mẫu câu đều đi kèm minh họa trực quan vector Icons8, phiên âm chuẩn quốc tế IPA, giải nghĩa ngữ cảnh, phát âm âm thanh tự nhiên (Audio / TTS) và nhận diện giọng nói AI (Speech Recognition).

---

## 2. Kiến trúc Phân tầng & Cơ chế Cô lập Dữ liệu

### 2.1. Phân tầng Kiến trúc Mã nguồn (Architectural Boundaries)
Hệ thống được module hóa cao độ theo mô hình UMD (Universal Module Definition), đảm bảo tách biệt tuyệt đối giữa tầng Dữ liệu giáo trình, Bộ máy đánh giá logic thuần túy (Pure Domain Logic), Dịch vụ hạ tầng (Audio/Speech) và Giao diện người dùng (UI View):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GIAO DIỆN HỌC SINH                              │
│         student.html  ──  js/app.js (UI Controller & Event Handling)   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  BỘ ĐÁNH GIÁ THUẦN   │  │  DỮ LIỆU GIÁO TRÌNH  │  │ DỊCH VỤ ÂM THANH/AI  │
│ (Pure Domain Logic)  │  │  (Course & Grammar)  │  │   (Audio & Speech)   │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ english-answer-      │  │ english-course-      │  │ speech-recognition-  │
│   evaluator.js       │  │   data.js (8000+ dòng│  │   service.js         │
│                      │  │   chứa Lớp 1, 4, 6)  │  │ speech-service.js    │
│ english-skill-       │  │                      │  │ audio-service.js     │
│   evaluator.js       │  │ english-grammar-     │  │ word-image-utils.js  │
│                      │  │   data.js            │  │ emoji-utils.js       │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

- **`js/core/english-course-data.js`**: Đóng gói toàn bộ cơ sở dữ liệu khóa học chính khóa và nâng cao của Lớp 1, 4, 6. Hoàn toàn không chứa mã điều khiển DOM.
- **`js/core/english-grammar-data.js`**: Ngân hàng đề tĩnh câu hỏi ngữ pháp Lớp 6 và 18 bộ chủ đề thì/ngữ pháp chuyên sâu.
- **`js/core/english-answer-evaluator.js`**: Module đánh giá câu trả lời thuần túy (Pure Evaluator): chấm trắc nghiệm, chấm chính tả nghe (Dictation), chấm sắp xếp câu (Word Unscramble), chấm sắp xếp chữ cái (Spelling), chấm điền khuyết (Cloze Test) và **Trợ lý chẩn đoán ngữ pháp sư phạm (Smart Grammar Assistant)**.
- **`js/core/english-skill-evaluator.js`**: Module tính toán chỉ số 6 kỹ năng radar (`calculateEnglishSkillScores`), kiểm tra điều kiện mở khóa Thẻ Năng Lực 3D (`isSkillCardUnlocked`) độc lập với giao diện.
- **`js/english_data.js`**: Bộ sinh đề thi động client-side (`generateEnglishQuestions`, `generateIoeQuestions`, `generateEnglishFullExam`), kết hợp thuật toán xáo trộn Fisher-Yates và hoán vị tất định (`scrambleWord`) chống trùng lặp tuyệt đối.

### 2.2. Cơ chế Bảo toàn Môn Toán & Cô lập Dữ liệu (Subject & Student Isolation)
Tuân thủ nghiêm ngặt **Quy tắc 10 và Quy tắc 14 của hệ thống**:
- **Cô lập theo môn học (Subject Isolation)**:
  - Môn Toán: Điểm lưu tại `state.scores['chuyen-de-X']`, tài nguyên vàng `state.gold`, chuỗi `state.streak`.
  - Môn Tiếng Anh: Điểm lưu độc lập với tiền tố `eng` (ví dụ: `eng6-t1-listening`, `eng6-t1-speaking`, `eng6-t1-reading`, `eng6-t1-writing`), điểm kinh nghiệm `state.englishXp`, trái tim `state.englishHearts`, chuỗi học tập `state.englishStreak`, phiên làm bài `state.examSessions`.
  - Toàn bộ thao tác môn Tiếng Anh không bao giờ ghi đè hay làm biến động dữ liệu môn Toán.
- **Cô lập theo học sinh (Student Isolation)**:
  - Học sinh Lớp 6 **Trần Bình Minh** (ID cố định: `std_htsj4gbmo`) thuộc tài khoản phụ huynh `skyprotect@gmail.com`.
  - Tiến trình học, điểm số, thẻ năng lực và lịch sử làm bài tiếng Anh lớp 6 của Trần Bình Minh được lưu trữ độc lập tại bản ghi SQLite tương ứng trong cơ sở dữ liệu `database.db`.

---

## 3. Phân tích Chuyên sâu Cấu trúc Chương trình Tiếng Anh Lớp 6

### 3.1. Chuẩn đầu ra & Định vị Năng lực
Chương trình Tiếng Anh Lớp 6 được thiết kế bám sát 100% Chương trình Giáo dục Phổ thông mới (GDPT 2018) theo bộ sách giáo khoa **Global Success (Tập 1 & Tập 2)**, kết hợp mục tiêu đầu ra chứng chỉ quốc tế:
- **Trình độ**: KET / PET & Lớp 7 Nâng cao (Tương đương CEFR A2 vươn tới B1).
- **Mục tiêu năng lực**:
  - Giao tiếp tự tin trong môi trường học đường, bạn bè, gia đình và cộng đồng.
  - Sử dụng thành thạo các thì cơ bản (Hiện tại đơn, Hiện tại tiếp diễn, Quá khứ đơn, Tương lai đơn) và các cấu trúc so sánh, câu điều kiện loại 1, động từ khuyết thiếu.
  - Năng lực đọc hiểu đoạn văn từ 80 - 150 từ, nghe hiểu các đoạn đối thoại học đường tốc độ chuẩn tự nhiên.

### 3.2. Cấu trúc 22 Chủ đề Học tập (Topics)
Chương trình Lớp 6 gồm **22 Units** hoàn chỉnh, bao gồm 12 bài chính khóa và 10 bài nâng cao vượt cấp:

| STT | Mã Topic | Tên Chủ đề (Unit Title) | Phân loại | Số từ vựng | Mẫu câu đàm thoại | Trọng tâm Ngữ pháp | Số video SGK |
|:---:|:---:|:---|:---:|:---:|:---|:---|:---:|
| 1 | `eng6-t1` | **Unit 1: My New School** | Chính khóa | 15 | 2 | Hiện tại đơn & Hiện tại tiếp diễn | 9 video |
| 2 | `eng6-t2` | **Unit 2: My House** | Chính khóa | 18 | 2 | Giới từ chỉ vị trí & Có... (There is/are) | 9 video |
| 3 | `eng6-t3` | **Unit 3: My Friends** | Chính khóa | 17 | 2 | Tính từ miêu tả tính cách & Thì hiện tại tiếp diễn chỉ tương lai | 9 video |
| 4 | `eng6-t4` | **Unit 4: My Neighbourhood** | Chính khóa | 16 | 2 | So sánh hơn của tính từ ngắn và dài (Comparatives) | 9 video |
| 5 | `eng6-t5` | **Unit 5: Natural Wonders of the World** | Chính khóa | 18 | 2 | So sánh nhất (Superlatives) & Must/Mustn't | 7 video |
| 6 | `eng6-t6` | **Unit 6: Our Tet Holiday** | Chính khóa | 16 | 2 | Should/Shouldn't & Lượng từ Some/Any | 9 video |
| 7 | `eng6-t7` | **Unit 7: Television** | Chính khóa | 18 | 2 | Từ để hỏi Wh-questions & Liên từ (and, but, although) | 9 video |
| 8 | `eng6-t8` | **Unit 8: Sports and Games** | Chính khóa | 18 | 2 | Quá khứ đơn (Past Simple) & Câu mệnh lệnh | 9 video |
| 9 | `eng6-t9` | **Unit 9: Cities of the World** | Chính khóa | 19 | 2 | Hiện tại hoàn thành (Present Perfect) & Đại từ sở hữu | 9 video |
| 10 | `eng6-t10` | **Unit 10: Our Houses in the Future** | Chính khóa | 19 | 2 | Tương lai đơn (Will/Won't) & Might dự đoán | 9 video |
| 11 | `eng6-t11` | **Unit 11: Our Greener World** | Chính khóa | 19 | 2 | Câu điều kiện loại 1 (First Conditional) & Quy tắc 3R | 6 video |
| 12 | `eng6-t12` | **Unit 12: Robots** | Chính khóa | 19 | 2 | So sánh nhất nâng cao & Could chỉ khả năng quá khứ | 7 video |
| 13 | `eng6-t13` | **Unit 13: Hobbies & Benefits** | Nâng cao L7 | 5 | 2 | Like/Love/Enjoy + V-ing, Hiện tại đơn mở rộng | Lý thuyết |
| 14 | `eng6-t14` | **Unit 14: Health & Calories** | Nâng cao L7 | 5 | 2 | Lời khuyên sức khỏe (Imperatives with more/less) | Lý thuyết |
| 15 | `eng6-t15` | **Unit 15: Community Service** | Nâng cao L7 | 5 | 2 | Quá khứ đơn & Hoạt động thiện nguyện | Lý thuyết |
| 16 | `eng6-t16` | **Unit 16: Music & Arts** | Nâng cao L7 | 5 | 2 | So sánh: (not) as... as, the same as, different from | Lý thuyết |
| 17 | `eng6-t17` | **Unit 17: Vietnamese Food & Drinks** | Nâng cao L7 | 5 | 2 | Danh từ đếm được / không đếm được & How much/How many | Lý thuyết |
| 18 | `eng6-t18` | **Unit 18: First University in VN** | Nâng cao L7 | 5 | 2 | Câu bị động trong quá khứ đơn (Was/Were + V3/ed) | Lý thuyết |
| 19 | `eng6-t19` | **Unit 19: Traffic & Safety** | Nâng cao L7 | 5 | 2 | It indicates distance & Used to chỉ thói quen quá khứ | Lý thuyết |
| 20 | `eng6-t20` | **Unit 20: Films & Reviews** | Nâng cao L7 | 5 | 2 | Liên từ chỉ sự tương phản: Although, In spite of, However | Lý thuyết |
| 21 | `eng6-t21` | **Unit 21: Energy Sources** | Nâng cao L7 | 5 | 2 | Thì tương lai tiếp diễn (Future Continuous) cơ bản | Lý thuyết |
| 22 | `eng6-t22` | **Unit 22: Future Transport** | Nâng cao L7 | 5 | 2 | Đại từ sở hữu & Mệnh đề chỉ lý do | Lý thuyết |

#### Thống kê Quy mô Dữ liệu Giáo trình Lớp 6:
- **Tổng số từ vựng chính khóa**: 212 từ vựng học thuật chuẩn SGK (kèm đầy đủ IPA, từ loại, câu ví dụ và dịch nghĩa câu).
- **Tổng số từ vựng nâng cao**: 50 từ vựng chuyên sâu bám chương trình Lớp 7.
- **Tổng số mẫu câu giao tiếp phản xạ**: 44 cặp đàm thoại hỏi - đáp thực tế.
- **Tổng số bài đọc hiểu tích hợp**: 22 bài đọc hiểu dài kèm câu hỏi trắc nghiệm nội dung.
- **Tổng số video bài giảng YouTube bám sát SGK**: **93 video clip bài giảng chi tiết** theo từng phần bài học (Getting Started, A Closer Look 1, A Closer Look 2, Communication, Skills 1, Skills 2, Looking Back & Project).

### 3.3. Hệ thống Ngữ pháp & Ngân hàng Câu hỏi Chuyên đề
Hệ thống ngữ pháp Lớp 6 được lưu trữ tại `js/core/english-grammar-data.js` với 2 cấu phần mạnh mẽ:
1. **Ngân hàng chuyên sâu Unit 1**:
   - `ENG6_T1_READING_GRAMMAR_QUESTIONS`: 35 câu hỏi trắc nghiệm ngữ pháp chuyên sâu về thì Hiện tại đơn và trợ động từ (*Do/Does/Don't/Doesn't*), có giải thích cặn kẽ sư phạm (`solutionHtml`).
   - `ENG6_T1_WRITING_GRAMMAR_QUESTIONS`: 14 câu hỏi luyện viết và điền trợ động từ vào câu khuyết.
2. **18 Chủ đề Ngữ pháp Toàn diện (`ENGLISH_GRAMMAR_TOPIC_QUESTIONS`)**:
   - *To be*, *Articles* (a/an/the), *Demonstratives* (this/that/these/those), *Plural nouns*, *Possessive*, *Modal can*, *Like + V-ing*, *Present continuous*, *Prepositions of place*, *Present simple verbs*, *Adverbs of frequency*, *Prepositions of time*, *Should/Shouldn't*, *Past simple*, *Comparatives*, *Future plans*, *Must/Mustn't*, *First conditional*.
   - Mỗi chủ đề có các câu hỏi phân loại sẵn dạng `choice` (trắc nghiệm) và `writing` (tự luận viết).

### 3.4. Hệ thống Kho Video Bài giảng SGK Tích hợp
Hệ thống tích hợp trực tiếp 93 video bài giảng chất lượng cao của giáo viên dạy theo SGK Global Success Lớp 6:
- Học sinh bấm vào nút **"Xem bài giảng video"** trên thẻ bài học, modal hiển thị danh sách tất cả các video theo từng kỹ năng của Unit.
- Học sinh bấm xem trực tiếp trong ứng dụng mà không bị quảng cáo xao nhãng.

---

## 4. Phân tích Chi tiết 8 Phân hệ Chức năng Hiện hữu

Giao diện Tiếng Anh được thiết kế theo bố cục Web App hiện đại với thanh điều hướng cánh trái (Sidebar Navigation) gồm 8 phân hệ chính:

```
┌─────────────────┐ ┌─────────────────────────────────────────────────────────┐
│  ENGLISH PRO    │ │                    STAGE NỘI DUNG                       │
├─────────────────┤ ├─────────────────────────────────────────────────────────┤
│ 🗺️ Bản đồ       │ │ [🎧 Nghe]   [🗣️ Nói]   [📖 Đọc]   [✍️ Viết]                 │
│ 📝 Ôn từ vựng   │ │                                                         │
│ 📄 Đề thi 4 KN  │ │ ┌─────────────────────────────────────────────────────┐ │
│ 🏆 Luyện thi IOE│ │ │ Thẻ Unit 1: My New School                           │ │
│ ➕ Tự tạo đề    │ │ │ - Từ vựng (Click phát âm)                           │ │
│ 📊 Xếp hạng     │ │ │ - Mẫu câu đàm thoại                                 │ │
│ 🛒 Cửa hàng     │ │ │ - Ngữ pháp & Video SGK                              │ │
│ 🥷 Hồ sơ        │ │ │ [👑 Điểm cao nhất: 90%]   [🚀 Luyện tập ngay]        │ │
│ ⬅️ Đổi môn      │ │ └─────────────────────────────────────────────────────┘ │
└─────────────────┘ └─────────────────────────────────────────────────────────┘
```

---

### 4.1. Bản đồ Hành trình Học tập 4 Kỹ năng (Island Map & Quick Study Lab)
- **4 Tab Kỹ năng 3D Duolingo-style**:
  - 🎧 **Nghe (Listening)**: Tông xanh dương (Ocean Blue)
  - 🗣️ **Nói (Speaking)**: Tông xanh ngọc (Emerald Green)
  - 📖 **Đọc (Reading)**: Tông cam hoàng hôn (Sunset Orange)
  - ✍️ **Viết (Writing)**: Tông tím hoàng gia (Royal Purple)
- **Hộp kiến thức trọng tâm (Quick Study Lab)** trên mỗi thẻ bài học:
  - Thẻ từ vựng bo tròn, click vào là phát âm ngay lập tức kèm phiên âm IPA và nghĩa tiếng Việt.
  - Khung đàm thoại giao tiếp (Speech bubble) trực quan.
  - Tóm tắt ngữ pháp và nút xem video bài giảng SGK.
- **Cơ chế Mở khóa Tuần tự**: Học sinh hoàn thành bài học trước với số điểm từ **80% trở lên** (nhận Vương miện vàng 👑) mới mở khóa bài học kế tiếp.
- **Thử thách bài học từ Cha Mẹ**: Hiển thị riêng biệt các chuyên đề do phụ huynh giao bài tập với viền tím nổi bật.

---

### 4.2. Bộ máy Luyện tập Tương tác Đa giác quan 4 Kỹ năng (Interactive Practice Engine)

Mỗi bài học khi bấm "Luyện tập ngay" sẽ kích hoạt chế độ **Focus Mode** tập trung cao độ, sinh ngẫu nhiên 10 - 15 câu hỏi thuộc kỹ năng đã chọn:

#### 🎧 Kỹ năng Nghe (Listening) - 5 Dạng bài:
1. **Nghe chọn tranh (Listen and Choose Picture)**: Hệ thống phát âm từ vựng, hiển thị 4 ảnh minh họa vector Icons8 (hoặc 3D emoji). Học sinh nghe và bấm chọn hình đúng.
2. **Nghe điền từ / Chính tả (Listen and Type / Dictation)**: Hệ thống đọc từ hoặc câu, học sinh gõ lại chính tả vào ô nhập liệu trung tâm.
3. **Nghe hiểu phản hồi đàm thoại (Listen & Choose Response)**: Hệ thống đọc câu hỏi đàm thoại, học sinh chọn câu trả lời tương ứng phù hợp nhất.
4. **Nghe câu và chép chính tả câu (Sentence Dictation)**: Luyện nghe cả câu hoàn chỉnh.
5. **Nghe hiểu đoạn văn / hội thoại (Listening Passage)**: Hệ thống đọc toàn bộ đoạn văn học đường hoặc hội thoại dài, học sinh nghe và chọn câu trả lời đúng cho câu hỏi đọc hiểu.

#### 🗣️ Kỹ năng Nói (Speaking) - Chấm điểm AI Tương tác:
1. **Phát âm từ vựng đơn (Word Pronunciation)**: Đọc to từng từ vựng kèm hiển thị phiên âm IPA.
2. **Nói câu ví dụ (Sentence Speaking)**: Đọc to toàn bộ câu văn chứa từ vựng trong bài.
3. **Nói mẫu câu giao tiếp (Dialogue Speaking)**: Luyện đọc trôi chảy câu đàm thoại.
4. **Đàm thoại phản xạ AI (Role-play Dialogue)**: AI đưa ra câu hỏi đàm thoại bằng giọng nói, học sinh bấm mic nói câu phản hồi.
- **Công nghệ nhận diện**: Tích hợp `Web Speech Recognition API`, hiển thị Visualizer sóng âm (Wave Canvas) và đồng hồ ghi âm. Hệ thống chấm độ chính xác (Accuracy %) theo thuật toán Levenshtein Distance cải tiến, tô màu **Xanh lá** cho từ phát âm chuẩn, **Đỏ** cho từ phát âm sai. Ngưỡng đạt yêu cầu: $\ge 60\%$.

#### 📖 Kỹ năng Đọc (Reading) - Tương tác cao:
1. **Trắc nghiệm nghĩa từ vựng (Vocabulary Meaning)**: Hỏi nghĩa tiếng Việt hoặc từ đồng nghĩa/trái nghĩa.
2. **Đọc điền từ vào câu khuyết (Sentence Completion / Cloze)**: Cho câu bị khuyết từ, học sinh chọn từ thích hợp điền vào chỗ trống.
3. **Đọc hiểu đoạn văn trả lời câu hỏi (Passage Comprehension)**:
   - Đoạn văn trình bày dạng khung giấy cổ điển.
   - **Tính năng đọc đồng bộ (Read-Along)**: Bấm "Nghe đọc", giọng phát âm đến từ nào, từ đó được tô sáng (highlight) màu vàng rực rỡ theo thời gian thực.
   - Bảng từ vựng bổ trợ (Vocabulary Support) ngay bên dưới đoạn văn để học sinh tra cứu phát âm và nghĩa tức thì.

#### ✍️ Kỹ năng Viết (Writing) - Rèn luyện Chính tả & Ngữ pháp:
1. **Sắp xếp chữ cái (Spelling Scramble)**: Các chữ cái trong từ bị xáo trộn hiển thị dạng thẻ chữ cái 3D nổi bật. Học sinh click/kéo các chữ cái theo đúng thứ tự. Thuật toán Fisher-Yates kết hợp Hoán vị tất định triệt tiêu 100% lỗi lặp từ gốc.
2. **Sắp xếp từ thành câu hoàn chỉnh (Word Unscramble)**: Các khối từ vựng (Word Blocks) bị xáo trộn, học sinh click vào từng khối để xếp thành câu hoàn chỉnh đúng trật tự ngữ pháp.
3. **Viết lại câu & Hoàn thành đối thoại (Sentence Rewriting & Dialogue Completion)**:
   - Học sinh gõ câu hoàn chỉnh vào ô nhập liệu.
   - **Trợ lý Sửa lỗi Ngữ pháp Thông minh (Smart Grammar Assistant)**: Nếu học sinh làm sai, thuật toán chẩn đoán tự động phân tích chi tiết nguyên nhân:
     - *Thiếu đuôi s/es ở ngôi thứ ba số ít.*
     - *Chưa chia động từ về thì Quá khứ đơn (thiếu ed).*
     - *Sai chính tả một vài ký tự.*
     - *Dấu câu hoặc ký tự thừa.*
     - *Sai cấu trúc ngữ pháp mẫu câu.*

---

### 4.3. Đấu trường Từ vựng & AI Khuyến nghị Mục tiêu (Vocabulary Arena & Focus Target Practice)
Tab **Ôn từ vựng (`eng-tab-practice`)** cung cấp công cụ tự học và chẩn đoán năng lực vượt trội:
1. **AI Khuyến nghị Mục tiêu (Focus Target Practice)**:
   - Hệ thống quét toàn bộ lịch sử các phiên làm bài (`state.examSessions`).
   - Tự động phát hiện kỹ năng yếu nhất của học sinh (độ chính xác $< 85\%$).
   - Đưa ra cảnh báo trực quan và gợi ý chính xác **2 bài học học sinh cần bổ túc gấp**, kèm nút "Luyện tập ngay" chuyển thẳng tới bài đó.
2. **Bảng đánh giá 6 Kỹ năng Anh ngữ**:
   - Hiển thị điểm số và thanh tiến trình phần trăm của: **Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp**.
   - Phân loại trạng thái tức thì: *Xuất sắc 👑 ($\ge 90\%$)*, *Khá tốt 🌟 ($\ge 80\%$)*, hoặc *Cần cải thiện ⚡ ($< 80\%$)*.
3. **Đấu trường Từ vựng (Vocabulary Arena)**:
   - Cho phép chọn bất kỳ Unit nào trong toàn bộ 22 Units.
   - Hiển thị thẻ từ vựng tương tác 3D: Chạm vào để phát âm, xem phiên âm IPA, nghĩa tiếng Việt và câu ví dụ ngữ cảnh.

---

### 4.4. Trung tâm Khảo thí & Tạo Đề thi Chuẩn GDPT 2018 (Exam Center & PDF Export)
Tab **Đề thi 4 Kỹ năng (`eng-tab-exams`)** là hệ thống khảo thí tự động chuẩn mực:
- **Ma trận Đề thi 4 Phần Chuẩn Quốc tế**:
  1. **Part 1. Listening (Nghe hiểu)**: Gồm bài nghe chọn từ trong ngữ cảnh và bài nghe điền một từ vào chỗ trống (Audio Script chuẩn).
  2. **Part 2. Language Focus (Ngữ âm & Ngữ pháp)**: Câu hỏi phát âm khác biệt, trọng âm khác biệt, chia thì và động từ khuyết thiếu.
  3. **Part 3. Reading (Đọc hiểu)**: Đọc đoạn văn trả lời câu hỏi và đọc điền từ vào bài đọc (Cloze text).
  4. **Part 4. Writing (Viết)**: Viết lại câu giữ nguyên nghĩa (*Sentence Rewriting*) và sắp xếp từ thành câu hoàn chỉnh (*Sentence Unscramble*).
- **Bộ lọc cấu hình linh hoạt**:
  - Theo Unit (Unit 1 - 12), theo Chủ đề tổng hợp, theo Đề thi Giữa kỳ/Học kỳ.
  - Tùy chọn 10 dạng thì và ngữ pháp Lớp 6 cụ thể đưa vào đề.
  - 5 cấp độ năng lực: *Cơ bản*, *Nâng cao*, *Khó / Chuyên sâu*, *AI Cá nhân hóa*, *Trường Chuyên Tỉnh/TP*.
- **2 Chế độ Làm bài Độc đáo**:
  1. **Làm bài trực tuyến**: Hệ thống tính giờ, chấm điểm tự động và lưu vào lịch sử khảo thí.
  2. **Xuất & In file PDF A4 Chuẩn Khảo thí**:
     - Định dạng trang in A4 chuẩn giáo dục (có logo trường, thông tin học sinh, bảng điểm, lời phê).
     - **Tích hợp Mã QR Audio Code**: Học sinh dùng điện thoại/máy tính bảng quét mã QR trên đề giấy để nghe trực tiếp file Audio bài thi nghe.
     - Trang đáp án và hướng dẫn giải chi tiết đính kèm ở cuối.

---

### 4.5. Đấu trường Olympic Tiếng Anh Quốc gia (IOE Olympic Arena)
Tab **Luyện thi IOE (`eng-tab-ioe`)** mô phỏng chính xác kỳ thi Olympic Tiếng Anh trên Internet (IOE):
- Gồm **22 Vòng tự luyện** tương ứng với 22 Units của Lớp 6.
- Điểm tối đa mỗi vòng: **200 điểm** (thời gian làm bài 20 phút).
- **5 Trò chơi Trí tuệ Đặc trưng của IOE**:
  1. **Leave Me Alone**: Từ vựng bị chèn một chữ cái thừa ngẫu nhiên, học sinh click vào chữ cái thừa để loại bỏ.
  2. **Fill in the Blank**: Từ vựng bị khuyết một chữ cái quan trọng, học sinh điền chữ cái còn thiếu.
  3. **Cool Pair Matching (Cặp đôi hoàn hảo)**: Trò chơi ghép nối giữa các thẻ từ tiếng Anh và thẻ nghĩa tiếng Việt tương ứng.
  4. **Smart Monkey (Khỉ thông thái)**: Trắc nghiệm phân biệt ngữ âm và trọng âm.
  5. **Defeat the Dragon (Đánh bại Rồng lửa)**: Trắc nghiệm ngữ pháp và cấu trúc câu bấm giờ tính điểm.

---

### 4.6. Quản lý Chuyên đề Từ vựng Cá nhân hóa (Custom Vocabulary Topics)
Tab **Tự tạo chủ đề (`eng-tab-custom-vocab`)**:
- Cho phép học sinh và phụ huynh nạp thêm danh sách từ mới ngoài sách giáo khoa (từ vựng học thêm, từ vựng lớp nâng cao).
- Tích hợp **AI Tự động Hoàn thiện**: Chỉ cần nhập từ tiếng Anh, hệ thống tự động sinh phiên âm IPA, dịch nghĩa chuẩn xác và đặt câu ví dụ minh họa.
- Tự động tích hợp chuyên đề mới này vào Bản đồ học tập và Bộ sinh câu hỏi luyện tập 4 kỹ năng.

---

### 4.7. Hồ sơ Chiến binh, Biểu đồ Radar & Gamification Thẻ 3D
Tab **Hồ sơ (`eng-tab-profile`)** tổng hợp bức tranh học tập toàn cảnh:
- **Chỉ số Sức mạnh**: Chuỗi ngày học liên tục (Streak), Điểm kinh nghiệm tích lũy (XP), Số chủ đề đã đạt Vương miện hoàn thành cả 4 kỹ năng.
- **Biểu đồ Radar Năng lực 6 Trục (Skills Radar Chart)**:
  - Vẽ trực quan trên Canvas HTML5 đại diện cho 6 năng lực: Nghe, Nói, Đọc, Viết, Từ vựng, Ngữ pháp.
  - Vùng đa giác biểu diễn trực quan độ cân bằng ngôn ngữ, giúp nhận ra ngay con có đang bị học lệch hay không.
- **Bộ sưu tập Thẻ Năng Lực 3D (3D Skill Cards)**:
  - Hệ thống thẻ kỹ năng: *Listening Master*, *Speaking Pro*, *Reading Wizard*, *Writing Champion*, *Listening Expert 6*, *Speaking Expert 6*, *Grammar Expert*, *Class 6 Master*...
  - **Thẻ Cực Phẩm (Gold Cards)**: Mạ vàng lấp lánh khi đạt thành tích xuất sắc.
  - **Cơ chế Quy đổi Thẻ Năng lực**: Học sinh có thể dùng Thẻ Cực Phẩm quy đổi thành thời gian giải trí/chơi game có kiểm soát trên máy tính Kiosk.

---

### 4.8. Cổng Quản trị Phụ huynh cho Môn Tiếng Anh (Parent Dashboard Integration)
Trên giao diện Phụ huynh (`parent.html`):
- **Trình tạo Đề thi Khảo thí A4 Chuyên nghiệp**: Phụ huynh tự chọn khối lớp (Lớp 6), chọn Unit hoặc chọn các chuyên đề ngữ pháp GDPT 2018 để xuất đề thi in giấy cho con kèm mã QR Audio.
- **Quản lý Từ vựng Cục bộ & Ôn tập Spaced Repetition**: Phụ huynh giao bài tập từ vựng mới cho con, hệ thống tự động lặp lại ngắt quãng trong các bài học tiếp theo.
- **Theo dõi Tiến độ & Bảng xếp hạng**: Giám sát điểm số 4 kỹ năng, lịch sử làm bài và lịch sử quy đổi thẻ của con.

---

## 5. Cơ chế Nhận diện Giọng nói (Speech AI) & Phát âm Offline-First

Hệ thống âm thanh và giọng nói được thiết kế theo tiêu chuẩn **Offline-First & Zero-Config**:
1. **Phát âm Từ vựng & Mẫu câu (`playEnglishVoice`)**:
   - Ưu tiên nạp file âm thanh chuẩn MP3 chất lượng cao tại thư mục `sounds/english/`.
   - **Tự động Chuyển tiếp Thông minh (Graceful Fallback)**: Nếu file âm thanh cục bộ chưa có, hệ thống lập tức tự động kích hoạt **Web Speech Synthesis API** (`SpeechService.speakEnglish`) để phát âm chuẩn giọng người bản ngữ Anh - Mỹ (*en-US*) mà không bị gián đoạn bài học.
2. **Đọc đồng bộ văn bản (Read-Along Engine)**:
   - Sử dụng cơ chế đo lường tốc độ phát âm để tô màu từng từ khóa trên màn hình khi đoạn văn đang được đọc, giúp trẻ liên kết chặt chẽ giữa chữ viết và âm thanh.
3. **Nhận diện Giọng đọc Học sinh (Speech Recognition Service)**:
   - Xử lý trực tiếp qua trình duyệt (hỗ trợ tối ưu trên Google Chrome và Microsoft Edge).
   - Tích hợp bộ lọc chuẩn hóa chuỗi và thuật toán đo lường độ tương đồng ngữ âm (Similarity Matcher), đảm bảo đánh giá công bằng, không bị ảnh hưởng bởi tạp âm nhỏ ở môi trường xung quanh.

---

## 6. Đánh giá Tổng kết & Định hướng Phát triển Tiếp theo

### 6.1. Điểm mạnh Nổi bật của Phân hệ Tiếng Anh Lớp 6
1. **Bám sát Tuyệt đối Chương trình Giáo dục**: Phủ kín 100% các chủ đề của SGK Tiếng Anh 6 Global Success (Tập 1 và Tập 2) cùng 10 chủ đề nâng cao Lớp 7.
2. **Cấu trúc 4 Kỹ năng Hoàn chỉnh**: Không dừng lại ở lý thuyết suông mà rèn luyện phản xạ toàn diện Nghe - Nói - Đọc - Viết.
3. **Hệ thống Bài giảng Đồ sộ**: 93 video bài giảng SGK tích hợp và hơn 260 từ vựng kèm hình ảnh, ngữ cảnh.
4. **Trí tuệ Nhân tạo Hữu ích**: Trợ lý sửa lỗi ngữ pháp (*Smart Grammar Assistant*) và AI nhận diện giọng nói (*Speech Recognition*) hỗ trợ học sinh tự học tại nhà như có gia sư đồng hành.
5. **Tính Cô lập & An toàn Dữ liệu Tuyệt đối**: Hoạt động hoàn toàn độc lập, bảo toàn 100% dữ liệu môn Toán của hai học sinh Trần Bình Minh và Trần Đức Phúc.

### 6.2. Định hướng Nâng cấp Tối ưu Hóa Tiếp theo
1. **Bổ sung Trọn bộ Kho Âm thanh MP3 Cục bộ**: Tiến hành tải và tích lũy sẵn các tệp âm thanh phát âm MP3 chuẩn cho toàn bộ từ vựng Lớp 6 vào thư mục `sounds/english/` để tối ưu hóa trải nghiệm khi máy tính hoàn toàn ngắt kết nối mạng.
2. **Mở rộng Ngân hàng Đề thi Đọc hiểu KET/PET**: Bổ sung thêm các bài đọc hiểu định dạng Cambridge KET/PET để chuẩn bị hành trang thi chứng chỉ quốc tế cho học sinh Lớp 6.
3. **Tối ưu Hơn nữa Giao diện Mobile/Tablet**: Tiếp tục tinh chỉnh trải nghiệm vuốt chạm cho các bài kéo thả chữ cái và ghép cặp từ trên màn hình cảm ứng của thiết bị di động.

---
*Báo cáo được hoàn thành tự động bởi AI Coding Assistant — Dự án Hệ thống Học tập Thông minh.*
