/**
 * MIGRATION SERVICE
 * Tự động di trú dữ liệu, sửa lỗi chấm điểm lịch sử và đồng bộ các cấu trúc dữ liệu mới
 */
import fs from 'fs';
import path from 'path';
import { db, allQuery, runQuery } from '../db/database';
import { syncAllStudentsToFirebase } from './firebase.service';
import { EXAMS_DIR } from './gemini.service';

export async function migrateFixMathBugsV12(): Promise<void> {
    db.all("SELECT student_id, state_json FROM student_progress", [], async (err: Error | null, rows: any[]) => {
        if (err) {
            console.error("[Migration V12] Lỗi truy vấn database:", err);
            return;
        }
        if (!rows || rows.length === 0) return;

        let updatedCount = 0;

        for (const row of rows) {
            try {
                const state = JSON.parse(row.state_json);
                let studentChanged = false;

                if (state.examSessions && Array.isArray(state.examSessions)) {
                    state.examSessions.forEach((session: any) => {
                        let sessionChanged = false;
                        let correctCount = 0;

                        if (session.questions && Array.isArray(session.questions)) {
                            session.questions.forEach((q: any) => {
                                const wasCorrect = q.isCorrect;

                                // 1. Dạng chia hết cho 4
                                if (q.questionText && q.questionText.includes("chia hết cho **4**") && !q.isShortAnswer) {
                                    if (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null) {
                                        const optSelected = q.options[q.userSelectedIndex];
                                        if (optSelected) {
                                            const val = parseInt(optSelected.replace(/[^0-9]/g, ''));
                                            if (!isNaN(val) && val % 4 === 0) {
                                                q.isCorrect = true;
                                            }
                                        }
                                    }
                                }

                                // 2. Dạng tìm x chia hết cho 3 không chia hết cho 9
                                if (q.questionText && q.questionText.includes("chia hết cho 3") && q.questionText.includes("không") && q.questionText.includes("chia hết cho 9") && !q.isShortAnswer) {
                                    if (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null) {
                                        const optSelected = q.options[q.userSelectedIndex];
                                        if (optSelected) {
                                            const xMatch = optSelected.match(/x\s*=\s*(\d+)/);
                                            if (xMatch) {
                                                const xVal = parseInt(xMatch[1]);
                                                if (q.questionText.includes("2x5") || q.questionText.includes("7x0")) {
                                                    if (xVal === 5 || xVal === 8) {
                                                        q.isCorrect = true;
                                                    }
                                                } else if (q.questionText.includes("4x5")) {
                                                    if (xVal === 3 || xVal === 6) {
                                                        q.isCorrect = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // 3. Dạng BCNN và tích
                                if (q.questionText && q.questionText.includes("BCNN") && q.questionText.includes("tích") && q.isShortAnswer) {
                                    if (q.userShortAnswer) {
                                        let cleanAns = q.userShortAnswer.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                                        cleanAns = cleanAns.replace(/\$/g, '').trim();
                                        cleanAns = cleanAns.replace(/,\s+/g, ';');
                                        cleanAns = cleanAns.replace(/([a-zA-Z=])\s*,\s*/g, '$1;');
                                        cleanAns = cleanAns.replace(/\s*,\s*([a-zA-Z=])/g, ';$1');
                                        cleanAns = cleanAns.replace(/(chiếc kẹo|kẹo|hộp sữa|sữa|hộp|quả|bông hoa|hoa|quyển sách|sách|vở|bút|học sinh|bạn|khối rubik|khối|rubik|phần tử|ước|bội|dm|cm|m|kg|g|giờ|phút|giây|lít|l|độ c|độ|c)/g, '').trim();
                                        cleanAns = cleanAns.replace(/\s+/g, '').toLowerCase();

                                        const hasPair18_20 = cleanAns.includes("18") && cleanAns.includes("20");
                                        const hasPair10_36 = cleanAns.includes("10") && cleanAns.includes("36");
                                        const hasPair4_90 = cleanAns.includes("4") && cleanAns.includes("90");
                                        const hasPair2_180 = cleanAns.includes("2") && cleanAns.includes("180");
                                        
                                        if (hasPair18_20 || hasPair10_36 || hasPair4_90 || hasPair2_180) {
                                            q.isCorrect = true;
                                        }
                                    }
                                }

                                if (q.isCorrect) {
                                    correctCount++;
                                }

                                if (q.isCorrect !== wasCorrect) {
                                    sessionChanged = true;
                                }
                            });
                        }

                        if (sessionChanged) {
                            const totalQ = session.questions.length;
                            const newScorePercent = Math.round((correctCount / totalQ) * 100);
                            console.log(`[Migration V12] Cập nhật session "${session.lessonTitle}" của ${row.student_id}: ${session.scorePercent}% -> ${newScorePercent}%`);
                            session.scorePercent = newScorePercent;
                            if (session.score !== undefined) {
                                session.score = correctCount;
                            }
                            if (state.scores && state.scores[session.lessonId] !== undefined) {
                                state.scores[session.lessonId] = Math.max(state.scores[session.lessonId], newScorePercent);
                            }
                            studentChanged = true;
                        }
                    });
                }

                if (studentChanged) {
                    await runQuery(
                        "UPDATE student_progress SET state_json = ? WHERE student_id = ?",
                        [JSON.stringify(state), row.student_id]
                    );
                    updatedCount++;
                }
            } catch (parseErr) {
                console.error(`[Migration V12] Lỗi parse JSON của student ${row.student_id}:`, parseErr);
            }
        }

        if (updatedCount > 0) {
            console.log(`[Migration V12] Đã di trú và sửa lỗi chấm điểm cho ${updatedCount} học sinh thành công.`);
        }
    });
}

export function runDataMigration(): void {
    const backupStatusFile = path.join(EXAMS_DIR, 'pregen_status_backup.json');
    const mainStatusFile = path.join(EXAMS_DIR, 'pregen_status.json');
    const studentBinhMinh = 'std_htsj4gbmo';
    const studentDucPhuc = 'std_tyc0gfnkz';

    const statusBinhMinhPath = path.join(EXAMS_DIR, `pregen_status_${studentBinhMinh}.json`);
    const statusDucPhucPath = path.join(EXAMS_DIR, `pregen_status_${studentDucPhuc}.json`);

    if (!fs.existsSync(statusBinhMinhPath) && !fs.existsSync(statusDucPhucPath) && fs.existsSync(mainStatusFile)) {
        console.log('[Migration] Bắt đầu di chuyển dữ liệu đề thi sang cấu trúc phân biệt học sinh...');
        try {
            const statusContent = fs.readFileSync(mainStatusFile, 'utf8');
            const oldStatus = JSON.parse(statusContent);

            const completedBinhMinh: string[] = [];
            const failedBinhMinh: Record<string, any> = {};
            const completedDucPhuc: string[] = [];
            const failedDucPhuc: Record<string, any> = {};

            if (oldStatus.completed && Array.isArray(oldStatus.completed)) {
                oldStatus.completed.forEach((id: string) => {
                    if (id.startsWith('l4-')) {
                        completedDucPhuc.push(id);
                    } else {
                        completedBinhMinh.push(id);
                    }
                });
            }

            if (oldStatus.failed && typeof oldStatus.failed === 'object') {
                Object.keys(oldStatus.failed).forEach(id => {
                    if (id.startsWith('l4-')) {
                        failedDucPhuc[id] = oldStatus.failed[id];
                    } else {
                        failedBinhMinh[id] = oldStatus.failed[id];
                    }
                });
            }

            fs.writeFileSync(statusBinhMinhPath, JSON.stringify({ completed: completedBinhMinh, failed: failedBinhMinh }, null, 2), 'utf8');
            fs.writeFileSync(statusDucPhucPath, JSON.stringify({ completed: completedDucPhuc, failed: failedDucPhuc }, null, 2), 'utf8');
            console.log('[Migration] Đã ghi nhận file trạng thái riêng cho Bình Minh và Đức Phúc.');

            const files = fs.readdirSync(EXAMS_DIR);
            let migratedCount = 0;
            files.forEach(file => {
                if (file.startsWith('pregen-') && file.endsWith('.json')) {
                    const lessonId = file.substring(7, file.length - 5);
                    if (lessonId.startsWith('std_')) {
                        return;
                    }

                    const oldPath = path.join(EXAMS_DIR, file);
                    let newFile = lessonId.startsWith('l4-') 
                        ? `pregen-${studentDucPhuc}-${lessonId}.json`
                        : `pregen-${studentBinhMinh}-${lessonId}.json`;
                    const newPath = path.join(EXAMS_DIR, newFile);

                    if (!fs.existsSync(newPath)) {
                        fs.renameSync(oldPath, newPath);
                    } else {
                        fs.unlinkSync(oldPath);
                    }
                    migratedCount++;
                }
            });

            fs.renameSync(mainStatusFile, backupStatusFile);
            console.log(`[Migration] Hoàn tất di chuyển ${migratedCount} tệp đề thi cũ. File cũ đã được backup thành pregen_status_backup.json.`);
        } catch (e) {
            console.error('[Migration] Lỗi xảy ra trong quá trình di chuyển dữ liệu:', e);
        }
    } else {
        syncAllStudentsToFirebase().catch(err => {
            console.error("[FirebaseSync] Lỗi khởi chạy đồng bộ ban đầu:", err);
        });
    }
}
