const fs = require('fs');
const path = require('path');

const targetPatterns = [
  'speechSynthesis.speak',
  'speechSynthesis',
  'SpeechSynthesisUtterance',
  'SpeechService'
];

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.git', 'dist', '.gemini', 'backups'].includes(file)) continue;
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.html')) {
      fileList.push(filepath);
    }
  }
  return fileList;
}

const allFiles = walk('.');
const occurrences = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    targetPatterns.forEach(pattern => {
      if (line.includes(pattern)) {
        let classification = 'UNKNOWN';
        const normFile = file.replace(/\\/g, '/');

        if (normFile.includes('tests/')) {
          classification = 'TEST_SPY_ASSERTION';
        } else if (normFile.includes('js/core/english-audio-service.js')) {
          if (line.includes('CURRICULUM') || line.includes('PASSIVE')) {
            classification = 'CURRICULUM_AND_PASSIVE_GUARD';
          } else if (line.includes('DYNAMIC') || line.includes('fallback') || line.includes('allowFallback')) {
            classification = 'DYNAMIC_FALLBACK_CONTROLLED';
          } else {
            classification = 'AUDIO_DISPATCHER';
          }
        } else if (normFile.includes('js/core/speech-service.js')) {
          classification = 'BROWSER_TTS_PRIMITIVE_WRAPPER';
        } else if (normFile.includes('js/app.js')) {
          classification = 'DYNAMIC_OR_SPEECH_SERVICE_FACADE';
        } else if (normFile.includes('student.html')) {
          classification = 'HTML_SCRIPT_IMPORT';
        } else if (normFile.includes('scripts/')) {
          classification = 'DEV_SCRIPT_MAINTENANCE';
        }

        occurrences.push({
          file: normFile,
          lineNum: idx + 1,
          pattern,
          classification,
          snippet: line.trim()
        });
      }
    });
  });
});

console.log('====================================================');
console.log('AUDIT TINH LOI GOI BROWSER TTS (STATIC TTS AUDIT)');
console.log('====================================================');
console.log('Tong so vi tri phat hien:', occurrences.length);

const byClassification = {};
let unknownCount = 0;
occurrences.forEach(o => {
  byClassification[o.classification] = (byClassification[o.classification] || 0) + 1;
  if (o.classification === 'UNKNOWN') {
    unknownCount++;
    console.warn('[UNKNOWN FOUND]', o.file + ':' + o.lineNum, '->', o.snippet);
  }
});

console.log('\nPhan loai chi tiet:', byClassification);
console.log('UNKNOWN Count:', unknownCount);

if (unknownCount > 0) {
  console.error('\nCANH BAO: Con vi tri UNKNOWN chua duoc phan loai!');
  process.exit(1);
} else {
  console.log('\n100% vi tri tham chieu TTS da duoc phan loai ro rang. Khong con UNKNOWN.');
}
