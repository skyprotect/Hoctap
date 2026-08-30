/**
 * ENGLISH LESSONS LOADER - GRADE 4 (On-Demand JSON Loader)
 */
(function(root) {
    'use strict';
    const Grade4English = {
        data: null,
        async load() {
            if (this.data) return this.data;
            if (typeof LazyLoader !== 'undefined' && typeof LazyLoader.loadJSON === 'function') {
                this.data = await LazyLoader.loadJSON('data/english/grade_4_lessons.json');
            } else if (typeof fetch !== 'undefined') {
                try {
                    const res = await fetch('data/english/grade_4_lessons.json');
                    if (res.ok) this.data = await res.json();
                } catch (e) {}
            }
            if (this.data && typeof window !== 'undefined') {
                window.ENGLISH_COURSE_DATA = window.ENGLISH_COURSE_DATA || {};
                window.ENGLISH_COURSE_DATA["4"] = this.data;
            }
            return this.data;
        }
    };
    if (typeof window !== 'undefined') {
        window.Grade4English = Grade4English;
        Grade4English.load().catch(() => {});
    }
    if (typeof module !== 'undefined' && module.exports) {
        try {
            const p = path.resolve(__dirname, '../../../data/english/grade_4_lessons.json');
            module.exports = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : { topics: [] };
        } catch (e) { module.exports = { topics: [] }; }
    }
})(typeof window !== 'undefined' ? window : global);
