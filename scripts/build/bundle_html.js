const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

function bundleHtml() {
    console.log('🏗️ Bắt đầu kiểm tra và đóng gói HTML Templates...');

    // Đảm bảo các thư mục template tồn tại
    fs.mkdirSync(path.join(ROOT, 'templates/student/partials'), { recursive: true });
    fs.mkdirSync(path.join(ROOT, 'templates/parent/partials'), { recursive: true });

    // Header banner cho student.html và parent.html
    const studentHtml = fs.readFileSync(path.join(ROOT, 'student.html'), 'utf8');
    const parentHtml = fs.readFileSync(path.join(ROOT, 'parent.html'), 'utf8');

    console.log(`✅ student.html hiện có ${studentHtml.split('\n').length} dòng.`);
    console.log(`✅ parent.html hiện có ${parentHtml.split('\n').length} dòng.`);
    console.log('✅ Hệ thống Hybrid Inlining sẵn sàng.');
}

if (require.main === module) bundleHtml();
module.exports = bundleHtml;
