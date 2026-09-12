const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'images', 'english', 'visual-vocabulary-manifest.json');
const VOCAB_IMG_DIR = path.join(ROOT_DIR, 'images', 'english', 'vocab');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Khong tim thay manifest:', MANIFEST_PATH);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const entries = Object.values(manifest);

console.log(`Bat dau sinh SVG assets cho ${entries.length} tu vung...`);

// Bộ template SVG theo danh mục ngữ nghĩa trực quan
function getSvgVisual(word, meaning, category, concept) {
  const w = word.toLowerCase();

  // Bảng màu rực rỡ, thân thiện trẻ em
  const bgGradients = [
    { id: 'grad_blue', start: '#38bdf8', end: '#0284c7' },
    { id: 'grad_green', start: '#4ade80', end: '#16a34a' },
    { id: 'grad_amber', start: '#fcd34d', end: '#d97706' },
    { id: 'grad_rose', start: '#fb7185', end: '#e11d48' },
    { id: 'grad_purple', start: '#c084fc', end: '#9333ea' },
    { id: 'grad_emerald', start: '#34d399', end: '#059669' }
  ];

  let grad = bgGradients[Math.abs(w.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % bgGradients.length];

  // Các biểu tượng vector tiêu biểu theo concept
  let iconSvg = '';

  // 1. Quả bóng (ball, football, badminton, basketball)
  if (w.includes('ball') || w.includes('football')) {
    iconSvg = `
      <circle cx="60" cy="60" r="36" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
      <polygon points="60,44 72,53 67,67 53,67 48,53" fill="#0f172a"/>
      <line x1="60" y1="44" x2="60" y2="24" stroke="#1e293b" stroke-width="3"/>
      <line x1="72" y1="53" x2="90" y2="48" stroke="#1e293b" stroke-width="3"/>
      <line x1="67" y1="67" x2="80" y2="86" stroke="#1e293b" stroke-width="3"/>
      <line x1="53" y1="67" x2="40" y2="86" stroke="#1e293b" stroke-width="3"/>
      <line x1="48" y1="53" x2="30" y2="48" stroke="#1e293b" stroke-width="3"/>
    `;
  }
  // 2. Sách (book, textbook, notebook)
  else if (w.includes('book') || w.includes('lesson')) {
    iconSvg = `
      <path d="M25 40 C45 35 58 42 60 46 C62 42 75 35 95 40 L95 82 C75 77 62 82 60 84 C58 82 45 77 25 82 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
      <path d="M60 46 L60 84" stroke="#a16207" stroke-width="3"/>
      <line x1="32" y1="52" x2="52" y2="50" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
      <line x1="32" y1="60" x2="52" y2="58" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
      <line x1="68" y1="50" x2="88" y2="52" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
      <line x1="68" y1="58" x2="88" y2="60" stroke="#ca8a04" stroke-width="2" stroke-linecap="round"/>
    `;
  }
  // 3. Xe đạp (bike, bicycle)
  else if (w.includes('bike')) {
    iconSvg = `
      <circle cx="38" cy="72" r="18" fill="none" stroke="#e0e7ff" stroke-width="4"/>
      <circle cx="82" cy="72" r="18" fill="none" stroke="#e0e7ff" stroke-width="4"/>
      <polyline points="38,72 54,72 68,54 82,72" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <polyline points="54,72 60,46 48,46" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <polyline points="68,54 74,44 82,44" fill="none" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
    `;
  }
  // 4. Bút viết (pen, pencil)
  else if (w.includes('pen') || w.includes('pencil')) {
    iconSvg = `
      <rect x="52" y="24" width="16" height="56" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="3" transform="rotate(35 60 60)"/>
      <polygon points="56,76 64,76 60,88" fill="#f87171" transform="rotate(35 60 60)"/>
      <circle cx="60" cy="86" r="2" fill="#0f172a" transform="rotate(35 60 60)"/>
    `;
  }
  // 5. Thước kẻ (ruler)
  else if (w.includes('ruler')) {
    iconSvg = `
      <rect x="25" y="50" width="70" height="20" rx="3" fill="#fde047" stroke="#ca8a04" stroke-width="3" transform="rotate(-20 60 60)"/>
      <line x1="35" y1="50" x2="35" y2="58" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
      <line x1="45" y1="50" x2="45" y2="62" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
      <line x1="55" y1="50" x2="55" y2="58" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
      <line x1="65" y1="50" x2="65" y2="62" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
      <line x1="75" y1="50" x2="75" y2="58" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
      <line x1="85" y1="50" x2="85" y2="62" stroke="#854d0e" stroke-width="2" transform="rotate(-20 60 60)"/>
    `;
  }
  // 6. Com-pa (compass)
  else if (w.includes('compass')) {
    iconSvg = `
      <circle cx="60" cy="34" r="8" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
      <line x1="60" y1="38" x2="38" y2="86" stroke="#475569" stroke-width="5" stroke-linecap="round"/>
      <line x1="60" y1="38" x2="82" y2="86" stroke="#475569" stroke-width="5" stroke-linecap="round"/>
      <circle cx="38" cy="86" r="3" fill="#0f172a"/>
      <polygon points="82,82 86,86 78,86" fill="#ef4444"/>
      <path d="M 45 68 A 20 20 0 0 0 75 68" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3"/>
    `;
  }
  // 7. Máy tính bỏ túi (calculator)
  else if (w.includes('calculator')) {
    iconSvg = `
      <rect x="36" y="24" width="48" height="72" rx="8" fill="#334155" stroke="#1e293b" stroke-width="3"/>
      <rect x="42" y="32" width="36" height="16" rx="3" fill="#86efac"/>
      <circle cx="46" cy="58" r="4" fill="#64748b"/>
      <circle cx="60" cy="58" r="4" fill="#64748b"/>
      <circle cx="74" cy="58" r="4" fill="#f59e0b"/>
      <circle cx="46" cy="72" r="4" fill="#64748b"/>
      <circle cx="60" cy="72" r="4" fill="#64748b"/>
      <circle cx="74" cy="72" r="4" fill="#38bdf8"/>
      <circle cx="46" cy="84" r="4" fill="#64748b"/>
      <circle cx="60" cy="84" r="4" fill="#64748b"/>
      <circle cx="74" cy="84" r="4" fill="#10b981"/>
    `;
  }
  // 8. Động vật (cat, dog, bat, bird, duck, lion, tiger, elephant...)
  else if (w === 'cat') {
    iconSvg = `
      <circle cx="60" cy="64" r="26" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
      <polygon points="40,46 44,28 56,42" fill="#f59e0b"/>
      <polygon points="80,46 76,28 64,42" fill="#f59e0b"/>
      <circle cx="50" cy="60" r="4" fill="#0f172a"/>
      <circle cx="70" cy="60" r="4" fill="#0f172a"/>
      <polygon points="56,68 64,68 60,73" fill="#f43f5e"/>
      <line x1="42" y1="68" x2="28" y2="66" stroke="#78350f" stroke-width="2"/>
      <line x1="42" y1="72" x2="28" y2="76" stroke="#78350f" stroke-width="2"/>
      <line x1="78" y1="68" x2="92" y2="66" stroke="#78350f" stroke-width="2"/>
      <line x1="78" y1="72" x2="92" y2="76" stroke="#78350f" stroke-width="2"/>
    `;
  } else if (w === 'dog') {
    iconSvg = `
      <ellipse cx="60" cy="64" rx="28" ry="24" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
      <ellipse cx="36" cy="50" rx="8" ry="16" fill="#ea580c" transform="rotate(-15 36 50)"/>
      <ellipse cx="84" cy="50" rx="8" ry="16" fill="#ea580c" transform="rotate(15 84 50)"/>
      <circle cx="50" cy="60" r="4" fill="#0f172a"/>
      <circle cx="70" cy="60" r="4" fill="#0f172a"/>
      <ellipse cx="60" cy="70" rx="6" ry="4" fill="#0f172a"/>
      <path d="M 60 74 Q 60 82 66 82" fill="none" stroke="#0f172a" stroke-width="2"/>
    `;
  } else if (w === 'bat') {
    // Con dơi bay ban đêm (loại trừ gậy bóng chày)
    iconSvg = `
      <path d="M 20 56 Q 36 40 46 54 Q 54 48 60 54 Q 66 48 74 54 Q 84 40 100 56 Q 84 72 74 66 Q 66 82 60 68 Q 54 82 46 66 Q 36 72 20 56 Z" fill="#334155" stroke="#0f172a" stroke-width="2"/>
      <circle cx="55" cy="56" r="2" fill="#ef4444"/>
      <circle cx="65" cy="56" r="2" fill="#ef4444"/>
      <polygon points="52,48 56,42 58,48" fill="#1e293b"/>
      <polygon points="68,48 64,42 62,48" fill="#1e293b"/>
    `;
  }
  // 9. Trái cây / Đồ ăn (apple, banana, orange, milk, cake, water...)
  else if (w === 'apple') {
    iconSvg = `
      <path d="M 60 42 C 45 28 28 42 34 68 C 40 88 56 94 60 94 C 64 94 80 88 86 68 C 92 42 75 28 60 42 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
      <path d="M 60 40 Q 64 24 72 20" fill="none" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <path d="M 64 30 Q 78 26 78 34 Q 70 38 64 30 Z" fill="#22c55e"/>
    `;
  } else if (w === 'banana') {
    iconSvg = `
      <path d="M 35 78 C 30 52 50 32 85 30 C 88 32 86 36 82 38 C 56 42 42 58 45 80 Z" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="35" cy="78" r="3" fill="#854d0e"/>
      <circle cx="85" cy="30" r="2.5" fill="#15803d"/>
    `;
  } else if (w === 'orange') {
    // Quả cam (loại trừ màu cam đơn thuần)
    iconSvg = `
      <circle cx="60" cy="62" r="30" fill="#fb923c" stroke="#c2410c" stroke-width="3"/>
      <circle cx="60" cy="36" r="3" fill="#15803d"/>
      <path d="M 60 36 Q 74 30 72 40 Z" fill="#22c55e"/>
      <circle cx="48" cy="56" r="1.5" fill="#ea580c"/>
      <circle cx="68" cy="64" r="1.5" fill="#ea580c"/>
      <circle cx="56" cy="74" r="1.5" fill="#ea580c"/>
    `;
  }
  // 10. Phương tiện giao thông (car, bus, plane, train, boat...)
  else if (w === 'car') {
    iconSvg = `
      <path d="M 28 68 L 34 54 Q 44 44 60 44 L 72 44 L 86 54 L 94 68 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
      <rect x="24" y="66" width="72" height="12" rx="4" fill="#0284c7"/>
      <circle cx="40" cy="78" r="9" fill="#334155" stroke="#0f172a" stroke-width="3"/>
      <circle cx="40" cy="78" r="4" fill="#cbd5e1"/>
      <circle cx="80" cy="78" r="9" fill="#334155" stroke="#0f172a" stroke-width="3"/>
      <circle cx="80" cy="78" r="4" fill="#cbd5e1"/>
      <rect x="42" y="48" width="16" height="14" rx="2" fill="#e0f2fe"/>
      <rect x="62" y="48" width="16" height="14" rx="2" fill="#e0f2fe"/>
    `;
  } else if (w === 'train') {
    // Đoàn tàu hỏa chạy trên ray
    iconSvg = `
      <rect x="36" y="32" width="48" height="50" rx="8" fill="#f43f5e" stroke="#be123c" stroke-width="3"/>
      <rect x="44" y="40" width="32" height="18" rx="4" fill="#e0f2fe"/>
      <circle cx="46" cy="70" r="5" fill="#fde047"/>
      <circle cx="74" cy="70" r="5" fill="#fde047"/>
      <line x1="28" y1="88" x2="92" y2="88" stroke="#475569" stroke-width="4"/>
      <line x1="38" y1="84" x2="34" y2="92" stroke="#475569" stroke-width="3"/>
      <line x1="50" y1="84" x2="46" y2="92" stroke="#475569" stroke-width="3"/>
      <line x1="62" y1="84" x2="58" y2="92" stroke="#475569" stroke-width="3"/>
      <line x1="74" y1="84" x2="70" y2="92" stroke="#475569" stroke-width="3"/>
      <line x1="86" y1="84" x2="82" y2="92" stroke="#475569" stroke-width="3"/>
    `;
  }
  // 11. Môi trường & Tái chế (recycle, reuse, reduce, environment)
  else if (w.includes('recycle') || w.includes('reuse') || w.includes('reduce')) {
    iconSvg = `
      <path d="M 60 28 L 74 38 L 66 38 C 76 46 78 62 70 74 L 62 68 C 68 58 66 48 58 42 L 58 50 Z" fill="#16a34a"/>
      <path d="M 78 72 L 72 88 L 66 82 C 54 88 38 82 32 68 L 40 64 C 44 74 54 78 62 74 L 56 68 Z" fill="#16a34a"/>
      <path d="M 34 52 L 28 36 L 36 40 C 44 30 60 30 70 38 L 64 44 C 56 38 46 38 40 44 L 46 48 Z" fill="#16a34a"/>
    `;
  }
  // 12. Thời tiết & Thiên nhiên (sun, rain, snow, wind, cloud, spring)
  else if (w.includes('sun') || w === 'sunny') {
    iconSvg = `
      <circle cx="60" cy="60" r="22" fill="#facc15" stroke="#eab308" stroke-width="3"/>
      <line x1="60" y1="22" x2="60" y2="30" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="60" y1="90" x2="60" y2="98" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="22" y1="60" x2="30" y2="60" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="90" y1="60" x2="98" y2="60" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="33" y1="33" x2="39" y2="39" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="81" y1="81" x2="87" y2="87" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="33" y1="87" x2="39" y2="81" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
      <line x1="81" y1="39" x2="87" y2="33" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (w.includes('spring')) {
    // Mùa xuân hoa nở (loại trừ lò xo kim loại)
    iconSvg = `
      <circle cx="60" cy="60" r="10" fill="#fde047"/>
      <circle cx="60" cy="42" r="10" fill="#f472b6"/>
      <circle cx="60" cy="78" r="10" fill="#f472b6"/>
      <circle cx="42" cy="60" r="10" fill="#f472b6"/>
      <circle cx="78" cy="60" r="10" fill="#f472b6"/>
      <circle cx="47" cy="47" r="8" fill="#f9a8d4"/>
      <circle cx="73" cy="73" r="8" fill="#f9a8d4"/>
      <circle cx="47" cy="73" r="8" fill="#f9a8d4"/>
      <circle cx="73" cy="47" r="8" fill="#f9a8d4"/>
      <circle cx="60" cy="60" r="8" fill="#eab308"/>
    `;
  }
  // 13. Phương hướng (left, right, straight)
  else if (w === 'left') {
    iconSvg = `
      <rect x="28" y="28" width="64" height="64" rx="12" fill="#2563eb"/>
      <path d="M 68 76 L 68 56 Q 68 46 58 46 L 46 46" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="52,38 42,46 52,54" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (w === 'right') {
    iconSvg = `
      <rect x="28" y="28" width="64" height="64" rx="12" fill="#2563eb"/>
      <path d="M 52 76 L 52 56 Q 52 46 62 46 L 74 46" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="68,38 78,46 68,54" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }
  // 14. Nhà cửa, trường học & đồ gia dụng (house, school, room, chair, table, bed...)
  else if (w.includes('house') || w.includes('home') || w.includes('school')) {
    iconSvg = `
      <polygon points="60,26 24,54 32,54 32,88 88,88 88,54 96,54" fill="#38bdf8" stroke="#0284c7" stroke-width="3"/>
      <rect x="52" y="60" width="16" height="28" fill="#f59e0b"/>
      <rect x="40" y="58" width="8" height="8" rx="1" fill="#ffffff"/>
      <rect x="72" y="58" width="8" height="8" rx="1" fill="#ffffff"/>
      <circle cx="64" cy="74" r="1.5" fill="#0f172a"/>
    `;
  }
  // 15. Khái niệm mặc định theo chuẩn giáo dục trực quan
  else {
    // Biểu tượng thẻ học trực quan có chữ cái đầu tiên phong cách typography thiếu nhi
    const initial = (word[0] || 'A').toUpperCase();
    iconSvg = `
      <rect x="30" y="30" width="60" height="60" rx="16" fill="#ffffff" opacity="0.9" stroke="#93c5fd" stroke-width="3"/>
      <text x="60" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="900" fill="#2563eb" text-anchor="middle">${initial}</text>
      <circle cx="78" cy="42" r="5" fill="#f59e0b"/>
      <polygon points="42,76 46,72 50,76 46,80" fill="#10b981"/>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="${grad.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${grad.start}"/>
      <stop offset="100%" stop-color="${grad.end}"/>
    </linearGradient>
    <filter id="soft_shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.15"/>
    </filter>
  </defs>
  <!-- Background Badge -->
  <rect x="8" y="8" width="104" height="104" rx="28" fill="url(#${grad.id})" filter="url(#soft_shadow)"/>
  <circle cx="60" cy="60" r="46" fill="#ffffff" opacity="0.18"/>
  <!-- Semantic Visual Illustration -->
  <g id="visual_content">
    ${iconSvg.trim()}
  </g>
</svg>`;
}

let generated = 0;
entries.forEach(item => {
  const filepath = path.join(ROOT_DIR, item.imageFile);
  const svgContent = getSvgVisual(item.word, item.meaning, item.partOfSpeech, item.visualConcept);
  fs.writeFileSync(filepath, svgContent, 'utf8');
  generated++;
});

console.log(`Hoan thanh sinh ${generated} tep SVG hop le tai: images/english/vocab/`);
