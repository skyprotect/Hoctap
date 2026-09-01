/**
 * VERIFY:ALL — Chạy tất cả seam probes theo thứ tự
 * 
 * Chạy: node tools/seam-probe/verify-all.js [studentId]
 * Mặc định: std_htsj4gbmo
 */
'use strict';

const { execSync } = require('child_process');
const path = require('path');

const STUDENT_ID = process.argv[2] || 'std_htsj4gbmo';
const PROBE_DIR = path.resolve(__dirname);

const probes = [
    { name: 'verify:data',       file: 'probe-data.js',       args: [STUDENT_ID],    zone: 'ZONE 1 — DATA / HYDRATION' },
    { name: 'verify:curriculum', file: 'probe-curriculum.js', args: [STUDENT_ID],    zone: 'ZONE 2 — CURRICULUM / PROGRESSION' },
    { name: 'verify:questions',  file: 'probe-questions.js',  args: ['bai-1', STUDENT_ID], zone: 'ZONE 3 — QUESTION GENERATION' },
    { name: 'verify:lifecycle',  file: 'probe-lifecycle.js',  args: [],              zone: 'ZONE 4+5 — WORKER & LIFECYCLE' },
];

const PASS_MARK = '══════════════════════════════════════════════════════';

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   HOCTAP SYSTEM SEAM VERIFICATION HARNESS           ║');
console.log(`║   Student: ${STUDENT_ID.padEnd(42)}║`);
console.log(`║   ${new Date().toLocaleString('vi-VN').padEnd(52)}║`);
console.log('╚══════════════════════════════════════════════════════╝\n');

const summary = [];

for (const probe of probes) {
    console.log(`\n${'═'.repeat(56)}`);
    console.log(`  Running: ${probe.name}`);
    console.log(`  Zone   : ${probe.zone}`);
    console.log(`${'═'.repeat(56)}`);

    const argsStr = probe.args.join(' ');
    const cmd = `node "${path.join(PROBE_DIR, probe.file)}" ${argsStr}`;

    let status = 'PASS';
    let output = '';
    try {
        output = execSync(cmd, { cwd: path.resolve(PROBE_DIR, '../..'), encoding: 'utf8', timeout: 30000 });
        console.log(output);
    } catch (err) {
        status = 'FAIL';
        output = err.stdout || err.message;
        console.log(output);
        console.error(`[${probe.name}] FAILED with code ${err.status}`);
    }

    summary.push({ name: probe.name, zone: probe.zone, status });
}

// --- Summary ---
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║   SEAM VERIFICATION SUMMARY                         ║');
console.log('╠══════════════════════════════════════════════════════╣');
for (const s of summary) {
    const icon = s.status === 'PASS' ? '✓' : '✗';
    const line = `║ ${icon} ${s.name.padEnd(22)} ${s.zone.slice(0, 27).padEnd(27)} ║`;
    console.log(line);
}
console.log('╚══════════════════════════════════════════════════════╝\n');
