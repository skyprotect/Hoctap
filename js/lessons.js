/**
 * CURRICULUM SYLLABUS & VIDEO LOADER (v13.40)
 * Tự động nạp dữ liệu chương trình học từ data/curriculum/
 */
(function(root) {
    'use strict';

    // Dữ liệu nhúng sẵn dự phòng offline
    const SUBTOPIC_VIDEOS = (function() {
        if (typeof module !== 'undefined' && module.exports) {
            try {
                const p = path.resolve(__dirname, '../data/curriculum/subtopic_videos.json');
                return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
            } catch (e) { return {}; }
        }
        return {};
    })();

    const SYSTEM_SUBJECTS = {
        "math": { id: "math", name: "Toán Học", icon: "fa-calculator", gradient: "from-blue-600 to-indigo-600" },
        "english": { id: "english", name: "Tiếng Anh", icon: "fa-language", gradient: "from-emerald-600 to-teal-600" }
    };

    let COURSE_DATA = [];

    async function loadCurriculum() {
        if (COURSE_DATA && COURSE_DATA.length > 0) return COURSE_DATA;
        if (typeof LazyLoader !== 'undefined' && typeof LazyLoader.loadJSON === 'function') {
            const data = await LazyLoader.loadJSON('data/curriculum/course_data.json');
            if (data) COURSE_DATA = data;
        } else if (typeof fetch !== 'undefined') {
            try {
                const res = await fetch('data/curriculum/course_data.json');
                if (res.ok) COURSE_DATA = await res.json();
            } catch (e) {}
        }
        if (typeof window !== 'undefined') {
            window.COURSE_DATA = COURSE_DATA;
            window.SUBTOPIC_VIDEOS = SUBTOPIC_VIDEOS;
            window.SYSTEM_SUBJECTS = SYSTEM_SUBJECTS;
        }
        return COURSE_DATA;
    }

    if (typeof window !== 'undefined') {
        window.SUBTOPIC_VIDEOS = SUBTOPIC_VIDEOS;
        window.SYSTEM_SUBJECTS = SYSTEM_SUBJECTS;
        window.COURSE_DATA = COURSE_DATA;
        window.loadCurriculum = loadCurriculum;
        loadCurriculum().catch(() => {});
    }

    if (typeof module !== 'undefined' && module.exports) {
        try {
            const cp = path.resolve(__dirname, '../data/curriculum/course_data.json');
            const svp = path.resolve(__dirname, '../data/curriculum/subtopic_videos.json');
            const cData = fs.existsSync(cp) ? JSON.parse(fs.readFileSync(cp, 'utf8')) : [];
            const svData = fs.existsSync(svp) ? JSON.parse(fs.readFileSync(svp, 'utf8')) : {};
            module.exports = {
                SUBTOPIC_VIDEOS: svData,
                SYSTEM_SUBJECTS,
                COURSE_DATA: cData,
                loadCurriculum
            };
        } catch (e) {
            module.exports = { SUBTOPIC_VIDEOS: {}, SYSTEM_SUBJECTS, COURSE_DATA: [], loadCurriculum };
        }
    }
})(typeof window !== 'undefined' ? window : global);
