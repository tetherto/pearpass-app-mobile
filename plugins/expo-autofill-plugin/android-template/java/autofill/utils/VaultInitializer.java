package com.pears.pass.autofill.utils;

import android.util.Log;

import com.pears.pass.autofill.data.PearPassVaultClient;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Utility class for vault client initialization.
 * Centralizes the initialization logic shared between AuthenticationActivity and PasskeyRegistrationActivity.
 */
public class VaultInitializer {
    private static final String TAG = "VaultInitializer";
    private static final long DEFAULT_TIMEOUT_MS = 30000;

    /**
     * Result of vault initialization containing state information.
     */
    public static class VaultInitState {
        public final boolean hasPasswordSet;
        public final boolean isLoggedIn;
        public final boolean isVaultOpen;
        public final PearPassVaultClient.MasterPasswordEncryption encryption;

        public VaultInitState(boolean hasPasswordSet, boolean isLoggedIn, boolean isVaultOpen,
                              PearPassVaultClient.MasterPasswordEncryption encryption) {
            this.hasPasswordSet = hasPasswordSet;
            this.isLoggedIn = isLoggedIn;
            this.isVaultOpen = isVaultOpen;
            this.encryption = encryption;
        }
    }

    /**
     * Error types for vault initialization failures.
     */
    public enum VaultInitError {
        TIMEOUT,
        INITIALIZATION_FAILED,
        VAULT_LOCKED,
        VAULT_CLIENT_ERROR
    }

    /**
     * Callback interface for initialization results.
     */
    public interface Callback {
        void onSuccess(VaultInitState state);
        void onError(VaultInitError error, Exception exception);
    }

    /**
     * Wait for vault client to be ready with a timeout.
     *
     * @param client The vault client to wait for
     * @param timeoutMs Timeout in milliseconds
     * @return CompletableFuture that completes when client is ready
     */
    public static CompletableFuture<Void> waitForClient(PearPassVaultClient client, long timeoutMs) {
        return CompletableFuture.runAsync(() -> {
            try {
                client.waitForInitialization().get(timeoutMs, TimeUnit.MILLISECONDS);
                Log.d(TAG, "Vault client is ready");
            } catch (TimeoutException e) {
                throw new RuntimeException("Vault client initialization timed out", e);
            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize vault client", e);
            }
        });
    }

    /**
     * Wait for vault client to be ready with default timeout.
     */
    public static CompletableFuture<Void> waitForClient(PearPassVaultClient client) {
        return waitForClient(client, DEFAULT_TIMEOUT_MS);
    }

    /**
     * Initialize user state by checking vault status.
     *
     * @param client The vault client
     * @return CompletableFuture with the initialization state
     */
    public static CompletableFuture<VaultInitState> initializeUser(PearPassVaultClient client) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Get vault status and active vault status
                PearPassVaultClient.VaultStatus vaultsStatus = client.vaultsGetStatus().get();
                PearPassVaultClient.VaultStatus activeVaultStatus = client.activeVaultGetStatus().get();

                // Get master password encryption
                PearPassVaultClient.MasterPasswordEncryption encryption =
                        client.getMasterPasswordEncryption(vaultsStatus).get();

                // Check if password is set
                boolean hasPasswordSet = encryption != null &&
                        encryption.ciphertext != null &&
                        encryption.nonce != null &&
                        encryption.salt != null;

                // Check if user is logged in (vault is initialized and unlocked)
                boolean isLoggedIn = vaultsStatus.isInitialized && !vaultsStatus.isLocked;

                // Check if active vault is open
                boolean isVaultOpen = isLoggedIn &&
                        activeVaultStatus.isInitialized &&
                        !activeVaultStatus.isLocked;

                Log.d(TAG, "User initialization complete - hasPasswordSet: " + hasPasswordSet +
                        ", isLoggedIn: " + isLoggedIn + ", isVaultOpen: " + isVaultOpen);

                return new VaultInitState(hasPasswordSet, isLoggedIn, isVaultOpen, encryption);
            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize user", e);
            }
        });
    }

    /**
     * Classify an exception into a VaultInitError type.
     * Delegates to VaultErrorUtils for consistent error detection.
     *
     * @param exception The exception to classify
     * @return The appropriate VaultInitError type
     */
    public static VaultInitError classifyError(Exception exception) {
        if (exception instanceof TimeoutException) {
            return VaultInitError.TIMEOUT;
        }

        // Check if it's a timeout wrapped in another exception
        Throwable cause = exception.getCause();
        if (cause instanceof TimeoutException) {
            return VaultInitError.TIMEOUT;
        }

        // Delegate lock error detection to VaultErrorUtils
        if (VaultErrorUtils.isDatabaseLockError(exception)) {
            return VaultInitError.VAULT_LOCKED;
        }

        return VaultInitError.VAULT_CLIENT_ERROR;
    }

    /**
     * Check if an error is a database lock error that might be retryable.
     *
     * @param exception The exception to check
     * @return true if this is a lock error
     */
    public static boolean isLockError(Exception exception) {
        return classifyError(exception) == VaultInitError.VAULT_LOCKED;
    }

    /**
     * Try to check if password is set, even when other operations fail.
     * This is useful for error recovery scenarios.
     *
     * @param client The vault client
     * @return true if password is set, false otherwise (including on error)
     */
    public static boolean tryCheckPasswordSet(PearPassVaultClient client) {
        try {
            PearPassVaultClient.MasterPasswordEncryption encryption =
                    client.getMasterPasswordEncryption(null).get();
            return encryption != null &&
                    encryption.ciphertext != null &&
                    encryption.nonce != null &&
                    encryption.salt != null;
        } catch (Exception e) {
            Log.e(TAG, "Could not check password status: " + e.getMessage());
            return false;
        }
    }

    /**
     * Perform full initialization with callback.
     * Waits for client, then initializes user state.
     *
     * @param client The vault client
     * @param callback Callback for results
     */
    public static void initialize(PearPassVaultClient client, Callback callback) {
        initialize(client, DEFAULT_TIMEOUT_MS, callback);
    }

    /**
     * Perform full initialization with callback and custom timeout.
     *
     * @param client The vault client
     * @param timeoutMs Timeout in milliseconds
     * @param callback Callback for results
     */
    public static void initialize(PearPassVaultClient client, long timeoutMs, Callback callback) {
        waitForClient(client, timeoutMs)
                .thenCompose(v -> initializeUser(client))
                .whenComplete((state, error) -> {
                    if (error != null) {
                        Exception ex = error instanceof Exception ?
                                (Exception) error : new Exception(error);
                        VaultInitError errorType = classifyError(ex);
                        callback.onError(errorType, ex);
                    } else {
                        callback.onSuccess(state);
                    }
                });
    }
}
