# Kế hoạch thực hiện: Tái cấu trúc phân môn Tiếng Anh theo 4 Kỹ năng & Tiêu chuẩn Quốc tế cho Trẻ em

Kế hoạch này mô tả chi tiết phương án kỹ thuật để tái cấu trúc phân môn Tiếng Anh: chuyển sang giao diện 4 kỹ năng Nghe, Nói, Đọc, Viết, bao phủ **100% toàn bộ các chủ đề** trong sách giáo khoa chính khóa của Lớp 1, Lớp 4, Lớp 6 và bổ sung **chương trình nâng cao vượt lớp** (Lớp 1 nâng cao kiến thức Lớp 2, Lớp 4 nâng cao kiến thức Lớp 5, Lớp 6 nâng cao kiến thức Lớp 7).

---

## 1. Thiết kế Giao diện & Trải nghiệm (UI/UX) Chuẩn Quốc tế

Phần giao diện Tiếng Anh mới được lấy cảm hứng từ các nền tảng học tiếng Anh hàng đầu cho trẻ em như **Duolingo, Monkey Stories** và cấu trúc bài thi **Cambridge Young Learners English (Starters, Movers, Flyers)**:

### A. Giao diện 4 kỹ năng (Nghe, Nói, Đọc, Viết) trong Tab chính:
- **Thanh tab ngang hiện đại**: Gồm 4 nút bấm lớn đại diện cho 4 kỹ năng: **Nghe 🎧 (Ocean Blue)**, **Nói 🗣️ (Emerald Green)**, **Đọc 📖 (Sunset Orange)**, **Viết ✍️ (Royal Purple)**. Nút bấm được thiết kế 3D (Duolingo style) nổi bật, có hiệu ứng nhấn lún chân thật và micro-animations.
- **Thẻ chủ đề trực quan (Topic Cards)**:
  - Phân loại rõ ràng thành **Chương trình chính khóa** và **Chương trình nâng cao**.
  - **Hộp kiến thức trọng tâm (Quick Study Lab)**:
    - **Từ vựng (Vocabulary)**: Hiển thị dưới dạng các thẻ từ vựng bo tròn, nhiều màu sắc pastel tươi sáng. Mỗi từ có icon loa nhỏ. Khi học sinh click vào từ, ứng dụng sẽ phát âm chuẩn từ đó ngay lập tức kèm theo nghĩa tiếng Việt hiển thị dạng tooltips hoặc flashcard lật 3D.
    - **Mẫu câu (Sentence Patterns)**: Trình bày dạng khung đàm thoại hoạt họa (Speech bubble) trực quan.
    - **Ngữ pháp & Thì (Grammar)**: Tóm tắt điểm ngữ pháp cốt lõi dạng biểu đồ hoặc bảng so sánh nhỏ gọn, dễ hiểu.

### B. Thiết kế các dạng bài tập chi tiết cho từng kỹ năng (Chuẩn Giáo dục Online):

#### 🎧 1. KỸ NĂNG NGHE (LISTENING) - Chia làm 3 dạng bài chuyên sâu:
*   **Dạng 1: Nghe chọn tranh (Listen and Choose the Picture):**
    *   Hệ thống đọc một từ vựng hoặc mô tả ngắn về một đồ vật/hành động.
    *   Hiển thị 2-4 bức ảnh lớn sinh động (hoặc Emoji 3D trực quan). Học sinh nghe và bấm vào bức tranh đại diện đúng nhất cho nội dung nghe được.
*   **Dạng 2: Nghe điền từ (Listen and Type / Dictation):**
    *   Hệ thống phát âm một từ vựng hoặc đọc một câu hoàn chỉnh.
    *   Học sinh nghe và gõ lại từ vựng hoặc câu đó vào ô nhập liệu lớn ở trung tâm.
*   **Dạng 3: Nghe hiểu trả lời câu hỏi (Listen and Answer the Question):**
    *   Hệ thống phát âm một đoạn đàm thoại hoặc một câu hỏi (ví dụ: *"Where are you from?"*).
    *   Hiển thị 4 phương án trả lời bằng chữ dưới dạng nút bấm trắc nghiệm, học sinh phải nghe hiểu nội dung câu hỏi/đối thoại để chọn phản hồi phù hợp nhất.

#### 🗣️ 2. KỸ NĂNG NÓI (SPEAKING) - Chấm điểm tương tác AI:
*   **Dạng 1: Phát âm từ vựng đơn (Word Pronunciation):**
    *   Trình bày thẻ từ vựng lớn kèm theo phiên âm quốc tế.
    *   Học sinh bấm mic và đọc to rõ ràng từ vựng đó.
*   **Dạng 2: Nói câu giao tiếp hoàn chỉnh (Sentence Speaking):**
    *   Trình bày câu mẫu đàm thoại hoặc trả lời một câu hỏi giao tiếp.
    *   Học sinh bấm giữ mic đọc cả câu. Kết quả nhận diện bằng Web Speech Recognition API sẽ tô màu **Xanh lá** cho từ phát âm đúng, **Đỏ** cho từ phát âm chưa chuẩn kèm phần trạng thái độ chính xác.
*   **Dạng 3: Đàm thoại phản xạ (Role-play Dialogue - NÂNG CAO):**
    *   Nhân vật AI đưa ra một câu hỏi giao tiếp bằng âm thanh.
    *   Học sinh bấm mic tự do nói câu trả lời. Hệ thống tự động phân tích ngữ cảnh để chấm điểm đạt/chưa đạt.

#### 📖 3. KỸ NĂNG ĐỌC (READING) - Tương tác cao:
*   **Dạng 1: Đọc hiểu đoạn văn trả lời câu hỏi (Passage Comprehension):**
    *   Hiển thị một đoạn văn ngắn trong khung giấy cổ điển kèm hình vẽ hoạt họa.
    *   *Tính năng đọc đồng bộ (Read-Along):* Khi bấm "Play audio", giọng đọc phát đến từ nào, từ đó sẽ được tô sáng (highlight) màu vàng rực trên màn hình.
    *   Học sinh đọc đoạn văn và trả lời các câu hỏi đọc hiểu lựa chọn A, B, C, D bên dưới.
*   **Dạng 2: Đọc hiểu điền từ vào đoạn văn (Cloze Test / Fill-in-the-blank):**
    *   Hiển thị một đoạn văn ngắn có các ô trống `[____]`.
    *   Học sinh click chọn các từ vựng cho sẵn từ khay chứa bên dưới để kéo/thả điền vào đúng vị trí của đoạn văn theo đúng ngữ cảnh và ngữ pháp.
*   **Dạng 3: Đọc câu hỏi và trả lời ngắn (Reading Q&A):**
    *   Đọc một câu hỏi hoặc tình huống ngắn, sau đó học sinh tự gõ câu trả lời ngắn bằng tiếng Anh vào ô trống.

#### ✍️ 4. KỸ NĂNG VIẾT (WRITING) - Rèn luyện tư duy ngữ pháp và chính tả:
*   **Dạng 1: Viết lại câu theo dữ liệu gợi ý (Sentence Rewriting):**
    *   Đưa ra một câu gốc và các từ gợi ý trong ngoặc đơn.
    *   Học sinh gõ lại câu hoàn chỉnh đúng cấu trúc ngữ pháp.
*   **Dạng 2: Sắp xếp từ thành câu hoàn chỉnh (Word Unscramble):**
    *   Hiển thị các khối từ vựng (Word Blocks) bị xáo trộn vị trí.
    *   Học sinh click vào các từ theo đúng thứ tự để tạo thành câu hoàn chỉnh.
*   **Dạng 3: Điền từ hoàn thành câu (Sentence Completion):**
    *   Cho sẵn một câu bị thiếu một từ hoặc thiếu động từ chưa chia (ví dụ: *She usually [study] studies English...*).
    *   *Trợ lý sửa lỗi ngữ pháp (Smart Grammar Assistant):* Nếu làm sai, hệ thống sẽ phân tích lỗi cụ thể (như chia sai thì, viết sai chính tả từ vựng, thiếu mạo từ...) và hướng dẫn học sinh sửa lại thay vì chỉ báo Đúng/Sai chung chung.

---

## 2. Bổ sung chuẩn Sư phạm Ngoại ngữ Quốc tế

Để hệ thống giáo dục ngoại ngữ đạt chuẩn quốc tế cao nhất dành cho học sinh Việt Nam, chúng tôi tích hợp 4 yếu tố sư phạm ngôn ngữ học cốt lõi sau:

### A. Chuẩn hóa Khung năng lực Ngôn ngữ Quốc tế (CEFR & Cambridge Syllabus):
- Định hướng trình bày và phân loại cấp bậc học viên rõ ràng tại tiêu đề giao diện chính:
  - **Lớp 1: Trình độ Pre-A1 Starters (Cambridge)** - Tập trung tuyệt đối vào nhận diện âm vị, từ vựng hình ảnh cơ bản.
  - **Lớp 4: Trình độ A1 Movers (Cambridge / CEFR)** - Giao tiếp cơ bản về bản thân, thói quen và sở thích cá nhân.
  - **Lớp 6: Trình độ A2 Flyers / KET (Cambridge / CEFR)** - Đàm thoại độc lập cơ bản, mô tả nơi chốn và các sự kiện trong quá khứ/tương lai.
- Các nhãn trình độ này giúp học sinh và phụ huynh định hướng rõ ràng mục tiêu đầu ra quốc tế của con mình.

### B. Hệ thống Lặp lại ngắt quãng (Spaced Repetition System - SRS):
- Tích hợp giải thuật nhắc nhở ôn tập thông minh (dựa trên đường cong quên lãng Ebbinghaus):
  - Hệ thống tự động ghi nhận các từ vựng/mẫu câu học sinh làm sai nhiều trong các bài kiểm tra.
  - Sau các khoảng thời gian ngắt quãng (1 ngày, 3 ngày, 7 ngày), hệ thống tự động gắn thẻ cảnh báo hoặc đưa các từ vựng này vào danh mục "Cần ôn tập gấp" ở tab **Ôn từ vựng**, thúc đẩy trẻ luyện tập lại để chuyển hóa từ vựng vào trí nhớ dài hạn.

### C. Từ điển ngữ cảnh đa giác quan (Contextual Multi-sensory Dictionary):
- Thẻ từ vựng (Flashcard) tương tác khi nhấn vào không chỉ hiện dịch nghĩa khô khan, mà bao gồm:
  - **Phát âm Anh-Mỹ chuẩn xác** bằng âm thanh.
  - **Phân loại từ loại** (Noun, Verb, Adjective...) giúp trẻ lớp 4 và lớp 6 xây dựng ngữ pháp.
  - **Đặt câu ví dụ ngữ cảnh cụ thể** (ví dụ với từ *fridge*: *"There is some milk in the fridge."*).

### D. Trò chơi hóa tăng cường động lực học tập (Gamified Achievements):
- Bổ sung hệ thống **Huy hiệu Thành tích (Badges)** hiển thị lấp lánh trong Hồ sơ (Profile) của học sinh để kích thích thi đua:
  - Huy hiệu *"Fluent Speaker"* 🗣️: Đạt 10 bài nói đạt từ 90% điểm trở lên.
  - Huy hiệu *"Golden Ear"* 🎧: Vượt qua 5 bài nghe liên tiếp đạt điểm tuyệt đối 100% không mất trái tim nào.
  - Huy hiệu *"Super Writer"* ✍️: Hoàn thành tất cả các bài viết của một khối lớp.
  - Huy hiệu *"Streak Master"* 🔥: Đạt chuỗi học liên tục 7 ngày.

---

## 3. Cơ chế Tính điểm & Đánh giá Năng lực học tập

Để đảm bảo chương trình mang tính sư phạm và khích lệ trẻ thi đua, cơ chế tính toán được thiết kế như sau:

### A. Quy trình Chấm điểm & Trái tim mạng sống (Gamification):
- **Cơ cấu bài luyện tập**: Mỗi bài thi kỹ năng gồm **5 câu hỏi** ngẫu nhiên được sinh ra. Trả lời đúng mỗi câu được tính **1 điểm**. Điểm tối đa của bài làm là **5/5**.
- **Quy đổi điểm số**: Quy đổi thành phần trăm `finalScorePct = (số câu đúng / 5) * 100` (tương đương các mức: 0%, 20%, 40%, 60%, 80%, 100%).
- **Ngưỡng hoàn thành & Nhận thưởng**: 
  - Nếu học sinh đạt điểm số **80% trở lên** (tương ứng đúng ít nhất 4/5 câu), chủ đề đó được ghi nhận là **Đã đạt (Passed)** và học sinh sẽ nhận được một **Vương miện vàng 👑** hiển thị lấp lánh trên giao diện.
  - Đồng thời, đạt vương miện sẽ mở khóa bài học tiếp theo của kỹ năng tương ứng (Mở khóa tuần tự).
- **Hệ thống tim mạng sống (Hearts System)**:
  - Học sinh bắt đầu bài học với tối đa **5 Trái tim ❤️**.
  - Mỗi khi trả lời **Sai** một câu hỏi, học sinh sẽ bị trừ đi **1 Trái tim**.
  - Nếu số Trái tim giảm về **0 ❤️** trước khi hoàn thành 5 câu hỏi, bài luyện tập lập tức kết thúc (Game Over). Học sinh phải dùng điểm XP tích lũy vào Cửa Hàng mua tim mới để được tiếp tục tham gia làm các bài học mới.

### B. Cơ chế tích lũy điểm kinh nghiệm (XP) & Bảng xếp hạng:
- **Tích lũy XP**: Mỗi lần học sinh hoàn thành một bài luyện tập (hoàn thành đủ 5 câu hỏi hoặc vượt qua bài thi), hệ thống sẽ thưởng ngay **100 XP** kinh nghiệm.
- **Bảng Xếp Hạng Anh Ngữ**: Điểm XP tích lũy được quản lý độc lập tại `this.state.englishXp` và dùng để so sánh thứ hạng của học sinh với các đối thủ cạnh tranh trên bảng xếp hạng (Trần Đức Phúc, Nguyễn Minh Anh, Lê Hoàng Nam, Phạm Khánh Vy...). Thứ hạng được sắp xếp theo thời gian thực (real-time sorting) mỗi khi XP thay đổi.
- **Cửa hàng phần thưởng**: Điểm XP dùng để đổi vật phẩm: 350 XP mua 1 tim; 1200 XP mua đầy 5 tim.

### C. Đánh giá năng lực toàn diện (Competency Assessment engine):
- **Chỉ số năng lực kỹ năng**: Năng lực của học sinh cho mỗi kỹ năng Nghe, Nói, Đọc, Viết được tính bằng **trung bình cộng điểm số cao nhất của tất cả các bài luyện tập đã làm thuộc kỹ năng đó**.
  $$\text{Chỉ số kỹ năng (\%)} = \frac{\sum \text{Điểm số cao nhất của các bài đã làm}}{\text{Tổng số bài học đã làm}} $$
- **Biểu đồ mạng nhện năng lực (Skills Radar Chart)**:
  - Hiển thị trực quan trong tab **Hồ sơ (Profile)** của Tiếng Anh.
  - Biểu đồ được vẽ trực tiếp bằng Canvas HTML5 với 4 trục tọa độ biểu thị 4 kỹ năng. Một vùng đa giác màu xanh pastel mờ phủ lên biểu đồ đại diện cho năng lực hiện tại của trẻ. Trẻ và phụ huynh dễ dàng nhìn ra con đang học lệch kỹ năng nào để cải thiện.

---

## 4. Kiến trúc Lưu trữ Dữ liệu Học sinh & Cam kết Không Chồng Chéo

Để đảm bảo tính bảo mật, sự độc lập và ngăn ngừa 100% rủi ro dữ liệu bị chồng chéo hoặc ghi đè, hệ thống lưu trữ được thiết kế phân cấp rạch ròi như sau:

### A. Tách biệt rạch ròi giữa các HỌC SINH (Student Isolation):
*   **Mỗi học sinh có dòng lưu trữ riêng:** Trong cơ sở dữ liệu SQLite [database.db](file:///f:/KHQS/AntiGravity/HocTap/database.db), mỗi học sinh được quản lý dưới một **`studentId` duy nhất** (ví dụ: `default` cho Trần Bình Minh, `sess_ducphuc` cho Trần Đức Phúc).
*   **Cơ chế lưu trữ độc lập:** Khi Trần Bình Minh học và làm bài, hệ thống chỉ truy cập, đọc và cập nhật dữ liệu của đúng dòng chứa `studentId = 'default'`. Tuyệt đối không chạm vào hay làm biến động dữ liệu của Trần Đức Phúc.
*   **Phân quyền đăng nhập:** Mỗi phiên làm bài đều bắt đầu bằng việc xác thực đúng ID học sinh, đảm bảo không có sự chồng chéo lịch sử làm bài giữa các con.

### B. Tách biệt rạch ròi giữa các MÔN HỌC (Subject Isolation):
Mặc dù dữ liệu học tập Toán và Tiếng Anh cùng được lưu trong một cấu trúc trạng thái (`state`) để tối ưu hóa hiệu suất SQLite, các biến và khóa dữ liệu được chia tách riêng biệt:
1.  **Dữ liệu Điểm số (`state.scores`):**
    *   Môn Toán lưu với các khóa dạng chuyên đề: `chuyen-de-1`, `chuyen-de-2` hoặc mã bài thi Toán.
    *   Môn Tiếng Anh lưu với các khóa bắt đầu bằng tiền tố `eng`: `eng1-listening-t1`, `eng4-speaking-t2`, `eng6-writing-t3`.
    *   *Do tên khóa hoàn toàn khác biệt, điểm số Tiếng Anh sẽ không bao giờ ghi đè lên điểm Toán và ngược lại.*
2.  **Dữ liệu Lịch sử làm bài thi:**
    *   Môn Toán lưu lịch sử chi tiết trong mảng `state.sessions` hoặc `state.history`.
    *   Môn Tiếng Anh lưu lịch sử chi tiết trong mảng độc lập `state.examSessions`.
3.  **Hệ thống XP, Tiền vàng, Mạng sống:**
    *   Môn Toán sử dụng: Vàng (`state.gold`), Streak Toán (`state.streak`).
    *   Môn Tiếng Anh sử dụng: Kinh nghiệm Anh ngữ (`state.englishXp`), Trái tim mạng sống (`state.englishHearts`), Streak Tiếng Anh (`state.englishStreak`).
4.  **Mã nguồn chương trình:**
    *   Học liệu Toán lưu tại [lessons.js](file:///f:/KHQS/AntiGravity/HocTap/js/lessons.js).
    *   Học liệu Tiếng Anh lưu tại [english_data.js](file:///f:/KHQS/AntiGravity/HocTap/js/english_data.js).
    *   *Logic giao diện Toán và Tiếng Anh hoàn toàn riêng biệt. Mọi thao tác trên màn hình Tiếng Anh không chạy bất kỳ mã nguồn nào của môn Toán.*

---

## 5. Lưu ý Triển khai & Bảo đảm An toàn Tuyệt đối

Để quá trình nâng cấp hệ thống diễn ra trơn tru, không gây gián đoạn và đảm bảo chất lượng kỹ thuật cao nhất, toàn bộ quá trình lập trình sẽ tuân thủ các nguyên tắc sau:

### A. Nguyên tắc Bảo toàn Môn Toán hiện tại (100% Safety Guarantee):
1.  **Sao lưu Database SQLite trước khi triển khai:** Trước khi thực hiện bất kỳ chỉnh sửa nào, tôi sẽ thực hiện sao lưu tệp `database.db` hiện tại thành tệp backup an toàn. Trong trường hợp xảy ra lỗi không mong muốn, chúng ta có thể phục hồi dữ liệu học tập Toán của học sinh Trần Bình Minh và Trần Đức Phúc ngay lập tức.
2.  **Không chỉnh sửa file dữ liệu Toán:** Các tệp như `js/lessons.js`, `js/questions-v3.js`, `js/questions-v4.js` và `js/game.js` sẽ được giữ nguyên trạng, không can thiệp để tránh làm biến động logic chấm điểm Toán.
3.  **Không thay đổi cấu trúc bảng (schema) SQLite:** Server-side SQLite schema được giữ nguyên 100%, không thực hiện lệnh `ALTER TABLE` hay thay đổi cột, tránh làm hỏng các câu lệnh SQL phục vụ cho môn Toán.
4.  **Kiểm định hồi quy (Regression Testing):** Sau khi hoàn thành phần Tiếng Anh, tôi sẽ đăng nhập và chạy thử 2 buổi học môn Toán để đảm bảo 100% tính năng Toán không bị ảnh hưởng.

### B. Nguyên tắc Thiết kế Giao diện Tiếng Anh Trực quan Quốc tế (UI/UX Best Practices):
1.  **Responsive Layout (Độ tương thích cao):** Thiết kế giao diện 4 tab và thẻ chủ đề tương thích tốt trên cả máy tính bảng (Tablet), laptop và máy tính để bàn (Desktop) của trẻ em.
2.  **Bảng màu Pastel dịu mắt:** Sử dụng các màu pastel dịu nhẹ (Pastel Green, Ocean Blue, Coral Red, Sunshine Yellow) với độ tương phản vừa phải để bảo vệ mắt của trẻ khi học lâu. Tránh các màu nguyên bản quá sặc sỡ.
3.  **Hiệu ứng chuyển động mượt mà (Smooth Transitions):** Sử dụng các hiệu ứng chuyển cảnh `fade-in`, `slide-up` nhẹ nhàng của CSS3 khi trẻ tương tác kéo thả hoặc chuyển tab, tạo cảm giác chuyên nghiệp, không gây giật lag khó chịu.
4.  **Font chữ bo tròn thân thiện:** Sử dụng font chữ hiện đại (như *Nunito* hoặc *Outfit* của Google Fonts) bo tròn nét chữ, mang lại cảm giác thân thiện với lứa tuổi tiểu học và THCS.

---

## 6. Quy trình Hậu kiểm, Đánh giá Chất lượng & Báo cáo Hoàn thành

Quá trình bàn giao sản phẩm sẽ trải qua quy trình kiểm soát chất lượng khách quan và đồng bộ chặt chẽ:

### A. Kiểm thử Hồi quy & Chức năng (Functional & Regression QA):
1.  **Hậu kiểm đa thiết bị/trình duyệt:** Sử dụng trình duyệt Chrome và Edge để giả lập màn hình máy tính bảng (768px), laptop (1366px), desktop (1920px). Xác minh giao diện không bị lệch nút bấm hay tràn khung.
2.  **Hậu kiểm 11 dạng bài tập:** Chạy thử thủ công tất cả 11 dạng bài luyện tập thuộc 4 kỹ năng (Nghe, Nói, Đọc, Viết) của cả 3 khối lớp, đảm bảo không có câu hỏi nào bị lỗi hiển thị hoặc sai đáp án.
3.  **Đánh giá triệt tiêu trùng đáp án:** Chạy thử tự động 50 lượt sinh câu hỏi ngẫu nhiên qua hàm `generateEnglishQuestions` tại client, xác minh các thuật toán kiểm tra chéo và dịch chuyển giá trị động bằng tam phân hoạt động tốt, triệt tiêu hoàn toàn lỗi trùng lặp đáp án đúng và đáp án nhiễu.
4.  **Hậu kiểm môn Toán:** Đăng nhập tài khoản của Trần Bình Minh và Trần Đức Phúc, kiểm tra lịch sử điểm số Toán xem có bị mất mát hoặc chồng lấn không. Chạy thử 1 buổi học Toán bình thường để đảm bảo an toàn tuyệt đối.

### B. Đồng bộ bản sạch (Clean Bundle Synchronization):
*   Sau khi hoàn tất toàn bộ chỉnh sửa tại dự án gốc (`HocTap`), tôi sẽ thực thi script đồng bộ tự động:
    ```bash
    node sync_clean.js
    ```
*   Script này sẽ tự động dọn dẹp các tệp dữ liệu cá nhân của học sinh trong thư mục `HocTap_Clean` (bao gồm `database.db`, `.port.tmp`, các bản sao lưu `.old`...) để tạo ra một bản đóng gói phân phối sạch 100% không có lịch sử làm bài trước khi bàn giao.

### C. Báo cáo kết quả (Walkthrough Report):
*   Khi kết thúc công việc, tôi sẽ tạo tệp báo cáo hoàn thành [walkthrough.md](file:///C:/Users/Binh Minh/.gemini/antigravity/brain/fda3d7cf-e0b4-46a2-83cb-1cc1f2b06cd5/walkthrough.md) hoàn toàn bằng **Tiếng Việt**.
*   Tệp này sẽ liệt kê rõ ràng: các tệp nguồn đã thay đổi, các tính năng mới đã hoàn thành, kết quả hậu kiểm thực tế và hướng dẫn chi tiết cách vận hành/phản xạ cho phụ huynh và học sinh.

---

## 7. Danh mục bài học chính khóa & Nâng cao

Chúng tôi sẽ cấu trúc 100% toàn bộ hệ thống bài học trong `js/english_data.js` như sau:

| Khối lớp | Số bài chính khóa | Số bài nâng cao (vượt cấp) |
|---|---|---|
| **Lớp 1** | **16 Units** (Unit 1: Playground, Unit 2: Classroom, Unit 3: Shopping...) | **4 Units nâng cao** (Lấy từ chương trình lớp 2: Gia đình, Môn thể thao, Các loại quả, Thức ăn nâng cao) |
| **Lớp 4** | **20 Units** (Unit 1: Friends, Unit 2: Daily Routines, Unit 3: My Week...) | **4 Units nâng cao** (Lấy từ chương trình lớp 5: Quá khứ đơn, Hỏi đường, Trải nghiệm hè, Ước mơ nghề nghiệp) |
| **Lớp 6** | **12 Units** (Unit 1: New School, Unit 2: House, Unit 3: Friends, Unit 4: Neighbourhood...) | **4 Units nâng cao** (Lấy từ chương trình lớp 7: Sở thích, Tương lai đơn nâng cao, Bảo vệ môi trường, Câu điều kiện loại 1) |

---

## 8. Kế hoạch kiểm định

### Xác minh thủ công
1. Khởi động ứng dụng, xác minh nhãn phiên bản hiển thị là `v6.3` ngày `11/07/2026 07:52` đồng bộ ở cả 2 vị trí.
2. Kiểm tra xem phân môn Tiếng Anh có hiển thị đúng 4 tab kỹ năng Nghe, Nói, Đọc, Viết hay không.
3. Kiểm tra xem danh sách chủ đề của Lớp 1, 4, 6 có đủ 100% số lượng Unit chính khóa và các Unit nâng cao hay không.
4. Nhấn vào các từ vựng xem tính năng phát âm tương tác có hoạt động chính xác hay không.
5. Thử nghiệm làm bài thi của cả 4 kỹ năng ở một Unit bất kỳ, kiểm tra các dạng bài:
   - Nghe: Trắc nghiệm âm thanh hoặc điền từ (Dictation).
   - Nói: Nhận diện giọng đọc mic và chấm điểm phần trạng thái độ chính xác.
   - Đọc: Câu hỏi đọc hiểu và dịch nghĩa.
   - Viết: Sắp xếp các từ xáo trộn thành câu hoàn chỉnh.
6. Hoàn thành bài làm, kiểm tra việc lưu điểm cao nhất (Hiển thị vương miện 👑), cộng XP và cập nhật thứ hạng trên Bảng xếp hạng.
7. Đăng nhập phân môn Toán và kiểm tra lịch sử học tập toán để chắc chắn không bị ảnh hưởng.

### Đồng bộ bản sạch
Chạy script `node sync_clean.js` để đồng bộ toàn bộ thay đổi sang thư mục chạy sạch `HocTap_Clean`.
