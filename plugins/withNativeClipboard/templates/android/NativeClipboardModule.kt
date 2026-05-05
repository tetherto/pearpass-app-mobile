package com.pears.pass

import android.content.ClipData
import android.content.ClipboardManager
import android.content.ClipDescription
import android.content.Context
import android.os.Build
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

            // Schedule a single WorkManager job. ExistingWorkPolicy.REPLACE handles
            // any previously enqueued clear for the same unique name atomically —
            // no manual cancel-then-enqueue (which races with the REPLACE).
            val clearClipboardRequest = OneTimeWorkRequestBuilder<ClearClipboardWorker>()
                .setInitialDelay(seconds.toLong(), TimeUnit.SECONDS)
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                CLEAR_CLIPBOARD_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                clearClipboardRequest,
            )

            Log.d(TAG, "Scheduled WorkManager to clear clipboard in ${seconds}s")

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
            WorkManager.getInstance(context).cancelUniqueWork(CLEAR_CLIPBOARD_WORK_NAME)

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
}
