package com.pears.pass.autofill.utils;

import android.util.Log;

import com.pears.pass.BuildConfig;

/**
 * Secure logging utility that only outputs logs in debug builds.
 *
 * This prevents sensitive information from being exposed in production builds
 * through logcat or crash reporting tools.
 *
 * Usage:
 * - SecureLog.d(TAG, "message") - Debug logs (stripped in release)
 * - SecureLog.e(TAG, "message") - Error logs (always logged, but sanitized)
 * - SecureLog.w(TAG, "message") - Warning logs (stripped in release)
 * - SecureLog.i(TAG, "message") - Info logs (stripped in release)
 */
public final class SecureLog {

    /**
     * Debug flag from the app's BuildConfig.
     * Automatically set to true for debug builds and false for release builds
     * by the Android build system.
     */
    private static final boolean IS_DEBUG = BuildConfig.DEBUG;

    private SecureLog() {
        // Prevent instantiation
    }

    /**
     * Log a debug message. Only logs in debug builds.
     *
     * @param tag The log tag
     * @param message The message to log
     */
    public static void d(String tag, String message) {
        if (IS_DEBUG) {
            Log.d(tag, message);
        }
    }

    /**
     * Log a debug message with throwable. Only logs in debug builds.
     *
     * @param tag The log tag
     * @param message The message to log
     * @param tr The throwable to log
     */
    public static void d(String tag, String message, Throwable tr) {
        if (IS_DEBUG) {
            Log.d(tag, message, tr);
        }
    }

    /**
     * Log an info message. Only logs in debug builds.
     *
     * @param tag The log tag
     * @param message The message to log
     */
    public static void i(String tag, String message) {
        if (IS_DEBUG) {
            Log.i(tag, message);
        }
    }

    /**
     * Log a warning message. Only logs in debug builds.
     *
     * @param tag The log tag
     * @param message The message to log
     */
    public static void w(String tag, String message) {
        if (IS_DEBUG) {
            Log.w(tag, message);
        }
    }

    /**
     * Log a warning message with throwable. Only logs in debug builds.
     *
     * @param tag The log tag
     * @param message The message to log
     * @param tr The throwable to log
     */
    public static void w(String tag, String message, Throwable tr) {
        if (IS_DEBUG) {
            Log.w(tag, message, tr);
        }
    }

    /**
     * Log an error message. Errors are always logged but sanitized to remove
     * potentially sensitive information.
     *
     * @param tag The log tag
     * @param message The message to log
     */
    public static void e(String tag, String message) {
        Log.e(tag, sanitize(message));
    }

    /**
     * Log an error message with throwable. Errors are always logged but sanitized.
     *
     * @param tag The log tag
     * @param message The message to log
     * @param tr The throwable to log
     */
    public static void e(String tag, String message, Throwable tr) {
        Log.e(tag, sanitize(message), tr);
    }

    /**
     * Sanitize a message by removing potentially sensitive information.
     * Removes password, token, key, and credential patterns from log messages.
     *
     * @param message The message to sanitize
     * @return The sanitized message
     */
    private static String sanitize(String message) {
        if (message == null) {
            return null;
        }

        return message
            // Remove password values
            .replaceAll("(?i)password[\"']?\\s*[:=]\\s*[\"']?[^\"'\\s,}]+", "password=***")
            // Remove token values
            .replaceAll("(?i)token[\"']?\\s*[:=]\\s*[\"']?[^\"'\\s,}]+", "token=***")
            // Remove key values
            .replaceAll("(?i)(api[_-]?key|secret[_-]?key)[\"']?\\s*[:=]\\s*[\"']?[^\"'\\s,}]+", "$1=***")
            // Remove credential values
            .replaceAll("(?i)credential[\"']?\\s*[:=]\\s*[\"']?[^\"'\\s,}]+", "credential=***")
            // Remove challenge values (WebAuthn)
            .replaceAll("(?i)challenge[\"']?\\s*[:=]\\s*[\"']?[^\"'\\s,}]+", "challenge=***");
    }

    /**
     * Check if debug logging is enabled.
     *
     * @return true if debug logging is enabled
     */
    public static boolean isDebugEnabled() {
        return IS_DEBUG;
    }
}
