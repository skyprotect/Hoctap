[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
AppId={{D3F9E9D2-6A92-488F-A3C9-96860DF06D3F}
AppName=Toán Học Kiosk
AppVersion=10.13
AppPublisher=Binh Minh
AppPublisherURL=https://github.com/skyprotect/Hoctap
AppSupportURL=https://github.com/skyprotect/Hoctap
AppUpdatesURL=https://github.com/skyprotect/Hoctap
DefaultDirName={localappdata}\Toán Học Kiosk
DisableProgramGroupPage=yes
DisableReadyPage=yes
OutputDir=F:\KHQS\AntiGravity
OutputBaseFilename=ToanHocKiosk_Setup_v10.13
Compression=lzma
SolidCompression=yes
WizardStyle=modern
; Chạy dưới quyền User thông thường để tránh thông báo UAC Administrator
PrivilegesRequired=lowest
; Đóng các tiến trình cũ nếu đang chạy
CloseApplications=yes
AppMutex=ToanHocKioskMutex

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
Name: "{group}\Toán Học Kiosk"; Filename: "{app}\🚀 Bắt đầu học.vbs"
Name: "{group}\Dừng học"; Filename: "{app}\⏹ Dừng học.vbs"
Name: "{commondesktop}\Toán Học Kiosk"; Filename: "{app}\🚀 Bắt đầu học.vbs"; Tasks: desktopicon

[Run]
Filename: "{app}\🚀 Bắt đầu học.vbs"; Description: "{cm:LaunchProgram,Toán Học Kiosk}"; Flags: shellexec postinstall skipifsilent

[InstallDelete]
; Dọn dẹp các tệp tạm thời cũ khi nâng cấp nhưng KHÔNG xóa database.db và .env
Type: files; Name: "{app}\*.tmp"
Type: files; Name: "{app}\*.log"

[Code]
// Tự động tắt các tiến trình đang chạy (node.exe, kiosk_lock.exe) trước khi cài đặt đè
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;
  // Thực hiện tắt tiến trình ngầm để giải phóng tài nguyên trước khi cài đè
  ShellExec('cmd.exe', '/c taskkill /f /im node.exe /im kiosk_lock.exe', '', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;
