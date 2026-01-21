package com.pears.pass

import android.content.ClipData
import android.content.ClipboardManager
import android.content.ClipDescription
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PersistableBundle
import android.util.Log
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.facebook.react.bridge.*
import java.util.concurrent.TimeUnit

class NativeClipboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "NativeClipboard"
        private const val CLEAR_CLIPBOARD_WORK_NAME = "ClearClipboard"
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

            // Mark as sensitive on Android 13+ to hide from previews/history
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                clip.description.extras = PersistableBundle().apply {
                    putBoolean(ClipDescription.EXTRA_IS_SENSITIVE, true)
                }
            }

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
        // Only works when app is in foreground; WorkManager handles background clearing
        clearHandler = Handler(Looper.getMainLooper())
        clearRunnable = Runnable {
            // Check if app is in foreground - on Android 10+, clipboard operations
            // silently fail when in background (no exception thrown)
            val currentActivity = currentActivity
            val isInForeground = currentActivity?.hasWindowFocus() == true

            if (!isInForeground) {
                Log.d(TAG, "App not in foreground, deferring clipboard clear to WorkManager")
                return@Runnable
            }

            // Clear unconditionally - no need to read/verify clipboard content because:
            // 1. ExistingWorkPolicy.REPLACE resets the timer when user copies something new
            // 2. Reading clipboard adds unnecessary complexity and potential failures
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
                Log.d(TAG, "Clipboard cleared via Handler")

                // Handler succeeded, cancel WorkManager
                cancelWorkManager()
            } catch (e: Exception) {
                // Clipboard access failed - let WorkManager handle it
                Log.d(TAG, "Handler clipboard clear failed, deferring to WorkManager", e)
            }
        }

        clearHandler?.postDelayed(clearRunnable!!, delayMillis)

        // 2. WorkManager for when app is closed (survives app termination)
        // WorkManager provides proper execution context that can access clipboard
        // even on Android 10+ where background clipboard access is restricted
        scheduleWorkManager(delayMillis)
    }

    private fun scheduleWorkManager(delayMillis: Long) {
        try {
            val context = reactApplicationContext

            val clearClipboardRequest = OneTimeWorkRequestBuilder<ClearClipboardWorker>()
                .setInitialDelay(delayMillis, TimeUnit.MILLISECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                CLEAR_CLIPBOARD_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                clearClipboardRequest,
            )

            Log.d(TAG, "Scheduled WorkManager to clear clipboard in ${delayMillis}ms")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to schedule WorkManager for clipboard clear", e)
        }
    }

    private fun cancelWorkManager() {
        try {
            val context = reactApplicationContext
            WorkManager.getInstance(context).cancelUniqueWork(CLEAR_CLIPBOARD_WORK_NAME)
            Log.d(TAG, "Cancelled clipboard clear WorkManager")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to cancel WorkManager", e)
        }
    }

    private fun cancelScheduledClear() {
        // Cancel Handler
        clearRunnable?.let {
            clearHandler?.removeCallbacks(it)
            clearRunnable = null
        }
        clearHandler = null

        // Cancel WorkManager
        cancelWorkManager()
    }
}