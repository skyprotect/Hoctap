package com.skyprotect.tabletlock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (Intent.ACTION_BOOT_COMPLETED == intent.action) {
            val sharedPref = context.getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
            val remainingTimeSeconds = sharedPref.getLong("remainingTimeSeconds", 0L)
            val currentToken = sharedPref.getString("currentToken", "") ?: ""

            if (remainingTimeSeconds > 0 && currentToken.isNotEmpty()) {
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
}
