/**
 * Characterization contract for questions.renderAndPrintStudentExam().
 *
 * This suite deliberately exercises the public, effectful entry point with a
 * minimal DOM harness.  It freezes the HTML emitted before KaTeX/DOM/print
 * delivery; it does not introduce a builder or alter production behaviour.
 */
const questions = require('../../js/questions-v3.js');
const StudentExamMarkup = require('../../js/core/student-exam-markup.js');

const makeQuestion = (overrides = {}) => ({
    questionText: '2 + 2 bằng bao nhiêu?',
    options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
    correctIndex: 1,
    solutionHtml: 'Vì $2 + 2 = 4$.',
    tip: 'Cộng hai số tự nhiên.',
    ...overrides
});

function makeElement(id) {
    return {
        id,
        innerHTML: '',
        classList: { remove: jest.fn(), add: jest.fn() }
    };
}

describe('renderAndPrintStudentExam deterministic document-markup contract', () => {
    let elements;
    let savedHtml;
    let print;
    let renderMath;

    beforeEach(() => {
        elements = {
            'print-preview-modal': makeElement('print-preview-modal'),
            'print-preview-paper': makeElement('print-preview-paper')
        };
        savedHtml = undefined;
        print = jest.fn();
        renderMath = jest.fn();

        global.app = { config: { schoolName: 'Trường <AI> & Bạn', studentName: 'Nguyễn "Minh" & Co.' } };
        global.window = { app: global.app, print, renderMathInElement: renderMath };
        global.document = {
            getElementById: jest.fn(id => elements[id] || null),
            createElement: jest.fn(() => makeElement('student-print-paper')),
            body: { appendChild: jest.fn(element => { elements[element.id] = element; }) }
        };
        global.setTimeout = jest.fn(callback => callback());
        questions.savePrintedPDFToServer = jest.fn(html => { savedHtml = html; });
    });

    afterEach(() => {
        delete global.window;
        delete global.document;
        delete global.app;
    });

    const renderPreview = (title, list, includeSolution = true, classLevel = '6', level = 'nang-cao') => {
        questions.renderAndPrintStudentExam(title, list, includeSolution, classLevel, level);
        return elements['print-preview-paper'].innerHTML;
    };

    test('TC-01 standard exam: emits header, a question, options, student answer table, and solution page', () => {
        const html = renderPreview('Phân số cơ bản', [makeQuestion()]);

        expect(html).toContain('Trường <AI> & Bạn');
        expect(html).toContain('Nguyễn "Minh" & Co.');
        expect(html).toContain('Môn: Toán Lớp 6 - Mức độ: Nâng cao');
        expect(html).toContain('Chuyên đề: Phân số cơ bản');
        expect(html).toContain('Câu 1: 2 + 2 bằng bao nhiêu?');
        expect(html).toContain('<span style="font-weight: bold;">A.</span> 3');
        expect(html).toContain('<span style="font-weight: bold;">D.</span> 6');
        expect(html).toContain('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM');
        expect(html).toContain('HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI');
        expect(html).toContain('Câu 1: Chọn đáp án B');
    });

    test('TC-02 metadata variants: maps known levels and defaults unknown levels to Nâng cao', () => {
        expect(renderPreview('Tỉ lệ', [], false, '4', 'co-ban')).toContain('Môn: Toán Lớp 4 - Mức độ: Cơ bản');
        expect(renderPreview('Tỉ lệ', [], false, '12', 'chat-luong-cao')).toContain('Môn: Toán Lớp 12 - Mức độ: Chất lượng cao AI');
        expect(renderPreview('Tỉ lệ', [], false, '7', 'unexpected')).toContain('Môn: Toán Lớp 7 - Mức độ: Nâng cao');
    });

    test('TC-03 10-question numbering: numbers supplied questions 1 through 10, while the answer-table columns are always 1 through 10', () => {
        const html = renderPreview('Mười câu', Array.from({ length: 10 }, (_, index) => makeQuestion({ questionText: `Nội dung ${index + 1}` })), false);

        expect(html).toContain('Câu 1: Nội dung 1');
        expect(html).toContain('Câu 10: Nội dung 10');
        expect((html.match(/Câu 10:/g) || []).length).toBe(1);
        expect(html).toContain('<td style="border: 1px solid #000000; padding: 6px;">10</td>');
    });

    test('TC-04 options: strips only an A-D prefix, preserves supplied order, and renders every supplied option label', () => {
        const html = renderPreview('Phương án', [makeQuestion({ options: ['A) first', 'B: second', 'C - third', 'D fourth', 'E. extra'] })], false);

        expect(html).toContain('>A.</span> first');
        expect(html).toContain('>B.</span> second');
        expect(html).toContain('>C.</span> third');
        expect(html).toContain('>D.</span> fourth');
        expect(html).toContain('>undefined.</span> E. extra');
    });

    test('TC-05 answer key: is excluded with includeSolution=false and includes index-derived letters on a separate page when true', () => {
        const list = [makeQuestion({ correctIndex: 0 }), makeQuestion({ correctIndex: 2 })];
        const withoutSolutions = renderPreview('Đáp án', list, false);
        const withSolutions = renderPreview('Đáp án', list, true);

        expect(withoutSolutions).not.toContain('1. BẢNG ĐÁP ÁN NHANH');
        expect(withSolutions).toContain('1. BẢNG ĐÁP ÁN NHANH');
        expect(withSolutions).toContain('>A</td>');
        expect(withSolutions).toContain('>C</td>');
        expect(withSolutions).toContain('class="print-page-break"');
    });

    test('TC-06 solutions: uses solutionHtml, substitutes the documented placeholder when absent, and omits the whole page when disabled', () => {
        const html = renderPreview('Lời giải', [makeQuestion({ solutionHtml: '<b>Lời giải</b>' }), makeQuestion({ solutionHtml: '' })]);

        expect(html).toContain('<b>Lời giải</b>');
        expect(html).toContain('Đang cập nhật...');
        expect(renderPreview('Lời giải', [makeQuestion()], false)).not.toContain('Đang cập nhật...');
    });

    test('TC-07 hints/tips: ignores hint and emits a non-empty tip only in the solution page', () => {
        const withTip = renderPreview('Mẹo', [makeQuestion({ hint: 'Gợi ý không được in', tip: 'Mẹo <b>được in</b>' })]);
        const noTip = renderPreview('Mẹo', [makeQuestion({ hint: 'Gợi ý không được in', tip: '' })]);

        expect(withTip).not.toContain('Gợi ý không được in');
        expect(withTip).toContain('💡 Mẹo làm bài: Mẹo <b>được in</b>');
        expect(noTip).not.toContain('💡 Mẹo làm bài:');
    });

    test('TC-08 LaTex and TC-09 HTML-sensitive input: normalizes br tags only and otherwise interpolates text raw', () => {
        const html = renderPreview('<Title & "quote">', [makeQuestion({
            questionText: 'So sánh $\\frac{a}{b}$ <tag>&"\' <br> tiếp',
            options: ['A. $x^{2}$ & <i>one</i>', 'B. two'],
            solutionHtml: '\\cmd{z}<br> & <em>solution</em>',
            tip: 'tip & <strong>raw</strong>'
        })]);

        expect(html).toContain('Chuyên đề: <Title & "quote">');
        expect(html).toContain('$\\frac{a}{b}$ <tag>&"\' <br/> tiếp');
        expect(html).toContain('$x^{2}$ & <i>one</i>');
        expect(html).toContain('\\cmd{z}<br/> & <em>solution</em>');
        expect(html).toContain('tip & <strong>raw</strong>');
    });

    test('TC-10 missing optional fields and empty question list: accepts no options/solution/tip, while retaining fixed student answer-table markup', () => {
        const optionalMissing = renderPreview('Tối thiểu', [makeQuestion({ options: undefined, solutionHtml: undefined, tip: undefined })]);
        const empty = renderPreview('Rỗng', [], false);

        expect(optionalMissing).not.toContain('grid-template-columns');
        expect(optionalMissing).toContain('Đang cập nhật...');
        expect(empty).not.toContain('Câu 1:');
        expect(empty).toContain('PHẦN I. CÂU HỎI TRẮC NGHIỆM (10 câu hỏi)');
        expect(empty).toContain('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM');
    });

    test('TC-11 preview versus print: both paths receive identical generated markup before KaTeX delivery', () => {
        const args = ['So sánh giao hàng', [makeQuestion()], true, '9', 'kho'];
        const previewHtml = renderPreview(...args);
        delete elements['print-preview-modal'];
        delete elements['print-preview-paper'];
        questions.renderAndPrintStudentExam(...args);

        expect(elements['student-print-paper'].innerHTML).toBe(previewHtml);
        expect(savedHtml).toBe(previewHtml);
        expect(print).toHaveBeenCalledTimes(1);
        expect(renderMath).toHaveBeenCalledTimes(2);
    });

    test('TC-12 fallback delivery: creates paper, saves KaTeX-rendered paper HTML, then schedules print; preview only opens its modal', () => {
        renderPreview('Preview', [makeQuestion()], false);
        expect(elements['print-preview-modal'].classList.remove).toHaveBeenCalledWith('hidden');
        expect(questions.savePrintedPDFToServer).not.toHaveBeenCalled();
        expect(print).not.toHaveBeenCalled();

        delete elements['print-preview-modal'];
        delete elements['print-preview-paper'];
        questions.renderAndPrintStudentExam('Fallback', [makeQuestion()], false, '6', 'co-ban');
        expect(elements['student-print-paper']).toBeDefined();
        expect(questions.savePrintedPDFToServer).toHaveBeenCalledWith(elements['student-print-paper'].innerHTML);
        expect(print).toHaveBeenCalled();
    });

    test('TC-13 pure builder: produces the same markup delivered by the public entry point', () => {
        const list = [makeQuestion({ questionText: 'A<br>B' })];
        const metadata = { schoolName: global.app.config.schoolName, defaultStudentName: global.app.config.studentName };

        expect(StudentExamMarkup.buildStudentExamMarkup('Thuần', list, true, '6', 'kho', metadata))
            .toBe(renderPreview('Thuần', list, true, '6', 'kho'));
    });
});
