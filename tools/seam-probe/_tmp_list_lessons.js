// temp helper script to query lessons
global.ENGLISH_COURSE_DATA = {};
const lessonsCode = require('fs').readFileSync('js/lessons.js', 'utf8');
const vm = require('vm');
const ctx = { ENGLISH_COURSE_DATA: global.ENGLISH_COURSE_DATA };
vm.createContext(ctx);
vm.runInContext(lessonsCode, ctx);
const COURSE_DATA = ctx.COURSE_DATA;
if (!COURSE_DATA) { console.log('COURSE_DATA not defined in ctx'); process.exit(1); }
console.log('COURSE_DATA length:', COURSE_DATA.length);
const c6 = COURSE_DATA.filter(c => (c.class || '6') === '6' && !c.subject);
console.log('Class 6 math chapters:', c6.length);
c6.forEach(ch => {
    ch.lessons.forEach(l => {
        console.log(`S${ch.semester} | ${l.id.padEnd(12)} | ${l.title.substring(0,50)}`);
    });
});
