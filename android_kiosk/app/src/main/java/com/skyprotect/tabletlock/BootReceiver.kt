package com.skyprotect.tabletlock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.widget.Toast
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class BootReceiver : BroadcastReceiver() {
    private val client = OkHttpClient()
    override fun onReceive(context: Context, intent: Intent) {
        if ("com.skyprotect.tabletlock.RESTART_SERVICE" == intent.action) {
            val sharedPref = context.getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
            val expiresTimeMillis = sharedPref.getLong("expiresTimeMillis", 0L)
            val remainingTimeSeconds = (expiresTimeMillis - System.currentTimeMillis()) / 1000
            val currentToken = sharedPref.getString("currentToken", "") ?: ""
            val lastActiveDate = sharedPref.getString("lastActiveDate", "") ?: ""
            val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())

            val isTimeValid = remainingTimeSeconds > 0 && currentToken.isNotEmpty() && (lastActiveDate.isEmpty() || lastActiveDate == todayStr)

            logToFirebase("BootReceiver", "Nhận được RESTART_SERVICE, isTimeValid = $isTimeValid, remainingTimeSeconds = $remainingTimeSeconds")

            if (isTimeValid) {
                val serviceIntent = Intent(context, KioskService::class.java)
                logToFirebase("BootReceiver", "Đang gọi startForegroundService...")
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent)
                } else {
                    context.startService(serviceIntent)
                }
            } else {
                logToFirebase("BootReceiver", "isTimeValid = false, bỏ qua RESTART_SERVICE")
            }
            return
        }

        if ("com.skyprotect.tabletlock.INSTALL_COMPLETE" == intent.action) {
            val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)
            if (status == PackageInstaller.STATUS_SUCCESS) {
                Toast.makeText(context, "Cập nhật ứng dụng thành công!", Toast.LENGTH_LONG).show()
                // Khởi chạy màn hình khóa MainActivity ngay lập tức để khóa cứng lại
                val i = Intent(context, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                }
                context.startActivity(i)
            } else {
                val msg = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE) ?: "Lỗi không xác định"
                Toast.makeText(context, "Cập nhật thất bại: $msg", Toast.LENGTH_LONG).show()
            }
            return
        }

        if (Intent.ACTION_BOOT_COMPLETED == intent.action || Intent.ACTION_MY_PACKAGE_REPLACED == intent.action) {
            val sharedPref = context.getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
            val expiresTimeMillis = sharedPref.getLong("expiresTimeMillis", 0L)
            val remainingTimeSeconds = (expiresTimeMillis - System.currentTimeMillis()) / 1000
            val currentToken = sharedPref.getString("currentToken", "") ?: ""
            val lastActiveDate = sharedPref.getString("lastActiveDate", "") ?: ""

            val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())

            var isTimeValid = remainingTimeSeconds > 0 && currentToken.isNotEmpty()
            if (isTimeValid && lastActiveDate.isNotEmpty() && lastActiveDate != todayStr) {
                // Đã qua ngày mới! Đặt lại trạng thái trong preferences bằng commit()
                with(sharedPref.edit()) {
                    putLong("remainingTimeSeconds", 0L)
                    putLong("expiresTimeMillis", 0L)
                    putString("currentToken", "")
                    putString("currentHistoryId", "")
                    putInt("initialMinutes", 0)
                    putString("lastActiveDate", "")
                    commit()
                }
                isTimeValid = false
            }

            if (isTimeValid) {
                // Khôi phục Service tiếp tục thời gian chơi còn lại
                val serviceIntent = Intent(context, KioskService::class.java)
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent)
                } else {
                    context.startService(serviceIntent)
                }
            } else {
                // Khởi chạy màn hình khóa MainActivity
                val i = Intent(context, MainActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                }
                context.startActivity(i)
            }
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
        
        val url = "https://binhminhchamhoc-default-rtdb.firebaseio.com/tablet_debug_logs.json"
        val body = jsonPayload.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
        val request = Request.Builder().url(url).post(body).build()
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {}
            override fun onResponse(call: Call, response: Response) {
                response.close()
            }
        })
    }
}
