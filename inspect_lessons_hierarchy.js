const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('f:/KHQS/AntiGravity/HocTap/js/lessons.js', 'utf8');
content += '\nmodule.exports = { COURSE_DATA };';

const tempFilePath = path.join(__dirname, 'temp_lessons_for_node.js');
fs.writeFileSync(tempFilePath, content, 'utf8');

const { COURSE_DATA } = require(tempFilePath);
fs.unlinkSync(tempFilePath);

const currentClass = "4";
COURSE_DATA
    .filter(chapter => (chapter.class || "6") === currentClass)
    .forEach(chapter => {
        console.log(`Chapter: ${chapter.title} (ID: ${chapter.id})`);
        console.log(`  class: ${chapter.class}`);
        console.log(`  semester: ${chapter.semester}`);
        console.log(`  lessons count: ${chapter.lessons.length}`);
        chapter.lessons.forEach(l => {
          console.log(`    Lesson ID: ${l.id}, Title: ${l.title}`);
        });
    });
