const fs = require('fs');

async function parseSchedulePdf() {
    console.log("Đang tải thư viện PDF.js...");
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    console.log("Đang đọc file 12.pdf...");
    const data = new Uint8Array(fs.readFileSync('12.pdf'));
    
    const loadingTask = pdfjs.getDocument({ data });
    const doc = await loadingTask.promise;
    console.log(`Đã tải file. Số trang: ${doc.numPages}`);
    
    // Danh sách các cột ngày dự kiến trong lịch
    const dateColumns = ['1', '2', '3', '6', '7', '8', '9', '10', '13', '14', '15', '16', '17', '20', '21', '22', '23', '24', '27', '28', '29', '30', '31'];
    
    const allRecords = [];
    
    for (let pNum = 1; pNum <= doc.numPages; pNum++) {
        console.log(`Đang xử lý trang ${pNum}/${doc.numPages}...`);
        const page = await doc.getPage(pNum);
        const textContent = await page.getTextContent();
        
        // 1. Nhóm các phần tử chữ theo dòng (Y chênh lệch <= 4)
        const tempRows = new Map();
        textContent.items.forEach(item => {
            const str = item.str.trim();
            if (!str) return;
            
            const x = item.transform[4];
            const y = item.transform[5];
            
            let foundY = null;
            for (const existingY of tempRows.keys()) {
                if (Math.abs(existingY - y) <= 4) {
                    foundY = existingY;
                    break;
                }
            }
            
            if (foundY !== null) {
                tempRows.get(foundY).push({ text: str, x, y });
            } else {
                tempRows.set(y, [{ text: str, x, y }]);
            }
        });
        
        // Sắp xếp các dòng Y từ trên xuống dưới
        const sortedYs = Array.from(tempRows.keys()).sort((a, b) => b - a);
        
        // 2. Tìm dòng tiêu đề ngày (chứa danh sách các ngày 1, 2, 3...)
        let headerRowY = null;
        let dayXCoords = {}; // Bản đồ lưu toạ độ X của từng ngày: day -> x
        
        for (const y of sortedYs) {
            const rowItems = tempRows.get(y);
            // Đếm xem dòng này chứa bao nhiêu số ngày hợp lệ
            const dayMatches = rowItems.filter(item => dateColumns.includes(item.text));
            if (dayMatches.length >= 10) { // Có ít nhất 10 ngày khớp thì coi là dòng tiêu đề ngày
                headerRowY = y;
                dayMatches.forEach(item => {
                    dayXCoords[item.text] = item.x;
                });
                break;
            }
        }
        
        if (headerRowY === null) {
            console.log(`Cảnh báo: Không tìm thấy dòng tiêu đề ngày ở trang ${pNum}`);
            continue;
        }
        
        console.log(`Trang ${pNum}: Tìm thấy dòng tiêu đề ngày ở Y = ${headerRowY.toFixed(1)}`);
        
        // 3. Tìm các phần tử chỉ thị hàng (Row Indicators) nằm dưới tiêu đề ngày
        // Chỉ thị hàng có X < 80 (như "1", "2", "-", "*", "+") và Y < headerRowY - 5
        const rowIndicators = [];
        sortedYs.forEach(y => {
            if (y >= headerRowY - 5) return; // Bỏ qua tiêu đề và phần phía trên
            
            const rowItems = tempRows.get(y);
            // Tìm phần tử bắt đầu hàng (X < 80)
            const indicator = rowItems.find(item => item.x < 80);
            if (indicator) {
                rowIndicators.push({ text: indicator.text, x: indicator.x, y });
            }
        });
        
        // Sắp xếp chỉ thị hàng theo Y giảm dần (từ trên xuống)
        rowIndicators.sort((a, b) => b.y - a.y);
        
        // 4. Gom các phần tử chữ vào các nhóm hàng dựa trên toạ độ Y của chỉ thị hàng gần nhất
        const rowGroups = new Map(); // indicatorY -> array of items
        rowIndicators.forEach(ind => {
            rowGroups.set(ind.y, []);
        });
        
        sortedYs.forEach(y => {
            if (y >= headerRowY - 5) return; // Bỏ qua phần tiêu đề trở lên
            
            const rowItems = tempRows.get(y);
            rowItems.forEach(item => {
                // Tìm chỉ thị hàng có Y gần nhất với item.y
                let closestIndY = null;
                let minDiff = Infinity;
                
                rowIndicators.forEach(ind => {
                    // Item chỉ thuộc về chỉ thị hàng nếu khoảng cách Y hợp lý
                    // (Thường dòng nội dung có thể cao hơn hoặc thấp hơn chỉ thị một chút, khoảng cách <= 15)
                    const diff = Math.abs(ind.y - item.y);
                    if (diff < minDiff && diff <= 15) {
                        minDiff = diff;
                        closestIndY = ind.y;
                    }
                });
                
                if (closestIndY !== null) {
                    rowGroups.get(closestIndY).push(item);
                }
            });
        });
        
        // 5. Phân tích từng nhóm hàng thành record hoàn chỉnh
        rowIndicators.forEach(ind => {
            const items = rowGroups.get(ind.y);
            if (items.length === 0) return;
            
            // Sắp xếp các phần tử trong hàng theo thứ tự đọc tự nhiên:
            // Dòng trên trước (Y giảm dần), cùng dòng thì trái trước (X tăng dần)
            items.sort((a, b) => {
                if (Math.abs(a.y - b.y) > 4) {
                    return b.y - a.y;
                }
                return a.x - b.x;
            });
            
            let stt = "";
            let noiDungParts = [];
            let giaoVienParts = [];
            let diaDiemParts = [];
            let thoiGianParts = [];
            let phanBoNgay = {};
            
            items.forEach(item => {
                const x = item.x;
                if (x < 80) {
                    stt = item.text;
                } else if (x >= 80 && x < 330) {
                    noiDungParts.push(item.text);
                } else if (x >= 330 && x < 380) {
                    giaoVienParts.push(item.text);
                } else if (x >= 380 && x < 425) {
                    diaDiemParts.push(item.text);
                } else if (x >= 425 && x < 455) {
                    thoiGianParts.push(item.text);
                } else {
                    // Phần bổ ngày (X >= 455)
                    // Tìm ngày có toạ độ X gần nhất với toạ độ X của phần tử này
                    let closestDay = null;
                    let minDiff = Infinity;
                    
                    for (const [day, dayX] of Object.entries(dayXCoords)) {
                        const diff = Math.abs(dayX - x);
                        if (diff < minDiff && diff <= 10) { // Giới hạn sai lệch toạ độ cột là 10
                            minDiff = diff;
                            closestDay = day;
                        }
                    }
                    
                    if (closestDay !== null) {
                        phanBoNgay[closestDay] = item.text;
                    }
                }
            });
            
            const noiDung = noiDungParts.join(" ");
            const giaoVien = giaoVienParts.join(" ");
            const diaDiem = diaDiemParts.join(" ");
            const thoiGian = thoiGianParts.join(" ");
            
            // Bỏ qua các hàng tiêu đề nhóm phụ nếu không có nội dung huấn luyện thực tế
            if (!noiDung || noiDung.toLowerCase() === "nội dung huấn luyện") return;
            
            allRecords.push({
                trang: pNum,
                stt,
                noi_dung: noiDung,
                giao_vien: giaoVien,
                dia_diem: diaDiem,
                thoi_gian: thoiGian,
                phan_bo: phanBoNgay
            });
        });
    }
    
    // 6. Gộp các dòng bị ngắt dòng (nếu dòng dưới không có STT và không có Giáo viên/Thời gian, 
    // thì gom phần nội dung của nó lên dòng trên)
    const finalRecords = [];
    allRecords.forEach(rec => {
        // Nếu dòng hiện tại không có stt rõ ràng (trống hoặc chỉ có dấu gạch ngang) 
        // và không có giáo viên/thời gian/phân bổ ngày, có khả năng nó là dòng chữ bị tràn của dòng trước
        if (finalRecords.length > 0 && 
            (!rec.stt || rec.stt === "-") && 
            !rec.giao_vien && 
            !rec.thoi_gian && 
            Object.keys(rec.phan_bo).length === 0) {
            
            const lastRec = finalRecords[finalRecords.length - 1];
            lastRec.noi_dung += " " + rec.noi_dung;
        } else {
            finalRecords.push(rec);
        }
    });
    
    // Hậu xử lý các ô đặc biệt (như 4.2) và dịch chuyển xung đột lịch
    finalRecords.forEach(rec => {
        const phan_bo = rec.phan_bo;
        const keys = Object.keys(phan_bo).sort((a, b) => dateColumns.indexOf(a) - dateColumns.indexOf(b));
        
        keys.forEach(day => {
            const val = phan_bo[day];
            if (val && /\d\.\d/.test(val)) {
                const parts = val.split('.');
                const v1 = parts[0];
                const v2 = parts[1];
                
                phan_bo[day] = v1;
                
                const dIdx = dateColumns.indexOf(day);
                if (dIdx !== -1 && dIdx + 1 < dateColumns.length) {
                    const nextDay = dateColumns[dIdx + 1];
                    
                    // Nếu ngày tiếp theo đã có giá trị (ví dụ "6"), dịch chuyển nó sang ngày tiếp theo nữa
                    if (phan_bo[nextDay] && dIdx + 2 < dateColumns.length) {
                        const nextNextDay = dateColumns[dIdx + 2];
                        phan_bo[nextNextDay] = phan_bo[nextDay];
                    }
                    
                    phan_bo[nextDay] = v2;
                }
            }
        });
    });

    // 7. Xuất ra file JSON
    fs.writeFileSync('schedule_12.json', JSON.stringify(finalRecords, null, 2), 'utf8');
    console.log("Đã lưu dữ liệu trích xuất dạng JSON vào: schedule_12.json");
    
    // 8. Xuất ra file CSV
    let csvContent = '\uFEFF'; // UTF-8 BOM để Excel đọc đúng tiếng Việt
    const headers = ['Trang', 'STT', 'Nội dung huấn luyện', 'Giáo viên', 'Địa điểm', 'Thời gian tổng'].concat(dateColumns);
    csvContent += headers.join(',') + '\n';
    
    finalRecords.forEach(rec => {
        const rowData = [
            rec.trang,
            `"${rec.stt.replace(/"/g, '""')}"`,
            `"${rec.noi_dung.replace(/"/g, '""')}"`,
            `"${rec.giao_vien.replace(/"/g, '""')}"`,
            `"${rec.dia_diem.replace(/"/g, '""')}"`,
            `"${rec.thoi_gian.replace(/"/g, '""')}"`
        ];
        
        dateColumns.forEach(day => {
            rowData.push(`"${(rec.phan_bo[day] || "").replace(/"/g, '""')}"`);
        });
        
        csvContent += rowData.join(',') + '\n';
    });
    
    fs.writeFileSync('schedule_12.csv', csvContent, 'utf8');
    console.log("Đã lưu dữ liệu trích xuất dạng CSV vào: schedule_12.csv");
    
    // In tóm tắt kết quả
    console.log("\n=== TÓM TẮT KẾT QUẢ TRÍCH XUẤT ===");
    console.log(`Tổng số dòng huấn luyện trích xuất được: ${finalRecords.length}`);
    console.log("\n5 dòng đầu tiên:");
    finalRecords.slice(0, 5).forEach(r => {
        console.log(`- [Trang ${r.trang}][STT: ${r.stt}] ${r.noi_dung}`);
        console.log(`  GV: ${r.giao_vien} | Địa điểm: ${r.dia_diem} | Tổng giờ: ${r.thoi_gian}`);
        if (Object.keys(r.phan_bo).length > 0) {
            console.log(`  Lịch phân bổ:`, r.phan_bo);
        }
    });
}

parseSchedulePdf();
