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

class KioskService : Service() {

    private var windowManager: WindowManager? = null
    private var floatingView: View? = null
    private var countDownTimer: CountDownTimer? = null
    private var remainingTimeSeconds: Long = 0
    private var currentToken: String = ""

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
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val minutes = intent?.getIntExtra("minutes", 7) ?: 7
        currentToken = intent?.getStringExtra("token") ?: ""
        remainingTimeSeconds = minutes * 60L

        // 1. Chạy Foreground Service với Notification để tránh bị Android kill
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Tablet Lock đang hoạt động")
            .setContentText("Thời gian sử dụng còn lại: $minutes phút.")
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
        remotePollHandler.post(remotePollRunnable)
        updateRemainingTimeOnFirebase(remainingTimeSeconds)

        return START_NOT_STICKY
    }

    private fun showFloatingWidget() {
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

        windowManager?.addView(floatingView, params)
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

                // Đồng bộ lên Firebase mỗi 5 giây
                if (remainingTimeSeconds % 5 == 0L) {
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

        // 2. Mở lại MainActivity (Màn hình khóa)
        val lockIntent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
            putExtra("force_lock", true)
        }
        startActivity(lockIntent)

        // 3. Tự hủy Service
        stopSelf()
    }

    override fun onDestroy() {
        super.onDestroy()
        countDownTimer?.cancel()
        remotePollHandler.removeCallbacks(remotePollRunnable)
        if (floatingView != null && windowManager != null) {
            windowManager?.removeView(floatingView)
        }
    }

    private fun pollRemoteCommand() {
        val url = "${FIREBASE_RTDB_URL}tablet_control.json"
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                if (response.isSuccessful && responseBody != null && responseBody != "null") {
                    try {
                        val jsonObject = com.google.gson.JsonParser.parseString(responseBody).asJsonObject
                        val command = jsonObject.get("command")?.asString ?: "none"

                        if (command == "lock") {
                            // Bị khóa từ xa!
                            android.os.Handler(android.os.Looper.getMainLooper()).post {
                                clearRemoteCommand()
                                lockDevice()
                            }
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                response.close()
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
