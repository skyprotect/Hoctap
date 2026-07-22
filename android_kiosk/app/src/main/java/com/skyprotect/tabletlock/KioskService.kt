package com.skyprotect.tabletlock

import android.app.*
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import androidx.core.app.NotificationCompat
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import android.content.ComponentName
import android.content.IntentFilter
import android.app.admin.DevicePolicyManager

class KioskService : Service() {

    private var windowManager: WindowManager? = null
    private var floatingView: View? = null
    private var countDownTimer: CountDownTimer? = null
    private var remainingTimeSeconds: Long = 0
    private var currentToken: String = ""
    private var initialMinutes: Int = 0
    private var currentHistoryId: String = ""
    private var isHistoryUpdated = false
    private var isCurrentlyLockedState = false

    private val client = OkHttpClient()
    private val FIREBASE_RTDB_URL = "https://binhminhchamhoc-default-rtdb.firebaseio.com/"

    private val remotePollHandler = Handler(Looper.getMainLooper())
    private val remotePollRunnable = object : Runnable {
        override fun run() {
            pollRemoteCommand()
            remotePollHandler.postDelayed(this, 3000)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        val defaultHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            logToFirebase("CRASH_LOGGER", "Lỗi Service Crash chưa xử lý trên thread ${thread.name}: ${throwable.message}\n${throwable.stackTraceToString()}")
            defaultHandler?.uncaughtException(thread, throwable)
        }
        logToFirebase("KioskService", "onCreate được gọi")
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        isHistoryUpdated = false

        val isNewUnlock = intent != null && intent.hasExtra("minutes")

        if (isNewUnlock) {
            isCurrentlyLockedState = false
            // Đây là yêu cầu mở khóa mới từ màn hình PIN hoặc từ xa
            // Cần dọn dẹp Widget và Timer cũ (nếu có) để bắt đầu chu kỳ mới
            countDownTimer?.cancel()
            countDownTimer = null
            remotePollHandler.removeCallbacks(remotePollRunnable)
            floatingView?.let {
                try {
                    windowManager?.removeView(it)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                floatingView = null
            }

            val minutes = intent!!.getIntExtra("minutes", 7)
            currentToken = intent.getStringExtra("token") ?: ""
            remainingTimeSeconds = minutes * 60L
            initialMinutes = minutes
            val expiresTimeMillis = System.currentTimeMillis() + minutes * 60L * 1000L

            // Lưu trạng thái ban đầu vào SharedPreferences
            val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
            val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())
            with(sharedPref.edit()) {
                putLong("remainingTimeSeconds", remainingTimeSeconds)
                putLong("expiresTimeMillis", expiresTimeMillis)
                putString("currentToken", currentToken)
                putString("currentHistoryId", "")
                putInt("initialMinutes", initialMinutes)
                putString("lastActiveDate", todayStr)
                commit()
            }
            logToFirebase("KioskService", "onStartCommand: Mở khóa mới, minutes = $initialMinutes")
            scheduleNextHeartbeat()
        } else {
            // Đây là trường hợp hồi sinh Service sau khi bị kill hoặc do hệ thống start lại để duy trì.
            // Nếu timer đang chạy rồi thì KHÔNG làm gì cả để tránh nhấp nháy giao diện và trùng lặp timer.
            if (countDownTimer != null) {
                logToFirebase("KioskService", "onStartCommand: Nhịp tim đến nhưng Service đang chạy tốt, gia hạn")
                scheduleNextHeartbeat()
                return START_STICKY
            }

            val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
            val expiresTimeMillis = sharedPref.getLong("expiresTimeMillis", 0L)
            remainingTimeSeconds = (expiresTimeMillis - System.currentTimeMillis()) / 1000
            currentToken = sharedPref.getString("currentToken", "") ?: ""
            currentHistoryId = sharedPref.getString("currentHistoryId", "") ?: ""
            initialMinutes = sharedPref.getInt("initialMinutes", 7)
            val lastActiveDate = sharedPref.getString("lastActiveDate", "") ?: ""

            val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())

            if (remainingTimeSeconds <= 0 || (lastActiveDate.isNotEmpty() && lastActiveDate != todayStr)) {
                if (!isCurrentlyLockedState) {
                    isCurrentlyLockedState = true
                    logToFirebase("KioskService", "onStartCommand: Thời gian chơi hết hoặc qua ngày mới, chuyển khóa")
                    lockDevice()
                } else {
                    logToFirebase("KioskService", "onStartCommand: Đã ở trạng thái khóa, duy trì bảo vệ ngầm")
                }
                return START_STICKY
            }
            logToFirebase("KioskService", "onStartCommand: Service Hồi Sinh, remainingTimeSeconds = $remainingTimeSeconds")
            scheduleNextHeartbeat()
        }

        // Khởi tạo các thành phần nếu chưa có (khi khởi động mới hoặc sau khi bị kill hồi sinh)

        // 1. Chạy Foreground Service với Notification để tránh bị Android kill
        val displayMinutes = (remainingTimeSeconds / 60).toInt()
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Tablet Lock đang hoạt động")
            .setContentText("Thời gian sử dụng còn lại: $displayMinutes phút.")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        // 2. Hiển thị Floating Bubble đếm ngược
        showFloatingWidget()

        // 3. Khởi tạo CountDownTimer
        startCountdown()

        // 4. Khởi chạy vòng lặp kiểm tra lệnh khóa từ xa và đồng bộ trạng thái ban đầu
        remotePollHandler.removeCallbacks(remotePollRunnable)
        remotePollHandler.post(remotePollRunnable)
        updateRemainingTimeOnFirebase(remainingTimeSeconds)

        // 5. Ghi nhận lịch sử mở khóa lên Firebase nếu khởi động mới hoàn toàn
        if (isNewUnlock) {
            createHistoryEntry(initialMinutes)
        }

        return START_STICKY
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        logToFirebase("KioskService", "onTaskRemoved: Ứng dụng bị vuốt tắt khỏi Recent Apps")
        val alarmManager = applicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
        val expiresTimeMillis = sharedPref.getLong("expiresTimeMillis", 0L)
        val isStillValid = (expiresTimeMillis - System.currentTimeMillis()) > 0

        if (isStillValid) {
            // Trường hợp 1: Đang trong thời gian chơi -> Tự hồi sinh KioskService bằng PendingIntent.getForegroundService
            val serviceIntent = Intent(applicationContext, KioskService::class.java)
            val pendingIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                PendingIntent.getForegroundService(
                    applicationContext,
                    2001,
                    serviceIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            } else {
                PendingIntent.getService(
                    applicationContext,
                    2001,
                    serviceIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.ELAPSED_REALTIME_WAKEUP,
                        android.os.SystemClock.elapsedRealtime() + 1000,
                        pendingIntent
                    )
                } else {
                    alarmManager.set(
                        AlarmManager.ELAPSED_REALTIME_WAKEUP,
                        android.os.SystemClock.elapsedRealtime() + 1000,
                        pendingIntent
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        } else {
            // Trường hợp 2: Đang ở trạng thái BỊ KHÓA -> Bật lại MainActivity ngay lập tức để giữ màn hình khóa
            val lockIntent = Intent(applicationContext, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                putExtra("force_lock", true)
            }
            val pendingIntent = PendingIntent.getActivity(
                applicationContext,
                2002,
                lockIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.ELAPSED_REALTIME_WAKEUP,
                        android.os.SystemClock.elapsedRealtime() + 500,
                        pendingIntent
                    )
                } else {
                    alarmManager.set(
                        AlarmManager.ELAPSED_REALTIME_WAKEUP,
                        android.os.SystemClock.elapsedRealtime() + 500,
                        pendingIntent
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        super.onTaskRemoved(rootIntent)
    }

    private fun clearStateInPreferences() {
        val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putLong("remainingTimeSeconds", 0L)
            putLong("expiresTimeMillis", 0L)
            putString("currentToken", "")
            putString("currentHistoryId", "")
            putInt("initialMinutes", 0)
            putString("lastActiveDate", "")
            commit()
        }
    }

    private fun showFloatingWidget() {
        // Gỡ bỏ floatingView cũ nếu đã được tạo trước đó để tránh rò rỉ và đè chữ
        floatingView?.let {
            try {
                windowManager?.removeView(it)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            floatingView = null
        }

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        // Layout params cho Floating View đè lên các ứng dụng khác
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT
        )

        // Đặt vị trí bong bóng nổi ở chính giữa phía trên màn hình, sát mép trên
        params.gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
        params.x = 0
        params.y = 8 // Khoảng cách nhỏ từ mép trên

        // Tạo giao diện cho Floating View (nhỏ, mờ, tinh tế)
        floatingView = TextView(this).apply {
            setBackgroundColor(Color.parseColor("#33000000")) // Nền cực mờ (opacity 20%)
            setTextColor(Color.parseColor("#b3fbbf24")) // Chữ màu vàng gold mờ (opacity 70%)
            setPadding(16, 6, 16, 6) // Padding nhỏ gọn
            textSize = 12f // Cỡ chữ nhỏ tinh tế
            paint.isFakeBoldText = true
            text = "Thời gian: --:--"
        }

        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M || android.provider.Settings.canDrawOverlays(this)) {
                windowManager?.addView(floatingView, params)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun startCountdown() {
        countDownTimer = object : CountDownTimer(remainingTimeSeconds * 1000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                remainingTimeSeconds = millisUntilFinished / 1000
                val minutesLeft = remainingTimeSeconds / 60
                val secondsLeft = remainingTimeSeconds % 60
                val timeStr = String.format("%02d:%02d", minutesLeft, secondsLeft)

                // Cập nhật giao diện floating view
                (floatingView as? TextView)?.text = "Còn lại: $timeStr"
                
                // Cập nhật thông báo Notification
                val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                val updatedNotification = NotificationCompat.Builder(this@KioskService, CHANNEL_ID)
                    .setContentTitle("Tablet Lock đang hoạt động")
                    .setContentText("Thời gian sử dụng còn lại: $timeStr")
                    .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
                    .build()
                notificationManager.notify(NOTIFICATION_ID, updatedNotification)

                // Đồng bộ lên Firebase và SharedPreferences mỗi 5 giây
                if (remainingTimeSeconds % 5 == 0L) {
                    val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
                    val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())
                    sharedPref.edit()
                        .putLong("remainingTimeSeconds", remainingTimeSeconds)
                        .putString("lastActiveDate", todayStr)
                        .apply()
                    updateRemainingTimeOnFirebase(remainingTimeSeconds)
                }
            }

            override fun onFinish() {
                // Đã hết giờ! Khóa máy tính bảng
                lockDevice()
            }
        }
        countDownTimer?.start()
    }

    private fun lockDevice() {
        // Hủy nhịp tim sinh tồn ngay khi bắt đầu khóa máy
        cancelHeartbeat()
        logToFirebase("KioskService", "lockDevice: Thực hiện khóa máy tính bảng")

        // 0. Cập nhật lịch sử mở khóa trên Firebase
        updateHistoryEntryOnLock()

        // 1. Đồng bộ lên Firebase trạng thái "used" của Token này
        if (currentToken.isNotEmpty() && currentToken != "remote") {
            val url = "${FIREBASE_RTDB_URL}tablet_tokens/$currentToken.json"
            val json = "{\"status\": \"used\"}"
            val body = json.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
            val request = Request.Builder().url(url).patch(body).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    e.printStackTrace()
                }

                override fun onResponse(call: Call, response: Response) {
                    response.close()
                }
            })
        }

        // Cập nhật status thành locked trên Firebase
        updateRemainingTimeOnFirebase(0)

        // Reset trạng thái preferences trước khi khóa hẳn
        clearStateInPreferences()

        // 2. Thiết lập lại app Kiosk làm Launcher mặc định để chiếm quyền phím Home
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val adminComponent = ComponentName(this, AdminReceiver::class.java)
        if (dpm.isDeviceOwnerApp(packageName)) {
            try {
                // Xóa cấu hình cũ trước khi đặt Launcher mới để tránh xung đột phím Home
                dpm.clearPackagePersistentPreferredActivities(adminComponent, packageName)

                val filter = IntentFilter(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    addCategory(Intent.CATEGORY_DEFAULT)
                }
                val activityComponent = ComponentName(packageName, MainActivity::class.java.name)
                dpm.addPersistentPreferredActivity(adminComponent, filter, activityComponent)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    dpm.setLockTaskFeatures(adminComponent, DevicePolicyManager.LOCK_TASK_FEATURE_NONE)
                }
                dpm.setLockTaskPackages(adminComponent, arrayOf(packageName))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // 3. Chủ động mở MainActivity trực tiếp (dùng SINGLE_TOP không dùng CLEAR_TASK để tránh nhấp nháy màn hình)
        val lockIntent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            putExtra("force_lock", true)
        }
        try {
            startActivity(lockIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 3b. Gửi thêm Full Screen Intent Notification để dự phòng đa tầng
        try {
            val pendingIntent = PendingIntent.getActivity(
                this,
                0,
                lockIntent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) 
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE 
                else 
                    PendingIntent.FLAG_UPDATE_CURRENT
            )

            val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
                .setContentTitle("Thiết bị đã khóa")
                .setContentText("Kiosk đang được bảo vệ.")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setFullScreenIntent(pendingIntent, true)
                .setAutoCancel(true)

            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(NOTIFICATION_ID, builder.build())
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 4. Trì hoãn tự hủy Service 1 giây để bảo toàn process và chuyển tiếp mượt mà
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            stopSelf()
        }, 1000)
    }

    override fun onDestroy() {
        // Hủy nhịp tim khi Service bị tắt hợp lệ
        cancelHeartbeat()
        logToFirebase("KioskService", "onDestroy: KioskService bị hủy")
        super.onDestroy()
        countDownTimer?.cancel()
        remotePollHandler.removeCallbacks(remotePollRunnable)
        
        // Cập nhật lịch sử nếu chưa được ghi nhận hoàn thành
        updateHistoryEntryOnLock()

        if (floatingView != null && windowManager != null) {
            try {
                windowManager?.removeView(floatingView)
            } catch (e: Exception) {
                e.printStackTrace()
            }
            floatingView = null
        }
    }

    private fun pollRemoteCommand() {
        val url = "${FIREBASE_RTDB_URL}tablet_control.json"
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    if (response.isSuccessful && responseBody != null && responseBody != "null") {
                        val jsonObject = com.google.gson.JsonParser.parseString(responseBody).asJsonObject
                        val command = jsonObject.get("command")?.asString ?: "none"

                        if (command == "lock") {
                            // Bị khóa từ xa!
                            android.os.Handler(android.os.Looper.getMainLooper()).post {
                                clearRemoteCommand()
                                lockDevice()
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
        val url = "${FIREBASE_RTDB_URL}tablet_control.json"
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

    private fun updateRemainingTimeOnFirebase(secs: Long) {
        val url = "${FIREBASE_RTDB_URL}tablet_control.json"
        val status = if (secs > 0) "unlocked" else "locked"
        val jsonPayload = "{\"status\": \"$status\", \"remainingTime\": $secs}"
        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).patch(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }

    private fun createHistoryEntry(minutes: Int) {
        val historyUrl = "${FIREBASE_RTDB_URL}tablet_history.json"
        val df = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).apply {
            timeZone = java.util.TimeZone.getTimeZone("UTC")
        }
        val unlockedAt = df.format(java.util.Date())
        val tokenVal = if (currentToken.isNotEmpty()) currentToken else "remote"

        val jsonPayload = """
            {
                "token": "$tokenVal",
                "unlockedAt": "$unlockedAt",
                "lockedAt": null,
                "minutes": $minutes,
                "actualDurationSeconds": null,
                "status": "active"
            }
        """.trimIndent()

        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(historyUrl).post(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }
            override fun onResponse(call: Call, response: Response) {
                try {
                    val resBody = response.body?.string()
                    if (response.isSuccessful && resBody != null) {
                        val jsonObject = com.google.gson.JsonParser.parseString(resBody).asJsonObject
                        currentHistoryId = jsonObject.get("name")?.asString ?: ""
                        // Lưu lịch sử ID vào preferences
                        val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
                        sharedPref.edit().putString("currentHistoryId", currentHistoryId).commit()
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                } finally {
                    response.close()
                }
            }
        })
    }

    private fun updateHistoryEntryOnLock() {
        if (currentHistoryId.isEmpty() || isHistoryUpdated) return
        isHistoryUpdated = true

        val historyUrl = "${FIREBASE_RTDB_URL}tablet_history/$currentHistoryId.json"
        val df = java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).apply {
            timeZone = java.util.TimeZone.getTimeZone("UTC")
        }
        val lockedAt = df.format(java.util.Date())
        
        val durationLimitSeconds = initialMinutes * 60L
        val actualSeconds = if (remainingTimeSeconds < 0) durationLimitSeconds else (durationLimitSeconds - remainingTimeSeconds)

        val jsonPayload = """
            {
                "lockedAt": "$lockedAt",
                "actualDurationSeconds": $actualSeconds,
                "status": "completed"
            }
        """.trimIndent()

        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(historyUrl).patch(body).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }

    private fun scheduleNextHeartbeat() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val serviceIntent = Intent(this, KioskService::class.java)
        
        val pendingIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            PendingIntent.getForegroundService(
                this,
                1001,
                serviceIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
        } else {
            PendingIntent.getService(
                this,
                1001,
                serviceIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
        }

        val timeToWakeUp = android.os.SystemClock.elapsedRealtime() + 20000 // 20 giây

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, timeToWakeUp, pendingIntent)
            } else {
                alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, timeToWakeUp, pendingIntent)
            }
            logToFirebase("KioskService", "scheduleNextHeartbeat: Đã đặt lịch Alarm 20 giây tiếp theo")
        } catch (e: Exception) {
            e.printStackTrace()
            try {
                alarmManager.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, timeToWakeUp, pendingIntent)
                logToFirebase("KioskService", "scheduleNextHeartbeat: Fallback đặt lịch Alarm 20s")
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
        }
    }

    private fun cancelHeartbeat() {
        try {
            val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(this, BootReceiver::class.java).apply {
                action = "com.skyprotect.tabletlock.RESTART_SERVICE"
            }
            val pendingIntent = PendingIntent.getBroadcast(
                this,
                1001, // ID nhịp tim sinh tồn cần hủy
                intent,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE else PendingIntent.FLAG_UPDATE_CURRENT
            )
            alarmManager.cancel(pendingIntent)
            logToFirebase("KioskService", "cancelHeartbeat: Đã hủy Alarm nhịp tim")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun logToFirebase(tag: String, message: String) {
        val df = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.US)
        val timeStr = df.format(java.util.Date())
        val jsonPayload = """
            {
                "time": "$timeStr",
                "tag": "$tag",
                "message": "$message"
            }
        """.trimIndent()
        
        val url = "${FIREBASE_RTDB_URL}tablet_debug_logs.json"
        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).post(body).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Kiosk Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }

    companion object {
        const val CHANNEL_ID = "KioskServiceChannel"
        const val NOTIFICATION_ID = 1001
    }
}
