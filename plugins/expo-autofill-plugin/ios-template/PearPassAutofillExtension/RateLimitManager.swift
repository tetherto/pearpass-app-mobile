//
//  RateLimitManager.swift
//  PearPassAutoFillExtension
//
//  Local rate limiter for the autofill master-password screen.
//  Mirrors pearpass-lib-vault-core/worklet/rateLimiter.js. Stored locally
//  because the autofill extension opens the vault store read-only.
//

import Foundation

final class RateLimitManager {
    struct Status {
        let isLocked: Bool
        let lockoutRemainingMs: Int64
        let remainingAttempts: Int
    }

    private static let suiteName = "pp.autofill.rateLimit"
    private static let keyFailures = "consecutiveFailures"
    private static let keyLockoutUntil = "lockoutUntil"
    private static let keyLastAttempt = "lastAttemptTime"

    private static let maxAttempts = 5
    private static let maxBackoffMs: Int64 = 24 * 60 * 60 * 1000      // 24h
    private static let cooldownMs: Int64 = 24 * 60 * 60 * 1000         // 24h fresh start

    private let defaults: UserDefaults

    init() {
        self.defaults = UserDefaults(suiteName: Self.suiteName) ?? .standard
    }

    func getStatus() -> Status {
        let failures = defaults.integer(forKey: Self.keyFailures)
        let lockoutUntil = (defaults.object(forKey: Self.keyLockoutUntil) as? NSNumber)?.int64Value ?? 0
        let lastAttempt = (defaults.object(forKey: Self.keyLastAttempt) as? NSNumber)?.int64Value ?? 0
        let now = Self.nowMs()

        if lastAttempt > 0 && now - lastAttempt >= Self.cooldownMs {
            reset()
            return Status(isLocked: false, lockoutRemainingMs: 0, remainingAttempts: Self.maxAttempts)
        }

        if lockoutUntil > 0 && now >= lockoutUntil {
            return Status(isLocked: false, lockoutRemainingMs: 0, remainingAttempts: 0)
        }

        let isLocked = lockoutUntil > 0
        let remainingMs = isLocked ? max(0, lockoutUntil - now) : 0
        let remaining = isLocked ? 0 : max(0, Self.maxAttempts - failures)
        return Status(isLocked: isLocked, lockoutRemainingMs: remainingMs, remainingAttempts: remaining)
    }

    func recordFailure() {
        let now = Self.nowMs()
        var failures = defaults.integer(forKey: Self.keyFailures)
        let lastAttempt = (defaults.object(forKey: Self.keyLastAttempt) as? NSNumber)?.int64Value ?? 0
        var lockoutUntil = (defaults.object(forKey: Self.keyLockoutUntil) as? NSNumber)?.int64Value ?? 0

        if lastAttempt > 0 && now - lastAttempt >= Self.cooldownMs {
            failures = 0
            lockoutUntil = 0
        }
        if lockoutUntil > 0 && now >= lockoutUntil {
            lockoutUntil = 0
        }

        failures += 1
        var newLockoutUntil: Int64 = 0
        if failures >= Self.maxAttempts {
            let exponent = failures - Self.maxAttempts + 1
            let backoffMs = Int64(pow(2.0, Double(exponent)) * 60.0 * 1000.0)
            newLockoutUntil = now + min(backoffMs, Self.maxBackoffMs)
        }

        defaults.set(failures, forKey: Self.keyFailures)
        defaults.set(NSNumber(value: newLockoutUntil), forKey: Self.keyLockoutUntil)
        defaults.set(NSNumber(value: now), forKey: Self.keyLastAttempt)
    }

    func reset() {
        defaults.removeObject(forKey: Self.keyFailures)
        defaults.removeObject(forKey: Self.keyLockoutUntil)
        defaults.removeObject(forKey: Self.keyLastAttempt)
    }

    private static func nowMs() -> Int64 {
        Int64(Date().timeIntervalSince1970 * 1000)
    }
}
