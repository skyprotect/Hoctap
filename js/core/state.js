/**
 * CENTRALIZED STATE MANAGEMENT
 * Quản lý trạng thái tập trung cho học sinh, môn học và thẻ năng lực
 * Bridge Pattern: Đồng bộ tuyệt đối window.app === window.AppState
 */
(function() {
    'use strict';

    const safeStorage = {
        fallback: {},
        getItem: function(key) {
            try { return localStorage.getItem(key); }
            catch(e) { console.warn("Storage.getItem failed:", e); return this.fallback[key] || null; }
        },
        setItem: function(key, value) {
            try { localStorage.setItem(key, value); }
            catch(e) { console.warn("Storage.setItem failed:", e); this.fallback[key] = value; }
        },
        removeItem: function(key) {
            try { localStorage.removeItem(key); }
            catch(e) { console.warn("Storage.removeItem failed:", e); delete this.fallback[key]; }
        }
    };

    function getDefaultState() {
        return {
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            scores: {},
            badges: [],
            goldBadges: [],
            history: [],
            distractions: 0,
            customVideos: {},
            parentPin: "123456",
            examSessions: [],
            completedSubtopics: [],
            subtopicScores: {},
            completedLessonTheory: [],
            subjects: {
                math: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [] },
                english: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [], skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 }, weakVocabulary: [] }
            },
            cardExchangeHistory: [],
            lastUpdated: new Date().toISOString()
        };
    }

    const AppState = {
        config: {
            parentName: "Phụ huynh",
            parentPin: "123456",
            studentName: "Trần Bình Minh",
            currentClass: "6",
            defaultStudentId: "std_htsj4gbmo",
            students: [
                { id: "std_htsj4gbmo", name: "Trần Bình Minh", parentName: "Phụ huynh", classLevel: "6" },
                { id: "std_baongoc", name: "Trần Bảo Ngọc", parentName: "Phụ huynh", classLevel: "1" },
                { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", parentName: "Phụ huynh", classLevel: "4" }
            ]
        },
        state: getDefaultState(),
        currentLesson: null,
        currentSubject: "math",
        currentSemester: 1,
        isDarkMode: true,
        pendingBadges: [],
        navHistory: [],
        justSentMessage: false,
        safeStorage: safeStorage,
        getDefaultState: getDefaultState
    };

    if (typeof window !== 'undefined') {
        window.safeStorage = safeStorage;
        window.AppState = AppState;
        // Bridge Pattern: window.app cùng tham chiếu tới window.AppState
        window.app = AppState;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { safeStorage, AppState };
    }
})();
