[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
AppId={{D3F9E9D2-6A92-488F-A3C9-96860DF06D3F}
AppName=Toan Hoc Kiosk
AppVersion=10.54
AppPublisher=Binh Minh
AppPublisherURL=https://github.com/skyprotect/Hoctap
AppSupportURL=https://github.com/skyprotect/Hoctap
AppUpdatesURL=https://github.com/skyprotect/Hoctap
DefaultDirName={commonpf}\ToanHocKiosk
DisableProgramGroupPage=yes
DisableReadyPage=yes
OutputDir=F:\KHQS\AntiGravity
OutputBaseFilename=ToanHocKiosk_Setup_v10.54
Compression=lzma2/fast
SolidCompression=no
WizardStyle=modern
UsePreviousAppDir=no
; Chạy dưới quyền Administrator để có đủ quyền cài đặt vào ổ C (tránh lỗi Access Denied)
PrivilegesRequired=admin
; Đóng các tiến trình cũ nếu đang chạy
CloseApplications=yes
AppMutex=ToanHocKioskMutex

[Dirs]
Name: "{app}"; Permissions: users-modify

[Languages]
Name: "vietnamese"; MessagesFile: "compiler:Languages\Vietnamese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; Sao chép tất cả các tệp từ thư mục HocTap_Clean
Source: "F:\KHQS\AntiGravity\HocTap_Clean\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs

; Tạo tệp cấu hình mặc định .env từ .env.example khi cài đặt lần đầu (KHÔNG ghi đè nếu đã tồn tại)
Source: "F:\KHQS\AntiGravity\HocTap_Clean\.env.example"; DestName: ".env"; DestDir: "{app}"; Flags: onlyifdoesntexist

; Không đóng gói database.db để tránh ghi đè dữ liệu học sinh cũ

[Icons]
Name: "{group}\Toán Học Kiosk"; Filename: "{app}\Bat dau hoc.vbs"; IconFilename: "{app}\images\app.ico"
Name: "{group}\Dừng học"; Filename: "{app}\Dung hoc.vbs"; IconFilename: "{app}\images\app.ico"
Name: "{userdesktop}\Toán Học Kiosk"; Filename: "{app}\Bat dau hoc.vbs"; IconFilename: "{app}\images\app.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\Bat dau hoc.vbs"; Description: "Khởi chạy ứng dụng Toán Học Kiosk"; Flags: shellexec postinstall skipifsilent

[InstallDelete]
; Dọn dẹp các tệp tạm thời cũ khi nâng cấp nhưng KHÔNG xóa database.db và .env
Type: files; Name: "{app}\*.tmp"
Type: files; Name: "{app}\*.log"
; Xóa bỏ các shortcut cũ bị hỏng từ các phiên bản trước để tránh nhầm lẫn
Type: files; Name: "{userdesktop}\Toán Học Kiosk.lnk"
Type: files; Name: "{userdesktop}\Toan Hoc Kiosk.lnk"
Type: files; Name: "{group}\Toán Học Kiosk.lnk"
Type: files; Name: "{group}\Toan Hoc Kiosk.lnk"
Type: files; Name: "{group}\Dừng học.lnk"
Type: files; Name: "{group}\Dung hoc.lnk"

[Code]
// Tự động tắt các tiến trình đang chạy (node.exe, kiosk_lock.exe) trước khi cài đặt đè
procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
  SqlitePath: String;
  OldSqlitePath: String;
begin
  if CurStep = ssInstall then
  begin
    // 1. Tắt cưỡng bức các tiến trình đang chạy dưới quyền Administrator đã được nâng cao
    ShellExec('taskkill.exe', '/f /im node.exe', '', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    ShellExec('taskkill.exe', '/f /im kiosk_lock.exe', '', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    ShellExec('cmd.exe', '/c taskkill /f /im node.exe /im kiosk_lock.exe', '', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    
    // Chờ 2.0 giây để hệ điều hành Windows giải phóng file handles
    Sleep(2000);
    
    // 2. Giải pháp dự phòng tối hậu: Đổi tên file node_sqlite3.node cũ sang .old (Windows cho phép đổi tên file đang bị khóa)
    SqlitePath := ExpandConstant('{app}\node_modules\sqlite3\build\Release\node_sqlite3.node');
    OldSqlitePath := SqlitePath + '.old';
    if FileExists(SqlitePath) then
    begin
      // Xóa file .old cũ nếu tồn tại trước đó
      if FileExists(OldSqlitePath) then
      begin
        DeleteFile(OldSqlitePath);
      end;
      // Đổi tên file đang bị khóa sang tên khác
      if RenameFile(SqlitePath, OldSqlitePath) then
      begin
        Log('[Setup] Đã đổi tên node_sqlite3.node sang .old thành công.');
      end else begin
        Log('[Setup] Không thể đổi tên node_sqlite3.node, thử xóa trực tiếp...');
        DeleteFile(SqlitePath);
      end;
    end;
  end;
end;
