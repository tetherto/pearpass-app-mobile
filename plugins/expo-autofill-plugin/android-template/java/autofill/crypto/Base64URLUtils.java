package com.pears.pass.autofill.crypto;

import android.util.Base64;

/**
 * Base64URL encoding/decoding utilities for WebAuthn compatibility.
 * RFC 4648 Section 5: Base 64 Encoding with URL and Filename Safe Alphabet.
 */
public class Base64URLUtils {

    /**
     * Encode bytes to Base64URL string (no padding).
     */
    public static String encode(byte[] data) {
        return Base64.encodeToString(data, Base64.URL_SAFE | Base64.NO_PADDING | Base64.NO_WRAP);
    }

    /**
     * Decode Base64URL string to bytes.
     */
    public static byte[] decode(String base64url) {
        return Base64.decode(base64url, Base64.URL_SAFE | Base64.NO_PADDING | Base64.NO_WRAP);
    }
}
