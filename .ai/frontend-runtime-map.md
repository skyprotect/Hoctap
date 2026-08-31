# FRONTEND RUNTIME MAP & EXECUTION LIFECYCLE

> **DỰ ÁN:** HocTap - Hệ thống Học tập & Thi trắc nghiệm AI (Toán & Tiếng Anh)  
> **PHIÊN BẢN ĐÓNG BĂNG:** v13.56  
> **NGÀY LẬP:** 31/08/2026  
> **TRẠNG THÁI:** RUNTIME MAP (SƠ ĐỒ VÒNG ĐỜI & LUỒNG THỰC THI THỜI GIAN THỰC)

---

## 1. VÒNG ĐỜI KHỞI ĐỘNG ỨNG DỤNG (APPLICATION BOOTSTRAP SEQUENCE)

Quy trình khởi động của ứng dụng từ lúc trình duyệt mở `student.html` diễn ra theo 7 giai đoạn kế tiếp:

```mermaid
sequenceDiagram
    autonumber
    actor User as Học sinh / Phụ huynh
    participant Browser as Trình duyệt (student.html)
    participant Precheck as Inline Precheck & Error Boundary
    participant Libs as Vendor Libs (KaTeX, Swal, Chart)
    participant App as app.js (window.app)
    participant Server as Express Server (Local/Kiosk)
    participant SW as Service Worker (sw.js)

    User->>Browser: Mở student.html (hoặc PWA Kiosk)
    Browser->>Precheck: Kiểm tra ES6+, Optional Chaining & window.onerror
    Browser->>Libs: Tải SweetAlert2, KaTeX, Chart.js, Mermaid.js
    Browser->>SW: Đăng ký Service Worker (Network-First Precache)
    Browser->>App: DOMContentLoaded / window.onload trigger app.init()
    
    rect rgb(20, 30, 45)
        Note over App,Server: Giai đoạn nhận diện môi trường & kết nối máy chủ
        App->>Server: GET /api/is-kiosk-mode
        Server-->>App: { isKiosk: boolean }
        App->>Server: GET /api/auth/google-client-id
        Server-->>App: { clientId: string }
        App->>Server: GET /api/load-config?studentId=default
        Server-->>App: { config: object }
    end

    App->>Browser: Hiển thị Splash Screen (#splash-screen)
    App->>App: Phát âm thanh chào mừng startup.mp3 (nếu chưa tắt)
    App->>Browser: Chuyển sang màn hình Chọn học sinh (#student-select-screen)
```

---

## 2. MÁY TRẠNG THÁI ĐIỀU HƯỚNG GIAO DIỆN (NAVIGATION STATE MACHINE)

Toàn bộ quá trình chuyển màn hình được điều phối tập trung thông qua hàm `app.showScreen(screenId)` và ngăn xếp `app.state.navigationHistory`:

```mermaid
stateDiagram-v2
    [*] --> SplashScreen: Mở ứng dụng
    SplashScreen --> StudentSelectScreen: Tự động sau 1.5s / Bấm Bắt đầu
    
    StudentSelectScreen --> MainDashboardScreen: Chọn Bình Minh / Đức Phúc / Bảo Ngọc
    
    state MainDashboardScreen {
        [*] --> SubjectTabs
        SubjectTabs --> MathCurriculum: Chọn môn Toán
        SubjectTabs --> EnglishCurriculum: Chọn môn Tiếng Anh
    }
    
    MainDashboardScreen --> QuizPracticeScreen: Bắt đầu Luyện tập / Thi trắc nghiệm
    MainDashboardScreen --> FreePlayOverlay: Bấm Chơi Game (15 phút)
    MainDashboardScreen --> FloatingChat: Bấm Cố vấn AI
    MainDashboardScreen --> EvaluationModal: Bấm Báo cáo Phụ huynh
    
    QuizPracticeScreen --> QuizResultView: Nộp bài / Hết giờ
    QuizResultView --> MainDashboardScreen: Bấm Quay lại Dashboard
    FreePlayOverlay --> MainDashboardScreen: Bấm Thoát Game / Hết 15 phút
    
    MainDashboardScreen --> StudentSelectScreen: Bấm Đổi học sinh
```

---

## 3. LUỒNG SINH ĐỀ THI & CÂU HỎI TRẮC NGHIỆM (QUIZ & QUESTION GENERATION PIPELINE)

Hệ thống hỗ trợ 2 chế độ sinh câu hỏi: **Sinh ngầm đa luồng qua Web Worker** (cho đề lớn 20-50 câu) và **Sinh trực tiếp trên Main Thread** (cho bài luyện tập ngắn):

```mermaid
flowchart TD
    A[Yêu cầu tạo đề: Bài học X, Cấp độ L] --> B{Số lượng câu hỏi?}
    
    B -->|> 10 câu| C[Khởi tạo Web Worker: question-generator-worker.js]
    B -->|<= 10 câu| D[Sinh trực tiếp trên Main Thread qua questions-v3.js]
    
    C --> E[Gửi Template danh sách câu hỏi qua postMessage]
    E --> F[Worker thực thi: Giải ràng buộc constraints & Math Formulas]
    F --> G[Lọc trùng đáp án: Dynamic Distractor Engine & GCD/LCM]
    G --> H[Trả về danh sách câu hỏi qua onmessage]
    
    D --> I[Template Engine cục bộ giải biến ngẫu nhiên]
    I --> J[Kiểm tra trùng đáp án bằng điều kiện tam phân]
    
    H --> K[Render câu hỏi lên DOM #quiz-practice-screen]
    J --> K
    
    K --> L[Gọi renderMathInElement để KaTeX biên dịch công thức toán]
    L --> M[Học sinh chọn đáp án A, B, C, D]
    M --> N{Đáp án Đúng hay Sai?}
    
    N -->|ĐÚNG| O[Phát correct.mp3 + Cộng điểm + Thưởng năng lượng Game]
    N -->|SAI| P[Phát wrong.mp3 + Hiển thị lời giải chi tiết KaTeX]
    
    O --> Q[Chuyển câu tiếp theo hoặc Tổng kết bài thi]
    P --> Q
```

---

## 4. LUỒNG ĐỒNG BỘ DỮ LIỆU & LƯU TRỮ OFFLINE (DATA PERSISTENCE FLOW)

Kiến trúc **Local-First** đảm bảo ứng dụng luôn chạy 100% khi mất mạng Internet:

```mermaid
flowchart LR
    subgraph CLIENT["Client Trình duyệt"]
        RAM["State trong RAM (app.state)"]
        LOCAL["safeStorage (LocalStorage)"]
        SW_CACHE["Service Worker Cache (sw.js)"]
    end

    subgraph LOCAL_SERVER["Máy chủ Cục bộ (Kiosk Node.js)"]
        EXPRESS["Express API (/api/*)"]
        SQLITE["SQLite Database (database.db)"]
    end

    subgraph CLOUD["Điện toán Đám mây (Online)"]
        FIREBASE_AUTH["Firebase Auth"]
        FIRESTORE["Cloud Firestore REST"]
        RTDB["Realtime Database"]
    end

    RAM -->|Ghi đệm tức thời| LOCAL
    RAM -->|POST /api/save-progress| EXPRESS
    EXPRESS -->|Lưu vĩnh viễn| SQLITE

    EXPRESS -.->|Đồng bộ nền khi có mạng| FIRESTORE
    EXPRESS -.->|Đẩy trạng thái trực tiếp| RTDB
    
    SW_CACHE -->|Phục vụ mã nguồn Offline| CLIENT
```

---

## 5. VÒNG ĐỜI TRÒ CHƠI TOWER DEFENSE (GAME RUNTIME LIFECYCLE)

Game Tower Defense được tích hợp sẵn trong client để tạo động lực học tập cho học sinh:

```mermaid
stateDiagram-v2
    [*] --> GameInit: Mở Free Play Overlay
    GameInit --> AssetLoading: Tải ảnh quái vật, trụ canh, âm thanh
    AssetLoading --> HeroSelection: Chọn Tướng (Minh Kiếm Vương / Phúc Xạ Thủ)
    
    state GameLoop {
        [*] --> UpdateEntities: delta_time
        UpdateEntities --> SpawnMonsterWave: Theo thời gian từng đợt
        SpawnMonsterWave --> CollisionAndCombat: Trụ & Tướng bắn quái
        CollisionAndCombat --> RenderCanvas: Vẽ hiệu ứng nổ, đạn, máu
        RenderCanvas --> CheckEndWave: Quái bị diệt hết?
    }
    
    HeroSelection --> GameLoop: Bấm Bắt đầu Trận đấu
    GameLoop --> VictoryDefeatModal: Hết 15 phút / Nhà chính nổ
    VictoryDefeatModal --> [*]: Trả quyền điều khiển về App Học tập
```
