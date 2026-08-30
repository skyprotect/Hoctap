/**
 * STUDENT CONTROLLER
 * Xử lý API nạp/lưu thông tin học sinh, tiến độ và tablet tokens
 */
const { dbGet, dbRun, dbAll } = require('../db/database');

async function getStudentInfo(req, res) {
    const studentId = req.query.studentId || 'std_htsj4gbmo';
    try {
        const row = await dbGet("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId]);
        let state = null;
        if (row && row.state_json) {
            try { state = JSON.parse(row.state_json); } catch(e) {}
        }
        res.json({ success: true, studentId, state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function saveProgress(req, res) {
    const { studentId, state, config } = req.body;
    if (!studentId || !state) {
        return res.status(400).json({ error: "Thiếu dữ liệu studentId hoặc state" });
    }
    try {
        const stateJson = JSON.stringify(state);
        await dbRun(
            "INSERT INTO student_progress (student_id, state_json) VALUES (?, ?) " +
            "ON CONFLICT(student_id) DO UPDATE SET state_json = excluded.state_json",
            [studentId, stateJson]
        );
        res.json({ success: true, message: "Đã lưu tiến độ thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getStudentInfo,
    saveProgress
};
