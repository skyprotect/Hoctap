const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

function bundleCSS() {
    const modules = [
        'css/tokens.css',
        'css/base.css',
        'css/layout.css',
        'css/game.css',
        'css/modals.css',
        'css/chat.css',
        'css/game-overlay.css',
        'css/english.css',
        'css/components.css'
    ];

    let combined = `/**
 * HỌCTẬP SYSTEM — MASTER CSS STYLESHEET (v13.42)
 * Tự động đóng gói từ các module: tokens, base, layout, game, modals, chat, game-overlay, english, components
 */
`;

    modules.forEach(m => {
        const fullPath = path.join(ROOT, m);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            combined += `\n/* ===== MODULE: ${m} ===== */\n` + content + '\n';
        }
    });

    const target = path.join(ROOT, 'css/style.css');
    fs.writeFileSync(target, combined, 'utf8');
    console.log(`✅ Đã đóng gói thành công ${modules.length} module CSS thành css/style.css (${combined.split('\n').length} dòng).`);
}

if (require.main === module) {
    bundleCSS();
}

module.exports = bundleCSS;
module.exports.bundleCSS = bundleCSS;

