/**
 * Bootstrap DOM-lifecycle characterization.
 *
 * Third-party UI libraries must not render while student.html is still in
 * <head>, because document.body does not exist until parsing reaches <body>.
 */
'use strict';

const fs = require('fs');
const path = require('path');

describe('student bootstrap DOM lifecycle', () => {
    const studentHtml = fs.readFileSync(path.resolve(__dirname, '../student.html'), 'utf8');

    test('waits for DOMContentLoaded before auto-rendering KaTeX into document.body', () => {
        expect(studentHtml).not.toMatch(/auto-render\.min\.js"\s+onload=/);
        expect(studentHtml).toMatch(/document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*renderMathInElement\(document\.body\)/);
    });

    test('does not ask SweetAlert to render until document.body is available', () => {
        expect(studentHtml).toMatch(/if \(!document\.body\) \{[\s\S]*DOMContentLoaded[\s\S]*showSystemError/);
        expect(studentHtml).toMatch(/target: document\.body/);
    });
});
