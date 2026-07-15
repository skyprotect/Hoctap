const fs = require('fs');
const path = require('path');

const logsDir = 'f:/KHQS/AntiGravity/HocTap/logs';
const files = fs.readdirSync(logsDir);

const reports = [];
for (const file of files) {
  const filePath = path.join(logsDir, file);
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const titleLine = lines.find(l => l.includes('Lesson ID:'));
  const errorLine = lines.find(l => l.includes('Error') || l.includes('ReferenceError') || l.includes('SyntaxError') || l.includes('TypeError') || l.includes('is not defined'));
  
  reports.push({
    file,
    mtime: stats.mtime,
    title: titleLine ? titleLine.trim() : 'Unknown',
    error: errorLine ? errorLine.trim() : lines.slice(8, 11).join(' ').trim()
  });
}

// Sort by modified time descending
reports.sort((a, b) => b.mtime - a.mtime);

console.log("Recent log files:");
reports.slice(0, 30).forEach(r => {
  console.log(`- File: ${r.file} (${r.mtime.toISOString()})`);
  console.log(`  Title: ${r.title}`);
  console.log(`  Error: ${r.error}`);
});
