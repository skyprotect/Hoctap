# REFACTOR PROTOCOL (Giao Thức Tái Cấu Trúc Mã Nguồn Chuẩn)
HocTap Autonomous Engineering System — v14.01

## NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

```text
DISCOVER 
→ CHARACTERIZE 
→ PROPOSE 
→ DECISION GATE 
→ IMPLEMENT 
→ TARGETED VERIFY 
→ FULL REGRESSION 
→ DIFF AUDIT 
→ CHECKPOINT 
→ NEXT CANDIDATE
```

1. **Tuyệt đối không dùng mô hình**: `AUDIT EVERYTHING → BIG REFACTOR → LARGE DIFF`.
2. **LOC không phải KPI kiến trúc**: Mô-đun lớn (nhiều dòng) nhưng gắn kết cao (cohesive) phải giữ nguyên. Mô-đun nhỏ nhưng pha tạp trách nhiệm (mixed-responsibility) vẫn cần bóc tách.
3. **Bảo toàn hành vi tuyệt đối**: Mọi quirk (hành vi đặc thù/lập dị đã biết) của hệ thống phải được bảo toàn, trừ khi có phê duyệt sửa lỗi tách biệt.
4. **Không tin tưởng tóm tắt chủ quan**: Mọi kết luận phải dựa trên output kiểm thử và git diff thực tế.

---

## CÁC PHA TRONG CHU TRÌNH TÁI CẤU TRÚC (STANDARD CYCLE)

### Phase A — DISCOVERY (Khám phá điểm nghẽn)
- Chỉ nhắm vào **01 điểm nóng cụ thể** (concrete hotspot) hoặc một seam rõ ràng tại một thời điểm.
- Truy vết toàn bộ callers, consumers và luồng dữ liệu (data flow) thực tế.
- Khảo sát trực tiếp mã nguồn bằng công cụ đọc/grep, không suy diễn từ tên hàm.
- Nghiêm cấm khảo sát tràn lan toàn bộ codebase gây loãng ngữ cảnh.
- Đưa ra bằng chứng code cụ thể (vị trí file, dòng, đoạn code) trước khi đề xuất bóc tách.

### Phase B — CHARACTERIZATION (Đặc tả và đóng băng hành vi)
- **Bắt buộc**: Phải có bộ test đặc tả trước khi bóc tách nếu hành vi hoặc hợp đồng (contract) chưa được khóa chặt 100%.
- Kiểm kê hiện trạng:
  - Test suites hiện có đã kiểm tra những gì?
  - Hành vi nào chưa có test bao phủ?
  - Các ca biên (edge cases), ca phủ định (negative cases)?
  - Các quirks kế thừa (legacy quirks: regex Unicode, dung sai 40%, phạt điểm...)?
  - Các side effects (DOM, audio, state mutation, network)?
- Viết test suite characterization độc lập khóa chặt hành vi hiện tại.
- **Nghiêm cấm "tiện tay sửa lỗi"** (no stealth bug-fixing).

### Phase C — CANDIDATE EVALUATION (Đánh giá đường biên tách rời)
Đánh giá ứng viên theo 10 tiêu chí kiến trúc:
1. **Tính gắn kết (Cohesion)**: Module mới chỉ làm 1 việc duy nhất?
2. **Độ ghép nối (Coupling)**: Có giảm liên kết giữa các module cũ?
3. **Rõ ràng trách nhiệm (Responsibility clarity)**: Tên module phản ánh đúng ngữ nghĩa?
4. **Cô lập thay đổi (Change isolation)**: Sửa logic này có làm vỡ logic khác?
5. **Khả năng kiểm thử (Testability)**: Có test độc lập không cần mock phức tạp?
6. **Số lượng phụ thuộc (Dependency count)**: Có hướng tới 0 dependency?
7. **Tác dụng phụ (Side effects)**: Có mutate global state, window, DOM?
8. **Rủi ro hồi quy (Regression risk)**: Ảnh hưởng bao nhiêu downstream consumers?
9. **Độ đơn giản khi Rollback (Rollback simplicity)**: Rollback bằng 1 commit sạch?
10. **Giảm trùng lặp (Duplication reduction)**: Có xóa được code trùng lặp thực tế?

Mọi kết luận phải được gán nhãn nghiêm ngặt:
- `[OBSERVED]`: Nhìn thấy trực tiếp trong mã nguồn.
- `[VERIFIED]`: Đã chứng minh bằng test output hoặc lệnh chạy thực tế.
- `[INFERRED]`: Suy luận kiến trúc có căn cứ.
- `[PROPOSED]`: Đề xuất thiết kế cho tương lai.

### Phase D — DECISION GATE (Cổng quyết định bắt buộc)
Chỉ được chọn duy nhất **01 quyết định**:
- `IMPLEMENT NOW`: Khi seam đã được đặc tả hoàn chỉnh, rủi ro thấp, thuộc nhóm Auto-Eligible.
- `CHARACTERIZE FIRST`: Khi seam có tiềm năng nhưng chưa đủ test khóa hành vi.
- `KEEP INTACT`: Khi seam gắn kết cao hoặc thuộc vùng cấm bảo vệ (Protected Danger Zone).
- `NEED MORE EVIDENCE`: Khi chưa rõ ràng luồng dữ liệu hoặc phụ thuộc ẩn.

*Tuyệt đối không chọn IMPLEMENT chỉ vì file quá dài (large LOC).*

### Phase E — MICRO-IMPLEMENTATION (Triển khai vi mô)
- Giới hạn tối đa: **1 – 4 thay đổi logic liên quan trực tiếp**.
- Không dọn dẹp code ngoài lề (no unrelated cleanup).
- Không tạo các tầng trừu tượng đầu cơ (no speculative abstractions).
- Không tự ý sinh ra các lớp `Manager/Service/Repository` chung chung trừ khi có bằng chứng kiến trúc rõ ràng.
- Giữ lớp tương thích ngược (compatibility wrappers) mỏng và nhẹ.

### Phase F — VERIFICATION (Xác minh đa tầng bắt buộc)
Chỉ được coi là thành công khi vượt qua toàn bộ:
1. **Targeted unit tests**: 100% tests của module mới pass.
2. **Characterization tests**: 100% test đặc tả pass.
3. **Full regression suite**: Toàn bộ các suites hiện có của dự án pass (ví dụ 47/47 suites).
4. **TypeScript checking**: Pass không lỗi type (`npm run build` hoặc typecheck).
5. **Clean Bundle Sync**: `node sync_clean.js` chạy thành công không có lỗi.
6. **Actual Git Diff Inspection**: Kiểm tra từng dòng diff bằng `git diff`, đảm bảo không có file lạ hay thay đổi ngoài ý muốn.

*Nghiêm cấm tuyên bố "zero risk", "fully safe", "100% coverage" nếu không có log kiểm thử chứng minh trực tiếp.*

### Phase G — CHECKPOINT (Ghi nhận điểm chốt an toàn)
Sau khi xác minh thành công:
1. Cập nhật `CURRENT_CHECKPOINT.md`.
2. Cập nhật `ARCHITECTURE_STATE.md`.
3. Cập nhật `REFACTOR_BACKLOG.md`.
4. Ghi nhận danh sách file thay đổi, số lượng test mới, quirks được bảo lưu.
5. Chuyển sang ứng viên tiếp theo trong backlog.
