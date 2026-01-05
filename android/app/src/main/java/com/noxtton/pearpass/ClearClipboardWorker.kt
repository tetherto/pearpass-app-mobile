package com.noxtton.pearpass

import android.content.ClipboardManager
import android.content.Context
import android.os.Build
import android.content.ClipData
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters

/**
 * A WorkManager worker to clear the clipboard after a delay.
 * Uses WorkManager instead of AlarmManager+BroadcastReceiver because
 * WorkManager provides proper execution context that can access the clipboard
 * even on Android 10+ where background clipboard access is restricted.
 */
class ClearClipboardWorker(
    appContext: Context,
    workerParams: WorkerParameters,
) : Worker(appContext, workerParams) {

    companion object {
        const val TAG = "ClearClipboardWorker"
    }

    private val clipboardManager =
        appContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

    override fun doWork(): Result {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                clipboardManager.clearPrimaryClip()
            } else {
                val clip = ClipData.newPlainText("", "")
                clipboardManager.setPrimaryClip(clip)
            }
            Log.d(TAG, "Clipboard cleared successfully")
            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to clear clipboard", e)
            Result.failure()
        }
    }
}
