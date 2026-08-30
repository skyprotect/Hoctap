#!/usr/bin/env node
/**
 * Simple source-code growth gate.
 * Configure extensions/thresholds for the project stack.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORED = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.next',
  'vendor', 'generated'
]);

const LIMITS = {
  '.js': 400,
  '.mjs': 400,
  '.cjs': 400,
  '.ts': 400,
  '.tsx': 400,
  '.jsx': 400,
  '.html': 300,
  '.css': 350
};

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
for (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  const limit = LIMITS[ext];
  if (!limit) continue;

  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).length;
  if (lines > limit) {
    console.error(`QUALITY GATE: ${path.relative(ROOT, file)} = ${lines} LOC (review threshold ${limit})`);
    failed = true;
  }
}

if (failed) {
  console.error('\nReview large files by cohesion and complexity. Do not split mechanically.');
  process.exit(1);
}

console.log('File growth gate: PASS');
