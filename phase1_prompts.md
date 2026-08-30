# 📋 BỘ PROMPT — GIAI ĐOẠN 2 (REVISED): RELEASE PIPELINE & CHẤT LƯỢNG
## Mục tiêu: Ai tải installer về → dùng ngay, không cần cấu hình
## Thư mục: `f:\KHQS\AntiGravity\HocTap` | Tiền đề: Giai đoạn 1 hoàn thành (v13.33)

---

## ═══════════════════════════════════════════════════════════
## TASK 2.1 — HOÀN THIỆN RELEASE PIPELINE (ƯU TIÊN CAO NHẤT)
## ═══════════════════════════════════════════════════════════

Bạn là **DevOps & Release Engineer**. Nhiệm vụ: đảm bảo quy trình `npm run release` hoạt động hoàn hảo — từ lúc chạy lệnh đến lúc file `.exe` xuất hiện trên GitHub Releases, bất kỳ ai tải về cài đặt xong là dùng được ngay.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.33 → 13.34
- **Release script:** `scripts/build/release.js`
- **Sync script:** `scripts/build/sync_clean.js`
- **Installer:** `installer.iss` (Inno Setup)
- **GitHub Repo:** `https://github.com/skyprotect/Hoctap`

### Kiểm tra & Yêu cầu

**Bước 1 — Audit sync_clean.js:**
Đọc `scripts/build/sync_clean.js` và xác nhận nó đang xóa sạch các file sau trước khi copy sang `HocTap_Clean`:
```
✅ database.db          ← Dữ liệu học sinh cũ — PHẢI XÓA
✅ .port.tmp            ← File port tạm — PHẢI XÓA
✅ *.old                ← Backup cũ — PHẢI XÓA
✅ logs/                ← Log file — PHẢI XÓA hoặc để trống
✅ firebase-service-account.json ← PHẢI XÓA (không phân phối)
✅ .env                 ← PHẢI XÓA (chỉ giữ .env.example)
✅ chrome_profile/      ← Chrome profile cá nhân — PHẢI XÓA
✅ backups/             ← Backup cá nhân — PHẢI XÓA
✅ exported_exams/      ← Đề thi đã xuất — PHẢI XÓA nội dung
```
Nếu thiếu bất kỳ mục nào → bổ sung vào `sync_clean.js`.

**Bước 2 — Audit installer.iss:**
Xác nhận `installer.iss` KHÔNG đóng gói các file nhạy cảm:
- KHÔNG có dòng `Source:` trỏ đến `database.db`
- KHÔNG có dòng `Source:` trỏ đến `firebase-service-account.json`
- KHÔNG có dòng `Source:` trỏ đến `.env` (chỉ `.env.example` được phép)
- Dòng `Source: "...HocTap_Clean\*"` phải là nguồn duy nhất

**Bước 3 — Hoàn thiện release.js:**
Đọc `scripts/build/release.js`. Bổ sung các bước còn thiếu theo thứ tự:
```javascript
// Quy trình chuẩn release.js:
// 1. Đọc version từ version.json
// 2. Pull git origin main (tránh conflict)
// 3. Chạy npm test → nếu FAIL thì dừng, không release
// 4. Chạy sync_clean.js → tạo bản sạch HocTap_Clean
// 5. Chạy Inno Setup compiler → tạo file .exe
// 6. Git add + commit + push (với message "Release v{version}")
// 7. Tạo git tag v{version} và push tag
// 8. Upload file .exe lên GitHub Releases qua GitHub API
// 9. In ra URL download để người dùng copy
```

**Bước 4 — Test thực tế:**
Chạy `npm run release` và xác nhận:
- File `.exe` được tạo thành công
- File `.exe` xuất hiện tại `https://github.com/skyprotect/Hoctap/releases`
- Cài file `.exe` trên máy khác (hoặc máy ảo) → app khởi động được không cần cấu hình

**Bước 5 — Thêm version check tự động:**
Khi `server.js` khởi động, tự động check GitHub Releases có bản mới không:
```javascript
// Nếu version trên GitHub > version hiện tại → log thông báo
// (Đã có UPDATE_CHECK_URL trong .env.example — kết nối lại nếu bị ngắt)
```

**Bước 6:** Nâng version 13.33 → 13.34, chạy `npm run release`.

### Tiêu chí Hoàn thành
- [ ] `HocTap_Clean/` không chứa `database.db`, `.env`, `firebase-service-account.json`
- [ ] `npm run release` chạy end-to-end không lỗi
- [ ] File `.exe` xuất hiện trên GitHub Releases
- [ ] Cài `.exe` trên máy sạch → app chạy ngay lập tức, không cần cấu hình
- [ ] Version nâng lên 13.34

---

## ═══════════════════════════════════════════════════════════
## TASK 2.2 — TYPESCRIPT MIGRATION (CHỈ SERVER/)
## ═══════════════════════════════════════════════════════════

Bạn là **TypeScript Migration Specialist**. Migrate `server/` directory sang TypeScript để code dễ bảo trì, IDE hỗ trợ autocomplete, và phát hiện lỗi sớm hơn.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.34 → 13.35
- **Phạm vi:** CHỈ `server/` — client-side JS (`js/app.js`, `student.html`) giữ nguyên
- **Tiền đề:** Task 1.1 đã tách `server.js` thành `server/routes/`, `server/controllers/`, `server/services/`

### Quy trình Thực hiện

**Bước 1 — Cài đặt:**
```bash
npm install --save-dev typescript ts-node @types/node @types/express @types/cors @types/jsonwebtoken @types/sqlite3
```

**Bước 2 — Tạo `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist-server",
    "rootDir": "./server",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["server/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Bước 3 — Tạo `server/types/index.ts` với các interfaces cốt lõi:**
```typescript
export interface Student {
    id: string;
    name: string;
    classLevel: '1' | '4' | '6';
    parentName?: string;
}

export interface StudentProgress {
    student: string;
    classLevel: string;
    xp: number;
    streak: number;
    lastActiveDate: string | null;
    scores: Record<string, number>;
    badges: string[];
    subjects: { math: SubjectData; english: SubjectData; };
    lastUpdated: string;
}

export interface SubjectData {
    scores: Record<string, number>;
    completedSubtopics: string[];
    subtopicScores: Record<string, number>;
    completedLessonTheory: string[];
    examSessions: ExamSession[];
}

export interface ExamSession {
    lessonId: string;
    lessonTitle: string;
    scorePercent: number;
    completedAt: string;
    questions: QuizQuestion[];
}

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctIndex: number;
    userSelectedIndex?: number;
    isCorrect?: boolean;
}
```

**Bước 4 — Migrate từng file:** `db/` → `services/` → `middleware/` → `controllers/` → `routes/`

Với mỗi file: đổi `.js` → `.ts`, thêm type annotations cơ bản, chạy `npx tsc --noEmit` kiểm tra.

**Bước 5 — Cập nhật server.js để load TS:**
```javascript
require('ts-node').register({ transpileOnly: true });
```

**Bước 6:** `npx tsc --noEmit` không có lỗi. `npm test` PASS. Nâng version 13.34 → 13.35, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] Tất cả files trong `server/` là `.ts`
- [ ] `npx tsc --noEmit` sạch lỗi
- [ ] `npm start` và `npm test` đều PASS
- [ ] Version nâng lên 13.35

---

## ═══════════════════════════════════════════════════════════
## TASK 2.3 — SINGLETON SQLITE CONNECTION POOL
## ═══════════════════════════════════════════════════════════

Bạn là **Database Engineer**. Nhiệm vụ: đảm bảo toàn hệ thống chỉ dùng đúng **1 kết nối SQLite duy nhất** — loại bỏ nguy cơ busy-lock và race condition.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.35 → 13.36
- **Vấn đề:** Có thể tồn tại 2 `new sqlite3.Database()` call song song sau quá trình refactor

### Quy trình Thực hiện

**Bước 1 — Audit:**
```bash
grep -rn "new sqlite3.Database" f:\KHQS\AntiGravity\HocTap --include="*.js" --include="*.ts" --exclude-dir=node_modules
```
Báo cáo đầy đủ kết quả. Mục tiêu: chỉ còn **đúng 1 kết quả** tại `server/db/database.ts`.

**Bước 2 — Nâng cấp thành Singleton:**
```typescript
// server/db/database.ts
class DatabasePool {
    private static instance: sqlite3.Database | null = null;

    static getInstance(): sqlite3.Database {
        if (!DatabasePool.instance) {
            DatabasePool.instance = new sqlite3.Database(DB_PATH);
            DatabasePool.instance.configure('busyTimeout', 10000);
        }
        return DatabasePool.instance;
    }

    static close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!DatabasePool.instance) return resolve();
            DatabasePool.instance.close(err => {
                DatabasePool.instance = null;
                err ? reject(err) : resolve();
            });
        });
    }
}

export const db = DatabasePool.getInstance();
```

**Bước 3 — Graceful Shutdown:**
```javascript
// Trong server.js entry point
process.on('SIGTERM', async () => {
    await DatabasePool.close();
    server.close(() => process.exit(0));
});
process.on('SIGINT', async () => {
    await DatabasePool.close();
    process.exit(0);
});
```

**Bước 4:** Grep lại → xác nhận 1 kết nối duy nhất. `npm test` PASS. Nâng version 13.35 → 13.36, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] Grep trả về đúng 1 `new sqlite3.Database` call
- [ ] Graceful shutdown đóng DB trước khi thoát
- [ ] `npm test` PASS
- [ ] Version nâng lên 13.36

---

## ═══════════════════════════════════════════════════════════
## TASK 2.4 — GITHUB ACTIONS: AUTO BUILD & UPLOAD RELEASE
## ═══════════════════════════════════════════════════════════

Bạn là **DevOps Engineer**. Nhiệm vụ: thiết lập GitHub Actions tự động build installer `.exe` và upload lên GitHub Releases mỗi khi push tag mới — không cần can thiệp thủ công.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.36 → 13.37
- **Repo:** `https://github.com/skyprotect/Hoctap`
- **Build tool:** Inno Setup (Windows only) → phải dùng `windows-latest` runner

### Workflow Files Cần Tạo

**File 1: `.github/workflows/ci.yml` — Chạy khi push lên main**
```yaml
name: CI — Quality Gate

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          JWT_SECRET: ci_test_secret_32chars_placeholder
          PORT: 3001
```

**File 2: `.github/workflows/release.yml` — Chạy khi push tag v***
```yaml
name: Build & Release Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Quality Gate
        run: npm test
        env:
          NODE_ENV: test
          JWT_SECRET: ci_test_secret_32chars_placeholder
          PORT: 3001

      - name: Sync Clean Bundle
        run: node scripts/build/sync_clean.js

      - name: Install Inno Setup
        run: choco install innosetup --yes

      - name: Build Installer
        run: iscc installer.iss

      - name: Get version from tag
        id: get_version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT
        shell: bash

      - name: Create GitHub Release & Upload
        uses: softprops/action-gh-release@v2
        with:
          name: "HocTap v${{ steps.get_version.outputs.VERSION }}"
          body_path: RELEASE_NOTES.md
          files: |
            ..\ToanHocKiosk_Setup_v${{ steps.get_version.outputs.VERSION }}.exe
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**File 3: `RELEASE_NOTES.md` — Template release notes tự động**
```markdown
## Hướng dẫn cài đặt

1. Tải file `ToanHocKiosk_Setup_vX.XX.exe` bên dưới
2. Chạy với quyền Administrator
3. Làm theo hướng dẫn cài đặt
4. Click shortcut **"Toán Học Kiosk"** trên Desktop để bắt đầu

## Yêu cầu hệ thống
- Windows 10/11 (64-bit)
- Google Chrome (phiên bản 80 trở lên)
- RAM: tối thiểu 4GB

## Lưu ý
- Dữ liệu học tập từ phiên bản cũ được giữ nguyên khi nâng cấp
- Mã PIN phụ huynh mặc định: **123456**
```

### Quy trình Thực hiện

**Bước 1:** Tạo thư mục `.github/workflows/`

**Bước 2:** Tạo 2 workflow files theo template trên

**Bước 3:** Tạo `RELEASE_NOTES.md`

**Bước 4 — Cập nhật `scripts/build/release.js`** để tự tạo tag sau khi build:
```javascript
// Cuối release.js, sau khi build thành công:
const { execSync } = require('child_process');
const version = require('../../version.json').version;

execSync('git add -A');
execSync(`git commit -m "Release v${version}" --allow-empty`);
execSync('git push origin main');
execSync(`git tag v${version}`);
execSync(`git push origin v${version}`);
// → GitHub Actions sẽ tự động nhận tag và build installer
console.log(`✅ Tag v${version} đã được push. GitHub Actions đang build installer...`);
console.log(`📦 Theo dõi tại: https://github.com/skyprotect/Hoctap/actions`);
```

**Bước 5:** Push lên GitHub, kiểm tra tab **Actions** — workflow CI phải xanh.

**Bước 6:** Chạy `npm run release` → kiểm tra tab **Releases** — file `.exe` phải xuất hiện tự động.

**Bước 7:** Nâng version 13.36 → 13.37, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] `.github/workflows/ci.yml` chạy xanh trên nhánh `main`
- [ ] `.github/workflows/release.yml` tự build và upload `.exe` khi có tag mới
- [ ] `npm run release` tự push tag → GitHub Actions tự build → file `.exe` xuất hiện trên Releases
- [ ] Ai vào `https://github.com/skyprotect/Hoctap/releases` đều thấy file `.exe` mới nhất
- [ ] Version nâng lên 13.37

---

## 📌 BẢNG THEO DÕI GIAI ĐOẠN 2 (REVISED)

| Task | Mô tả | Phiên bản | Mục tiêu chính |
|---|---|---|---|
| **2.1** | Hoàn thiện Release Pipeline | 13.33 → 13.34 | Installer sạch, dùng ngay |
| **2.2** | TypeScript Migration (server/) | 13.34 → 13.35 | Code quality |
| **2.3** | Singleton SQLite Pool | 13.35 → 13.36 | Ổn định DB |
| **2.4** | GitHub Actions CI/CD | 13.36 → 13.37 | Auto publish installer |

> **Sau Giai đoạn 2:** Chạy `npm run release` → file `.exe` tự động xuất hiện trên GitHub Releases → bất kỳ ai tải về cài đặt xong là dùng được ngay.
