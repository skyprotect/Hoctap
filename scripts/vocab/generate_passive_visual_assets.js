/**
 * generate_passive_visual_assets.js (v15.12)
 * Sinh toàn bộ SVG Scene minh họa trực quan cho 185 bài nghe Passive Listening.
 * Không đọc chữ nhiều — tập trung vào bối cảnh hình ảnh trực quan hỗ trợ nghe hiểu.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json');
const OUT_DIR = path.join(ROOT_DIR, 'images', 'english', 'passive');
fs.mkdirSync(OUT_DIR, { recursive: true });

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Không tìm thấy manifest!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const lessons = Object.values(manifest);

console.log(`--- SINH VISUAL HERO ASSETS CHO PASSIVE LISTENING (v15.12: ${lessons.length} bài) ---`);

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function createHeroSvg(lesson) {
  const title = escapeXml(lesson.title);
  const level = escapeXml(lesson.level);
  const topic = escapeXml(lesson.topic || 'General');

  // Gradient màu theo Level
  let bgGrad = { start: '#60a5fa', end: '#2563eb' };
  if (level === 'Pre-A1') bgGrad = { start: '#f472b6', end: '#db2777' };
  else if (level === 'A1') bgGrad = { start: '#34d399', end: '#059669' };
  else if (level === 'A2') bgGrad = { start: '#a78bfa', end: '#7c3aed' };

  let sceneElements = '';
  const topLower = topic.toLowerCase();

  if (topLower.includes('animal') || topLower.includes('pet')) {
    sceneElements = `
      <circle cx="200" cy="125" r="42" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
      <polygon points="170,95 180,68 198,92" fill="#f59e0b"/>
      <polygon points="230,95 220,68 202,92" fill="#f59e0b"/>
      <circle cx="186" cy="120" r="5" fill="#0f172a"/>
      <circle cx="214" cy="120" r="5" fill="#0f172a"/>
      <polygon points="196,132 204,132 200,138" fill="#f43f5e"/>
      <circle cx="265" cy="150" r="18" fill="#ef4444"/>
    `;
  } else if (topLower.includes('classroom') || topLower.includes('school')) {
    sceneElements = `
      <rect x="70" y="65" width="260" height="100" rx="10" fill="#15803d" stroke="#bbf7d0" stroke-width="4"/>
      <rect x="90" y="80" width="100" height="20" rx="4" fill="#ffffff" opacity="0.15"/>
      <text x="200" y="125" font-family="'Segoe UI', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">ABC • 123</text>
      <rect x="140" y="155" width="120" height="35" rx="6" fill="#ca8a04"/>
    `;
  } else if (topLower.includes('family') || topLower.includes('home')) {
    sceneElements = `
      <polygon points="200,55 85,115 110,115 110,185 290,185 290,115 315,115" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
      <rect x="175" y="125" width="50" height="60" rx="6" fill="#f59e0b"/>
      <circle cx="215" cy="155" r="4" fill="#0f172a"/>
      <rect x="130" y="130" width="28" height="28" rx="4" fill="#e0f2fe"/>
      <rect x="242" y="130" width="28" height="28" rx="4" fill="#e0f2fe"/>
    `;
  } else if (topLower.includes('food') || topLower.includes('drink')) {
    sceneElements = `
      <circle cx="200" cy="135" r="55" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <ellipse cx="200" cy="135" rx="40" ry="25" fill="#f87171"/>
      <circle cx="155" cy="95" r="20" fill="#22c55e"/>
      <circle cx="245" cy="95" r="18" fill="#fb923c"/>
    `;
  } else if (topLower.includes('weather')) {
    sceneElements = `
      <circle cx="160" cy="105" r="40" fill="#facc15" stroke="#eab308" stroke-width="4"/>
      <path d="M 180 145 Q 220 105 260 145 Q 290 135 300 160 Q 290 185 200 185 Z" fill="#e0f2fe" opacity="0.95"/>
    `;
  } else if (topLower.includes('transport') || topLower.includes('directions')) {
    sceneElements = `
      <rect x="110" y="85" width="180" height="65" rx="16" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
      <rect x="130" y="100" width="38" height="28" rx="4" fill="#ffffff"/>
      <rect x="181" y="100" width="38" height="28" rx="4" fill="#ffffff"/>
      <rect x="232" y="100" width="38" height="28" rx="4" fill="#ffffff"/>
      <circle cx="150" cy="155" r="16" fill="#1e293b"/>
      <circle cx="250" cy="155" r="16" fill="#1e293b"/>
    `;
  } else if (topLower.includes('environment') || topLower.includes('nature')) {
    sceneElements = `
      <circle cx="200" cy="130" r="50" fill="#10b981" stroke="#059669" stroke-width="3"/>
      <path d="M 160 130 Q 200 80 240 130 Z" fill="#34d399"/>
      <rect x="195" y="130" width="10" height="35" fill="#78350f"/>
    `;
  } else if (topLower.includes('sport') || topLower.includes('hobb')) {
    sceneElements = `
      <circle cx="160" cy="125" r="35" fill="#f97316" stroke="#ea580c" stroke-width="3"/>
      <path d="M 160 90 L 160 160 M 125 125 L 195 125" stroke="#ffffff" stroke-width="3"/>
      <circle cx="240" cy="125" r="30" fill="#3b82f6" stroke="#2563eb" stroke-width="3"/>
      <polygon points="230,110 255,125 230,140" fill="#ffffff"/>
    `;
  } else {
    sceneElements = `
      <rect x="90" y="65" width="220" height="105" rx="16" fill="#ffffff" opacity="0.9" stroke="#93c5fd" stroke-width="3"/>
      <circle cx="200" cy="112" r="30" fill="#f59e0b"/>
      <path d="M 190 112 L 215 112 L 205 102" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="bg_${lesson.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGrad.start}"/>
      <stop offset="100%" stop-color="${bgGrad.end}"/>
    </linearGradient>
    <filter id="shadow_${lesson.id}" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Background Card -->
  <rect x="10" y="10" width="380" height="230" rx="20" fill="url(#bg_${lesson.id})" filter="url(#shadow_${lesson.id})"/>
  
  <!-- Topic & Level Badge -->
  <rect x="24" y="24" width="76" height="24" rx="12" fill="#ffffff" opacity="0.25"/>
  <text x="62" y="41" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">${level}</text>

  <rect x="108" y="24" width="130" height="24" rx="12" fill="#ffffff" opacity="0.2"/>
  <text x="173" y="41" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">${topic.toUpperCase()}</text>

  <!-- Illustration Elements -->
  <g transform="translate(0, 5)">
    ${sceneElements}
  </g>

  <!-- Title Banner -->
  <rect x="24" y="188" width="352" height="38" rx="12" fill="#0f172a" opacity="0.85"/>
  <text x="200" y="212" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">${title}</text>
</svg>`;
}

let generatedCount = 0;
lessons.forEach(lesson => {
  const filename = `${lesson.id.toLowerCase()}_hero.svg`;
  const filePath = path.join(OUT_DIR, filename);
  const svg = createHeroSvg(lesson);
  fs.writeFileSync(filePath, svg, 'utf8');
  generatedCount++;
});

console.log(`✓ Đã sinh thành công ${generatedCount} file SVG Visual Hero tại: ${OUT_DIR}`);
