package com.skyprotect.tabletlock

import android.app.job.JobParameters
import android.app.job.JobService
import android.content.Context
import android.content.Intent
import android.os.Build

class KioskJobService : JobService() {
    override fun onStartJob(params: JobParameters?): Boolean {
        val sharedPref = getSharedPreferences("KioskServicePref", Context.MODE_PRIVATE)
        val expiresTimeMillis = sharedPref.getLong("expiresTimeMillis", 0L)
        val remainingTimeSeconds = (expiresTimeMillis - System.currentTimeMillis()) / 1000
        val currentToken = sharedPref.getString("currentToken", "") ?: ""
        val lastActiveDate = sharedPref.getString("lastActiveDate", "") ?: ""
        val todayStr = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())

        val isTimeValid = remainingTimeSeconds > 0 && currentToken.isNotEmpty() && (lastActiveDate.isEmpty() || lastActiveDate == todayStr)

        if (isTimeValid) {
            val serviceIntent = Intent(applicationContext, KioskService::class.java)
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    applicationContext.startForegroundService(serviceIntent)
                } else {
                    applicationContext.startService(serviceIntent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        } else {
            val lockIntent = Intent(applicationContext, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                putExtra("force_lock", true)
            }
            try {
                applicationContext.startActivity(lockIntent)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        jobFinished(params, false)
        return false
    }

    override fun onStopJob(params: JobParameters?): Boolean {
        return true
    }
}
