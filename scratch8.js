const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('js/lessons.js', 'utf8');
const sandbox = { COURSE_DATA: [] };
try {
    vm.runInNewContext(code + '\n; sandbox.COURSE_DATA = COURSE_DATA;', sandbox);
} catch(e) {}
let scores = ["lt-c1-1","bai-3","bai-7","lt-c1-2","bai-1","bai-2","bai-4","bai-5","bai-6","bai-9","kt-c1","bai-8","bai-10","lt-c2-1","bai-11","bai-12","lt-c2-2","kt-c2","bai-13","bai-14","bai-15","lt-c3-1","bai-16","bai-17","lt-c3-2","kt-c3","bai-18","bai-19","lt-c4","bai-22","lt-c5","bai-23","bai-24","lt-c6-1","bai-20","kt-c4","bai-21"];

sandbox.COURSE_DATA.filter(c => (!c.class || c.class === '6') && c.semester === 1).forEach(c => {
    console.log(c.title);
    c.lessons.forEach(l => {
        if (!scores.includes(l.id)) {
            console.log('  [MISSING]', l.id, l.title);
        } else {
            console.log('  [OK]', l.id, l.title);
        }
    });
});
