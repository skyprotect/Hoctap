#!/usr/bin/env node
/**
 * Quality Gate: File Growth & Complexity Check
 * Enforces file size review bands according to AGENT.md:
 * - JS/TS: <= 400 LOC (green/review band)
 * - HTML: <= 300 LOC
 * - CSS: <= 350 LOC
 * Monolithic datasets, game engine components, and SPA templates require explicit justified limits.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORED = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist-server',
  'build',
  'coverage',
  '.next',
  '.cache',
  'chrome_profile',
  'firebase_deploy',
  'test-results',
  'exported_exams',
  'backups',
  'chibi',
  'android_kiosk'
]);

const DEFAULT_LIMITS = {
  '.js': 400,
  '.mjs': 400,
  '.cjs': 400,
  '.ts': 400,
  '.tsx': 450,
  '.jsx': 400,
  '.html': 300,
  '.css': 350
};

const EXCEPTION_MARKERS = [
  /\/vendor\//i,
  /\/generated\//i,
  /\/lib\//i,
  /[.]min[.]/i
];

/**
 * Explicit Justified Exceptions with strict upper-bound caps (ADR-001)
 */
const JUSTIFIED_EXCEPTIONS = [
  { pattern: /^css[\\/]style\.css$/i, maxLines: 8000, reason: 'Bundled master stylesheet containing all 9 CSS modules' },
  { pattern: /^css[\\/]components\.css$/i, maxLines: 3000, reason: 'Core component, timeline, practice, and quiz runner styles' },
  { pattern: /^css[\\/]modals\.css$/i, maxLines: 1500, reason: 'Splash screen, login, and modal dialog system styles' },
  { pattern: /^css[\\/]layout\.css$/i, maxLines: 1500, reason: 'Application header, sidebar, split layout, and responsive grid styles' },
  { pattern: /^css[\\/]game\.css$/i, maxLines: 1200, reason: 'Tower defense game and hero skill styles' },
  { pattern: /^css[\\/]chat\.css$/i, maxLines: 900, reason: 'Chat and presence UI styles' },
  { pattern: /^css[\\/]english\.css$/i, maxLines: 900, reason: 'English learning module styles' },
  { pattern: /^css[\\/]parent\.css$/i, maxLines: 800, reason: 'Parent dashboard and video management styles' },
  { pattern: /^student\.html$/i, maxLines: 2500, reason: 'Student Single-Page Application root markup & inline SVG assets' },
  { pattern: /^parent\.html$/i, maxLines: 1200, reason: 'Parent Single-Page Application root markup' },
  { pattern: /^parent_remote\.html$/i, maxLines: 900, reason: 'Remote Parent SPA markup' },
  { pattern: /^data[\\/]grade_1[\\/]math[\\/]generator\.js$/i, maxLines: 1300, reason: 'Grade 1 Math exercise dataset & rules' },
  { pattern: /^data[\\/]grade_4[\\/]math[\\/]generator\.js$/i, maxLines: 1300, reason: 'Grade 4 Math exercise dataset & rules' },
  { pattern: /^data[\\/]grade_6[\\/]math[\\/]advanced\.js$/i, maxLines: 800, reason: 'Grade 6 Advanced Math question dataset' },
  { pattern: /^data[\\/]grade_6[\\/]math[\\/]exam7991\.js$/i, maxLines: 1400, reason: 'Grade 6 Math Exam 7991 dataset' },
  { pattern: /^data[\\/]grade_6[\\/]math[\\/]generators[\\/]/i, maxLines: 1300, reason: 'Grade 6 Chapter Math exercise generator datasets' },
  { pattern: /^data[\\/]grade_6[\\/]math[\\/]runner[\\/]practice_ui\.js$/i, maxLines: 2000, reason: 'Math practice canvas and interactive runner' },
  { pattern: /^data[\\/]grade_6[\\/]math[\\/]runner[\\/]print_exam\.js$/i, maxLines: 800, reason: 'Exam print layout generator' },
  { pattern: /^js[\\/]app\.js$/i, maxLines: 800, reason: 'Global window.app Façade orchestrator and backward-compatibility router' },
  { pattern: /^js[\\/]game[\\/]/i, maxLines: 2500, reason: 'Canvas 2D Tower Defense game engine and combat subsystems' },
  { pattern: /^js[\\/]question-generator-worker\.js$/i, maxLines: 1500, reason: 'Dedicated Web Worker for background math question generation' },
  { pattern: /^scripts[\\/]maintenance[\\/]exams_auditor\.js$/i, maxLines: 700, reason: 'Question template pedagogical integrity checker script' },
  { pattern: /^scripts[\\/]maintenance[\\/]pronunciation-assessment[\\/]/i, maxLines: 1000, reason: 'Speech evaluation toolset' },
  { pattern: /^tests[\\/]characterization\.test\.js$/i, maxLines: 600, reason: 'Comprehensive characterization test suite' }
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (IGNORED.has(name)) continue;
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

let failed = false;
let passedFiles = 0;
let checkedFiles = 0;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const ext = path.extname(file).toLowerCase();
  const defaultLimit = DEFAULT_LIMITS[ext];
  if (!defaultLimit || EXCEPTION_MARKERS.some((r) => r.test(rel))) continue;

  checkedFiles++;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).length;

  // Check if file matches justified exceptions
  const exception = JUSTIFIED_EXCEPTIONS.find((e) => e.pattern.test(rel));
  const effectiveLimit = exception ? exception.maxLines : defaultLimit;

  if (lines > effectiveLimit) {
    console.error(
      `FAIL: ${rel} = ${lines} LOC > ${effectiveLimit} (default: ${defaultLimit}). ` +
      (exception ? `Exceeded justified limit (${exception.reason}).` : 'Unjustified file growth.')
    );
    failed = true;
  } else {
    passedFiles++;
  }
}

console.log(`Quality Gate [File Growth]: Checked ${checkedFiles} files. Passed: ${passedFiles}/${checkedFiles}.`);
if (failed) {
  process.exit(1);
} else {
  console.log('PASS: All files adhere to architectural growth limits and justified exceptions.');
  process.exit(0);
}
