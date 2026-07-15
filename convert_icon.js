const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đường dẫn ảnh gốc sinh bởi AI
const aiPngPath = "C:/Users/Binh Minh/.gemini/antigravity/brain/4ba90cba-758c-4c97-8203-55d4c83a80f2/new_app_icon_1784114022386.png";

// Đường dẫn lưu trữ trong dự án
const targetPngPath = path.join(__dirname, 'images', 'app_icon.png');
const targetIcoPath = path.join(__dirname, 'images', 'app.ico');

function pngToIco(pngPath, icoPath) {
  const pngData = fs.readFileSync(pngPath);
  const size = pngData.length;
  
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon (1)
  header.writeUInt16LE(1, 4); // Number of images: 1

  // Image directory: 16 bytes
  const dir = Buffer.alloc(16);
  dir.writeUInt8(0, 0);       // Width (0 means 256)
  dir.writeUInt8(0, 1);       // Height (0 means 256)
  dir.writeUInt8(0, 2);       // Color palette (0 means no palette)
  dir.writeUInt8(0, 3);       // Reserved
  dir.writeUInt16LE(1, 4);    // Color planes
  dir.writeUInt16LE(32, 6);   // Bits per pixel (32)
  dir.writeUInt32LE(size, 8); // Size of PNG data
  dir.writeUInt32LE(22, 12);  // Offset of PNG data (6 bytes header + 16 bytes dir = 22)

  // Ghép lại và ghi ra file
  const icoData = Buffer.concat([header, dir, pngData]);
  fs.writeFileSync(icoPath, icoData);
  console.log(`✅ Đã chuyển đổi thành công sang file ICO tại: ${icoPath}`);
}

function run() {
  if (!fs.existsSync(aiPngPath)) {
    console.error(`❌ LỖI: Không tìm thấy ảnh AI tại đường dẫn: ${aiPngPath}`);
    process.exit(1);
  }

  // 1. Chuyển đổi và resize ảnh JPEG/PNG gốc sang định dạng PNG 256x256 pixel bằng PowerShell .NET
  console.log('⏳ Đang chuyển đổi và resize ảnh AI sang định dạng PNG 256x256...');
  try {
    const formattedAiPath = aiPngPath.replace(/\\/g, '/');
    const formattedTargetPath = targetPngPath.replace(/\\/g, '/');
    
    const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Drawing; $src = [System.Drawing.Bitmap]::FromFile('${formattedAiPath}'); $dst = New-Object System.Drawing.Bitmap(256, 256); $g = [System.Drawing.Graphics]::FromImage($dst); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic; $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality; $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality; $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality; $g.DrawImage($src, 0, 0, 256, 256); $g.Dispose(); $src.Dispose(); $dst.Save('${formattedTargetPath}', [System.Drawing.Imaging.ImageFormat]::Png); $dst.Dispose();"`;
    
    execSync(psCommand, { stdio: 'inherit' });
    console.log(`✅ Đã resize và lưu ảnh PNG 256x256 tại: ${targetPngPath}`);
  } catch (error) {
    console.error('❌ LỖI khi chạy lệnh PowerShell chuyển đổi ảnh:', error.message);
    process.exit(1);
  }

  // 2. Chuyển đổi PNG thực thụ sang file .ico
  pngToIco(targetPngPath, targetIcoPath);
}

run();
