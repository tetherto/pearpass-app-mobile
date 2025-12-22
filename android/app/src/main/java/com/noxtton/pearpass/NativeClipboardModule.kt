package com.pears.pass

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.*

class NativeClipboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "NativeClipboard"
        private const val ALARM_REQUEST_CODE = 1001
        private var lastCopiedText: String? = null
        private var clearHandler: Handler? = null
        private var clearRunnable: Runnable? = null
    }

    override fun getName(): String {
        return "NativeClipboard"
    }

    @ReactMethod
    fun setStringWithExpiration(text: String, seconds: Double, promise: Promise) {
        try {
            val context = reactApplicationContext
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            val clip = ClipData.newPlainText("", text)
            clipboard.setPrimaryClip(clip)

            lastCopiedText = text
            scheduleClearClipboard(text, (seconds * 1000).toLong())

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLIPBOARD_ERROR", "Failed to set clipboard with expiration", e)
        }
    }

    @ReactMethod
    fun clearClipboard(promise: Promise) {
        try {
            val context = reactApplicationContext
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                clipboard.clearPrimaryClip()
            } else {
                val clip = ClipData.newPlainText("", "")
                clipboard.setPrimaryClip(clip)
            }

            lastCopiedText = null
            cancelScheduledClear()

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLIPBOARD_ERROR", "Failed to clear clipboard", e)
        }
    }

    @ReactMethod
    fun clearIfCurrentMatches(text: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            if (clipboard.hasPrimaryClip()) {
                val clipData = clipboard.primaryClip
                if (clipData != null && clipData.itemCount > 0) {
                    val currentText = clipData.getItemAt(0).text?.toString()

                    if (currentText == text) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                            clipboard.clearPrimaryClip()
                        } else {
                            val clip = ClipData.newPlainText("", "")
                            clipboard.setPrimaryClip(clip)
                        }
                        lastCopiedText = null
                        promise.resolve(true)
                        return
                    }
                }
            }

            promise.resolve(false)
        } catch (e: Exception) {
            // Android 10+ restriction workaround
            if (lastCopiedText == text) {
                try {
                    val clipboard = reactApplicationContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        clipboard.clearPrimaryClip()
                    } else {
                        val clip = ClipData.newPlainText("", "")
                        clipboard.setPrimaryClip(clip)
                    }
                    lastCopiedText = null
                    promise.resolve(true)
                } catch (clearError: Exception) {
                    promise.reject("CLIPBOARD_ERROR", "Failed to clear clipboard", clearError)
                }
            } else {
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun isAvailable(promise: Promise) {
        promise.resolve(true)
    }

    private fun scheduleClearClipboard(text: String, delayMillis: Long) {
        cancelScheduledClear()

        // 1. Handler for in-app clearing (fast, immediate response when app is open)
        clearHandler = Handler(Looper.getMainLooper())
        clearRunnable = Runnable {
            try {
                val context = reactApplicationContext
                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

                var shouldClear = true
                try {
                    if (clipboard.hasPrimaryClip()) {
                        val clipData = clipboard.primaryClip
                        if (clipData != null && clipData.itemCount > 0) {
                            val currentText = clipData.getItemAt(0).text?.toString()
                            shouldClear = currentText == text
                        }
                    }
                } catch (e: Exception) {
                    // Android 10+ restriction
                    shouldClear = lastCopiedText == text
                }

                if (shouldClear) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        clipboard.clearPrimaryClip()
                    } else {
                        val clip = ClipData.newPlainText("", "")
                        clipboard.setPrimaryClip(clip)
                    }
                    lastCopiedText = null
                }

                // Cancel alarm since Handler already cleared
                cancelAlarm()
            } catch (e: Exception) {
                Log.e(TAG, "Failed to clear clipboard via Handler", e)
            }
        }

        clearHandler?.postDelayed(clearRunnable!!, delayMillis)

        // 2. AlarmManager for when app is closed (survives app termination)
        scheduleAlarm(text, delayMillis)
    }

    private fun scheduleAlarm(text: String, delayMillis: Long) {
        try {
            val context = reactApplicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            val intent = Intent("com.pears.pass.CLEAR_CLIPBOARD").apply {
                setPackage(context.packageName)
                putExtra("text_to_match", text)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val triggerTime = System.currentTimeMillis() + delayMillis

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                // Android 12+: Check if exact alarms are allowed
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                } else {
                    // Fallback to inexact alarm (might be slightly delayed)
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // Android 6+: Use setExactAndAllowWhileIdle for Doze mode
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            }

            Log.d(TAG, "Scheduled alarm to clear clipboard in ${delayMillis}ms")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to schedule alarm for clipboard clear", e)
        }
    }

    private fun cancelAlarm() {
        try {
            val context = reactApplicationContext
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

            val intent = Intent("com.pears.pass.CLEAR_CLIPBOARD").apply {
                setPackage(context.packageName)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                ALARM_REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()

            Log.d(TAG, "Cancelled clipboard clear alarm")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to cancel alarm", e)
        }
    }

    private fun cancelScheduledClear() {
        // Cancel Handler
        clearRunnable?.let {
            clearHandler?.removeCallbacks(it)
            clearRunnable = null
        }
        clearHandler = null

        // Cancel Alarm
        cancelAlarm()
    }
}