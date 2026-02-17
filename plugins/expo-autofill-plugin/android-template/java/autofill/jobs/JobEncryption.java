package com.pears.pass.autofill.jobs;

import com.goterl.lazysodium.SodiumAndroid;
import com.goterl.lazysodium.interfaces.SecretBox;

import java.util.Arrays;

/**
 * Encryption operations for the job queue file using libsodium's crypto_secretbox
 * (XSalsa20-Poly1305). This must match the JS reader which uses crypto_secretbox_open_easy
 * from sodium-native.
 *
 * The encryption key is the hashedPassword (32 bytes) from the vault's masterEncryption metadata,
 * the same key used for vault encryption, already derived via Argon2id.
 *
 * Uses lazysodium-android for native bindings to libsodium.
 *
 * NOTE: The lazysodium-android dependency must be added to the app's build.gradle:
 *   implementation "com.goterl:lazysodium-android:5.1.0@aar"
 *   implementation "net.java.dev.jna:jna:5.14.0@aar"
 */
public class JobEncryption {
    private static final String TAG = "JobEncryption";

    /** Nonce size for crypto_secretbox (24 bytes). */
    public static final int NONCE_BYTES = SecretBox.NONCEBYTES;

    /** Authentication tag size for crypto_secretbox (16 bytes). */
    public static final int MAC_BYTES = SecretBox.MACBYTES;

    /** Required key length for crypto_secretbox (32 bytes). */
    public static final int KEY_BYTES = SecretBox.KEYBYTES;

    private static final SodiumAndroid sodium;

    static {
        sodium = new SodiumAndroid();
    }

    private JobEncryption() {
        // Prevent instantiation
    }

    /**
     * Encrypt data using crypto_secretbox (XSalsa20-Poly1305).
     *
     * Generates a random 24-byte nonce, encrypts the data, and returns nonce + ciphertext.
     * The ciphertext includes the 16-byte Poly1305 authentication tag.
     *
     * @param data The plaintext data to encrypt
     * @param key  The 32-byte encryption key (hashedPassword)
     * @return nonce (24 bytes) + ciphertext (data.length + 16 bytes MAC)
     * @throws Exception if encryption fails or key length is invalid
     */
    public static byte[] encrypt(byte[] data, byte[] key) throws Exception {
        if (key == null || key.length != KEY_BYTES) {
            throw new IllegalArgumentException(
                    "Key must be " + KEY_BYTES + " bytes, got " + (key != null ? key.length : 0));
        }
        if (data == null || data.length == 0) {
            throw new IllegalArgumentException("Data must not be null or empty");
        }

        byte[] nonce = generateNonce();
        byte[] ciphertext = new byte[MAC_BYTES + data.length];

        // Native signature: crypto_secretbox_easy(byte[] c, byte[] m, long mlen, byte[] n, byte[] k)
        int result = sodium.crypto_secretbox_easy(
                ciphertext, data, (long) data.length, nonce, key);

        if (result != 0) {
            throw new Exception("crypto_secretbox_easy failed with code: " + result);
        }

        // Return nonce + ciphertext
        byte[] output = new byte[NONCE_BYTES + ciphertext.length];
        System.arraycopy(nonce, 0, output, 0, NONCE_BYTES);
        System.arraycopy(ciphertext, 0, output, NONCE_BYTES, ciphertext.length);

        return output;
    }

    /**
     * Decrypt data that was encrypted with crypto_secretbox.
     *
     * Expects input as nonce (first 24 bytes) followed by ciphertext (includes 16-byte MAC).
     *
     * @param nonceAndCiphertext nonce (first 24 bytes) + ciphertext (remaining bytes)
     * @param key                The 32-byte decryption key (hashedPassword)
     * @return The decrypted plaintext data
     * @throws Exception if decryption fails, data is too short, or key is invalid
     */
    public static byte[] decrypt(byte[] nonceAndCiphertext, byte[] key) throws Exception {
        if (key == null || key.length != KEY_BYTES) {
            throw new IllegalArgumentException(
                    "Key must be " + KEY_BYTES + " bytes, got " + (key != null ? key.length : 0));
        }
        if (nonceAndCiphertext == null || nonceAndCiphertext.length <= NONCE_BYTES + MAC_BYTES) {
            throw new IllegalArgumentException(
                    "Data too short: must be at least " + (NONCE_BYTES + MAC_BYTES + 1) + " bytes");
        }

        // Split nonce and ciphertext
        byte[] nonce = new byte[NONCE_BYTES];
        System.arraycopy(nonceAndCiphertext, 0, nonce, 0, NONCE_BYTES);

        int ciphertextLength = nonceAndCiphertext.length - NONCE_BYTES;
        byte[] ciphertext = new byte[ciphertextLength];
        System.arraycopy(nonceAndCiphertext, NONCE_BYTES, ciphertext, 0, ciphertextLength);

        byte[] plaintext = new byte[ciphertextLength - MAC_BYTES];

        // Native signature: crypto_secretbox_open_easy(byte[] m, byte[] c, long clen, byte[] n, byte[] k)
        int result = sodium.crypto_secretbox_open_easy(
                plaintext, ciphertext, (long) ciphertext.length, nonce, key);

        if (result != 0) {
            throw new Exception("crypto_secretbox_open_easy failed — wrong key or corrupted data");
        }

        return plaintext;
    }

    /**
     * Generate a cryptographically random 24-byte nonce using libsodium's randombytes_buf.
     *
     * @return 24 random bytes suitable for crypto_secretbox
     */
    public static byte[] generateNonce() {
        byte[] nonce = new byte[NONCE_BYTES];
        sodium.randombytes_buf(nonce, NONCE_BYTES);
        return nonce;
    }

    /**
     * Zero out a byte array to prevent sensitive data from lingering in memory.
     *
     * Falls back to Arrays.fill if libsodium's sodium_memzero is not available.
     *
     * @param data The byte array to zero
     */
    public static void secureZero(byte[] data) {
        if (data != null && data.length > 0) {
            try {
                sodium.sodium_memzero(data, data.length);
            } catch (Exception e) {
                // Fallback to Java zeroing
                Arrays.fill(data, (byte) 0);
            }
        }
    }

    /**
     * Decode a hex-encoded string to a byte array.
     *
     * The vault worklet transmits the hashedPassword as a hex string (e.g., "a1b2c3...").
     * This method converts it to the raw 32-byte key needed by crypto_secretbox.
     *
     * @param hex The hex-encoded string (must have even length)
     * @return The decoded byte array
     * @throws IllegalArgumentException if the hex string is null, empty, or has odd length
     */
    public static byte[] hexToBytes(String hex) {
        if (hex == null || hex.isEmpty()) {
            throw new IllegalArgumentException("Hex string must not be null or empty");
        }
        if (hex.length() % 2 != 0) {
            throw new IllegalArgumentException("Hex string must have even length");
        }

        int len = hex.length() / 2;
        byte[] result = new byte[len];
        for (int i = 0; i < len; i++) {
            int high = Character.digit(hex.charAt(i * 2), 16);
            int low = Character.digit(hex.charAt(i * 2 + 1), 16);
            if (high == -1 || low == -1) {
                throw new IllegalArgumentException("Invalid hex character at position " + (i * 2));
            }
            result[i] = (byte) ((high << 4) | low);
        }
        return result;
    }
}
