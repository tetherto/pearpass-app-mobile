package com.noxtton.pearpass

import android.app.Activity
import android.content.ComponentName
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.autofill.AutofillManager
import com.facebook.react.bridge.*
import com.noxtton.pearpass.autofill.utils.AutofillConstants

class AutofillModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val AUTOFILL_REQUEST_CODE = 1001
    }

    private var settingsPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "AutofillModule"
    }

    /**
     * Checks if this specific app is set as the default autofill service
     */
    @ReactMethod
    fun isAutofillEnabled(promise: Promise) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            promise.resolve(false)
            return
        }

        try {
            val context = reactApplicationContext
            val autofillManager = context.getSystemService(AutofillManager::class.java)

            if (autofillManager == null) {
                promise.resolve(false)
                return
            }

            // Check if autofill is enabled AND this app is a provider
            val hasEnabledServices = autofillManager.hasEnabledAutofillServices()
            
            if (!hasEnabledServices) {
                promise.resolve(false)
                return
            }
            
            // Get enabled services and check if our app is among them
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                "autofill_service"
            )
            
            val ourServiceName = "${context.packageName}${AutofillConstants.AUTOFILL_SERVICE_CLASS}"
            val isOurAppEnabled = enabledServices?.contains(ourServiceName) == true
            
            promise.resolve(isOurAppEnabled)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Opens Android autofill settings
     */
    @ReactMethod
    fun openAutofillSettings(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("E_NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            val result = Arguments.createMap()
            result.putBoolean("success", false)
            result.putString("reason", "Android version too old")
            promise.resolve(result)
            return
        }

        try {
            // Create ComponentName for our autofill service
            val componentName = ComponentName(
                activity.packageName,
                "${activity.packageName}${AutofillConstants.AUTOFILL_SERVICE_CLASS}"
            )

            val intent = Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
            intent.data = Uri.parse("package:${componentName.flattenToString()}")
            activity.startActivity(intent)

            // Intent was launched successfully
            val result = Arguments.createMap()
            result.putBoolean("success", true)
            result.putString("method", "ACTION_REQUEST_SET_AUTOFILL_SERVICE")
            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("E_FAILED_TO_OPEN_SETTINGS", "Unable to open settings: ${e.message}")
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        // No longer used
    }

    override fun onNewIntent(intent: Intent?) {
        // no-op
    }

    /**
     * iOS-only method - not implemented for Android
     */
    @ReactMethod
    fun requestToEnableAutofill(promise: Promise) {
        promise.resolve(false)
    }
}