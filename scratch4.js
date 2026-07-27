const fs = require('fs');
const code = fs.readFileSync('js/lessons.js', 'utf8');
const vm = require('vm');
const sandbox = { COURSE_DATA: [], SUBTOPIC_VIDEOS: {} };
try {
    vm.runInNewContext(code + '\n; sandbox.COURSE_DATA = COURSE_DATA;', sandbox);
} catch(e) { console.error(e); }
let c6 = sandbox.COURSE_DATA.filter(c => String(c.class) === '6');
console.log("Total class 6 chapters:", c6.length);
let c6s1 = c6.filter(c => Number(c.semester) === 1);
c6s1.forEach(c => {
    console.log(c.title, "Semester:", c.semester);
    c.lessons.forEach(l => console.log('  ', l.id, l.title));
});
