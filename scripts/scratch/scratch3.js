const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('js/english_data.js', 'utf8');
const sandbox = { window: {} };
const script = new vm.Script(code);
script.runInNewContext(sandbox);

const c6 = sandbox.ENGLISH_COURSE_DATA["6"];
if (c6 && c6.topics) {
    c6.topics.forEach(t => console.log(t.id, t.title));
}
