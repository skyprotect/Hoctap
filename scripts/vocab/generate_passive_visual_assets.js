const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json');
const OUT_DIR = path.join(ROOT_DIR, 'images', 'english', 'passive');
fs.mkdirSync(OUT_DIR, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

console.log('--- SINH VISUAL HERO ASSETS CHO PASSIVE LISTENING ---');

// Tạo SVG Scene cho từng chủ đề bài nghe
function createHeroSvg(lesson) {
  const title = lesson.title;
  const level = lesson.level;
  const topic = lesson.topic;

  // Bảng màu theo Level
  let bgGrad = { start: '#60a5fa', end: '#2563eb' };
  if (level === 'Pre-A1') bgGrad = { start: '#f472b6', end: '#db2777' };
  else if (level === 'A1') bgGrad = { start: '#34d399', end: '#059669' };
  else if (level === 'A2') bgGrad = { start: '#a78bfa', end: '#7c3aed' };

  let sceneElements = '';

  if (topic === 'animals') {
    sceneElements = `
      <circle cx="200" cy="130" r="45" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
      <polygon points="165,100 175,70 195,95" fill="#f59e0b"/>
      <polygon points="235,100 225,70 205,95" fill="#f59e0b"/>
      <circle cx="185" cy="125" r="6" fill="#0f172a"/>
      <circle cx="215" cy="125" r="6" fill="#0f172a"/>
      <polygon points="195,138 205,138 200,145" fill="#f43f5e"/>
      <circle cx="270" cy="155" r="22" fill="#ef4444"/>
    `;
  } else if (topic.includes('classroom') || topic === 'school') {
    sceneElements = `
      <rect x="70" y="60" width="260" height="110" rx="10" fill="#15803d" stroke="#bbf7d0" stroke-width="4"/>
      <rect x="90" y="80" width="100" height="24" rx="4" fill="#ffffff" opacity="0.15"/>
      <text x="200" y="125" font-family="'Segoe UI', sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">ABC 123</text>
      <rect x="140" y="160" width="120" height="40" rx="6" fill="#ca8a04"/>
    `;
  } else if (topic === 'family' || topic === 'home') {
    sceneElements = `
      <polygon points="200,50 80,120 110,120 110,190 290,190 290,120 320,120" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
      <rect x="170" y="130" width="60" height="60" rx="6" fill="#f59e0b"/>
      <circle cx="220" cy="160" r="4" fill="#0f172a"/>
      <rect x="125" y="135" width="30" height="30" rx="4" fill="#e0f2fe"/>
      <rect x="245" y="135" width="30" height="30" rx="4" fill="#e0f2fe"/>
    `;
  } else if (topic === 'food') {
    sceneElements = `
      <circle cx="200" cy="140" r="60" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <ellipse cx="200" cy="140" rx="45" ry="30" fill="#f87171"/>
      <circle cx="150" cy="100" r="24" fill="#22c55e"/>
      <circle cx="250" cy="100" r="20" fill="#fb923c"/>
    `;
  } else if (topic === 'weather') {
    sceneElements = `
      <circle cx="160" cy="110" r="42" fill="#facc15" stroke="#eab308" stroke-width="4"/>
      <path d="M 180 150 Q 220 110 260 150 Q 290 140 300 165 Q 290 190 200 190 Z" fill="#e0f2fe" opacity="0.95"/>
    `;
  } else if (topic === 'transport') {
    sceneElements = `
      <rect x="110" y="90" width="180" height="70" rx="16" fill="#38bdf8" stroke="#0284c7" stroke-width="4"/>
      <rect x="130" y="105" width="40" height="30" rx="4" fill="#ffffff"/>
      <rect x="180" y="105" width="40" height="30" rx="4" fill="#ffffff"/>
      <rect x="230" y="105" width="40" height="30" rx="4" fill="#ffffff"/>
      <circle cx="150" cy="165" r="18" fill="#1e293b"/>
      <circle cx="250" cy="165" r="18" fill="#1e293b"/>
    `;
  } else {
    sceneElements = `
      <rect x="90" y="70" width="220" height="110" rx="16" fill="#ffffff" opacity="0.9" stroke="#93c5fd" stroke-width="3"/>
      <circle cx="200" cy="115" r="32" fill="#f59e0b"/>
      <path d="M 190 115 L 215 115 L 205 105" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGrad.start}"/>
      <stop offset="100%" stop-color="${bgGrad.end}"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.2"/>
    </filter>
  </defs>
  <!-- Card Background -->
  <rect x="10" y="10" width="380" height="230" rx="20" fill="url(#bg)" filter="url(#shadow)"/>
  
  <!-- Topic & Level Badge -->
  <rect x="24" y="24" width="76" height="24" rx="12" fill="#ffffff" opacity="0.25"/>
  <text x="62" y="41" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">${level}</text>

  <rect x="108" y="24" width="110" height="24" rx="12" fill="#ffffff" opacity="0.2"/>
  <text x="163" y="41" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">${topic.toUpperCase()}</text>

  <!-- Illustration Scene -->
  <g id="scene_content">
    ${sceneElements}
  </g>

  <!-- Title Bottom Ribbon -->
  <rect x="24" y="195" width="352" height="34" rx="10" fill="#0f172a" opacity="0.65"/>
  <text x="200" y="218" font-family="'Segoe UI', sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle">${title}</text>
</svg>`;
}

let count = 0;
Object.values(manifest).forEach(l => {
  const filename = `${l.id.toLowerCase()}_hero.svg`;
  const fullPath = path.join(OUT_DIR, filename);
  const svg = createHeroSvg(l);
  fs.writeFileSync(fullPath, svg, 'utf8');
  count++;
});

console.log(`Đã sinh thành công ${count} tệp Hero SVG bối cảnh tại: ${OUT_DIR}`);
