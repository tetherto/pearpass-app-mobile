package com.pears.pass.autofill.crypto;

import java.io.ByteArrayOutputStream;

/**
 * Minimal CBOR encoder for WebAuthn authenticator data.
 * Implements only the subset needed for passkey operations.
 * Compatible with browser extension's CBOR encoding.
 *
 * CBOR Major Types:
 *   0: Unsigned integer (0x00-0x1B)
 *   1: Negative integer (0x20-0x3B)
 *   2: Byte string (0x40-0x5B)
 *   3: Text string (0x60-0x7B)
 *   4: Array (0x80-0x9B)
 *   5: Map (0xA0-0xBB)
 */
public class CBOREncoder {

    /**
     * Start a CBOR map with given number of items.
     */
    public static byte[] startMap(int count) {
        if (count <= 23) {
            return new byte[]{(byte) (0xA0 | count)};
        } else if (count <= 255) {
            return new byte[]{(byte) 0xB8, (byte) count};
        } else {
            byte[] data = new byte[3];
            data[0] = (byte) 0xB9;
            data[1] = (byte) ((count >> 8) & 0xFF);
            data[2] = (byte) (count & 0xFF);
            return data;
        }
    }

    /**
     * Encode an integer (positive or negative).
     */
    public static byte[] encodeInt(int value) {
        if (value < 0) {
            return encodeNegInt(-1 - value);
        }
        return encodeUInt(value);
    }

    /**
     * Encode unsigned integer (CBOR major type 0).
     */
    public static byte[] encodeUInt(int value) {
        if (value <= 23) {
            return new byte[]{(byte) value};
        } else if (value <= 255) {
            return new byte[]{0x18, (byte) value};
        } else if (value <= 65535) {
            byte[] data = new byte[3];
            data[0] = 0x19;
            data[1] = (byte) ((value >> 8) & 0xFF);
            data[2] = (byte) (value & 0xFF);
            return data;
        } else {
            byte[] data = new byte[5];
            data[0] = 0x1A;
            data[1] = (byte) ((value >> 24) & 0xFF);
            data[2] = (byte) ((value >> 16) & 0xFF);
            data[3] = (byte) ((value >> 8) & 0xFF);
            data[4] = (byte) (value & 0xFF);
            return data;
        }
    }

    /**
     * Encode negative integer (CBOR major type 1).
     * The value parameter is the absolute value minus one: -1 -> 0, -2 -> 1, etc.
     */
    public static byte[] encodeNegInt(int value) {
        if (value <= 23) {
            return new byte[]{(byte) (0x20 | value)};
        } else if (value <= 255) {
            return new byte[]{0x38, (byte) value};
        } else if (value <= 65535) {
            byte[] data = new byte[3];
            data[0] = 0x39;
            data[1] = (byte) ((value >> 8) & 0xFF);
            data[2] = (byte) (value & 0xFF);
            return data;
        } else {
            byte[] data = new byte[5];
            data[0] = 0x3A;
            data[1] = (byte) ((value >> 24) & 0xFF);
            data[2] = (byte) ((value >> 16) & 0xFF);
            data[3] = (byte) ((value >> 8) & 0xFF);
            data[4] = (byte) (value & 0xFF);
            return data;
        }
    }

    /**
     * Encode byte string (CBOR major type 2).
     */
    public static byte[] encodeBytes(byte[] data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int count = data.length;

        if (count <= 23) {
            out.write(0x40 | count);
        } else if (count <= 255) {
            out.write(0x58);
            out.write(count);
        } else if (count <= 65535) {
            out.write(0x59);
            out.write((count >> 8) & 0xFF);
            out.write(count & 0xFF);
        } else {
            out.write(0x5A);
            out.write((count >> 24) & 0xFF);
            out.write((count >> 16) & 0xFF);
            out.write((count >> 8) & 0xFF);
            out.write(count & 0xFF);
        }

        out.write(data, 0, data.length);
        return out.toByteArray();
    }

    /**
     * Encode text string (CBOR major type 3).
     */
    public static byte[] encodeText(String string) {
        byte[] utf8Data = string.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int count = utf8Data.length;

        if (count <= 23) {
            out.write(0x60 | count);
        } else if (count <= 255) {
            out.write(0x78);
            out.write(count);
        } else if (count <= 65535) {
            out.write(0x79);
            out.write((count >> 8) & 0xFF);
            out.write(count & 0xFF);
        } else {
            out.write(0x7A);
            out.write((count >> 24) & 0xFF);
            out.write((count >> 16) & 0xFF);
            out.write((count >> 8) & 0xFF);
            out.write(count & 0xFF);
        }

        out.write(utf8Data, 0, utf8Data.length);
        return out.toByteArray();
    }

    /**
     * Start a CBOR array with given number of items.
     */
    public static byte[] startArray(int count) {
        if (count <= 23) {
            return new byte[]{(byte) (0x80 | count)};
        } else if (count <= 255) {
            return new byte[]{(byte) 0x98, (byte) count};
        } else {
            byte[] data = new byte[3];
            data[0] = (byte) 0x99;
            data[1] = (byte) ((count >> 8) & 0xFF);
            data[2] = (byte) (count & 0xFF);
            return data;
        }
    }
}
