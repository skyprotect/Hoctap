import pdfplumber
import json
import csv
import os

def parse_schedule_pdf(pdf_path):
    all_data = []
    
    # Danh sách các cột ngày có trong lịch
    date_columns = ['1', '2', '3', '6', '7', '8', '9', '10', '13', '14', '15', '16', '17', '20', '21', '22', '23', '24', '27', '28', '29', '30', '31']
    headers = ['STT', 'Noi_dung_huan_luyen', 'Giao_vien', 'Dia_diem', 'Thoi_gian'] + date_columns
    
    print(f"Bắt đầu đọc file {pdf_path}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            print(f"Đang xử lý trang {page_idx + 1}/{len(pdf.pages)}...")
            
            # Sử dụng các đường kẻ ngang và dọc để phân tách các ô chính xác
            tables = page.extract_tables(settings={
                "vertical_strategy": "lines",
                "horizontal_strategy": "lines",
                "snap_tolerance": 3,
                "join_tolerance": 3,
            })
            
            for table_idx, table in enumerate(tables):
                if not table:
                    continue
                
                # Bỏ qua các hàng tiêu đề chính của bảng ở đầu trang
                start_row = 0
                for row_idx, row in enumerate(table):
                    # Tìm dòng tiêu đề cột để bắt đầu đọc dữ liệu từ dòng tiếp theo
                    # Dòng tiêu đề thường chứa các cột như "Nội dung huấn luyện" hoặc "Giáo viên"
                    row_str = " ".join([str(x) if x else "" for x in row]).lower()
                    if "nội dung" in row_str or "giáo viên" in row_str:
                        start_row = row_idx + 1
                        break
                
                # Nếu không tìm thấy tiêu đề, mặc định bắt đầu từ dòng đầu tiên
                for row_idx in range(start_row, len(table)):
                    row = table[row_idx]
                    
                    # Kiểm tra xem hàng có trống hoàn toàn không
                    if not any(row):
                        continue
                    
                    # Chuẩn hóa dữ liệu trong hàng
                    cleaned_row = [str(cell).strip().replace('\n', ' ') if cell is not None else "" for cell in row]
                    
                    # Đảm bảo hàng có đủ số cột như mong đợi (ít nhất là 5 cột metadata + các cột ngày)
                    if len(cleaned_row) < 5:
                        continue
                        
                    # Lấy thông tin cơ bản
                    stt = cleaned_row[0]
                    noi_dung = cleaned_row[1]
                    giao_vien = cleaned_row[2]
                    dia_diem = cleaned_row[3]
                    thoi_gian = cleaned_row[4]
                    
                    # Nếu nội dung trống thì bỏ qua
                    if not noi_dung or noi_dung.lower() in ["t", "t/t", "nội dung huấn luyện"]:
                        continue
                    
                    # Trích xuất phân phối số tiết theo ngày
                    days_distribution = {}
                    # Số cột ngày thực tế trong hàng này
                    num_days = min(len(cleaned_row) - 5, len(date_columns))
                    
                    for d_idx in range(num_days):
                        day = date_columns[d_idx]
                        val = cleaned_row[5 + d_idx]
                        if val: # Chỉ lưu các ngày có hoạt động huấn luyện (số tiết hoặc kí hiệu K/T/Ô)
                            days_distribution[day] = val
                    
                    record = {
                        "page": page_idx + 1,
                        "stt": stt,
                        "noi_dung_huan_luyen": noi_dung,
                        "giao_vien": giao_vien,
                        "dia_diem": dia_diem,
                        "thoi_gian_tong": thoi_gian,
                        "phan_bo_ngay": days_distribution
                    }
                    all_data.append(record)

    return all_data, headers

def main():
    pdf_path = "12.pdf"
    if not os.path.exists(pdf_path):
        print(f"Không tìm thấy file {pdf_path} trong thư mục hiện tại.")
        return
        
    try:
        data, headers = parse_schedule_pdf(pdf_path)
        
        # 1. Lưu ra file JSON
        json_path = "schedule_12.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Đã lưu dữ liệu dạng JSON vào: {json_path}")
        
        # 2. Lưu ra file CSV
        csv_path = "schedule_12.csv"
        with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            # Viết header
            writer.writerow(headers)
            # Viết dữ liệu
            for r in data:
                row_data = [
                    r["stt"],
                    r["noi_dung_huan_luyen"],
                    r["giao_vien"],
                    r["dia_diem"],
                    r["thoi_gian_tong"]
                ]
                # Thêm số tiết tương ứng với từng ngày trong danh sách date_columns
                for day in headers[5:]:
                    row_data.append(r["phan_bo_ngay"].get(day, ""))
                writer.writerow(row_data)
        print(f"Đã lưu dữ liệu dạng CSV vào: {csv_path}")
        
        # In tóm tắt kết quả
        print("\n=== TÓM TẮT DỮ LIỆU ĐÃ TRÍCH XUẤT ===")
        print(f"Tổng số dòng nội dung huấn luyện đọc được: {len(data)}")
        print("\nVí dụ 5 dòng đầu tiên:")
        for r in data[:5]:
            print(f"- [{r['stt']}] {r['noi_dung_huan_luyen']} | GV: {r['giao_vien']} | Tổng thời gian: {r['thoi_gian_tong']}")
            if r['phan_bo_ngay']:
                print(f"  Phân bổ: {r['phan_bo_ngay']}")
                
    except Exception as e:
        print(f"Đã xảy ra lỗi khi xử lý: {str(e)}")

if __name__ == "__main__":
    main()
