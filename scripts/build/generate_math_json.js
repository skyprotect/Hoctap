/**
 * HỌCTẬP SYSTEM — MATH JSON GENERATOR ORCHESTRATOR
 * Đóng gói và xuất các bộ đề mẫu Toán Lớp 6 từ thư mục math_templates/
 */

const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../../data/math/grade6');
fs.mkdirSync(outDir, { recursive: true });

const chapter1 = require('./math_templates/chapter1_naturals');
const chapter2 = require('./math_templates/chapter2_integers');
const chapter3 = require('./math_templates/chapter3_geometry');
const chapter4 = require('./math_templates/chapter4_statistics');
const chapter5 = require('./math_templates/chapter5_fractions');

function generateMathJson() {
    const files = [
        { name: 'chapter1_integers.json', data: chapter1 },
        { name: 'chapter2_fractions.json', data: chapter2 },
        { name: 'chapter3_geometry.json', data: chapter3 },
        { name: 'chapter4_statistics.json', data: chapter4 },
        { name: 'chapter5_ratios.json', data: chapter5 }
    ];

    for (const file of files) {
        const filePath = path.join(outDir, file.name);
        fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2), 'utf-8');
        console.log(`✅ Xuất thành công: ${file.name} (${file.data.templates.length} templates)`);
    }

    console.log('🎉 ĐÃ HOÀN TẤT TẠO 5 FILE JSON NGÂN HÀNG ĐỀ TOÁN LỚP 6!');
}

if (require.main === module) {
    generateMathJson();
}

module.exports = generateMathJson;
