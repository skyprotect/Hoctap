const { chromium } = require('playwright-core');
const app = require('../server.js');
const fs = require('fs');

async function debugBrowser() {
    console.log('=== BẮT ĐẦU KIỂM THỬ TRÊN TRÌNH DUYỆT THỰC TẾ (v13.55) ===');
    
    // Đợi server khởi động
    await new Promise(r => setTimeout(r, 2000));
    
    let browser;
    const chromePath = 'C:\\Users\\skypr\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
    try {
        const launchOptions = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };
        if (fs.existsSync(chromePath)) {
            launchOptions.executablePath = chromePath;
        }
        browser = await chromium.launch(launchOptions);

        const context = await browser.newContext({
            viewport: { width: 1280, height: 800 }
        });
        const page = await context.newPage();

        const logs = [];
        const errors = [];

        page.on('console', msg => {
            const text = msg.text();
            logs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${text}`);
            if (msg.type() === 'error') {
                errors.push(`[CONSOLE ERROR] ${text}`);
            }
        });

        page.on('pageerror', err => {
            errors.push(`[PAGE ERROR] ${err.message}\n${err.stack}`);
        });

        let port = 3000;
        try {
            port = parseInt(fs.readFileSync('.port.tmp', 'utf-8'), 10) || 3000;
        } catch (e) {}

        console.log(`\n1. Điều hướng tới http://localhost:${port}/ ...`);
        await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(2000);

        // --- BƯỚC 1: KIỂM TRA MÀN HÌNH SPLASH ---
        console.log('\n2. Kiểm tra Màn hình Splash Screen:');
        const splashData = await page.evaluate(() => {
            return {
                time: document.getElementById('splash-clock-time')?.textContent,
                date: document.getElementById('splash-clock-date')?.textContent,
                quoteText: document.getElementById('splash-quote-text')?.textContent,
                quoteAuthor: document.getElementById('splash-quote-author')?.textContent,
                xp: document.getElementById('splash-xp-val')?.textContent,
                streak: document.getElementById('splash-streak-val')?.textContent,
                badges: document.getElementById('splash-badge-count')?.textContent,
                welcomeUser: document.querySelector('.splash-welcome-user')?.textContent,
                isSplashVisible: !document.getElementById('splash-screen')?.classList.contains('hidden'),
                versionTag: document.querySelector('.splash-version-tag')?.textContent,
                fixedVersionTag: document.querySelector('.version-tag-fixed')?.textContent
            };
        });
        console.log('Splash State:', JSON.stringify(splashData, null, 2));

        // --- BƯỚC 2: BẤM NÚT BẮT ĐẦU HỌC TẬP ---
        console.log('\n3. Bấm nút Bắt đầu học tập (Enter App):');
        await page.click('#splash-start-btn');
        await page.waitForTimeout(1500);

        const timelineStateSem1 = await page.evaluate(() => {
            const screenTimelineVisible = !document.getElementById('screen-timeline')?.classList.contains('hidden');
            const chapters = document.querySelectorAll('#skill-tree-container .timeline-chapter');
            const lessons = document.querySelectorAll('#skill-tree-container .lesson-node-wrapper');
            const headerXp = document.getElementById('xp-val')?.textContent;
            const headerStreak = document.getElementById('streak-val')?.textContent;
            const headerBadge = document.getElementById('badge-count')?.textContent;

            return {
                screenTimelineVisible,
                chaptersCount: chapters.length,
                lessonsCount: lessons.length,
                sem1Active: document.getElementById('sem-tab-1')?.classList.contains('active'),
                sem2Active: document.getElementById('sem-tab-2')?.classList.contains('active'),
                headerXp,
                headerStreak,
                headerBadge
            };
        });
        console.log('Timeline HK1 State:', JSON.stringify(timelineStateSem1, null, 2));

        // --- BƯỚC 3: KIỂM TRA ĐỀ THI ĐỊNH KỲ 7991 ---
        console.log('\n4. Kiểm tra Module Đề Thi Định Kỳ 7991 (70% TN + 30% TL):');
        const exam7991Check = await page.evaluate(() => {
            const hasModule = typeof window.questions7991 !== 'undefined';
            if (!hasModule) return { hasModule: false };
            
            const gk1 = window.questions7991.generate7991Exam('gk1', '6');
            const ck1 = window.questions7991.generate7991Exam('ck1', '6');
            return {
                hasModule: true,
                gk1Title: gk1.title,
                gk1TotalPoints: gk1.totalPoints,
                gk1Mcq: gk1.mcqQuestions ? gk1.mcqQuestions.length : 0,
                gk1Essay: gk1.essayQuestions ? gk1.essayQuestions.length : 0,
                ck1Title: ck1.title,
                ck1TotalPoints: ck1.totalPoints,
                ck1Mcq: ck1.mcqQuestions ? ck1.mcqQuestions.length : 0,
                ck1Essay: ck1.essayQuestions ? ck1.essayQuestions.length : 0
            };
        });
        console.log('Exam 7991 Check:', JSON.stringify(exam7991Check, null, 2));

        // --- BƯỚC 4: BẤM CHUYỂN SANG HỌC KỲ 2 ---
        console.log('\n5. Bấm chuyển sang Học kỳ 2:');
        await page.click('#sem-tab-2');
        await page.waitForTimeout(1000);

        const timelineStateSem2 = await page.evaluate(() => {
            const chapters = document.querySelectorAll('#skill-tree-container .timeline-chapter');
            const lessons = document.querySelectorAll('#skill-tree-container .lesson-node-wrapper');
            return {
                sem1Active: document.getElementById('sem-tab-1')?.classList.contains('active'),
                sem2Active: document.getElementById('sem-tab-2')?.classList.contains('active'),
                chaptersCount: chapters.length,
                lessonsCount: lessons.length
            };
        });
        console.log('Timeline HK2 State:', JSON.stringify(timelineStateSem2, null, 2));

        // Quay lại HK1 và mở một bài học
        console.log('\n6. Quay lại HK1 và Mở bài học chi tiết:');
        await page.click('#sem-tab-1');
        await page.waitForTimeout(1000);

        const firstLesson = await page.$('#skill-tree-container .node-btn.active') || await page.$('#skill-tree-container .node-btn');
        if (firstLesson) {
            await firstLesson.click();
            await page.waitForTimeout(1500);

            const lessonDetailState = await page.evaluate(() => {
                const detailPanel = document.getElementById('lesson-detail-panel');
                const welcomePanel = document.getElementById('welcome-viewer-panel');
                const title = document.getElementById('current-lesson-title')?.textContent;
                const subtopics = document.querySelectorAll('#subtopics-list-container .subtopic-item-card');
                const hasVideo = !!document.querySelector('#video-wrapper iframe');
                const hasMethod = (document.getElementById('subtopic-method-html')?.textContent || '').length > 10;

                return {
                    detailPanelVisible: detailPanel && !detailPanel.classList.contains('hidden'),
                    welcomePanelHidden: welcomePanel && welcomePanel.classList.contains('hidden'),
                    lessonTitle: title,
                    subtopicsCount: subtopics.length,
                    hasVideo,
                    hasMethod
                };
            });
            console.log('Lesson Detail State:', JSON.stringify(lessonDetailState, null, 2));
        }

        // --- BƯỚC 5: BẤM NÚT ĐỔI MÔN HỌC ---
        console.log('\n7. Bấm nút Đổi môn học (#header-select-subject-btn):');
        await page.click('#header-select-subject-btn');
        await page.waitForTimeout(1000);

        const subjectScreenState = await page.evaluate(() => {
            const screen = document.getElementById('screen-subject-select');
            const mathCard = document.querySelector('.subject-card.math-card');
            const englishCard = document.querySelector('.subject-card.english-card');

            return {
                subjectScreenVisible: screen && !screen.classList.contains('hidden'),
                hasMathCard: !!mathCard,
                hasEnglishCard: !!englishCard,
                mathCardTitle: mathCard?.querySelector('h3')?.textContent,
                englishCardTitle: englishCard?.querySelector('h3')?.textContent
            };
        });
        console.log('Subject Select Screen State:', JSON.stringify(subjectScreenState, null, 2));

        // --- BƯỚC 6: CHỌN MÔN TOÁN HỌC TRỞ LẠI ---
        console.log('\n8. Bấm chọn môn Toán Học:');
        const mathCardBtn = await page.$('.subject-card.math-card');
        if (mathCardBtn) {
            await mathCardBtn.click();
            await page.waitForTimeout(1000);
        }
        const backToMathState = await page.evaluate(() => {
            return {
                timelineVisible: !document.getElementById('screen-timeline')?.classList.contains('hidden'),
                lessonsCount: document.querySelectorAll('#skill-tree-container .lesson-node-wrapper').length
            };
        });
        console.log('Back to Math State:', JSON.stringify(backToMathState, null, 2));

        // In danh sách lỗi nếu có
        console.log('\n=== TỔNG HỢP LỖI BROWSER ===');
        console.log('Errors count:', errors.length);
        if (errors.length > 0) {
            errors.forEach(e => console.error(e));
        } else {
            console.log('🎉 0 LỖI! Tất cả các chức năng hoạt động hoàn hảo và mượt mà!');
        }

    } catch (err) {
        console.error('Debug script error:', err);
    } finally {
        if (browser) await browser.close();
        process.exit(0);
    }
}

debugBrowser();
