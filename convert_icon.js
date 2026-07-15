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

  // 1. Chuyển đổi, resize ảnh AI sang định dạng PNG 256x256 và XÓA NỀN tự động (Transparent Background) bằng PowerShell .NET
  console.log('⏳ Đang resize và xóa nền (làm trong suốt) ảnh AI...');
  try {
    const formattedAiPath = aiPngPath.replace(/\\/g, '/');
    const formattedTargetPath = targetPngPath.replace(/\\/g, '/');
    
    const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Drawing; $src = [System.Drawing.Bitmap]::FromFile('${formattedAiPath}'); $dst = New-Object System.Drawing.Bitmap(256, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb); $g = [System.Drawing.Graphics]::FromImage($dst); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic; $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality; $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality; $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality; $g.DrawImage($src, 0, 0, 256, 256); $g.Dispose(); $src.Dispose(); $bgCol = $dst.GetPixel(0, 0); $bgR = [int]$bgCol.R; $bgG = [int]$bgCol.G; $bgB = [int]$bgCol.B; $visited = New-Object 'Boolean[,]' 256, 256; $queue = New-Object System.Collections.Queue; $visited[0, 0] = $true; $queue.Enqueue(@(0, 0)); $visited[255, 0] = $true; $queue.Enqueue(@(255, 0)); $visited[0, 255] = $true; $queue.Enqueue(@(0, 255)); $visited[255, 255] = $true; $queue.Enqueue(@(255, 255)); $tolerance = 65; $dx = @(1, -1, 0, 0); $dy = @(0, 0, 1, -1); while ($queue.Count -gt 0) { $curr = $queue.Dequeue(); $cx = [int]$curr[0]; $cy = [int]$curr[1]; $pixelCol = $dst.GetPixel($cx, $cy); $rDiff = [int]$pixelCol.R - $bgR; $gDiff = [int]$pixelCol.G - $bgG; $bDiff = [int]$pixelCol.B - $bgB; $dist = [Math]::Sqrt(($rDiff * $rDiff) + ($gDiff * $gDiff) + ($bDiff * $bDiff)); if ($dist -lt $tolerance) { $dst.SetPixel($cx, $cy, [System.Drawing.Color]::Transparent); for ($i = 0; $i -lt 4; $i++) { $nx = $cx + $dx[$i]; $ny = $cy + $dy[$i]; if ($nx -ge 0 -and $nx -lt 256 -and $ny -ge 0 -and $ny -lt 256) { if (!$visited[$nx, $ny]) { $visited[$nx, $ny] = $true; $queue.Enqueue(@($nx, $ny)); } } } } } $dst.Save('${formattedTargetPath}', [System.Drawing.Imaging.ImageFormat]::Png); $dst.Dispose();"`;
    
    execSync(psCommand, { stdio: 'inherit' });
    console.log(`✅ Đã lưu ảnh PNG 256x256 đã xóa nền tại: ${targetPngPath}`);
  } catch (error) {
    console.error('❌ LỖI khi chạy lệnh PowerShell chuyển đổi và xóa nền ảnh:', error.message);
    process.exit(1);
  }

  // 2. Đóng gói PNG trong suốt sang file .ico
  pngToIco(targetPngPath, targetIcoPath);
}

run();
