/**
 * ENGLISH VOCABULARY DATA LOADER (v13.40)
 */
(function(root) {
    'use strict';
    const EnglishDataLoader = {
        dict: null,
        async load() {
            if (this.dict) return this.dict;
            if (typeof LazyLoader !== 'undefined' && typeof LazyLoader.loadJSON === 'function') {
                this.dict = await LazyLoader.loadJSON('data/english/vocabulary_dict.json');
            } else if (typeof fetch !== 'undefined') {
                try {
                    const res = await fetch('data/english/vocabulary_dict.json');
                    if (res.ok) this.dict = await res.json();
                } catch (e) {}
            }
            return this.dict || {};
        }
    };
    if (typeof window !== 'undefined') {
        window.EnglishDataLoader = EnglishDataLoader;
        window.ENGLISH_LESSONS_DATA = window.ENGLISH_LESSONS_DATA || {};
        EnglishDataLoader.load().then(d => { if (d) window.ENGLISH_LESSONS_DATA = d; }).catch(() => {});
    }
    if (typeof module !== 'undefined' && module.exports) {
        try {
            const p = path.resolve(__dirname, '../data/english/vocabulary_dict.json');
            module.exports = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
        } catch (e) { module.exports = {}; }
    }
})(typeof window !== 'undefined' ? window : global);
