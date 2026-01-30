import Foundation
import AuthenticationServices
import UIKit
import React

@objc(AutofillModule)
class AutofillModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /**
   * Checks if autofill is enabled for this app
   */
  @objc
  func isAutofillEnabled(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 12.0, *) {
      let store = ASCredentialIdentityStore.shared
      store.getState { state in
        resolve(state.isEnabled)
      }
    } else {
      // For iOS < 12, we can't check this
      resolve(false)
    }
  }
  
  /**
   * Opens the autofill settings
   */
  @objc
  func openAutofillSettings(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if #available(iOS 17.0, *) {
        ASSettingsHelper.openCredentialProviderAppSettings { error in
          if let error = error {
            reject("CREDENTIAL_PROVIDER_ERROR", error.localizedDescription, error)
          } else {
            let result: [String: Any] = [
              "success": true,
              "method": "openCredentialProviderAppSettings"
            ]
            resolve(result)
          }
        }
      } else {
        // Fallback for iOS < 17
        if let url = URL(string: "App-prefs:PASSWORDS&path=PASSWORD_OPTIONS") {
          UIApplication.shared.open(url, options: [:]) { success in
            if success {
              let result: [String: Any] = [
                "success": true,
                "method": "App-prefs"
              ]
              resolve(result)
            } else {
              reject("SETTINGS_OPEN_ERROR", "Failed to open Settings", nil)
            }
          }
        } else {
          reject("SETTINGS_URL_ERROR", "Could not create Settings URL", nil)
        }
      }
    }
  }
  
  /**
   * Requests to enable autofill (iOS 18+ only)
   */
  @objc
  func requestToEnableAutofill(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if #available(iOS 18.0, *) {
        ASSettingsHelper.requestToTurnOnCredentialProviderExtension { success in
          resolve(success)
        }
      } else {
        reject("IOS_VERSION_ERROR", "This feature requires iOS 18.0 or later", nil)
      }
    }
  }
}
