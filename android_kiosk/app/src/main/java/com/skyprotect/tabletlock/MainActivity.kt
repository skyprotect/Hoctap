package com.skyprotect.tabletlock

import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Khởi tạo Device Policy Manager
        dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(this, AdminReceiver::class.java)

        initViews()
        setupLockBehavior()
        checkOverlayPermission()
    }

    override fun onResume() {
        super.onResume()
        // Kích hoạt lại Kiosk Mode khi học sinh quay lại màn hình khóa
        startKioskMode()
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
            if (dpm.isDeviceOwnerApp(packageName)) {
                // Khóa cứng thiết bị, học sinh không thể thoát ra ngoài
                startLockTask()
                // Cho phép mở các ứng dụng cơ bản khác khi được mở khóa
                dpm.setLockTaskPackages(adminComponent, arrayOf(packageName, "com.android.launcher3", "com.android.chrome"))
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
                val responseBody = response.body?.string()
                if (!response.isSuccessful || responseBody == null || responseBody == "null") {
                    runOnUiThread {
                        showError("Mã bảo mật không tồn tại!")
                    }
                    return
                }

                try {
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
                response.close()
                runOnUiThread {
                    // Mở khóa Kiosk Mode thành công
                    unlockTabletForPlay(minutes, pin)
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

        // 3. Đưa MainActivity về chế độ chạy ngầm (Home screen sẽ hiển thị để trẻ chơi)
        moveTaskToBack(true)
        
        // Reset mã PIN
        currentPin = ""
        updatePinDisplay()
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
