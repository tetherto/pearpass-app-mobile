package com.pears.pass.autofill.utils;

import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * Utility class for secure buffer handling of sensitive data like passwords.
 * Provides methods to convert strings to byte arrays and securely clear them after use.
 */
public final class SecureBufferUtils {

    private SecureBufferUtils() {
        // Prevent instantiation
    }

    /**
     * Converts a string to a UTF-8 encoded byte array.
     *
     * @param str The string to convert
     * @return UTF-8 encoded byte array
     */
    public static byte[] stringToBuffer(String str) {
        if (str == null) {
            return new byte[0];
        }
        return str.getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Converts a byte array to a UTF-8 string.
     *
     * @param buffer The byte array to convert
     * @return UTF-8 decoded string
     */
    public static String bufferToString(byte[] buffer) {
        if (buffer == null || buffer.length == 0) {
            return "";
        }
        return new String(buffer, StandardCharsets.UTF_8);
    }

    /**
     * Securely clears a byte array by overwriting with zeros.
     * This helps prevent sensitive data from remaining in memory.
     *
     * @param buffer The byte array to clear
     */
    public static void clearBuffer(byte[] buffer) {
        if (buffer != null && buffer.length > 0) {
            Arrays.fill(buffer, (byte) 0);
        }
    }

    /**
     * Converts a char array to a UTF-8 encoded byte array.
     * Use this instead of stringToBuffer when you have a char[] to avoid
     * creating an intermediate String which cannot be cleared from memory.
     *
     * @param chars The char array to convert
     * @return UTF-8 encoded byte array
     */
    public static byte[] charsToBuffer(char[] chars) {
        if (chars == null || chars.length == 0) {
            return new byte[0];
        }
        java.nio.CharBuffer charBuffer = java.nio.CharBuffer.wrap(chars);
        java.nio.ByteBuffer byteBuffer = StandardCharsets.UTF_8.encode(charBuffer);
        byte[] result = new byte[byteBuffer.remaining()];
        byteBuffer.get(result);
        // Clear the internal ByteBuffer array to avoid leaving data in memory
        if (byteBuffer.hasArray()) {
            Arrays.fill(byteBuffer.array(), (byte) 0);
        }
        return result;
    }

    /**
     * Securely clears a char array by overwriting with null characters.
     * Use this to clear password char arrays after converting to byte[].
     *
     * @param chars The char array to clear
     */
    public static void clearChars(char[] chars) {
        if (chars != null && chars.length > 0) {
            Arrays.fill(chars, '\0');
        }
    }

    /**
     * Converts a byte array to Base64 encoded string.
     * Used for transmitting binary data over JSON/RPC.
     *
     * @param buffer The byte array to encode
     * @return Base64 encoded string
     */
    public static String toBase64(byte[] buffer) {
        if (buffer == null || buffer.length == 0) {
            return "";
        }
        return Base64.encodeToString(buffer, Base64.NO_WRAP);
    }

    /**
     * Decodes a Base64 string to a byte array.
     *
     * @param base64 The Base64 encoded string
     * @return Decoded byte array
     */
    public static byte[] fromBase64(String base64) {
        if (base64 == null || base64.isEmpty()) {
            return new byte[0];
        }
        return Base64.decode(base64, Base64.NO_WRAP);
    }

    /**
     * Securely clears a CharSequence (like StringBuilder or StringBuffer).
     * Note: Regular String objects cannot be cleared as they are immutable.
     *
     * @param chars The CharSequence to clear (should be StringBuilder or similar)
     */
    public static void clearCharSequence(CharSequence chars) {
        if (chars instanceof StringBuilder) {
            StringBuilder sb = (StringBuilder) chars;
            for (int i = 0; i < sb.length(); i++) {
                sb.setCharAt(i, '\0');
            }
            sb.setLength(0);
        } else if (chars instanceof StringBuffer) {
            StringBuffer sb = (StringBuffer) chars;
            for (int i = 0; i < sb.length(); i++) {
                sb.setCharAt(i, '\0');
            }
            sb.setLength(0);
        }
    }
}
