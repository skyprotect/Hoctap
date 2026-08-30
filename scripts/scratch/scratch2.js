const fs = require('fs');
const code = fs.readFileSync('js/english_data.js', 'utf8');
let match = code.match(/const ENGLISH_COURSE_DATA = \[(.*)\];/s);
if (match) {
    console.log("Found ENGLISH_COURSE_DATA");
} else {
    console.log("Could not find ENGLISH_COURSE_DATA");
}
