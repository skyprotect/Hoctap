using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Threading;
using System.Net;
using System.IO;
using System.ComponentModel;
using System.Drawing;

namespace KioskLock
{
    static class Program
    {
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private const int WM_SYSKEYDOWN = 0x0104;
        private const int LLKHF_ALTDOWN = 0x20;

        private const int VK_LWIN = 0x5B;
        private const int VK_RWIN = 0x5C;
        private const int VK_TAB = 0x09;
        private const int VK_ESCAPE = 0x1B;
        private const int VK_APPS = 0x5D;
        private const int VK_F4 = 0x73;

        private static LowLevelKeyboardProc _proc = HookCallback;
        private static IntPtr _hookID = IntPtr.Zero;
        private static bool _restored = false;
        private static Process _chromeProcess = null;
        private static readonly object _lockObj = new object();
        private static bool _isPasswordFormOpen = false;
        private static Mutex _appMutex = null;

        [StructLayout(LayoutKind.Sequential)]
        private struct KBDLLHOOKSTRUCT
        {
            public int vkCode;
            public int scanCode;
            public int flags;
            public int time;
            public IntPtr dwExtraInfo;
        }

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool UnhookWindowsHookEx(IntPtr hhk);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr GetModuleHandle(string lpModuleName);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        internal static void WriteLog(string message)
        {
            try
            {
                string logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "kiosk_lock.log");
                File.AppendAllText(logPath, string.Format("[{0}] {1}\r\n", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), message));
            }
            catch {}
        }

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        public static int GetPortFromEnv()
        {
            // 1. Thử đọc cổng động từ tệp .port.tmp do Node.js server ghi
            try
            {
                string portTmpPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".port.tmp");
                if (File.Exists(portTmpPath))
                {
                    string portStr = File.ReadAllText(portTmpPath).Trim();
                    int port;
                    if (int.TryParse(portStr, out port))
                    {
                        WriteLog(string.Format("Đọc được cổng động từ .port.tmp: {0}", port));
                        return port;
                    }
                }
            }
            catch {}

            // 2. Fallback đọc từ .env hoặc mặc định 3000
            try
            {
                string envPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".env");
                if (File.Exists(envPath))
                {
                    string[] lines = File.ReadAllLines(envPath);
                    foreach (string line in lines)
                    {
                        string trimmed = line.Trim();
                        if (trimmed.StartsWith("PORT="))
                        {
                            string[] parts = trimmed.Split('=');
                            if (parts.Length > 1)
                            {
                                string portStr = parts[1].Trim();
                                int port;
                                if (int.TryParse(portStr, out port))
                                {
                                    return port;
                                }
                            }
                        }
                    }
                }
            }
            catch {}
            return 3000;
        }

        private static string FindChromePath()
        {
            // 1. Thử kiểm tra các đường dẫn mặc định phổ biến
            string[] commonPaths = {
                @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
            };

            foreach (var path in commonPaths)
            {
                if (File.Exists(path))
                {
                    return path;
                }
            }

            // 2. Thử tìm kiếm trong registry (App Paths)
            try
            {
                using (var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"))
                {
                    if (key != null)
                    {
                        object val = key.GetValue("");
                        if (val != null && File.Exists(val.ToString()))
                        {
                            return val.ToString();
                        }
                    }
                }
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"))
                {
                    if (key != null)
                    {
                        object val = key.GetValue("");
                        if (val != null && File.Exists(val.ToString()))
                        {
                            return val.ToString();
                        }
                    }
                }
            }
            catch {}

            return null;
        }

        private static void CopyDirectory(string sourceDir, string destinationDir)
        {
            Directory.CreateDirectory(destinationDir);

            foreach (string file in Directory.GetFiles(sourceDir))
            {
                string dest = Path.Combine(destinationDir, Path.GetFileName(file));
                File.Copy(file, dest, true);
            }

            foreach (string folder in Directory.GetDirectories(sourceDir))
            {
                string dest = Path.Combine(destinationDir, Path.GetFileName(folder));
                CopyDirectory(folder, dest);
            }
        }

        [STAThread]
        static void Main(string[] args)
        {
            bool createdNew;
            _appMutex = new Mutex(true, "Global\\ToanHocKioskMutex", out createdNew);
            if (!createdNew)
            {
                WriteLog("Đã phát hiện một tiến trình KioskLock đang chạy (Mutex đã tồn tại). Thoát tiến trình mới.");
                return;
            }

            WriteLog("Ứng dụng KioskLock bắt đầu khởi chạy.");
            // Đăng ký sự kiện khi ứng dụng thoát để đảm bảo Task Manager luôn được mở lại
            AppDomain.CurrentDomain.ProcessExit += new EventHandler(OnProcessExit);
            Application.ApplicationExit += new EventHandler(OnApplicationExit);

            // Kiểm tra xem Chrome đã được cài đặt chưa
            string chromePath = FindChromePath();
            if (chromePath == null)
            {
                DialogResult dialogResult = MessageBox.Show(
                    "Google Chrome chưa được cài đặt trên máy tính của bạn.\n\nHệ thống cần cài đặt Google Chrome để chạy chương trình ở chế độ Kiosk.\nBạn có muốn tự động tải và cài đặt Google Chrome ngay bây giờ không?", 
                    "Yêu cầu cài đặt Google Chrome", 
                    MessageBoxButtons.YesNo, 
                    MessageBoxIcon.Information
                );

                if (dialogResult == DialogResult.Yes)
                {
                    ChromeDownloadForm downloadForm = new ChromeDownloadForm();
                    Application.Run(downloadForm);

                    if (downloadForm.IsSuccess)
                    {
                        chromePath = FindChromePath();
                    }
                    else
                    {
                        string errMsg = string.IsNullOrEmpty(downloadForm.ErrorMessage) ? "Người dùng đã hủy bỏ hoặc cài đặt thất bại." : downloadForm.ErrorMessage;
                        MessageBox.Show("Cài đặt Google Chrome thất bại:\n" + errMsg, "Lỗi cài đặt", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }
                }
                else
                {
                    return;
                }
            }

            if (chromePath == null)
            {
                MessageBox.Show("Không thể tìm thấy Google Chrome sau khi cài đặt. Vui lòng cài đặt Google Chrome thủ công.", "Lỗi Kiosk", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            // Cấu hình đường dẫn lưu thông tin Chrome (profile) dùng chung cố định trên Windows
            string profilePath = @"C:\ChromeKioskToan6";
            
            // Tự động di trú dữ liệu cũ từ thư mục dự án local sang thư mục dùng chung nếu cần
            string localProfilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "chrome_profile");
            if (Directory.Exists(localProfilePath) && !Directory.Exists(profilePath))
            {
                try
                {
                    CopyDirectory(localProfilePath, profilePath);
                }
                catch {}
            }

            // Nếu chưa có thư mục profile dùng chung thì tạo mới
            if (!Directory.Exists(profilePath))
            {
                try
                {
                    Directory.CreateDirectory(profilePath);
                }
                catch {}
            }

            // 1. Vô hiệu hóa Task Manager
            SetTaskManager(false);
            WriteLog("Đã vô hiệu hóa Task Manager.");

            // 2. Cài đặt Keyboard Hook
            _hookID = SetHook(_proc);
            WriteLog("Đã cài đặt Keyboard Hook.");

            // 3. Khởi chạy Chrome Kiosk với đường dẫn hồ sơ động
            int port = GetPortFromEnv();
            string chromeArgs = string.Format("--kiosk http://localhost:{0} --user-data-dir=\"{1}\" --disable-cache --disk-cache-size=1 --media-cache-size=1 --autoplay-policy=no-user-gesture-required", port, profilePath);
            
            try
            {
                _chromeProcess = Process.Start(new ProcessStartInfo
                {
                    FileName = chromePath,
                    Arguments = chromeArgs,
                    UseShellExecute = false
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show("Không thể khởi chạy Google Chrome Kiosk:\n" + ex.Message, "Lỗi Kiosk", MessageBoxButtons.OK, MessageBoxIcon.Error);
                Cleanup();
                return;
            }

            if (_chromeProcess != null)
            {
                // Khởi chạy luồng Heartbeat theo dõi Server Node.js
                StartHeartbeat(port);

                // Luồng giám sát file cờ thoát Kiosk Mode
                Thread exitWatcherThread = new Thread(() =>
                {
                    string flagPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "kiosk_exit_flag.tmp");
                    while (!_restored)
                    {
                        Thread.Sleep(500); // Kiểm tra mỗi 500ms
                        if (_restored) break;

                        if (System.IO.File.Exists(flagPath))
                        {
                            WriteLog("Phát hiện file flag thoát Kiosk Mode từ Node.js server. Tiến hành thoát...");
                            Cleanup();
                            Environment.Exit(0);
                        }
                    }
                });
                exitWatcherThread.IsBackground = true;
                exitWatcherThread.Start();

                // Luồng giám sát Chrome Kiosk thoát
                Thread monitorThread = new Thread(() =>
                {
                    _chromeProcess.WaitForExit();
                    Cleanup();
                    Application.Exit();
                });
                monitorThread.IsBackground = true;
                monitorThread.Start();
            }
            else
            {
                Cleanup();
                return;
            }

            Application.Run();
        }

        private static void Cleanup()
        {
            if (_restored) return;
            _restored = true;

            WriteLog("Bắt đầu thực hiện Cleanup.");

            // Tắt Chrome Kiosk nếu nó vẫn đang chạy
            if (_chromeProcess != null && !_chromeProcess.HasExited)
            {
                try
                {
                    WriteLog("Đang tắt tiến trình Chrome Kiosk...");
                    _chromeProcess.Kill();
                }
                catch (Exception ex)
                {
                    WriteLog("Lỗi khi tắt Chrome: " + ex.Message);
                }
            }

            // Gỡ hook
            if (_hookID != IntPtr.Zero)
            {
                WriteLog("Đang gỡ bỏ Keyboard Hook...");
                UnhookWindowsHookEx(_hookID);
                _hookID = IntPtr.Zero;
            }

            // Kích hoạt lại Task Manager
            WriteLog("Đang kích hoạt lại Task Manager...");
            SetTaskManager(true);

            // Kiểm tra xem có file flag yêu cầu giữ Node Server hay không
            string flagPath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "kiosk_exit_flag.tmp");
            if (System.IO.File.Exists(flagPath))
            {
                try
                {
                    System.IO.File.Delete(flagPath);
                }
                catch {}
            }
            else
            {
                // Tắt server Node.js đang chạy cổng 3000
                WriteLog("Đang tắt Node.js server...");
                KillNodeServer();
            }

            WriteLog("Cleanup hoàn tất.");
        }

        private static void OnProcessExit(object sender, EventArgs e)
        {
            Cleanup();
        }

        private static void OnApplicationExit(object sender, EventArgs e)
        {
            Cleanup();
        }

        private static void SetTaskManager(bool enable)
        {
            try
            {
                using (var key = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Policies\System"))
                {
                    if (key != null)
                    {
                        if (enable)
                        {
                            key.DeleteValue("DisableTaskMgr", false);
                        }
                        else
                        {
                            key.SetValue("DisableTaskMgr", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        }
                    }
                }
            }
            catch {}
        }

        private static void KillNodeServer()
        {
            try
            {
                int port = GetPortFromEnv();
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = string.Format("-WindowStyle Hidden -Command \"$conn = Get-NetTCPConnection -LocalPort {0} -ErrorAction SilentlyContinue; if ($conn) {{ Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue }}\"", port),
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                Process.Start(psi);
            }
            catch {}
        }

        private static IntPtr SetHook(LowLevelKeyboardProc proc)
        {
            using (Process curProcess = Process.GetCurrentProcess())
            using (ProcessModule curModule = curProcess.MainModule)
            {
                return SetWindowsHookEx(WH_KEYBOARD_LL, proc, GetModuleHandle(curModule.ModuleName), 0);
            }
        }

        private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)WM_SYSKEYDOWN))
            {
                KBDLLHOOKSTRUCT kbStruct = (KBDLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(KBDLLHOOKSTRUCT));

                // 1. Chặn phím Windows
                if (kbStruct.vkCode == VK_LWIN || kbStruct.vkCode == VK_RWIN)
                {
                    return (IntPtr)1;
                }

                // 2. Chặn phím Apps
                if (kbStruct.vkCode == VK_APPS)
                {
                    return (IntPtr)1;
                }

                // 3. Chặn Alt + Tab, Alt + Esc
                bool alt = (kbStruct.flags & LLKHF_ALTDOWN) != 0;
                if (alt && (kbStruct.vkCode == VK_TAB || kbStruct.vkCode == VK_ESCAPE))
                {
                    return (IntPtr)1;
                }

                // 4. Chặn Ctrl + Esc
                bool ctrl = (Control.ModifierKeys & Keys.Control) != 0;
                if (ctrl && kbStruct.vkCode == VK_ESCAPE)
                {
                    return (IntPtr)1;
                }

                // 5. Chặn Alt + F4 và yêu cầu mật khẩu
                if (alt && kbStruct.vkCode == VK_F4)
                {
                    WriteLog("Phát hiện tổ hợp phím Alt + F4!");
                    ShowPasswordPrompt();
                    return (IntPtr)1;
                }

                // 5b. Phát hiện phím tắt khẩn cấp Ctrl + Shift + Alt + F12 (VK_F12 = 0x7B)
                bool shift = (Control.ModifierKeys & Keys.Shift) != 0;
                if (ctrl && shift && alt && kbStruct.vkCode == 0x7B)
                {
                    WriteLog("Phát hiện tổ hợp phím khẩn cấp Ctrl + Shift + Alt + F12!");
                    ShowPasswordPrompt();
                    return (IntPtr)1;
                }
            }
            return CallNextHookEx(_hookID, nCode, wParam, lParam);
        }

        private static void StartHeartbeat(int port)
        {
            Thread heartbeatThread = new Thread(() =>
            {
                int failCount = 0;
                string url = string.Format("http://localhost:{0}/api/health", port);
                WriteLog("Bắt đầu luồng Heartbeat theo dõi server Node.js tại: " + url);
                while (!_restored)
                {
                    Thread.Sleep(3000);
                    if (_restored) break;

                    try
                    {
                        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                        request.Timeout = 2000;
                        request.Method = "GET";
                        using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                        {
                            if (response.StatusCode == HttpStatusCode.OK)
                            {
                                failCount = 0; // reset
                            }
                            else
                            {
                                failCount++;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        failCount++;
                        WriteLog(string.Format("Heartbeat ping thất bại: {0} (Số lần thất bại liên tiếp: {1})", ex.Message, failCount));
                    }

                    if (failCount >= 3)
                    {
                        WriteLog("Node.js server không phản hồi liên tục 3 lần. Tự động thoát Kiosk Mode khẩn cấp.");
                        Cleanup();
                        Environment.Exit(0);
                    }
                }
            });
            heartbeatThread.IsBackground = true;
            heartbeatThread.Start();
        }

        private static void ShowPasswordPrompt()
        {
            lock (_lockObj)
            {
                if (_isPasswordFormOpen)
                {
                    WriteLog("Hộp thoại nhập mật khẩu đang mở, bỏ qua yêu cầu mới.");
                    return;
                }
                _isPasswordFormOpen = true;
            }

            WriteLog("Đang chuẩn bị hiển thị hộp thoại mật khẩu trên luồng STA...");
            IntPtr activeWindowHandle = GetForegroundWindow();
            WriteLog("Cửa sổ Foreground hiện tại (được xác định làm owner): " + activeWindowHandle);

            Thread passwordThread = new Thread(() =>
            {
                try
                {
                    using (PasswordForm form = new PasswordForm())
                    {
                        IWin32Window owner = activeWindowHandle != IntPtr.Zero ? new WindowWrapper(activeWindowHandle) : null;
                        WriteLog("Hiển thị ShowDialog với owner wrapper...");
                        
                        DialogResult result = form.ShowDialog(owner);
                        WriteLog("Kết quả ShowDialog: " + result);
                        
                        if (result == DialogResult.OK)
                        {
                            WriteLog("Mật khẩu chính xác. Thực hiện Cleanup và thoát...");
                            Cleanup();
                            Environment.Exit(0);
                        }
                    }
                }
                catch (Exception ex)
                {
                    WriteLog("Lỗi trong luồng hiển thị form mật khẩu: " + ex.ToString());
                    MessageBox.Show("Lỗi hiển thị form mật khẩu: " + ex.Message, "Lỗi Kiosk", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                finally
                {
                    lock (_lockObj)
                    {
                        _isPasswordFormOpen = false;
                    }
                    WriteLog("Đã đặt lại trạng thái _isPasswordFormOpen = false.");
                }
            });
            passwordThread.SetApartmentState(ApartmentState.STA);
            passwordThread.Start();
        }
    }

    public class ChromeDownloadForm : Form
    {
        private ProgressBar progressBar;
        private Label labelStatus;
        private string tempFilePath;
        public bool IsSuccess { get; private set; }
        public string ErrorMessage { get; private set; }

        public ChromeDownloadForm()
        {
            this.Text = "Cài đặt Google Chrome";
            this.Size = new Size(400, 150);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MaximizeBox = false;
            this.MinimizeBox = false;

            labelStatus = new Label();
            labelStatus.Text = "Đang kết nối tới máy chủ Google...";
            labelStatus.Location = new Point(20, 20);
            labelStatus.Size = new Size(360, 25);
            this.Controls.Add(labelStatus);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(20, 50);
            progressBar.Size = new Size(340, 23);
            progressBar.Minimum = 0;
            progressBar.Maximum = 100;
            this.Controls.Add(progressBar);

            tempFilePath = Path.Combine(Path.GetTempPath(), "chrome_installer.exe");
            IsSuccess = false;

            this.Load += new EventHandler(ChromeDownloadForm_Load);
        }

        private void ChromeDownloadForm_Load(object sender, EventArgs e)
        {
            try
            {
                // Kích hoạt TLS 1.2
                ServicePointManager.SecurityProtocol |= (SecurityProtocolType)3072;

                WebClient client = new WebClient();
                client.DownloadProgressChanged += new DownloadProgressChangedEventHandler(client_DownloadProgressChanged);
                client.DownloadFileCompleted += new AsyncCompletedEventHandler(client_DownloadFileCompleted);
                
                client.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                
                client.DownloadFileAsync(new Uri("https://dl.google.com/chrome/install/latest/chrome_installer.exe"), tempFilePath);
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                this.Close();
            }
        }

        private void client_DownloadProgressChanged(object sender, DownloadProgressChangedEventArgs e)
        {
            progressBar.Value = e.ProgressPercentage;
            labelStatus.Text = string.Format("Đang tải Google Chrome: {0}% ({1:0.0} MB / {2:0.0} MB)", 
                e.ProgressPercentage, 
                (double)e.BytesReceived / 1024 / 1024, 
                (double)e.TotalBytesToReceive / 1024 / 1024);
        }

        private void client_DownloadFileCompleted(object sender, AsyncCompletedEventArgs e)
        {
            if (e.Error != null)
            {
                ErrorMessage = e.Error.Message;
                this.Close();
                return;
            }

            labelStatus.Text = "Đang cài đặt Google Chrome âm thầm. Vui lòng chờ...";
            progressBar.Style = ProgressBarStyle.Marquee;

            Thread installThread = new Thread(() =>
            {
                try
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = tempFilePath,
                        Arguments = "/silent /install",
                        UseShellExecute = true
                    };
                    Process p = Process.Start(psi);
                    if (p != null)
                    {
                        p.WaitForExit();
                        IsSuccess = true;
                    }
                    else
                    {
                        ErrorMessage = "Không thể khởi chạy bộ cài đặt.";
                    }
                }
                catch (Exception ex)
                {
                    ErrorMessage = ex.Message;
                }
                finally
                {
                    try
                    {
                        if (File.Exists(tempFilePath))
                        {
                            File.Delete(tempFilePath);
                        }
                    }
                    catch {}

                    this.Invoke((MethodInvoker)delegate {
                        this.Close();
                    });
                }
            });
            installThread.IsBackground = true;
            installThread.Start();
        }
    }

    public class WindowWrapper : IWin32Window
    {
        private readonly IntPtr _hwnd;
        public WindowWrapper(IntPtr handle)
        {
            _hwnd = handle;
        }
        public IntPtr Handle
        {
            get { return _hwnd; }
        }
    }

    public class PasswordForm : Form
    {
        private Label lblPrompt;
        private TextBox txtPassword;
        private Button btnConfirm;
        private Button btnCancel;

        public PasswordForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.lblPrompt = new Label();
            this.txtPassword = new TextBox();
            this.btnConfirm = new Button();
            this.btnCancel = new Button();
            this.SuspendLayout();

            // lblPrompt
            this.lblPrompt.Location = new Point(20, 20);
            this.lblPrompt.Size = new Size(260, 20);
            this.lblPrompt.Text = "Nhập mật khẩu để thoát:";
            this.lblPrompt.Font = new Font("Segoe UI", 10F, FontStyle.Regular);

            // txtPassword
            this.txtPassword.Location = new Point(20, 45);
            this.txtPassword.Size = new Size(245, 25);
            this.txtPassword.PasswordChar = '*';
            this.txtPassword.Font = new Font("Segoe UI", 10F, FontStyle.Regular);
            this.txtPassword.KeyDown += new KeyEventHandler(txtPassword_KeyDown);

            // btnConfirm
            this.btnConfirm.Location = new Point(50, 85);
            this.btnConfirm.Size = new Size(80, 30);
            this.btnConfirm.Text = "Xác nhận";
            this.btnConfirm.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            this.btnConfirm.Click += new EventHandler(btnConfirm_Click);

            // btnCancel
            this.btnCancel.Location = new Point(155, 85);
            this.btnCancel.Size = new Size(80, 30);
            this.btnCancel.Text = "Hủy";
            this.btnCancel.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            this.btnCancel.Click += new EventHandler(btnCancel_Click);

            // PasswordForm
            this.Text = "Xác thực thoát ứng dụng";
            this.ClientSize = new Size(285, 135);
            this.Controls.Add(this.lblPrompt);
            this.Controls.Add(this.txtPassword);
            this.Controls.Add(this.btnConfirm);
            this.Controls.Add(this.btnCancel);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.ControlBox = false;
            this.TopMost = true;
            this.BackColor = Color.White;

            this.AcceptButton = this.btnConfirm;
            this.CancelButton = this.btnCancel;

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private void txtPassword_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                ValidatePassword();
            }
        }

        private void btnConfirm_Click(object sender, EventArgs e)
        {
            ValidatePassword();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        private bool VerifyPinWithServer(string pin)
        {
            try
            {
                int port = Program.GetPortFromEnv();
                string url = string.Format("http://localhost:{0}/api/verify-pin", port);
                
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.Timeout = 2000; // 2 seconds timeout
                
                string jsonPayload = string.Format("{{\"pin\":\"{0}\"}}", pin);
                byte[] byteArray = System.Text.Encoding.UTF8.GetBytes(jsonPayload);
                request.ContentLength = byteArray.Length;
                
                using (Stream dataStream = request.GetRequestStream())
                {
                    dataStream.Write(byteArray, 0, byteArray.Length);
                }
                
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        return true;
                    }
                }
            }
            catch (WebException ex)
            {
                if (ex.Response != null)
                {
                    using (HttpWebResponse errorResponse = (HttpWebResponse)ex.Response)
                    {
                        if (errorResponse.StatusCode == HttpStatusCode.Forbidden || errorResponse.StatusCode == HttpStatusCode.Unauthorized)
                        {
                            Program.WriteLog("Server trả về mã lỗi Forbidden/Unauthorized - PIN sai.");
                            return false;
                        }
                    }
                }
                Program.WriteLog("Lỗi WebException khi gọi server verify-pin: " + ex.Message);
            }
            catch (Exception ex)
            {
                Program.WriteLog("Lỗi chung khi gọi server verify-pin: " + ex.Message);
            }
            
            // Fallback nếu mất kết nối server hoặc chưa bật server Node.js: kiểm tra cục bộ với mật khẩu backdoor
            return pin == "123456" || pin == "haidangppk";
        }

        private void ValidatePassword()
        {
            string enteredPassword = txtPassword.Text;
            if (VerifyPinWithServer(enteredPassword))
            {
                Program.WriteLog("Người dùng đã nhập đúng mật khẩu. Gửi DialogResult.OK.");
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            else
            {
                Program.WriteLog("Người dùng nhập sai mật khẩu: " + enteredPassword);
                MessageBox.Show("Mật khẩu không chính xác!", "Lỗi xác thực", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtPassword.Clear();
                txtPassword.Focus();
            }
        }
    }
}
