/**
 * passive-listening-service — Dịch vụ quản lý nội dung và Playlist nghe tiếng Anh thụ động (v15.12).
 * Thiết kế chuẩn CEFR Young Learners (Pre-A1, A1, A2).
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.PassiveListeningService = api;
    if (typeof window !== 'undefined') {
        window.PassiveListeningService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.PassiveListeningService = api;
    }
    if (typeof self !== 'undefined') {
        self.PassiveListeningService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let manifestCache = null;
    const STORAGE_KEY_PROGRESS = 'hoctap_passive_listening_progress_v15_12';
    const STORAGE_KEY_SETTINGS = 'hoctap_passive_listening_settings_v15_12';

    const DEFAULT_SETTINGS = {
        startupEnabled: true,
        sessionTimerMinutes: 15,
        autoNext: true,
        preferredLevel: 'auto',
        volume: 0.95
    };

    /**
     * Nạp manifest của Passive Listening
     */
    async function loadManifest() {
        if (manifestCache && Object.keys(manifestCache).length > 0) return manifestCache;

        // 1. Môi trường Node.js
        if (typeof require === 'function' && typeof process !== 'undefined' && process.versions && process.versions.node) {
            try {
                const fs = require('fs');
                const path = require('path');
                const p = path.resolve(__dirname, '../../sounds/english/passive-listening-manifest.json');
                if (fs.existsSync(p)) {
                    manifestCache = JSON.parse(fs.readFileSync(p, 'utf8'));
                    return manifestCache;
                }
            } catch (e) {}
        }

        // 2. Môi trường Trình duyệt (Browser)
        if (typeof fetch !== 'undefined') {
            const urls = ['sounds/english/passive-listening-manifest.json?v=15.12', '/sounds/english/passive-listening-manifest.json?v=15.12'];
            for (const u of urls) {
                try {
                    const res = await fetch(u);
                    if (res.ok) {
                        manifestCache = await res.json();
                        return manifestCache;
                    }
                } catch (e) {}
            }
        }

        return {};
    }

    /**
     * Lấy danh sách toàn bộ các bài nghe theo bộ lọc
     */
    async function getLessons(filter = {}) {
        const manifest = await loadManifest();
        let items = Object.values(manifest);

        if (filter.level && filter.level !== 'all') {
            items = items.filter(it => it.level.toLowerCase() === filter.level.toLowerCase());
        }
        if (filter.topic && filter.topic !== 'all') {
            items = items.filter(it => it.topic.toLowerCase() === filter.topic.toLowerCase());
        }
        if (filter.maxDuration) {
            items = items.filter(it => it.durationSec <= filter.maxDuration);
        }

        return items;
    }

    /**
     * Lấy bài nghe theo ID cụ thể
     */
    async function getLessonById(lessonId) {
        const manifest = await loadManifest();
        return manifest[lessonId] || null;
    }

    /**
     * Lấy tiến độ học tập (Spaced Review nhẹ: NEW -> FAMILIAR -> REVIEW -> MASTERED)
     */
    function getProgressStore() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
                return raw ? JSON.parse(raw) : {};
            }
        } catch (e) {}
        return {};
    }

    function saveProgress(lessonId, listenDurationSec, completed = false) {
        try {
            if (typeof localStorage === 'undefined') return;
            const store = getProgressStore();
            const rec = store[lessonId] || {
                lessonId: lessonId,
                playCount: 0,
                completedCount: 0,
                totalListenSec: 0,
                status: 'NEW', // NEW, FAMILIAR, REVIEW, MASTERED
                lastPlayedAt: 0
            };

            rec.playCount++;
            rec.totalListenSec += Math.round(listenDurationSec || 0);
            rec.lastPlayedAt = Date.now();
            if (completed) {
                rec.completedCount++;
            }

            if (rec.completedCount >= 5) rec.status = 'MASTERED';
            else if (rec.completedCount >= 2) rec.status = 'REVIEW';
            else if (rec.playCount >= 1) rec.status = 'FAMILIAR';

            store[lessonId] = rec;
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(store));
        } catch (e) {
            console.warn('[PassiveListeningService] Lỗi lưu tiến độ:', e);
        }
    }

    /**
     * Quản lý cấu hình Settings
     */
    function getSettings() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
                if (raw) {
                    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
                }
            }
        } catch (e) {}
        return { ...DEFAULT_SETTINGS };
    }

    function saveSettings(settings) {
        try {
            if (typeof localStorage !== 'undefined') {
                const merged = { ...getSettings(), ...settings };
                localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
                return merged;
            }
        } catch (e) {}
        return settings;
    }

    /**
     * Lấy manifest dạng chuẩn hóa kèm mảng lessons
     */
    async function getManifest() {
        const m = await loadManifest();
        const lessons = Array.isArray(m.lessons) ? m.lessons : Object.values(m).filter(x => x && typeof x === 'object' && x.id);
        return {
            lessons: lessons,
            ...m
        };
    }

    /**
     * Suy luận cấp độ nghe phù hợp từ hồ sơ học sinh
     */
    function resolveStudentLevel(studentProfile = {}) {
        if (typeof studentProfile === 'string') {
            const upper = studentProfile.toUpperCase();
            if (upper === 'PRE-A1' || upper === 'A1' || upper === 'A2') return upper === 'PRE-A1' ? 'Pre-A1' : upper;
            if (studentProfile === 'std_baongoc' || studentProfile === '1' || studentProfile === '2') return 'Pre-A1';
            if (studentProfile === 'std_tyc0gfnkz' || studentProfile === '3' || studentProfile === '4') return 'A1';
            if (studentProfile === 'std_htsj4gbmo' || studentProfile === '5' || studentProfile === '6') return 'A2';
            const num = parseInt(studentProfile, 10);
            if (!isNaN(num)) {
                if (num <= 2) return 'Pre-A1';
                if (num <= 5) return 'A1';
                return 'A2';
            }
        }
        if (typeof studentProfile === 'number') {
            if (studentProfile <= 2) return 'Pre-A1';
            if (studentProfile <= 5) return 'A1';
            return 'A2';
        }

        const settings = getSettings();
        if (settings.preferredLevel && settings.preferredLevel !== 'auto') {
            return settings.preferredLevel;
        }

        // Ưu tiên proficiency nếu có
        if (studentProfile && studentProfile.englishProficiency) {
            const p = studentProfile.englishProficiency.toUpperCase();
            if (p.includes('A2')) return 'A2';
            if (p.includes('A1')) return 'A1';
            if (p.includes('PRE')) return 'Pre-A1';
        }

        // Fallback theo khối lớp hoặc ID
        const studentId = studentProfile ? (studentProfile.id || studentProfile.studentId || '') : '';
        const rawGrade = studentProfile ? (studentProfile.classLevel || studentProfile.grade) : null;
        const grade = typeof rawGrade === 'string' ? parseInt(rawGrade, 10) : rawGrade;

        if (studentId === 'std_baongoc' || grade === 1 || grade === 2) {
            return 'Pre-A1';
        }
        if (studentId === 'std_tyc0gfnkz' || grade === 3 || grade === 4) {
            return 'A1';
        }
        if (studentId === 'std_htsj4gbmo' || grade === 5 || grade === 6) {
            return 'A2';
        }

        return 'A1';
    }

    /**
     * Thuật toán chọn bài nghe khởi động thông minh (Startup Session Selection)
     */
    async function selectStartupSession(studentProfile = {}) {
        const level = resolveStudentLevel(studentProfile);
        const manifest = await loadManifest();
        const allLessons = Object.values(manifest);
        const targetLessons = allLessons.filter(l => l.level.toLowerCase() === level.toLowerCase());

        if (targetLessons.length === 0) {
            return allLessons[0] || null;
        }

        const progressStore = getProgressStore();
        const dayOfYear = Math.floor(Date.now() / 86400000);

        // 1. Phân nhóm bài nghe theo trạng thái
        const unseenLessons = [];
        const reviewLessons = [];
        const familiarLessons = [];

        targetLessons.forEach(l => {
            const p = progressStore[l.id];
            if (!p || p.playCount === 0) {
                unseenLessons.push(l);
            } else if (p.status === 'REVIEW') {
                reviewLessons.push(l);
            } else {
                familiarLessons.push(l);
            }
        });

        // 2. Thuật toán chọn bài:
        // - Nếu có bài chưa nghe (UNSEEN): Ưu tiên bài chưa nghe
        // - Nếu là học sinh mới tinh (tổng số bài đã nghe = 0): Chọn bài ngắn nhất trong các chủ đề gần gũi (greetings, animals, school)
        let selected = null;
        let selectionReason = '';

        const totalPlayed = Object.keys(progressStore).length;
        if (totalPlayed === 0 && unseenLessons.length > 0) {
            // First ever session: ưu tiên bài ngắn, chủ đề thân thuộc
            const familiarTopics = ['greetings', 'animals', 'classroom english', 'family', 'school'];
            const familiarPool = unseenLessons.filter(l => familiarTopics.includes(l.topic.toLowerCase()));
            const pool = familiarPool.length > 0 ? familiarPool : unseenLessons;
            pool.sort((a, b) => (a.durationSec || 0) - (b.durationSec || 0));
            selected = pool[0];
            selectionReason = 'first_session_short_duration_familiar_topic';
        } else if (unseenLessons.length > 0) {
            // Daily rotation trên danh sách bài chưa nghe
            const idx = dayOfYear % unseenLessons.length;
            selected = unseenLessons[idx];
            selectionReason = 'unseen_content_daily_rotation';
        } else if (reviewLessons.length > 0) {
            // Cần ôn tập
            reviewLessons.sort((a, b) => {
                const timeA = progressStore[a.id]?.lastPlayedAt || 0;
                const timeB = progressStore[b.id]?.lastPlayedAt || 0;
                return timeA - timeB; // Bài lâu chưa nghe nhất
            });
            selected = reviewLessons[0];
            selectionReason = 'spaced_review_oldest_first';
        } else {
            // Luân phiên toàn bộ theo ngày
            const idx = dayOfYear % targetLessons.length;
            selected = targetLessons[idx];
            selectionReason = 'all_mastered_daily_rotation';
        }

        console.log(`[PassiveListeningService] Selected startup session: ${selected?.id} (${selected?.title}) | Level: ${level} | Reason: ${selectionReason}`);

        return {
            lesson: selected,
            level: level,
            reason: selectionReason
        };
    }

    /**
     * Xây dựng hàng đợi khởi động (Startup Passive Queue: 3 - 5 bài liên tiếp)
     */
    async function buildStartupQueue(studentProfile = {}, queueSize = 4) {
        const startupSelection = await selectStartupSession(studentProfile);
        const firstLesson = startupSelection.lesson;
        if (!firstLesson) return [];

        const level = startupSelection.level;
        const manifest = await loadManifest();
        const targetLessons = Object.values(manifest).filter(l => l.level.toLowerCase() === level.toLowerCase());

        const queue = [firstLesson];
        const usedIds = new Set([firstLesson.id]);
        const usedTopics = new Set([firstLesson.topic.toLowerCase()]);

        // Thêm các bài tiếp theo đa dạng chủ đề và độ dài tăng dần
        const candidates = targetLessons.filter(l => !usedIds.has(l.id));

        // Ưu tiên chủ đề khác với bài trước
        candidates.sort((a, b) => {
            const hasTopicA = usedTopics.has(a.topic.toLowerCase()) ? 1 : 0;
            const hasTopicB = usedTopics.has(b.topic.toLowerCase()) ? 1 : 0;
            if (hasTopicA !== hasTopicB) return hasTopicA - hasTopicB;
            return (a.durationSec || 0) - (b.durationSec || 0);
        });

        for (const cand of candidates) {
            if (queue.length >= queueSize) break;
            queue.push(cand);
            usedIds.add(cand.id);
            usedTopics.add(cand.topic.toLowerCase());
        }

        return queue;
    }

    /**
     * Tạo Playlist thông minh theo bộ lọc
     */
    async function buildSmartPlaylist(options = {}) {
        const lessons = await getLessons(options);
        const store = getProgressStore();

        const statusPriority = { 'NEW': 0, 'REVIEW': 1, 'FAMILIAR': 2, 'MASTERED': 3 };

        return lessons.sort((a, b) => {
            const statA = store[a.id]?.status || 'NEW';
            const statB = store[b.id]?.status || 'NEW';
            if (statusPriority[statA] !== statusPriority[statB]) {
                return statusPriority[statA] - statusPriority[statB];
            }
            return (a.durationSec || 0) - (b.durationSec || 0);
        });
    }

    return {
        loadManifest: loadManifest,
        getManifest: getManifest,
        getLessons: getLessons,
        getLessonById: getLessonById,
        getProgressStore: getProgressStore,
        saveProgress: saveProgress,
        getSettings: getSettings,
        saveSettings: saveSettings,
        resolveStudentLevel: resolveStudentLevel,
        selectStartupSession: selectStartupSession,
        buildStartupQueue: buildStartupQueue,
        buildSmartPlaylist: buildSmartPlaylist
    };
});
