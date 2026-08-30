/**
 * GRADE 4 MATH - CHAPTER 1: SỐ TỰ NHIÊN VÀ PHÉP TÍNH
 */
(function(root) {
    'use strict';
    const Chapter1 = {
        generate(type, level, ctx) {
            const self = ctx || this;
            if (type.startsWith('l4-on-tap-') || type.startsWith('l4-phep-tinh-')) {
                const a = self.randomInt ? self.randomInt(1000, 9999) : 1234;
                const b = self.randomInt ? self.randomInt(1000, 9999) : 5678;
                const ans = a + b;
                return {
                    type: 'trac-nghiem',
                    questionText: `Tính giá trị của biểu thức: $${a} + ${b}$`,
                    options: [`$${ans}$`, `$${ans + 10}$`, `$${ans - 10}$`, `$${ans + 100}$`],
                    correctIndex: 0,
                    hints: ['Thực hiện phép cộng đặt tính rồi tính.'],
                    solutionHtml: `Ta có: $${a} + ${b} = ${ans}$.`,
                    tip: 'Cộng lần lượt từ phải sang trái.'
                };
            }
            return null;
        }
    };
    if (typeof window !== 'undefined') window.g4_chapter1 = Chapter1;
    if (typeof module !== 'undefined' && module.exports) module.exports = Chapter1;
})(typeof window !== 'undefined' ? window : global);
