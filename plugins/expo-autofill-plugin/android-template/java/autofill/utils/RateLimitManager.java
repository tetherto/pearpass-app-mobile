package com.pears.pass.autofill.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Local rate limiter for the autofill master-password screen.
 * Mirrors the exponential backoff in pearpass-lib-vault-core/worklet/rateLimiter.js,
 * stored locally because the autofill plugin opens the vault store read-only.
 */
public class RateLimitManager {
    private static final String PREFS = "pp_autofill_rate_limit";
    private static final String KEY_CONSECUTIVE_FAILURES = "consecutiveFailures";
    private static final String KEY_LOCKOUT_UNTIL = "lockoutUntil";
    private static final String KEY_LAST_ATTEMPT_TIME = "lastAttemptTime";

    private static final int MAX_ATTEMPTS = 5;
    private static final long MAX_BACKOFF_MS = 24L * 60L * 60L * 1000L; // 24h
    private static final long COOLDOWN_MS = 24L * 60L * 60L * 1000L;    // 24h fresh start

    public static class Status {
        public final boolean isLocked;
        public final long lockoutRemainingMs;
        public final int remainingAttempts;

        public Status(boolean isLocked, long lockoutRemainingMs, int remainingAttempts) {
            this.isLocked = isLocked;
            this.lockoutRemainingMs = lockoutRemainingMs;
            this.remainingAttempts = remainingAttempts;
        }
    }

    private final SharedPreferences prefs;

    public RateLimitManager(Context context) {
        this.prefs = context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public Status getStatus() {
        int failures = prefs.getInt(KEY_CONSECUTIVE_FAILURES, 0);
        long lockoutUntil = prefs.getLong(KEY_LOCKOUT_UNTIL, 0L);
        long lastAttempt = prefs.getLong(KEY_LAST_ATTEMPT_TIME, 0L);
        long now = System.currentTimeMillis();

        if (lastAttempt > 0 && now - lastAttempt >= COOLDOWN_MS) {
            reset();
            return new Status(false, 0L, MAX_ATTEMPTS);
        }

        if (lockoutUntil > 0 && now >= lockoutUntil) {
            return new Status(false, 0L, 0);
        }

        boolean isLocked = lockoutUntil > 0;
        long remainingMs = isLocked ? Math.max(0L, lockoutUntil - now) : 0L;
        int remaining = isLocked ? 0 : Math.max(0, MAX_ATTEMPTS - failures);
        return new Status(isLocked, remainingMs, remaining);
    }

    public void recordFailure() {
        long now = System.currentTimeMillis();
        int failures = prefs.getInt(KEY_CONSECUTIVE_FAILURES, 0);
        long lastAttempt = prefs.getLong(KEY_LAST_ATTEMPT_TIME, 0L);
        long lockoutUntil = prefs.getLong(KEY_LOCKOUT_UNTIL, 0L);

        if (lastAttempt > 0 && now - lastAttempt >= COOLDOWN_MS) {
            failures = 0;
            lockoutUntil = 0L;
        }
        if (lockoutUntil > 0 && now >= lockoutUntil) {
            lockoutUntil = 0L;
        }

        failures++;
        long newLockoutUntil = 0L;
        if (failures >= MAX_ATTEMPTS) {
            int exponent = failures - MAX_ATTEMPTS + 1;
            long backoffMs = (long) (Math.pow(2, exponent) * 60L * 1000L);
            newLockoutUntil = now + Math.min(backoffMs, MAX_BACKOFF_MS);
        }

        prefs.edit()
                .putInt(KEY_CONSECUTIVE_FAILURES, failures)
                .putLong(KEY_LOCKOUT_UNTIL, newLockoutUntil)
                .putLong(KEY_LAST_ATTEMPT_TIME, now)
                .apply();
    }

    public void reset() {
        prefs.edit().clear().apply();
    }
}
