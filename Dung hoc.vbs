Set WshShell = CreateObject("WScript.Shell")
strPath = Wscript.ScriptFullName
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.GetFile(strPath)
strFolder = objFSO.GetParentFolderName(objFile)
WshShell.CurrentDirectory = strFolder

' 1. Đọc cổng động từ .port.tmp trước, fallback sang .env hoặc 3000
Dim port
port = "3000"
portTmpPath = objFSO.BuildPath(strFolder, ".port.tmp")
If objFSO.FileExists(portTmpPath) Then
    On Error Resume Next
    Set objTextFile = objFSO.OpenTextFile(portTmpPath, 1)
    strLine = Trim(objTextFile.ReadLine)
    objTextFile.Close
    If strLine <> "" And IsNumeric(strLine) Then
        port = strLine
    End If
    On Error GoTo 0
End If

If port = "3000" Then
    strEnvFile = objFSO.BuildPath(strFolder, ".env")
    If objFSO.FileExists(strEnvFile) Then
        On Error Resume Next
        Set objTextFile = objFSO.OpenTextFile(strEnvFile, 1)
        Do Until objTextFile.AtEndOfStream
            strLine = Trim(objTextFile.ReadLine)
            If Left(strLine, 5) = "PORT=" Then
                port = Trim(Mid(strLine, 6))
                Exit Do
            End If
        Loop
        objTextFile.Close
        On Error GoTo 0
    End If
End If

' 2. Ép tắt triệt để kiosk_lock.exe, Chrome Kiosk và Node.js server
psCmd = "Stop-Process -Name kiosk_lock -Force -ErrorAction SilentlyContinue; " & _
        "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'chrome.exe' -and $_.CommandLine -like '*C:\ChromeKioskToan6*' } | Stop-Process -Force -ErrorAction SilentlyContinue; " & _
        "$conn = Get-NetTCPConnection -LocalPort " & port & " -ErrorAction SilentlyContinue; if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }; " & _
        "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*server.js*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

WshShell.Run "powershell.exe -WindowStyle Hidden -Command """ & psCmd & """", 0, True

' 3. Xóa các tệp cờ tạm
flagPath = objFSO.BuildPath(strFolder, "kiosk_exit_flag.tmp")
If objFSO.FileExists(flagPath) Then
    On Error Resume Next
    objFSO.DeleteFile flagPath, True
    On Error GoTo 0
End If

If objFSO.FileExists(portTmpPath) Then
    On Error Resume Next
    objFSO.DeleteFile portTmpPath, True
    On Error GoTo 0
End If

' 4. Khôi phục Task Manager (nếu đã bị kiosk_lock.exe tắt)
WshShell.Run "powershell.exe -WindowStyle Hidden -Command ""Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name DisableTaskMgr -ErrorAction SilentlyContinue""", 0, True

' Hàm giải mã Unicode để đảm bảo hiển thị tiếng Việt hoàn hảo 100% trên mọi phiên bản Windows
Function U(txt)
    Dim res, i, hexVal
    res = ""
    i = 1
    Do While i <= Len(txt)
        If Mid(txt, i, 2) = "\u" And i + 5 <= Len(txt) Then
            hexVal = Mid(txt, i + 2, 4)
            res = res & ChrW(CLng("&H" & hexVal))
            i = i + 6
        Else
            res = res & Mid(txt, i, 1)
            i = i + 1
        End If
    Loop
    U = res
End Function

' 5. Thông báo hoàn thành
MsgBox U("\u0110\u00E3 d\u1EEBng ho\u00E0n to\u00E0n ph\u1EA7n m\u1EC1m h\u1ECDc t\u1EADp th\u00E0nh c\u00F4ng!") & vbCrLf & _
       U("T\u1EA5t c\u1EA3 ti\u1EBFn tr\u00ECnh \u0111\u00E3 \u0111\u01B0\u1EE3c d\u1ECDn d\u1EB9p v\u00E0 Task Manager \u0111\u00E3 \u0111\u01B0\u1EE3c kh\u00F4i ph\u1EE5c."), _
       64, U("To\u00E1n & Ti\u1EBFng Anh - D\u1EEBng h\u1EC7 th\u1ED1ng")

