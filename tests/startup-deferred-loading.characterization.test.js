/**
 * Startup deferred loading characterization.
 *
 * Freezes the contract that loadProgress() hydrates authoritative student
 * learning progress without awaiting non-critical English custom-topic network I/O,
 * and verifies that custom topics load post-boot with in-flight deduplication.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
const { ENGLISH_COURSE_DATA } = require('../js/core/english-course-data');

function createProductionAppHarness({ fetchMock, initialStorage = new Map() }) {
    const source = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
    const appRequire = Module.createRequire(path.resolve(__dirname, '../js/app.js'));
    const elements = new Map();

    function getElement(id) {
        if (!elements.has(id)) {
            elements.set(id, {
                id,
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn(() => false)
                },
                style: {},
                innerText: '',
                textContent: '',
                innerHTML: '',
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                querySelector: jest.fn(() => null),
                querySelectorAll: jest.fn(() => []),
                appendChild: jest.fn(),
                scrollIntoView: jest.fn()
            });
        }
        return elements.get(id);
    }

    const document = {
        readyState: 'complete',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getElementById: jest.fn(id => getElement(id)),
        querySelector: jest.fn(sel => getElement(sel)),
        querySelectorAll: jest.fn(() => []),
        createElement: jest.fn(tag => getElement(tag + '_' + Math.random())),
        body: getElement('body')
    };

    const safeStorage = {
        getItem: jest.fn(k => initialStorage.get(k) || null),
        setItem: jest.fn((k, v) => initialStorage.set(k, String(v))),
        removeItem: jest.fn(k => initialStorage.delete(k))
    };

    const window = {
        safeStorage,
        location: { protocol: 'http:' },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        COURSE_DATA: [
            {
                chapterId: 'ch1',
                chapterTitle: 'Chương 1',
                lessons: [
                    { id: 'math-ch1-les1', title: 'Bài 1: Tập hợp', semester: 1, subtopics: [{ id: 'sub1', title: 'Dạng 1' }] }
                ]
            }
        ],
        SYSTEM_SUBJECTS: {
            math: { id: 'math', name: 'Toán học', icon: 'fa-calculator', supportedClasses: ['6'] },
            english: { id: 'english', name: 'Tiếng Anh', icon: 'fa-language', supportedClasses: ['6'] }
        },
        ENGLISH_COURSE_DATA
    };

    const factory = new Function('window', 'document', 'fetch', 'require', 'console', 'SYSTEM_SUBJECTS', 'COURSE_DATA', 'ENGLISH_COURSE_DATA',
        `${source}; return window.app;`
    );

    const app = factory(window, document, fetchMock, appRequire, console, window.SYSTEM_SUBJECTS, window.COURSE_DATA, window.ENGLISH_COURSE_DATA);
    app.config = {
        ...app.config,
        currentClass: '6',
        defaultStudentId: 'std_test_deferred',
        studentName: 'Bình Minh'
    };

    return { app, document, window, safeStorage, elements };
}

describe('Startup Deferred Loading & loadProgress Contract', () => {
    test('1. loadProgress() resolves and hydrates student progress without awaiting custom topics', async () => {
        let customTopicsResolved = false;
        const fetchMock = jest.fn(async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('/api/load-progress')) {
                return {
                    ok: true,
                    json: async () => ({
                        xp: 500,
                        streak: 5,
                        scores: { 'math-ch1-les1': 100 },
                        completedSubtopics: ['sub1'],
                        subjects: {
                            math: {
                                scores: { 'math-ch1-les1': 100 },
                                completedSubtopics: ['sub1']
                            }
                        },
                        _revision: 1
                    })
                };
            }
            if (urlStr.includes('/api/custom-topics') || urlStr.includes('/api/custom-vocabulary')) {
                // Simulate slow 500ms custom topic network delay
                await new Promise(r => setTimeout(r, 500));
                customTopicsResolved = true;
                return { ok: true, json: async () => [] };
            }
            return { ok: true, json: async () => ({}) };
        });

        const { app } = createProductionAppHarness({ fetchMock });

        // loadProgress should resolve immediately once progress is loaded,
        // without waiting for the 500ms custom-topics delay
        const start = Date.now();
        await app.loadProgress();
        const duration = Date.now() - start;

        expect(duration).toBeLessThan(200); // Must resolve well before 500ms
        expect(app.state.xp).toBe(500);
        expect(app.state.streak).toBe(5);
        expect(app.state.scores['math-ch1-les1']).toBe(100);
        expect(customTopicsResolved).toBe(false); // custom-topics request is still pending or not awaited
    });

    test('2. in-flight deduplication: concurrent calls to loadCustomTopics share the same request', async () => {
        let customTopicFetchCount = 0;
        const fetchMock = jest.fn(async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('/api/custom-topics')) {
                customTopicFetchCount++;
                await new Promise(r => setTimeout(r, 50));
                return { ok: true, json: async () => [{ id: 'custom-1', title: 'Chủ đề từ cha mẹ' }] };
            }
            if (urlStr.includes('/api/custom-vocabulary')) {
                return { ok: true, json: async () => [{ id: 'vocab-1', word: 'hello', translation: 'xin chào', topic_id: 'custom-1' }] };
            }
            return { ok: true, json: async () => ({}) };
        });

        const { app } = createProductionAppHarness({ fetchMock });

        // Launch two concurrent calls (e.g. background post-boot + user opening vocab tab)
        const [res1, res2] = await Promise.all([
            app.loadCustomTopics(),
            app.loadCustomTopics()
        ]);

        expect(customTopicFetchCount).toBe(1); // Only 1 network request fired
        expect(app.customTopics).toHaveLength(1);
        expect(app.customTopics[0].id).toBe('custom-1');
        expect(app.customVocabulary).toHaveLength(1);
    });

    test('3. custom topic failure does not throw or corrupt state', async () => {
        const fetchMock = jest.fn(async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('/api/custom-topics') || urlStr.includes('/api/custom-vocabulary')) {
                return { ok: false, status: 500 };
            }
            return { ok: true, json: async () => ({}) };
        });

        const { app } = createProductionAppHarness({ fetchMock });

        await expect(app.loadCustomTopics()).resolves.not.toThrow();
        expect(app.customTopics).toEqual([]);
        expect(app.customVocabulary).toEqual([]);
    });

    test('4. renderEnglishMap renders core curriculum safely when custom topics are pending/empty', () => {
        const { app, elements } = createProductionAppHarness({ fetchMock: jest.fn() });
        app.customTopics = null;
        app.customVocabulary = null;
        app.currentEnglishSkill = 'listening';

        expect(() => app.renderEnglishMap()).not.toThrow();

        const container = elements.get('english-map-path-container');
        expect(container).toBeDefined();
        expect(container.appendChild).toHaveBeenCalled();
    });

    test('5. failed loadCustomTopics does not permanently poison future calls (resets promise on error)', async () => {
        let callCount = 0;
        const fetchMock = jest.fn(async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('/api/custom-topics')) {
                callCount++;
                if (callCount === 1) {
                    throw new Error('Network timeout');
                }
                return { ok: true, json: async () => [{ id: 'recovered-topic', title: 'Recovered Topic' }] };
            }
            if (urlStr.includes('/api/custom-vocabulary')) {
                return { ok: true, json: async () => [] };
            }
            return { ok: true, json: async () => ({}) };
        });

        const { app } = createProductionAppHarness({ fetchMock });

        // First call fails
        await app.loadCustomTopics();
        expect(app.customTopics).toEqual([]);
        expect(app._loadingCustomTopicsPromise).toBeNull();

        // Second call should NOT be permanently poisoned, it fetches afresh and succeeds
        await app.loadCustomTopics();
        expect(app.customTopics).toHaveLength(1);
        expect(app.customTopics[0].id).toBe('recovered-topic');
        expect(callCount).toBe(2);
    });

    test('6. loadProgress contract: preserves 3-attempt retry without custom-topic delay', async () => {
        let progressAttempts = 0;
        const fetchMock = jest.fn(async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('/api/load-progress')) {
                progressAttempts++;
                if (progressAttempts < 2) {
                    throw new Error('Transient connection error');
                }
                return {
                    ok: true,
                    json: async () => ({
                        xp: 150,
                        streak: 2,
                        scores: {},
                        completedSubtopics: []
                    })
                };
            }
            return { ok: true, json: async () => ({}) };
        });

        const { app } = createProductionAppHarness({ fetchMock });
        await app.loadProgress();

        expect(progressAttempts).toBe(2); // Retried after transient error
        expect(app.state.xp).toBe(150);
        expect(app.customTopics).toBeUndefined(); // loadProgress does NOT populate or touch customTopics
    });
});
