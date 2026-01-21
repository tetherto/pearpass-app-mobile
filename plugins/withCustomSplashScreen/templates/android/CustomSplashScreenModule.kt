package com.pears.pass

import android.app.Activity
import android.app.Dialog
import android.view.Window
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

object CustomSplashScreenView {
	var dialog: Dialog? = null

	fun show(activity: Activity) {
		if (dialog == null) {
			dialog = Dialog(activity, android.R.style.Theme_DeviceDefault_NoActionBar)
			dialog?.requestWindowFeature(Window.FEATURE_NO_TITLE)
			dialog?.setContentView(R.layout.custom_splash_screen_layout)
			dialog?.setCancelable(false)

			val window = dialog?.window
			window?.statusBarColor = android.graphics.Color.TRANSPARENT
			window?.navigationBarColor = android.graphics.Color.BLACK

			window?.decorView?.systemUiVisibility =
					View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
					View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN

			dialog?.show()
		}
	}

	fun hide() {
		dialog?.dismiss()
		dialog = null
	}
}

class CustomSplashScreenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
	override fun getName(): String {
		return "CustomSplashScreen"
	}

	@ReactMethod
	fun show() {
		val activity: Activity? = currentActivity
		activity?.runOnUiThread {
			CustomSplashScreenView.show(activity)
		}
	}

	@ReactMethod
	fun hide() {
		val activity: Activity? = currentActivity
		activity?.runOnUiThread {
			CustomSplashScreenView.hide()
		}
	}
}