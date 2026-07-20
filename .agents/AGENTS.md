# Quy tắc thiết kế câu hỏi Template trắc nghiệm tránh trùng đáp án

Để đảm bảo đề thi trắc nghiệm được sinh ra bởi AI không bao giờ gặp lỗi trùng lặp đáp án (giữa đáp án đúng và các đáp án nhiễu, hoặc giữa các đáp án nhiễu với nhau) và hiển thị tối ưu về mặt sư phạm, tất cả các AI Agents thiết kế câu hỏi template cần tuân thủ các quy tắc sau:

## 1. Thiết kế đáp án nhiễu động (Dynamic Distractors)
- **Tuyệt đối không** sử dụng các đáp án nhiễu dạng số cố định (ví dụ: `w1 = 10, w2 = 20`) khi kết quả đúng `ans` thay đổi ngẫu nhiên.
- Các đáp án nhiễu phải được tính bằng công thức phụ thuộc vào các biến đầu vào hoặc phụ thuộc trực tiếp vào kết quả đúng `ans` (ví dụ: `w1 = ans + 5`, `w2 = ans * 2`).
- Nếu có khả năng hai công thức đáp án trùng nhau ở một vài bộ số ngẫu nhiên, **phải sử dụng biểu thức điều kiện tam phân** để dịch chuyển giá trị động, tránh trùng lặp:
  - Cú pháp khuyên dùng: `"w1": "(biểu thức_tính_w1 === ans) ? biểu thức_tính_w1 + số_lệch : biểu thức_tính_w1"`
  - **Tránh trùng chéo do số lệch tĩnh**: Nếu bạn dịch chuyển `w2` tránh trùng với `ans` bằng cách cộng thêm `5` (`ans + 5`), bạn phải đảm bảo rằng `ans + 5` không vô tình trùng với `w1`. Giải pháp an toàn nhất là sử dụng biểu thức tam phân lồng nhau kiểm tra chéo:
    - Ví dụ: `"w2": "(w2_goc === ans || w2_goc === w1) ? ( ((ans + 5) === w1) ? ans + 9 : ans + 5 ) : w2_goc"` (nếu trùng thì thử cộng 5, nếu vẫn trùng w1 thì cộng 9).
  - **Tránh trùng chéo khi sử dụng phép nhân/chia**: Thay vì nhân/chia với một số cố định dễ tạo ra trùng lặp ở một số bộ số đặc biệt, hãy nhân với các biến động hoặc kiểm tra điều kiện trùng trước khi nhân.

## 2. Loại bỏ hoàn toàn số thập phân lẻ trong các câu hỏi số nguyên
- Khi đề bài và các phương án liên quan đến đếm số người, vật phẩm, hoặc các đơn vị nguyên (ví dụ: học sinh, gói kẹo, số trang sách, số tiền...), **phải ép các phép chia có kết quả là số nguyên**.
- Thêm các ràng buộc chia hết vào thuộc tính `"constraints"` để bộ sinh số ngẫu nhiên lọc bỏ các bộ số lẻ:
  - Ví dụ: Thay vì cho phép ra số thập phân, hãy thêm constraint: `"totalAmount % pricePerPack === 0"` hoặc `"(a + c) % (b + d) === 0"`.
- Việc giữ kết quả là số nguyên sẽ ngăn chặn thuật toán chuẩn hóa chuỗi của kịch bản kiểm thử (test script) tự động xóa dấu chấm thập phân làm biến đổi các giá trị khác nhau thành giống nhau (ví dụ: chuẩn hóa `27.5` và `275` đều thành `275` dẫn đến báo lỗi trùng lặp giả).

## 3. Tránh các giá trị vô nghĩa (Infinity, NaN, null)
- Trong các công thức lọc mảng hoặc tìm min/max (ví dụ: `Math.min(...filteredPerms)`), nếu có khả năng mảng rỗng làm trả về `Infinity`, **phải viết biểu thức tự gọi (IIFE) hoặc biểu thức điều kiện** để trả về một giá trị dự phòng hợp lý:
  - Ví dụ: `"w3": "(() => { const other = list.filter(x => x !== ans); return other.length === 0 ? ans + 10 : Math.min(...other); })()"`

## 4. Bổ sung Constraints tập hợp để triệt tiêu trùng lặp
- Đối với các câu hỏi về tập hợp, hiệu số tuổi, chuyển động mà các đáp án liên quan trực tiếp đến các biến trung gian (như `learnBoth`, `neither`, `atLeastOne`), hãy thêm các constraints loại trừ trùng nhau trực tiếp vào cấu hình câu hỏi:
  - Ví dụ: `"learnGuitar + learnPiano !== 3 * learnBoth"`, `"learnGuitar + learnPiano !== 2 * learnBoth"`.

## 5. Các trường hợp toán học đặc biệt cần lưu ý
- **Bội chung nhỏ nhất (BCNN) và Ước chung lớn nhất (ƯCLN)**:
  - Khi tìm BCNN của hai số nguyên tố cùng nhau, `BCNN(a, b) = a * b`. Nếu đáp án nhiễu `w1` là `a * b`, nó sẽ luôn trùng với `ans`. Cần thêm điều kiện tam phân để dịch chuyển `w1`.
  - Khi tìm BCNN của hai số chia hết cho nhau, `BCNN(a, b) = Math.max(a, b)`. Nếu đáp án nhiễu `w3` là `Math.max(a, b)`, nó sẽ trùng với `ans`. Cần dịch chuyển `w3`.
- **Số dư tài khoản và Di chuyển số nguyên (Tàu ngầm, Thang máy)**:
  - Các phép tính cộng/trừ số nguyên có chứa trị tuyệt đối `Math.abs` (như khoảng cách trục số, độ sâu dưới biển) rất dễ tạo ra các đáp án trùng nhau giữa các phương án âm và dương khi chúng được đưa vào trị tuyệt đối. Phải luôn viết biểu thức tam phân để dịch chuyển giá trị tránh trùng tuyệt đối.
- **Dãy số quy luật (Cấp số cộng)**:
  - Công sai $d$ có thể âm hoặc dương. Các công thức nhiễu như `w2 = firstTerm + 2 * d + Math.abs(d)` sẽ trùng với `ans = firstTerm + 3 * d` khi $d > 0$. Hãy thiết lập điều kiện kiểm tra dấu của công sai hoặc kiểm tra trực tiếp sự trùng nhau của công thức.

## 6. Quy tắc định dạng LaTeX và biến số trong đề bài (Tránh lệch dấu $ và lỗi hiển thị)
- **Quy tắc vàng tránh lệch dấu $**: Tuyệt đối không sử dụng ký tự `$` trước dấu mở ngoặc `{` của các biến nằm bên trong một biểu thức LaTeX dài. Dấu `$` chỉ được đặt ở đầu và ở cuối biểu thức LaTeX.
  - *Ví dụ sai*: `$A = \\{${firstDisplayed}, ${factor * 2}, ..., ${lastDisplayed}\\}$` (làm KaTeX bắt cặp dấu `$` sai và dính chữ).
  - *Ví dụ đúng*: `$A = \\{{firstDisplayed}, {factor * 2}, ..., {lastDisplayed}\\}$`
- **Khai báo biến đồng bộ**: Đề bài, gợi ý và lời giải chỉ được sử dụng các biến đã khai báo trong cấu hình `"variables"` hoặc `"formulas"`. Tuyệt đối không tự ý viết các biến tiếng Việt không được định nghĩa (ví dụ: viết `{cận dưới}` thay vì `{lowerBound}`).
- **Hiển thị biến độc lập kèm đơn vị**: Đối với các biến số đơn giản đi kèm với đơn vị, hãy dùng `{totalMembers} thành viên` (không cần bọc dấu `$`). Nếu bắt buộc phải bọc dấu `$` để có font toán học, hãy bọc đúng cách: `$ {totalMembers} $` hoặc `{ans}$` độc lập, tránh lồng ghép phức tạp.

## 7. Quy tắc ngôn ngữ tài liệu dự án (Implementation Plan & Walkthrough)
- Từ nay trở đi, tất cả tài liệu `implementation_plan.md` (Implementation Plan) và `walkthrough.md` phải được trình bày hoàn toàn bằng tiếng Việt.

## 8. Quy tắc cập nhật phiên bản và thời gian cập nhật của phần mềm
- Mỗi khi thực hiện sửa đổi bất kỳ đoạn mã nguồn nào (HTML, CSS, JS), **bắt buộc** phải nâng số phiên bản (ví dụ từ `3.4` lên `3.5`) và cập nhật thời gian sửa đổi (ngày giờ hiện tại) lên màn hình chính.
- Nâng tham số cachebuster ở tất cả các thẻ import file CSS/JS tương ứng trong `student.html` (ví dụ: `?v=3.5`) để tránh lỗi cache trình duyệt của người dùng.
- Hiển thị số phiên bản và thời gian cập nhật đồng bộ ở 2 vị trí:
  - Trên màn hình chào mừng (Splash Screen).
  - Thẻ phiên bản cố định ở góc dưới cùng bên phải màn hình.

## 9. Quy tắc đồng bộ bản sạch (Clean Bundle Synchronization)
- Mỗi khi thực hiện bất kỳ sửa đổi hoặc nâng cấp mã nguồn nào tại dự án gốc (`HocTap`), **bắt buộc** phải chạy kịch bản đồng bộ tự động `node sync_clean.js` để cập nhật sang thư mục chạy sạch (`HocTap_Clean`).
- Không được chỉnh sửa mã nguồn trực tiếp trong `HocTap_Clean` mà phải thực hiện trên dự án gốc (`HocTap`), sau đó chạy script đồng bộ để tự động cập nhật sang `HocTap_Clean`.
- Kịch bản đồng bộ `sync_clean.js` phải luôn đảm bảo xóa sạch các tệp dữ liệu cá nhân của học sinh ở thư mục `HocTap_Clean` (bao gồm `database.db`, `.port.tmp`, và các bản sao lưu `.old`) để phân phối cho người dùng khác một bản sạch 100% không có lịch sử làm bài.

## 10. Quy định bảo toàn dữ liệu học tập môn Toán
- Các yêu cầu chỉnh sửa, cập nhật hoặc phát triển tính năng mới tiếp theo chỉ được thực thi trên phần học môn Tiếng Anh.
- Toàn bộ dữ liệu học tập môn Toán của học sinh Trần Bình Minh và Trần Đức Phúc phải được bảo toàn, độc lập, riêng rẽ. Tuyệt đối không được làm sai lệch hoặc làm hỏng các dữ liệu này dưới bất kỳ hình thức nào.

## 11. Quy tắc tự động đồng bộ Git và Tự động phát hành
- **Đồng bộ mã nguồn trước khi sửa đổi**: Mỗi khi thực hiện bất kỳ thay đổi nào liên quan đến mã nguồn (HTML, CSS, JS) trong các phiên làm việc, AI Agent bắt buộc phải tự động chạy lệnh `git pull origin main` để kéo các thay đổi mới nhất từ GitHub về máy cục bộ nhằm tránh xung đột nhánh.
- **Tự động chạy lệnh phát hành (Release)**: Ngay sau khi hoàn thành việc chỉnh sửa mã nguồn, AI Agent bắt buộc phải tự động thực thi lệnh phát hành `npm run release` để đóng gói bộ cài mới và đẩy lên GitHub Releases trực tuyến cho người dùng mà không cần chờ yêu cầu thủ công.

## 12. Quy tắc nghiêm cấm sai chính tả và lỗi font chữ
- **Tuyệt đối cấm** xảy ra các trường hợp sai chính tả (bao gồm cả tiếng Việt và tiếng Anh) và lỗi hiển thị font chữ (như lỗi mã hóa UTF-8 thành ký tự lạ dạng `ToÃ¡n Há»c`) trong toàn bộ dự án, bao gồm mã nguồn, giao diện người dùng, tài liệu hướng dẫn, các file script khởi chạy và phím tắt/lối tắt hệ thống.
- Mọi chuỗi ký tự hiển thị phải được kiểm tra kỹ lưỡng về định dạng mã hóa và lỗi chính tả trước khi phát hành.

## 14. Quy tắc tự trị đóng gói phân phối (Zero-Config Distribution) và Phân quyền Học sinh
- **Tự trị Đóng gói Phân phối (Zero-Config)**: Tất cả mã nguồn ứng dụng (Server, Client Web) phải hoạt động 100% ngay lập tức khi gửi đi phân phối cho người dùng cài đặt ở bất kỳ thư mục hay máy tính nào. Mọi thông số Google Client ID, Firebase Config, API Key nhúng sẵn đều phải có giá trị nhúng dự phòng cố định (hardcode fallback) trong mã nguồn. Tuyệt đối không bao giờ được trả về `""` hay `undefined` hoặc phụ thuộc vào việc phải copy file `.env` thủ công.
- **Phân quyền Tài khoản Phụ huynh & Học sinh chuẩn xác**:
  - **Tài khoản `skyprotect@gmail.com`**: Quản lý 2 học sinh riêng biệt độc lập:
    - 1. **Trần Bình Minh** (ID cố định: `std_htsj4gbmo`, Lớp 6)
    - 2. **Trần Bảo Ngọc** (ID độc lập mới: `std_baongoc`, Lớp 1)
  - **Tài khoản `nhematseo@gmail.com`**: Quản lý 1 học sinh riêng biệt:
    - **Trần Đức Phúc** (ID cố định: `std_tyc0gfnkz`, Lớp 4).

