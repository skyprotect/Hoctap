package com.skyprotect.tabletlock

import android.app.Activity
import android.app.PendingIntent
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageInstaller
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var txtPinDisplay: TextView
    private lateinit var txtStatus: TextView
    private var currentPin = ""

    private lateinit var dpm: DevicePolicyManager
    private lateinit var adminComponent: ComponentName

    private val client = OkHttpClient()
    private val FIREBASE_RTDB_URL = "https://binhminhchamhoc-default-rtdb.firebaseio.com/"

    private val remotePollHandler = Handler(Looper.getMainLooper())
    private val remotePollRunnable = object : Runnable {
        override fun run() {
            pollRemoteCommand()
            remotePollHandler.postDelayed(this, 3000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Khởi tạo Device Policy Manager
        dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(this, AdminReceiver::class.java)

        initViews()
        setupLockBehavior()
        checkOverlayPermission()
        checkBatteryOptimization()

        // Khởi chạy vòng lặp kiểm tra lệnh từ xa
        remotePollHandler.post(remotePollRunnable)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
    }

    override fun onResume() {
        super.onResume()
        
        // Kiểm tra thời gian chơi còn hiệu lực hay không
        val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
        val remainingTimeSeconds = sharedPref.getLong("remainingTimeSeconds", 0L)
        val currentToken = sharedPref.getString("currentToken", "") ?: ""
        val lastActiveDate = sharedPref.getString("lastActiveDate", "") ?: ""
        val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())
        
        val isTimeValid = remainingTimeSeconds > 0 && currentToken.isNotEmpty() && (lastActiveDate.isEmpty() || lastActiveDate == todayStr)
        
        if (isTimeValid) {
            // Thiết lập Launcher hệ thống gốc làm Launcher mặc định để trẻ chơi bình thường không bị lỗi vòng lặp
            try {
                if (dpm.isDeviceOwnerApp(packageName)) {
                    val launcherComponent = getSystemLauncherComponent()
                    if (launcherComponent != null) {
                        val filter = IntentFilter(Intent.ACTION_MAIN).apply {
                            addCategory(Intent.CATEGORY_HOME)
                            addCategory(Intent.CATEGORY_DEFAULT)
                        }
                        dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)
                        dpm.addPersistentPreferredActivity(adminComponent, filter, launcherComponent)
                    } else {
                        dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)
                    }
                    
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        dpm.clearUserRestriction(adminComponent, android.os.UserManager.DISALLOW_APPS_CONTROL)
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        dpm.setAutoTimeRequired(adminComponent, false)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
            // Chủ động khởi chạy lại Foreground Service để tiếp tục đếm ngược thời gian chơi còn lại
            try {
                val serviceIntent = Intent(this, KioskService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(serviceIntent)
                } else {
                    startService(serviceIntent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }

            launchSystemLauncher()
            finish() // Đóng màn hình khóa để tránh nó hiển thị đè lên màn hình chính
        } else {
            // Hết giờ chơi hoặc chưa mở khóa -> Kích hoạt lại Kiosk Mode để khóa cứng
            
            // Đồng bộ trạng thái: Chủ động dừng KioskService và xóa bong bóng nổi
            try {
                val serviceIntent = Intent(this, KioskService::class.java)
                stopService(serviceIntent)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            
            // Xóa sạch trạng thái preferences để đồng bộ tuyệt đối
            try {
                val sharedPrefEdit = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE).edit()
                sharedPrefEdit.putLong("remainingTimeSeconds", 0L)
                sharedPrefEdit.putString("currentToken", "")
                sharedPrefEdit.putString("currentHistoryId", "")
                sharedPrefEdit.putInt("initialMinutes", 0)
                sharedPrefEdit.putString("lastActiveDate", "")
                sharedPrefEdit.commit()
            } catch (e: Exception) {
                e.printStackTrace()
            }

            // Thử khóa ngay lập tức
            startKioskMode()
            // Thử lại sau 1.5 giây để đảm bảo hệ thống Android nhận dạng xong Device Owner khi app vừa cập nhật
            Handler(Looper.getMainLooper()).postDelayed({
                startKioskMode()
            }, 1500)
            updateStatusOnFirebase("locked")
        }
    }

    private fun getSystemLauncherComponent(): ComponentName? {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
        }
        val pm = packageManager
        val resolveInfos = pm.queryIntentActivities(intent, 0)
        for (resolveInfo in resolveInfos) {
            val pkgName = resolveInfo.activityInfo.packageName
            if (pkgName != packageName) {
                return ComponentName(pkgName, resolveInfo.activityInfo.name)
            }
        }
        return null
    }

    private fun launchSystemLauncher() {
        try {
            val launcherComponent = getSystemLauncherComponent()
            if (launcherComponent != null) {
                val intent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    component = launcherComponent
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(intent)
            } else {
                moveTaskToBack(true)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            moveTaskToBack(true)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        remotePollHandler.removeCallbacks(remotePollRunnable)
    }

    private fun checkBatteryOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val pm = getSystemService(Context.POWER_SERVICE) as android.os.PowerManager
            if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                try {
                    val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:$packageName")
                    }
                    startActivity(intent)
                } catch (e: Exception) {
                    e.printStackTrace()
                    Toast.makeText(this, "Vui lòng tắt tối ưu hóa pin cho ứng dụng trong Cài đặt để tránh bị tắt ngầm!", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun initViews() {
        txtPinDisplay = findViewById(R.id.txtPinDisplay)
        txtStatus = findViewById(R.id.txtStatus)

        // Thiết lập sự kiện cho bàn phím số
        val btnIds = arrayOf(
            R.id.btn0, R.id.btn1, R.id.btn2, R.id.btn3, R.id.btn4,
            R.id.btn5, R.id.btn6, R.id.btn7, R.id.btn8, R.id.btn9
        )

        for (i in 0..9) {
            findViewById<Button>(btnIds[i]).setOnClickListener {
                if (currentPin.length < 6) {
                    currentPin += i.toString()
                    updatePinDisplay()
                }
            }
        }

        findViewById<Button>(R.id.btnDelete).setOnClickListener {
            if (currentPin.isNotEmpty()) {
                currentPin = currentPin.substring(0, currentPin.length - 1)
                updatePinDisplay()
            }
        }

        findViewById<Button>(R.id.btnConfirm).setOnClickListener {
            if (currentPin.length == 6) {
                verifyPinWithFirebase(currentPin)
            } else {
                showError("Vui lòng nhập đầy đủ 6 chữ số!")
            }
        }

        findViewById<Button>(R.id.btnUpdateApk).setOnClickListener {
            downloadAndInstallUpdate()
        }

        // Hiển thị số phiên bản hiện tại
        try {
            val pInfo = packageManager.getPackageInfo(packageName, 0)
            val version = pInfo.versionName
            val txtVersion = findViewById<TextView>(R.id.txtAppVersion)
            txtVersion.text = "Phiên bản: v2.8 (Cập nhật: 19/07/2026 15:45)"
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun updatePinDisplay() {
        // Hiển thị mã PIN dạng che giấu (bullet) để tăng bảo mật
        val dots = "*".repeat(currentPin.length)
        txtPinDisplay.text = dots
        txtStatus.visibility = View.GONE
    }

    private fun setupLockBehavior() {
        // Tắt chế độ nhấn giữ nút Nguồn và tắt phím hệ thống
        window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )
    }

    private fun startKioskMode() {
        try {
            // Chủ động dừng KioskService để đảm bảo bong bóng đếm ngược biến mất khi khóa cứng
            try {
                val serviceIntent = Intent(this, KioskService::class.java)
                stopService(serviceIntent)
            } catch (e: Exception) {
                e.printStackTrace()
            }

            if (dpm.isDeviceOwnerApp(packageName)) {
                // Thiết lập các hạn chế bảo mật Device Owner khi ở chế độ Kiosk khóa cứng
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    dpm.addUserRestriction(adminComponent, android.os.UserManager.DISALLOW_SAFE_BOOT)
                    dpm.addUserRestriction(adminComponent, android.os.UserManager.DISALLOW_FACTORY_RESET)
                    dpm.addUserRestriction(adminComponent, android.os.UserManager.DISALLOW_APPS_CONTROL)
                    dpm.addUserRestriction(adminComponent, android.os.UserManager.DISALLOW_DEBUGGING_FEATURES)
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    dpm.setAutoTimeRequired(adminComponent, true)
                }

                // Xóa cấu hình phím Home cũ để tránh xung đột trước khi đặt Launcher mới
                dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)

                // Đặt ứng dụng này làm Launcher mặc định của máy tính bảng
                val filter = IntentFilter(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    addCategory(Intent.CATEGORY_DEFAULT)
                }
                val activityComponent = ComponentName(packageName, MainActivity::class.java.name)
                dpm.addPersistentPreferredActivity(adminComponent, filter, activityComponent)

                // Cho phép mở các ứng dụng cơ bản khác khi được mở khóa (phải đặt trước khi startLockTask)
                val launcherComponent = getSystemLauncherComponent()
                val launcherPkg = launcherComponent?.packageName ?: "com.android.launcher3"
                dpm.setLockTaskPackages(adminComponent, arrayOf(packageName, launcherPkg, "com.android.chrome"))
                
                // Khóa cứng thiết bị, học sinh không thể thoát ra ngoài
                startLockTask()
            } else {
                Toast.makeText(this, "Chưa cấu hình Device Owner! Vui lòng đọc file README.md để thiết lập.", Toast.LENGTH_LONG).show()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun verifyPinWithFirebase(pin: String) {
        showStatus("Đang xác thực...", false)

        val url = "$FIREBASE_RTDB_URL/tablet_tokens/$pin.json"
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showError("Lỗi kết nối Firebase: " + e.message)
                }
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    if (!response.isSuccessful || responseBody == null || responseBody == "null") {
                        runOnUiThread {
                            showError("Mã bảo mật không tồn tại!")
                        }
                        return
                    }

                    val jsonObject = JsonParser.parseString(responseBody).asJsonObject
                    val status = jsonObject.get("status").asString
                    val minutes = jsonObject.get("minutes").asInt

                    if (status != "unused") {
                        runOnUiThread {
                            showError("Mã bảo mật này đã được sử dụng!")
                        }
                    } else {
                        // Kích hoạt token thành công
                        activateToken(pin, minutes)
                    }
                } catch (e: Exception) {
                    runOnUiThread {
                        showError("Lỗi phân tích dữ liệu Firebase.")
                    }
                } finally {
                    response.close()
                }
            }
        })
    }

    private fun activateToken(pin: String, minutes: Int) {
        val activatedAt = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).format(java.util.Date())
        val expiresTime = System.currentTimeMillis() + minutes * 60 * 1000
        val expiresAt = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).format(java.util.Date(expiresTime))

        // Cập nhật trạng thái token là active
        val url = "$FIREBASE_RTDB_URL/tablet_tokens/$pin.json"
        val jsonPayload = """
            {
                "status": "active",
                "activatedAt": "$activatedAt",
                "expiresAt": "$expiresAt"
            }
        """.trimIndent()

        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).patch(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    showError("Kích hoạt thất bại. Lỗi kết nối.")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    runOnUiThread {
                        // Mở khóa Kiosk Mode thành công
                        unlockTabletForPlay(minutes, pin)
                    }
                } finally {
                    response.close()
                }
            }
        })
    }

    private fun unlockTabletForPlay(minutes: Int, token: String) {
        Toast.makeText(this, "Xác thực thành công! Bạn có $minutes phút sử dụng.", Toast.LENGTH_LONG).show()

        // 1. Dừng Lock Task (Tạm thời mở khóa thiết bị Android)
        try {
            if (dpm.isDeviceOwnerApp(packageName)) {
                stopLockTask()
                
                // Thiết lập Launcher hệ thống gốc làm Launcher mặc định khi mở khóa chơi
                val launcherComponent = getSystemLauncherComponent()
                if (launcherComponent != null) {
                    val filter = IntentFilter(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_HOME)
                        addCategory(Intent.CATEGORY_DEFAULT)
                    }
                    dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)
                    dpm.addPersistentPreferredActivity(adminComponent, filter, launcherComponent)
                } else {
                    dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)
                }

                // Gỡ bỏ các hạn chế kiểm soát ứng dụng khi mở khóa chơi
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    dpm.clearUserRestriction(adminComponent, android.os.UserManager.DISALLOW_APPS_CONTROL)
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    dpm.setAutoTimeRequired(adminComponent, false)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 2. Khởi chạy Foreground Service để đếm ngược thời gian và tự động khóa lại
        val serviceIntent = Intent(this, KioskService::class.java).apply {
            putExtra("minutes", minutes)
            putExtra("token", token)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        // 3. Chủ động đưa trẻ ra màn hình Launcher gốc của máy
        launchSystemLauncher()
        
        // Reset mã PIN
        currentPin = ""
        updatePinDisplay()

        // Kết thúc MainActivity để ẩn hoàn toàn khỏi danh sách ứng dụng gần đây (Recent Tasks)
        finish()
    }

    private fun checkOverlayPermission() {
        // Cần quyền hiển thị nổi (SYSTEM_ALERT_WINDOW) để vẽ bong bóng đếm ngược
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
        }
    }

    private fun showStatus(msg: String, isError: Boolean) {
        txtStatus.text = msg
        txtStatus.setTextColor(if (isError) Color.parseColor("#f87171") else Color.parseColor("#34d399"))
        txtStatus.visibility = View.VISIBLE
    }

    private fun showError(msg: String) {
        showStatus(msg, true)
        currentPin = ""
        updatePinDisplay()
    }

    private fun pollRemoteCommand() {
        val url = "$FIREBASE_RTDB_URL/tablet_control.json"
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                // Bỏ qua lỗi kết nối
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    if (response.isSuccessful && responseBody != null && responseBody != "null") {
                        val jsonObject = JsonParser.parseString(responseBody).asJsonObject
                        val command = jsonObject.get("command")?.asString ?: "none"
                        val minutes = jsonObject.get("minutes")?.asInt ?: 0

                        if (command == "unlock" && minutes > 0) {
                            runOnUiThread {
                                clearRemoteCommand()
                                unlockTabletForPlay(minutes, "remote")
                            }
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                } finally {
                    response.close()
                }
            }
        })
    }

    private fun clearRemoteCommand() {
        val url = "$FIREBASE_RTDB_URL/tablet_control.json"
        val jsonPayload = "{\"command\": \"none\", \"minutes\": 0}"
        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).patch(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }

    private fun updateStatusOnFirebase(status: String) {
        val url = "$FIREBASE_RTDB_URL/tablet_control.json"
        val jsonPayload = "{\"status\": \"$status\", \"remainingTime\": 0}"
        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).patch(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }



    private fun isNewVersionAvailable(current: String, latest: String): Boolean {
        val currentParts = current.split(".").mapNotNull { it.toIntOrNull() }
        val latestParts = latest.split(".").mapNotNull { it.toIntOrNull() }

        val length = Math.max(currentParts.size, latestParts.size)
        for (i in 0 until length) {
            val currVal = if (i < currentParts.size) currentParts[i] else 0
            val latVal = if (i < latestParts.size) latestParts[i] else 0
            if (latVal > currVal) return true
            if (currVal > latVal) return false
        }
        return false
    }

    private fun downloadAndInstallUpdate() {
        val btnUpdate = findViewById<Button>(R.id.btnUpdateApk)
        btnUpdate.isEnabled = false
        showStatus("Đang kiểm tra phiên bản...", false)

        val versionUrl = "https://raw.githubusercontent.com/skyprotect/Hoctap/main/version.json?t=${System.currentTimeMillis()}"
        val request = Request.Builder().url(versionUrl).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    btnUpdate.isEnabled = true
                    showError("Lỗi kết nối kiểm tra phiên bản!")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    if (!response.isSuccessful || responseBody == null || responseBody == "null") {
                        runOnUiThread {
                            btnUpdate.isEnabled = true
                            showError("Kiểm tra phiên bản thất bại!")
                        }
                        response.close()
                        return
                    }

                    val jsonObject = JsonParser.parseString(responseBody).asJsonObject
                    val latestAndroidVersion = jsonObject.get("androidVersion")?.asString ?: "1.0"
                    
                    val pInfo = packageManager.getPackageInfo(packageName, 0)
                    val currentVersion = pInfo.versionName ?: "1.0"

                    response.close()

                    if (isNewVersionAvailable(currentVersion, latestAndroidVersion)) {
                        runOnUiThread {
                            showStatus("Đang tải bản cập nhật v$latestAndroidVersion...", false)
                            startDownloadApk(latestAndroidVersion)
                        }
                    } else {
                        runOnUiThread {
                            btnUpdate.isEnabled = true
                            Toast.makeText(this@MainActivity, "Ứng dụng đang ở phiên bản mới nhất: v$currentVersion", Toast.LENGTH_LONG).show()
                            showStatus("", false)
                            txtStatus.visibility = View.GONE
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        btnUpdate.isEnabled = true
                        showError("Lỗi kiểm tra phiên bản: ${e.message}")
                    }
                }
            }
        })
    }

    private fun startDownloadApk(versionName: String) {
        val btnUpdate = findViewById<Button>(R.id.btnUpdateApk)
        val apkUrl = "https://raw.githubusercontent.com/skyprotect/Hoctap/main/TabletLock_Kiosk.apk?t=${System.currentTimeMillis()}"
        val request = Request.Builder().url(apkUrl).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    btnUpdate.isEnabled = true
                    showError("Tải APK thất bại: ${e.message}")
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (!response.isSuccessful) {
                    runOnUiThread {
                        btnUpdate.isEnabled = true
                        showError("Tải APK thất bại: HTTP ${response.code}")
                    }
                    response.close()
                    return
                }

                try {
                    val updateFile = java.io.File(cacheDir, "update.apk")
                    val inputStream = response.body?.byteStream()
                    if (inputStream == null) {
                        runOnUiThread {
                            btnUpdate.isEnabled = true
                            showError("Dữ liệu tải về rỗng!")
                        }
                        response.close()
                        return
                    }

                    val outputStream = java.io.FileOutputStream(updateFile)
                    val buffer = ByteArray(4096)
                    var bytesRead: Int
                    while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                        outputStream.write(buffer, 0, bytesRead)
                    }
                    outputStream.close()
                    inputStream.close()
                    response.close()

                    runOnUiThread {
                        showStatus("Đang cài đặt phiên bản v$versionName...", false)
                        try {
                            if (dpm.isDeviceOwnerApp(packageName)) {
                                stopLockTask()
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                        installApk(updateFile)
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        btnUpdate.isEnabled = true
                        showError("Lỗi lưu file APK: ${e.message}")
                    }
                }
            }
        })
    }

    private fun installApk(apkFile: java.io.File) {
        val packageInstaller = packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
        params.setAppPackageName(packageName)

        try {
            val sessionId = packageInstaller.createSession(params)
            val session = packageInstaller.openSession(sessionId)
            
            val out = session.openWrite("COSU_Install", 0, -1)
            val inputStream = java.io.FileInputStream(apkFile)
            val buffer = ByteArray(65536)
            var c: Int
            while (inputStream.read(buffer).also { c = it } != -1) {
                out.write(buffer, 0, c)
            }
            session.fsync(out)
            inputStream.close()
            out.close()

            // Tạo IntentSender để nhận kết quả qua BootReceiver chạy ngầm
            val intent = Intent(this, BootReceiver::class.java).apply {
                action = "com.skyprotect.tabletlock.INSTALL_COMPLETE"
            }
            val pendingIntent = PendingIntent.getBroadcast(
                this,
                0,
                intent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
            )
            
            session.commit(pendingIntent.intentSender)
            session.close()
        } catch (e: Exception) {
            e.printStackTrace()
            runOnUiThread {
                findViewById<Button>(R.id.btnUpdateApk).isEnabled = true
                showError("Lỗi cài đặt: ${e.message}")
            }
        }
    }

    // Ghi đè sự kiện bấm phím cứng để chặn thoát
    override fun onBackPressed() {
        // Chặn hoàn toàn phím Back
    }
}

// Khai báo lớp Color đơn giản thay thế lớp gốc Android nếu cần thiết lập màu thủ công
object Color {
    fun parseColor(colorString: String): Int {
        return android.graphics.Color.parseColor(colorString)
    }
}
