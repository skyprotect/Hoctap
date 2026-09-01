/**
 * Builds the printable student-exam document markup without touching the DOM.
 * Delivery (preview, KaTeX, persistence, printing) remains with QuestionEngine.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') module.exports = api;
    root.StudentExamMarkup = api;
    if (typeof window !== 'undefined') window.StudentExamMarkup = api;
    if (typeof globalThis !== 'undefined') globalThis.StudentExamMarkup = api;
    if (typeof self !== 'undefined') self.StudentExamMarkup = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function buildStudentExamMarkup(lessonTitle, questionsList, includeSolution, classLevel, level, metadata) {
        const schoolName = metadata.schoolName;
        const defaultStudentName = metadata.defaultStudentName;
        const levelTextMap = { 'co-ban': 'Cơ bản', 'nang-cao': 'Nâng cao', 'kho': 'Khó', 'chat-luong-cao': 'Chất lượng cao AI' };
        const levelText = levelTextMap[level] || 'Nâng cao';
        let html = `
            <!-- Trang Đề thi -->
            <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif;">
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px;">
                    <div style="text-align: center; font-weight: bold; font-size: 11px; text-transform: uppercase; width: 45%;"><p style="margin: 0; padding: 0;">${schoolName}</p><p style="font-size: 9px; font-weight: normal; margin-top: 2px; margin-bottom: 0;">Chương trình học tập cá nhân hóa AI</p></div>
                    <div style="text-align: center; font-weight: bold; font-size: 13px; text-transform: uppercase; width: 50%;"><p style="margin: 0; padding: 0;">ĐỀ THI KIỂM TRA CHUYÊN ĐỀ</p><p style="font-size: 11px; font-weight: bold; font-style: italic; text-transform: none; margin-top: 4px; margin-bottom: 0;">Môn: Toán Lớp ${classLevel} - Mức độ: ${levelText}</p></div>
                </div>
                <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.5px;">Chuyên đề: ${lessonTitle}</div>
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.8;"><div style="width: 60%;">Họ và tên học sinh: <span style="font-weight: bold;">${defaultStudentName}</span></div><div style="width: 35%;">Ngày làm bài: ....../....../20...</div><div style="width: 60%;">Lớp: ....................................................................</div><div style="width: 35%;">Thời gian làm bài: 45 phút</div></div>
                <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; margin-bottom: 25px; font-size: 13px; text-align: center;"><thead><tr style="background-color: #f8fafc;"><th style="border: 1px solid #000000; padding: 8px; font-weight: bold; width: 30%;">ĐIỂM SỐ</th><th style="border: 1px solid #000000; padding: 8px; font-weight: bold;">LỜI PHÊ CỦA PHỤ HUYNH</th></tr></thead><tbody><tr style="height: 60px;"><td style="border: 1px solid #000000;"></td><td style="border: 1px solid #000000; text-align: left; padding: 8px; vertical-align: top; color: #64748b;"></td></tr></tbody></table>
                <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed #000000; padding-bottom: 4px;">PHẦN I. CÂU HỎI TRẮC NGHIỆM (10 câu hỏi)</div>
                <p style="font-style: italic; font-size: 12px; margin-bottom: 15px; color: #475569;">Khoanh tròn vào chữ cái đứng trước câu trả lời đúng nhất hoặc điền vào Bảng đáp án ở cuối đề.</p>
                <div style="display: flex; flex-direction: column; gap: 20px;">`;

        questionsList.forEach((q, idx) => {
            const cleanText = q.questionText.replace(/<br\s*\/?>/gi, '<br/>');
            let optionsHtml = '';
            if (q.options && q.options.length > 0) {
                optionsHtml = '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; padding-left: 15px; font-size: 13px;">';
                q.options.forEach((opt, oIdx) => {
                    const cleanOpt = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    const letter = ['A', 'B', 'C', 'D'][oIdx];
                    optionsHtml += `<div style="line-height: 1.5;"><span style="font-weight: bold;">${letter}.</span> ${cleanOpt}</div>`;
                });
                optionsHtml += '</div>';
            }
            html += `<div style="page-break-inside: avoid; break-inside: avoid;"><div class="math-render" style="font-size: 13.5px; font-weight: 600; line-height: 1.6; text-align: justify;">Câu ${idx + 1}: ${cleanText}</div>${optionsHtml}</div>`;
        });

        html += `</div><div style="margin-top: 35px; page-break-inside: avoid; break-inside: avoid;"><div style="font-weight: bold; font-size: 12px; text-align: center; margin-bottom: 10px; text-transform: uppercase;">BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM</div><table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; text-align: center; font-size: 12px;"><thead><tr style="background-color: #f1f5f9; font-weight: bold;"><td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Câu hỏi</td>${[1,2,3,4,5,6,7,8,9,10].map(number => `<td style="border: 1px solid #000000; padding: 6px;">${number}</td>`).join('')}</tr></thead><tbody><tr style="height: 32px;"><td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Đáp án chọn</td>${Array(10).fill('<td style="border: 1px solid #000000;"></td>').join('')}</tr></tbody></table></div><div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">© Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.</div></div>`;

        if (includeSolution) {
            html += `<div class="print-page-break" style="margin-top: 40px;"></div><div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif; margin-top: 20px;"><div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 20px;">HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI</div><p style="font-size: 13px; margin-bottom: 15px; font-weight: bold;">Chuyên đề: ${lessonTitle} - Mức độ: ${levelText}</p><div style="margin-bottom: 25px;"><div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">1. BẢNG ĐÁP ÁN NHANH</div><table style="width: 100%; border-collapse: collapse; border: 1.2px solid #000000; text-align: center; font-size: 12px;"><thead><tr style="background-color: #f1f5f9; font-weight: bold;"><td style="border: 1px solid #000000; padding: 6px;">Câu</td>${[1,2,3,4,5,6,7,8,9,10].map(number => `<td style="border: 1px solid #000000; padding: 6px;">${number}</td>`).join('')}</tr></thead><tbody><tr style="height: 28px; font-weight: bold;"><td style="border: 1px solid #000000; background-color: #f1f5f9; color: #000000 !important;">Đáp án</td>`;
            questionsList.forEach(q => { html += `<td style="border: 1px solid #000000; color: #10b981 !important;">${['A', 'B', 'C', 'D'][q.correctIndex || 0]}</td>`; });
            html += `</tr></tbody></table></div><div style="font-weight: bold; font-size: 12px; margin-bottom: 12px; text-transform: uppercase;">2. LỜI GIẢI CHI TIẾT TỪNG CÂU</div><div style="display: flex; flex-direction: column; gap: 18px; font-size: 13px; line-height: 1.6;">`;
            questionsList.forEach((q, idx) => {
                const correctLetter = ['A', 'B', 'C', 'D'][q.correctIndex || 0];
                const cleanSol = q.solutionHtml ? q.solutionHtml.replace(/<br\s*\/?>/gi, '<br/>') : 'Đang cập nhật...';
                const cleanTip = q.tip ? q.tip.replace(/<br\s*\/?>/gi, '<br/>') : '';
                html += `<div style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px;"><p style="font-weight: bold; margin-bottom: 4px;">Câu ${idx + 1}: Chọn đáp án ${correctLetter}</p><div class="math-render" style="margin-top: 6px; padding-left: 10px; border-left: 2px solid #8b5cf6; color: #334155 !important;">${cleanSol}</div>`;
                if (cleanTip) html += `<div class="math-render" style="margin-top: 6px; padding-left: 10px; font-style: italic; color: #475569 !important; font-size: 12.5px;">💡 Mẹo làm bài: ${cleanTip}</div>`;
                html += '</div>';
            });
            html += `</div><div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">© Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.</div></div>`;
        }
        return html;
    }

    return { buildStudentExamMarkup };
});
