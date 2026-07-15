Set WshShell = CreateObject("WScript.Shell")
strPath = Wscript.ScriptFullName
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.GetFile(strPath)
strFolder = objFSO.GetParentFolderName(objFile)

' 1. Tắt server Node.js đang chiếm port 3000
Dim port
port = "3000"
strEnvFile = objFSO.BuildPath(strFolder, ".env")
If objFSO.FileExists(strEnvFile) Then
    Set objTextFile = objFSO.OpenTextFile(strEnvFile, 1)
    Do Until objTextFile.AtEndOfStream
        strLine = Trim(objTextFile.ReadLine)
        If Left(strLine, 5) = "PORT=" Then
            port = Trim(Mid(strLine, 6))
            Exit Do
        End If
    Loop
    objTextFile.Close
End If

WshShell.Run "powershell.exe -WindowStyle Hidden -Command ""$conn = Get-NetTCPConnection -LocalPort " & port & " -ErrorAction SilentlyContinue; if ($conn) { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }""", 0, True

' 2. Khôi phục Task Manager (nếu đã bị kiosk_lock.exe tắt)
WshShell.Run "powershell.exe -WindowStyle Hidden -Command ""Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name DisableTaskMgr -ErrorAction SilentlyContinue""", 0, True

' 3. Thông báo hoàn thành
MsgBox "Đã dừng phần mềm học tập thành công!" & Chr(13) & "Task Manager đã được khôi phục.", 64, "Toán & Tiếng Anh - Dừng hệ thống"
