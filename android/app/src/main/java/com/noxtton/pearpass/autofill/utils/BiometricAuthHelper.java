package com.noxtton.pearpass.autofill.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.security.keystore.UserNotAuthenticatedException;
import android.util.Base64;
import android.util.Log;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * Helper class for biometric authentication in the autofill extension
 * Replicates Expo SecureStore's approach: AES key in Keystore + BiometricPrompt
 */
public class BiometricAuthHelper {
    private static final String TAG = "BiometricAuthHelper";

    // SharedPreferences constants - must match Expo SecureStore
    // Default keychainService in Expo SecureStore is "key_v1" (DEFAULT_KEYSTORE_ALIAS)
    private static final String SHARED_PREFERENCES_NAME = "SecureStore";
    private static final String KEYCHAIN_SERVICE = "key_v1";
    private static final String BIOMETRIC_ENABLED_KEY = KEYCHAIN_SERVICE + "-biometricsEnabled";
    private static final String ENCRYPTION_DATA_KEY = KEYCHAIN_SERVICE + "-encryptionData";

    // Keystore and encryption constants - must match Expo SecureStore
    private static final String KEYSTORE_PROVIDER = "AndroidKeyStore";
    private static final String AES_CIPHER = "AES/GCM/NoPadding";
    private static final int AES_KEY_SIZE_BITS = 256;
    private static final int GCM_AUTHENTICATION_TAG_LENGTH = 128;

    // Expo SecureStore creates keystore alias as: "AES/GCM/NoPadding:key_v1:keystoreAuthenticated"
    // where "key_v1" is the default keychainService (DEFAULT_KEYSTORE_ALIAS)
    private static final String KEY_ALIAS = AES_CIPHER + ":" + KEYCHAIN_SERVICE + ":keystoreAuthenticated";

    // JSON property names
    private static final String PROP_CIPHERTEXT = "ct";
    private static final String PROP_IV = "iv";
    private static final String PROP_TLEN = "tlen";
    private static final String PROP_VAULT_CIPHERTEXT = "ciphertext";
    private static final String PROP_VAULT_NONCE = "nonce";
    private static final String PROP_VAULT_HASHED_PASSWORD = "hashedPassword";

    private final Context context;
    private final SharedPreferences sharedPrefs;

    // Singleton instance
    private static BiometricAuthHelper instance;

    /**
     * Encryption data structure matching the main app's format
     */
    public static class EncryptionData {
        public final String ciphertext;
        public final String nonce;
        public final String hashedPassword;

        public EncryptionData(String ciphertext, String nonce, String hashedPassword) {
            this.ciphertext = ciphertext;
            this.nonce = nonce;
            this.hashedPassword = hashedPassword;
        }

        public String toJson() {
            try {
                JSONObject obj = new JSONObject();
                obj.put(PROP_VAULT_CIPHERTEXT, ciphertext);
                obj.put(PROP_VAULT_NONCE, nonce);
                obj.put(PROP_VAULT_HASHED_PASSWORD, hashedPassword);
                return obj.toString();
            } catch (Exception e) {
                return null;
            }
        }

        public static EncryptionData fromJson(String json) {
            try {
                JSONObject obj = new JSONObject(json);
                return new EncryptionData(
                    obj.getString(PROP_VAULT_CIPHERTEXT),
                    obj.getString(PROP_VAULT_NONCE),
                    obj.getString(PROP_VAULT_HASHED_PASSWORD)
                );
            } catch (Exception e) {
                return null;
            }
        }
    }

    private BiometricAuthHelper(Context context) {
        this.context = context.getApplicationContext();
        this.sharedPrefs = context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
    }

    public static synchronized BiometricAuthHelper getInstance(Context context) {
        if (instance == null) {
            instance = new BiometricAuthHelper(context);
        }
        return instance;
    }

    /**
     * Check if biometric authentication is supported on this device
     */
    public boolean isBiometricSupported() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return false;
        }
        BiometricManager biometricManager = BiometricManager.from(context);
        int result = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG);
        return result == BiometricManager.BIOMETRIC_SUCCESS;
    }

    /**
     * Check if biometrics are enabled (has stored encrypted data from main app)
     */
    public boolean isBiometricsEnabled() {
        try {
            String enabledValue = sharedPrefs.getString(BIOMETRIC_ENABLED_KEY, null);
            if (enabledValue == null) {
                Log.d(TAG, "isBiometricsEnabled - no BIOMETRIC_ENABLED_KEY found");
                return false;
            }

            // Parse the JSON to get the encrypted data
            JSONObject encryptedItem = new JSONObject(enabledValue);
            String ciphertextB64 = encryptedItem.getString(PROP_CIPHERTEXT);
            String ivB64 = encryptedItem.getString(PROP_IV);
            int tlen = encryptedItem.getInt(PROP_TLEN);

            byte[] ciphertextBytes = Base64.decode(ciphertextB64, Base64.DEFAULT);
            byte[] ivBytes = Base64.decode(ivB64, Base64.DEFAULT);

            // Get the keystore alias from the JSON (it's stored in keystoreAlias field)
            String keystoreAlias = encryptedItem.optString("keystoreAlias", KEYCHAIN_SERVICE);
            boolean requiresAuth = encryptedItem.optBoolean("requireAuthentication", false);

            // Build the full key alias based on authentication requirement
            String authSuffix = requiresAuth ? ":keystoreAuthenticated" : ":keystoreUnauthenticated";
            String keyAlias = AES_CIPHER + ":" + keystoreAlias + authSuffix;

            // Get the secret key from keystore
            KeyStore keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER);
            keyStore.load(null);

            // Log all available keystore aliases
            java.util.Enumeration<String> aliases = keyStore.aliases();
            StringBuilder allAliases = new StringBuilder("Available keystore aliases: ");
            while (aliases.hasMoreElements()) {
                allAliases.append(aliases.nextElement()).append(", ");
            }
            Log.d(TAG, allAliases.toString());

            if (!keyStore.containsAlias(keyAlias)) {
                Log.e(TAG, "Keystore key not found: " + keyAlias);
                return false;
            }

            KeyStore.SecretKeyEntry entry = (KeyStore.SecretKeyEntry) keyStore.getEntry(keyAlias, null);
            SecretKey secretKey = entry.getSecretKey();

            // Initialize cipher for decryption
            Cipher cipher = Cipher.getInstance(AES_CIPHER);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(tlen, ivBytes);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);

            // Decrypt the data
            byte[] plaintextBytes = cipher.doFinal(ciphertextBytes);
            String plaintext = new String(plaintextBytes, StandardCharsets.UTF_8);

            Log.d(TAG, "isBiometricsEnabled - decrypted value: " + plaintext);

            // The decrypted value should be "true" or "false"
            return Boolean.parseBoolean(plaintext);
        } catch (Exception e) {
            Log.e(TAG, "isBiometricsEnabled - error: " + e.getMessage(), e);
            return false;
        }
    }

    /**
     * Check if encryption data is stored
     */
    public boolean hasStoredEncryptionData() {
        String encryptedData = sharedPrefs.getString(ENCRYPTION_DATA_KEY, null);
        return encryptedData != null && !encryptedData.isEmpty();
    }

    /**
     * Check if the stored encryption data requires authentication
     */
    private boolean isStoredWithAuthentication() {
        try {
            String encryptedDataString = sharedPrefs.getString(ENCRYPTION_DATA_KEY, null);
            if (encryptedDataString == null) {
                return false;
            }

            JSONObject encryptedItem = new JSONObject(encryptedDataString);
            boolean requiresAuth = encryptedItem.optBoolean("requireAuthentication", false);
            return requiresAuth;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if biometrics are available and enabled
     */
    public boolean canUseBiometrics() {
        return isBiometricSupported() && isBiometricsEnabled();
    }


    /**
     * Get the secret key from the Android Keystore
     * This key is created by the main app (Expo SecureStore)
     */
    private SecretKey getSecretKey() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER);
        keyStore.load(null);

        if (!keyStore.containsAlias(KEY_ALIAS)) {
            throw new Exception("Keystore key not found. Biometric auth must be enabled from the main app first.");
        }

        KeyStore.SecretKeyEntry entry = (KeyStore.SecretKeyEntry) keyStore.getEntry(KEY_ALIAS, null);
        if (entry == null) {
            throw new Exception("Failed to retrieve keystore entry");
        }

        return entry.getSecretKey();
    }

    /**
     * Show biometric prompt and retrieve encryption data
     * This replicates Expo SecureStore's cipher-based authentication
     */
    public CompletableFuture<EncryptionData> authenticateWithBiometric(
            FragmentActivity activity,
            String title,
            String subtitle) {

        CompletableFuture<EncryptionData> future = new CompletableFuture<>();

        if (!canUseBiometrics()) {
            future.completeExceptionally(new Exception("Biometrics not available or not enabled"));
            return future;
        }

        try {
            // Get encrypted data from storage
            String encryptedDataString = sharedPrefs.getString(ENCRYPTION_DATA_KEY, null);
            if (encryptedDataString == null) {
                future.completeExceptionally(new Exception("No encrypted data found"));
                return future;
            }

            JSONObject encryptedItem = new JSONObject(encryptedDataString);
            String ciphertextB64 = encryptedItem.getString(PROP_CIPHERTEXT);
            String ivB64 = encryptedItem.getString(PROP_IV);
            int tlen = encryptedItem.getInt(PROP_TLEN);

            byte[] ciphertextBytes = Base64.decode(ciphertextB64, Base64.DEFAULT);
            byte[] ivBytes = Base64.decode(ivB64, Base64.DEFAULT);

            // Get the secret key from keystore
            KeyStore keyStore = KeyStore.getInstance(KEYSTORE_PROVIDER);
            keyStore.load(null);

            if (!keyStore.containsAlias(KEY_ALIAS)) {
                future.completeExceptionally(new Exception("Keystore key not found"));
                return future;
            }

            KeyStore.SecretKeyEntry entry = (KeyStore.SecretKeyEntry) keyStore.getEntry(KEY_ALIAS, null);
            SecretKey secretKey = entry.getSecretKey();

            // Initialize cipher for decryption
            Cipher cipher = Cipher.getInstance(AES_CIPHER);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(tlen, ivBytes);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);

            // Create biometric prompt
            Executor executor = ContextCompat.getMainExecutor(activity);
            BiometricPrompt biometricPrompt = new BiometricPrompt(activity, executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errorCode, CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        String message = "Authentication error: " + errString;
                        if (errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                            errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                            message = "Authentication canceled";
                        }
                        future.completeExceptionally(new Exception(message));
                    }

                    @Override
                    public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        try {
                            // Get the authenticated cipher
                            Cipher authenticatedCipher = result.getCryptoObject().getCipher();

                            // Decrypt the data
                            byte[] plaintextBytes = authenticatedCipher.doFinal(ciphertextBytes);
                            String plaintext = new String(plaintextBytes, StandardCharsets.UTF_8);

                            // Parse and return the encryption data
                            EncryptionData encryptionData = EncryptionData.fromJson(plaintext);
                            future.complete(encryptionData);
                        } catch (Exception e) {
                            future.completeExceptionally(new Exception("Failed to decrypt data"));
                        }
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        // User can retry, don't complete the future
                    }
                });

            // Create prompt info
            BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle(title)
                .setSubtitle(subtitle)
                .setNegativeButtonText("Use Password")
                .build();

            // Show biometric prompt with cipher
            biometricPrompt.authenticate(promptInfo, new BiometricPrompt.CryptoObject(cipher));

        } catch (UserNotAuthenticatedException e) {
            future.completeExceptionally(new Exception("User authentication required"));
        } catch (Exception e) {
            future.completeExceptionally(new Exception("Failed to initialize authentication"));
        }

        return future;
    }

}