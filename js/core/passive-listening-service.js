/**
 * passive-listening-service — Dịch vụ quản lý nội dung và Playlist nghe tiếng Anh thụ động (v15.9).
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
    const STORAGE_KEY_PROGRESS = 'hoctap_passive_listening_progress_v15_9';
    const STORAGE_KEY_SETTINGS = 'hoctap_passive_listening_settings_v15_9';

    /**
     * Nạp manifest của Passive Listening
     */
    async function loadManifest() {
        if (manifestCache) return manifestCache;

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
            try {
                const res = await fetch('sounds/english/passive-listening-manifest.json?v=15.9');
                if (res.ok) {
                    manifestCache = await res.json();
                    return manifestCache;
                }
            } catch (e) {
                console.warn('[PassiveListeningService] Không thể fetch manifest:', e);
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
     * Tạo Playlist Engine có chủ đích (Vocabulary Overlap & Level Progression)
     */
    async function buildSmartPlaylist(options = {}) {
        const lessons = await getLessons(options);
        const store = getProgressStore();

        // Sắp xếp: Ưu tiên NEW -> FAMILIAR -> REVIEW -> MASTERED (Vocabulary Recycling)
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
        getLessons: getLessons,
        getLessonById: getLessonById,
        getProgressStore: getProgressStore,
        saveProgress: saveProgress,
        buildSmartPlaylist: buildSmartPlaylist
    };
});
