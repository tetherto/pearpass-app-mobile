package com.pears.pass

import android.content.BroadcastReceiver
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

class ClipboardClearReceiver : BroadcastReceiver() {

    companion object {
        const val TAG = "ClipboardClearReceiver"
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (context == null || intent?.action != "com.pears.pass.CLEAR_CLIPBOARD") {
            return
        }

        val textToMatch = intent.getStringExtra("text_to_match")
        Log.d(TAG, "Received clipboard clear request")

        try {
            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

            var shouldClear = true

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                
                try {
                    if (clipboard.hasPrimaryClip() && textToMatch != null) {
                        val clipData = clipboard.primaryClip
                        if (clipData != null && clipData.itemCount > 0) {
                            val currentText = clipData.getItemAt(0).text?.toString()
                            shouldClear = currentText == textToMatch
                        }
                    }
                } catch (e: Exception) {
                    Log.w(TAG, "Could not check clipboard content", e)
                    
                    shouldClear = true
                }
            } else {
                Log.d(TAG, "Android 10+ detected, clearing clipboard as scheduled")
                shouldClear = true
            }

            if (shouldClear) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    // API 28+ has clearPrimaryClip()
                    clipboard.clearPrimaryClip()
                } else {
                    val clip = ClipData.newPlainText("", "")
                    clipboard.setPrimaryClip(clip)
                }
                Log.d(TAG, "Clipboard cleared successfully")
            } else {
                Log.d(TAG, "Clipboard content doesn't match, not clearing")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to clear clipboard", e)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                Log.e(TAG, "Android 10+ clipboard clearing failed. May need transparent activity workaround", e)
            }
        }
    }
}