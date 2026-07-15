Set WshShell = CreateObject("WScript.Shell")
strPath = Wscript.ScriptFullName
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.GetFile(strPath)
strFolder = objFSO.GetParentFolderName(objFile)
WshShell.CurrentDirectory = strFolder


' TỐI ƯU HIỆU NĂNG & TRÁNH TRÙNG LẶP TIẾN TRÌNH (SINGLE INSTANCE)
' A. Kiểm tra xem có file "Bat dau hoc.vbs" nào khác đang chạy không (tránh click đúp/click liên tục khi máy chậm)
Dim objWMIService, colItems, objItem, instanceCount
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
Set colItems = objWMIService.ExecQuery("Select * from Win32_Process Where Name = 'wscript.exe' Or Name = 'cscript.exe'")
instanceCount = 0
For Each objItem in colItems
    If InStr(LCase(objItem.CommandLine), "bat dau hoc.vbs") > 0 Then
        instanceCount = instanceCount + 1
    End If
Next

If instanceCount > 1 Then
    WScript.Quit
End If

' B. Kiểm tra xem kiosk_lock.exe đã đang hoạt động chưa (tránh chạy lại khi ứng dụng đã hiển thị)
Set colItems = objWMIService.ExecQuery("Select * from Win32_Process Where Name = 'kiosk_lock.exe'")
If colItems.Count > 0 Then
    WScript.Quit
End If

' 1. Khởi chạy Server Node.js ngầm hoàn toàn
WshShell.Run "node server.js", 0, False

' 2. Chờ server sẵn sàng bằng cách gửi request kiểm tra định kỳ (tối đa 30 lần, mỗi lần cách nhau 300ms)
Dim http, isReady, attempts
isReady = False
attempts = 0

Do While Not isReady And attempts < 30
    On Error Resume Next
    Set http = CreateObject("MSXML2.ServerXMLHTTP")
    http.open "GET", "http://localhost:3000/student.html", False
    http.send
    If Err.Number = 0 Then
        If http.status = 200 Then
            isReady = True
        End If
    End If
    On Error GoTo 0
    
    If Not isReady Then
        WScript.Sleep 300 ' Chờ 300ms rồi thử lại
        attempts = attempts + 1
    End If
Loop

' 3. Tạo thư mục profile Chrome riêng để tránh xung đột
strProfile = strFolder & "\chrome_profile"
If Not objFSO.FolderExists(strProfile) Then
    On Error Resume Next
    objFSO.CreateFolder(strProfile)
    On Error GoTo 0
End If

' 4. Chạy kiosk_lock.exe: khóa bàn phím, ẩn Task Manager, mở Chrome Kiosk
'    kiosk_lock.exe sẽ tự tắt Node Server khi thoát
WshShell.Run "kiosk_lock.exe", 0, False
