/**
 * GRADE 1 MATH - CHAPTER 1: SỐ VÀ PHÉP ĐẾM (0 - 10)
 */
(function(root) {
    'use strict';
    const Chapter1 = {
        generate(type, level, ctx) {
            const self = ctx || this;
            if (type.startsWith('l1-cac-so-') || type.startsWith('l1-so-sanh-')) {
                const a = self.randomInt ? self.randomInt(1, 10) : 5;
                const b = self.randomInt ? self.randomInt(1, 10) : 3;
                return {
                    type: 'trac-nghiem',
                    questionText: `Điền dấu thích hợp vào chỗ chấm: $${a} ... ${b}$`,
                    options: ['$>$', '$<$', '$=$', 'Không so sánh được'],
                    correctIndex: a > b ? 0 : (a < b ? 1 : 2),
                    hints: ['So sánh số tự nhiên trong phạm vi 10.'],
                    solutionHtml: `Vì $${a} ${a > b ? '>' : (a < b ? '<' : '=')} ${b}$.`,
                    tip: 'Số nào đếm sau thì lớn hơn.'
                };
            }
            return null;
        }
    };
    if (typeof window !== 'undefined') window.g1_chapter1 = Chapter1;
    if (typeof module !== 'undefined' && module.exports) module.exports = Chapter1;
})(typeof window !== 'undefined' ? window : global);
