const fs = require('fs');
const code = fs.readFileSync('js/lessons.js', 'utf8');
let chapters = [];
let regex = /class:\s*['"]6['"].*?semester:\s*1.*?title:\s*['"](.*?)['"]/gs;
let match;
while(match = regex.exec(code)) chapters.push(match[1]);
console.log(chapters);
