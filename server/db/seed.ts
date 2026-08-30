/**
 * DATABASE SEEDING
 * Tự động nạp cấu hình và 3 học sinh chuẩn theo Quy tắc 14
 */
import { Student } from '../types';

export const SYSTEM_STUDENTS: Student[] = [
    { id: "std_htsj4gbmo", name: "Trần Bình Minh", parentName: "Phụ huynh", classLevel: "6" },
    { id: "std_baongoc", name: "Trần Bảo Ngọc", parentName: "Phụ huynh", classLevel: "1" },
    { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", parentName: "Phụ huynh", classLevel: "4" }
];

export async function seedDefaultData(
    dbGet: (sql: string, params?: any[]) => Promise<any>,
    dbRun: (sql: string, params?: any[]) => Promise<any>
): Promise<void> {
    try {
        const row = await dbGet("SELECT value FROM settings WHERE key = 'config'").catch(() => null);
        let currentConfig: any = null;
        if (row && row.value) {
            try { currentConfig = JSON.parse(row.value); } catch (e) {}
        }

        if (!currentConfig) {
            currentConfig = {
                parentName: "Phụ huynh",
                studentName: "Trần Bình Minh",
                currentClass: "6",
                defaultStudentId: "std_htsj4gbmo",
                students: SYSTEM_STUDENTS,
                parentEmail: "skyprotect@gmail.com",
                parentPhone: "",
                telegramBotToken: "",
                telegramChatId: "",
                aiTeacherEnabled: true,
                geminiApiKeys: []
            };
            await dbRun("INSERT OR REPLACE INTO settings (key, value) VALUES ('config', ?)", [JSON.stringify(currentConfig)]);
            console.log("🌱 Đã khởi tạo cấu hình mặc định trong settings");
        } else {
            // Đảm bảo có đủ 3 học sinh
            let needsUpdate = false;
            if (!Array.isArray(currentConfig.students)) {
                currentConfig.students = SYSTEM_STUDENTS;
                needsUpdate = true;
            } else {
                for (const defStd of SYSTEM_STUDENTS) {
                    if (!currentConfig.students.some((s: any) => s.id === defStd.id)) {
                        currentConfig.students.push(defStd);
                        needsUpdate = true;
                    }
                }
            }
            if (needsUpdate) {
                await dbRun("INSERT OR REPLACE INTO settings (key, value) VALUES ('config', ?)", [JSON.stringify(currentConfig)]);
                console.log("🌱 Đã cập nhật danh sách 3 học sinh chuẩn hóa trong CSDL SQLite");
            }
        }
    } catch (e: any) {
        console.warn("⚠️ Cảnh báo khởi tạo dữ liệu seed:", e.message);
    }
}
