import Foundation
import UIKit
import React

@objc(NativeClipboard)
class NativeClipboard: NSObject {

    private static var lastCopiedText: String?
    private static var clearTimer: Timer?

    @objc
    func setStringWithExpiration(_ text: String, seconds: Double, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NativeClipboard.clearTimer?.invalidate()
            NativeClipboard.lastCopiedText = text

            if #available(iOS 10.3, *) {
                let expireDate = Date().addingTimeInterval(TimeInterval(seconds))
                let pbType = "public.utf8-plain-text"

                UIPasteboard.general.setItems(
                    [[pbType: text]],
                    options: [
                        .expirationDate: expireDate,
                        .localOnly: false
                    ]
                )

                resolver(true)
            } else {
                // Fallback for pre-iOS 10.3
                UIPasteboard.general.string = text

                NativeClipboard.clearTimer = Timer.scheduledTimer(withTimeInterval: seconds, repeats: false) { _ in
                    self.clearIfMatches(text)
                }

                resolver(true)
            }
        }
    }

    @objc
    func clearClipboard(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            UIPasteboard.general.string = ""
            NativeClipboard.lastCopiedText = nil
            NativeClipboard.clearTimer?.invalidate()
            resolver(true)
        }
    }

    @objc
    func clearIfCurrentMatches(_ text: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            if UIPasteboard.general.string == text {
                UIPasteboard.general.string = ""
                NativeClipboard.lastCopiedText = nil
                resolver(true)
            } else {
                resolver(false)
            }
        }
    }

    @objc
    func isAvailable(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        resolver(true)
    }

    private func clearIfMatches(_ originalText: String) {
        DispatchQueue.main.async {
            if UIPasteboard.general.string == originalText {
                UIPasteboard.general.string = ""
                NativeClipboard.lastCopiedText = nil
            }
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}