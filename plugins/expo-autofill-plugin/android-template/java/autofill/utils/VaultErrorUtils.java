package com.pears.pass.autofill.utils;

import com.pears.pass.autofill.ui.ErrorBoundaryFragment;

import java.util.concurrent.TimeoutException;

/**
 * Utility class for vault error classification.
 * Centralizes error detection logic shared across activities.
 */
public final class VaultErrorUtils {

    private VaultErrorUtils() {} // Prevent instantiation

    /**
     * Database lock error patterns to check for.
     * These patterns indicate the database is locked by another process.
     */
    private static final String[] LOCK_ERROR_PATTERNS = {
        "lock hold by current process",
        "file descriptor could not be locked",
        "no record locks available",
        "database is locked",
        "cannot acquire lock"
    };

    /**
     * Case-sensitive lock error patterns (e.g., explicit LOCK errors).
     */
    private static final String[] LOCK_ERROR_PATTERNS_CASE_SENSITIVE = {
        "LOCK"
    };

    /**
     * Check if an exception represents a database lock error.
     *
     * @param e The throwable to check
     * @return true if this is a database lock error
     */
    public static boolean isDatabaseLockError(Throwable e) {
        if (e == null) {
            return false;
        }

        // Check the exception message
        if (containsLockPattern(e.getMessage())) {
            return true;
        }

        // Check the cause
        Throwable cause = e.getCause();
        if (cause != null && containsLockPattern(cause.getMessage())) {
            return true;
        }

        // Check suppressed exceptions
        for (Throwable suppressed : e.getSuppressed()) {
            if (containsLockPattern(suppressed.getMessage())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a message contains any lock error pattern.
     *
     * @param message The message to check
     * @return true if the message contains a lock pattern
     */
    private static boolean containsLockPattern(String message) {
        if (message == null || message.isEmpty()) {
            return false;
        }

        String lowerMessage = message.toLowerCase();

        // Case-insensitive checks
        for (String pattern : LOCK_ERROR_PATTERNS) {
            if (lowerMessage.contains(pattern)) {
                return true;
            }
        }

        // Case-sensitive checks
        for (String pattern : LOCK_ERROR_PATTERNS_CASE_SENSITIVE) {
            if (message.contains(pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Classify an error into a specific type.
     *
     * @param e The throwable to classify
     * @return The appropriate ErrorType
     */
    public static ErrorBoundaryFragment.ErrorType classifyError(Throwable e) {
        if (e == null) {
            return ErrorBoundaryFragment.ErrorType.GENERIC_ERROR;
        }

        // Check for timeout
        if (e instanceof TimeoutException) {
            return ErrorBoundaryFragment.ErrorType.TIMEOUT_ERROR;
        }

        // Check cause for timeout
        if (e.getCause() instanceof TimeoutException) {
            return ErrorBoundaryFragment.ErrorType.TIMEOUT_ERROR;
        }

        // Check for database lock errors
        if (isDatabaseLockError(e)) {
            return ErrorBoundaryFragment.ErrorType.VAULT_LOCKED_ERROR;
        }

        // Check for initialization errors
        String message = e.getMessage();
        if (message != null && message.toLowerCase().contains("initialization")) {
            return ErrorBoundaryFragment.ErrorType.INITIALIZATION_FAILED;
        }

        return ErrorBoundaryFragment.ErrorType.VAULT_CLIENT_ERROR;
    }

    /**
     * Get a user-friendly error message for display.
     *
     * @param e The throwable to get a message for
     * @return A user-friendly error message
     */
    public static String getUserFriendlyMessage(Throwable e) {
        ErrorBoundaryFragment.ErrorType type = classifyError(e);

        switch (type) {
            case VAULT_LOCKED_ERROR:
                return "The vault is locked by another process. Please close other PearPass instances and try again.";
            case TIMEOUT_ERROR:
                return "The operation timed out. Please try again.";
            case INITIALIZATION_FAILED:
                return "Failed to initialize the vault. Please restart the app.";
            default:
                return "An error occurred. Please try again.";
        }
    }
}
