#pragma codepage 65001
[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
AppId={{D3F9E9D2-6A92-488F-A3C9-96860DF06D3F}
AppName=Toan Hoc Kiosk
AppVersion=12.58
AppPublisher=Binh Minh
AppPublisherURL=https://github.com/skyprotect/Hoctap
AppSupportURL=https://github.com/skyprotect/Hoctap
AppUpdatesURL=https://github.com/skyprotect/Hoctap
DefaultDirName={commonpf}\ToanHocKiosk
DisableProgramGroupPage=yes
DisableReadyPage=yes
OutputDir=F:\KHQS\AntiGravity
OutputBaseFilename=ToanHocKiosk_Setup_v12.58
Compression=lzma2/fast
SolidCompression=no
WizardStyle=modern
UsePreviousAppDir=no
; Chạy dưới quyền Administrator để có đủ quyền cài đặt vào ổ C (tránh lỗi Access Denied)
PrivilegesRequired=admin
; Đóng các tiến trình cũ nếu đang chạy
CloseApplications=yes
AppMutex=Global\ToanHocKioskMutex

[Dirs]
Name: "{app}"; Permissions: users-modify

[Languages]
Name: "vietnamese"; MessagesFile: "compiler:Languages\Vietnamese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; Sao chép tất cả các tệp từ thư mục HocTap_Clean và cấp quyền sửa đổi cho users thường
Source: "F:\KHQS\AntiGravity\HocTap_Clean\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs; Permissions: users-modify

; Tạo tệp cấu hình mặc định .env từ .env.example khi cài đặt lần đầu (KHÔNG ghi đè nếu đã tồn tại) và cấp quyền sửa đổi
Source: "F:\KHQS\AntiGravity\HocTap_Clean\.env.example"; DestName: ".env"; DestDir: "{app}"; Flags: onlyifdoesntexist; Permissions: users-modify

; Không đóng gói database.db để tránh ghi đè dữ liệu học sinh cũ

[Icons]
Name: "{group}\Toán Học Kiosk"; Filename: "{app}\Bat dau hoc.vbs"; IconFilename: "{app}\images\app.ico"
Name: "{group}\Dừng học"; Filename: "{app}\Dung hoc.vbs"; IconFilename: "{app}\images\app.ico"
Name: "{userdesktop}\Toán Học Kiosk"; Filename: "{app}\Bat dau hoc.vbs"; IconFilename: "{app}\images\app.ico"; Tasks: desktopicon


[InstallDelete]
; Dọn dẹp các tệp tạm thời cũ khi nâng cấp nhưng KHÔNG xóa database.db và .env
Type: files; Name: "{app}\*.tmp"
Type: files; Name: "{app}\*.log"
; Xóa bỏ các shortcut cũ bị hỏng từ các phiên bản trước để tránh nhầm lẫn
Type: files; Name: "{userdesktop}\Toán Học Kiosk.lnk"
Type: files; Name: "{userdesktop}\Toan Hoc Kiosk.lnk"
Type: files; Name: "{userdesktop}\ToÃ¡n Há»c Kiosk.lnk"
Type: files; Name: "{group}\Toán Học Kiosk.lnk"
Type: files; Name: "{group}\Toan Hoc Kiosk.lnk"
Type: files; Name: "{group}\ToÃ¡n Há»c Kiosk.lnk"
Type: files; Name: "{group}\Dừng học.lnk"
Type: files; Name: "{group}\Dung hoc.lnk"

[Code]
function IsAppRunning(): Boolean;
var
  WbemLocator, WbemServices, WbemObjectSet: Variant;
  ProcessEnum: Variant;
  WbemObject: Variant;
  TempCount: LongWord;
  CommandLine: String;
  ExecutablePath: String;
  AppDir: String;
begin
  Result := False;
  AppDir := LowerCase(ExpandConstant('{app}'));
  
  try
    WbemLocator := CreateOleObject('WbemScripting.SWbemLocator');
    WbemServices := WbemLocator.ConnectServer('.', 'root\CIMV2');
    
    // 1. Kiểm tra kiosk_lock.exe
    WbemObjectSet := WbemServices.ExecQuery('SELECT Name FROM Win32_Process WHERE Name = ''kiosk_lock.exe''');
    if not VarIsEmpty(WbemObjectSet) then
    begin
      if WbemObjectSet.Count > 0 then
      begin
        Result := True;
        Exit;
      end;
    end;
    
    // 2. Kiểm tra node.exe liên quan đến server.js và thư mục cài đặt
    WbemObjectSet := WbemServices.ExecQuery('SELECT Name, CommandLine, ExecutablePath FROM Win32_Process WHERE Name = ''node.exe''');
    if not VarIsEmpty(WbemObjectSet) then
    begin
      ProcessEnum := WbemObjectSet._NewEnum;
      while ProcessEnum.Next(1, WbemObject, TempCount) do
      begin
        CommandLine := '';
        ExecutablePath := '';
        if not VarIsNull(WbemObject.CommandLine) then
          CommandLine := LowerCase(String(WbemObject.CommandLine));
        if not VarIsNull(WbemObject.ExecutablePath) then
          ExecutablePath := LowerCase(String(WbemObject.ExecutablePath));
          
        if (Pos('server.js', CommandLine) > 0) and 
           ((Pos(AppDir, CommandLine) > 0) or (Pos(AppDir, ExecutablePath) > 0) or (Pos('toanhockiosk', CommandLine) > 0)) then
        begin
          Result := True;
          Exit;
        end;
      end;
    end;
  except
    // Fallback nếu lỗi WMI
    Result := False;
  end;
end;

procedure KillAppProcesses();
var
  WbemLocator, WbemServices, WbemObjectSet: Variant;
  ProcessEnum: Variant;
  WbemObject: Variant;
  TempCount: LongWord;
  CommandLine: String;
  ExecutablePath: String;
  AppDir: String;
  Pid: Integer;
  ResultCode: Integer;
begin
  AppDir := LowerCase(ExpandConstant('{app}'));
  
  try
    WbemLocator := CreateOleObject('WbemScripting.SWbemLocator');
    WbemServices := WbemLocator.ConnectServer('.', 'root\CIMV2');
    
    // 1. Tắt kiosk_lock.exe
    WbemObjectSet := WbemServices.ExecQuery('SELECT ProcessId FROM Win32_Process WHERE Name = ''kiosk_lock.exe''');
    if not VarIsEmpty(WbemObjectSet) then
    begin
      ProcessEnum := WbemObjectSet._NewEnum;
      while ProcessEnum.Next(1, WbemObject, TempCount) do
      begin
        if not VarIsNull(WbemObject.ProcessId) then
        begin
          Pid := WbemObject.ProcessId;
          Exec('taskkill.exe', Format('/f /pid %d', [Pid]), '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
        end;
      end;
    end;
    
    // 2. Tắt chọn lọc node.exe
    WbemObjectSet := WbemServices.ExecQuery('SELECT ProcessId, CommandLine, ExecutablePath FROM Win32_Process WHERE Name = ''node.exe''');
    if not VarIsEmpty(WbemObjectSet) then
    begin
      ProcessEnum := WbemObjectSet._NewEnum;
      while ProcessEnum.Next(1, WbemObject, TempCount) do
      begin
        CommandLine := '';
        ExecutablePath := '';
        if not VarIsNull(WbemObject.CommandLine) then
          CommandLine := LowerCase(String(WbemObject.CommandLine));
        if not VarIsNull(WbemObject.ExecutablePath) then
          ExecutablePath := LowerCase(String(WbemObject.ExecutablePath));
          
        if (Pos('server.js', CommandLine) > 0) and 
           ((Pos(AppDir, CommandLine) > 0) or (Pos(AppDir, ExecutablePath) > 0) or (Pos('toanhockiosk', CommandLine) > 0)) then
        begin
          if not VarIsNull(WbemObject.ProcessId) then
          begin
            Pid := WbemObject.ProcessId;
            Exec('taskkill.exe', Format('/f /pid %d', [Pid]), '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
          end;
        end;
      end;
    end;
    
    // Chờ 2.0 giây để hệ điều hành Windows giải phóng file handles hoàn toàn
    Sleep(2000);
  except
    // Fallback tắt hàng loạt nếu lỗi WMI
    Exec('taskkill.exe', '/f /im kiosk_lock.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    Exec('taskkill.exe', '/f /im node.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    Sleep(2000);
  end;
end;

function PrepareToInstall(var NeedsRestart: Boolean): String;
var
  PromptMsg: String;
  UserResponse: Integer;
begin
  Result := '';
  
  if IsAppRunning() then
  begin
    PromptMsg := 'Phần mềm Toán Học Kiosk hiện đang chạy.' + #13#10#13#10 +
                'Bộ cài đặt cần đóng phần mềm này trước khi tiến hành cập nhật.' + #13#10 +
                'Bạn có muốn bộ cài đặt tự động đóng phần mềm ngay bây giờ không?';
                
    UserResponse := MsgBox(PromptMsg, mbConfirmation, MB_YESNO or MB_DEFBUTTON1);
    if UserResponse = IDYES then
    begin
      // Thực hiện đóng các tiến trình
      KillAppProcesses();
      
      // Kiểm tra lại xem đã đóng hết chưa
      if IsAppRunning() then
      begin
        Result := 'Không thể tự động tắt phần mềm Toán Học Kiosk. Vui lòng đóng phần mềm thủ công hoặc khởi động lại máy tính trước khi cài đặt.';
      end;
    end
    else
    begin
      // Người dùng chọn không tự động tắt
      Result := 'Quá trình cài đặt đã bị hủy bởi người dùng để bảo toàn trạng thái hoạt động của phần mềm.';
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  ResultCode: Integer;
  SqlitePath: String;
  OldSqlitePath: String;
begin
  if CurStep = ssInstall then
  begin
    // Đóng các tiến trình một lần nữa để làm phương án dự phòng tối hậu
    KillAppProcesses();
    
    // Đổi tên file node_sqlite3.node cũ sang .old (Windows cho phép đổi tên file đang bị khóa)
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
  end
  else if CurStep = ssPostInstall then
  begin
    // Hiển thị thông báo cập nhật thành công trực quan cho người dùng
    MsgBox('Cập nhật phần mềm Toán Học Kiosk thành công!' + #13#10#13#10 +
           'Bạn hãy nhấp đúp vào biểu tượng "Toán Học Kiosk" trên màn hình Desktop để khởi chạy ứng dụng.', 
           mbInformation, MB_OK);
  end;
end;
