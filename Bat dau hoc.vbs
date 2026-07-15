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

' 1. Xóa file .port.tmp cũ nếu tồn tại để chuẩn bị nhận diện cổng mới
portTmpPath = objFSO.BuildPath(strFolder, ".port.tmp")
If objFSO.FileExists(portTmpPath) Then
    On Error Resume Next
    objFSO.DeleteFile portTmpPath, True
    On Error GoTo 0
End If

' Khởi chạy Server Node.js ngầm hoàn toàn và ghi log lỗi ra node_error.log
WshShell.Run "cmd.exe /c node server.js > node_error.log 2>&1", 0, False

' 2. Chờ server sẵn sàng bằng cách đọc cổng động và gửi request kiểm tra (tối đa 40 lần, mỗi lần 300ms)
Dim isReady, attempts, port
isReady = False
attempts = 0
port = "3000"

Do While Not isReady And attempts < 40
    WScript.Sleep 300
    attempts = attempts + 1
    
    If objFSO.FileExists(portTmpPath) Then
        On Error Resume Next
        Dim objTextFile, portStr, http
        Set objTextFile = objFSO.OpenTextFile(portTmpPath, 1)
        portStr = Trim(objTextFile.ReadLine)
        objTextFile.Close
        
        If portStr <> "" And IsNumeric(portStr) Then
            port = portStr
            Set http = CreateObject("MSXML2.XMLHTTP")
            http.open "GET", "http://localhost:" & port & "/student.html", False
            http.send
            If Err.Number = 0 Then
                If http.status = 200 Then
                    isReady = True
                End If
            End If
        End If
        On Error GoTo 0
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
