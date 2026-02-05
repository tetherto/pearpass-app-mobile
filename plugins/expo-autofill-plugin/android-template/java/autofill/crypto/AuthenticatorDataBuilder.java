package com.pears.pass.autofill.crypto;

import java.io.ByteArrayOutputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.interfaces.ECPublicKey;

/**
 * Builds WebAuthn authenticator data structures.
 * Compatible with browser extension's buildAuthenticatorData.js
 *
 * Authenticator Data Flags:
 *   UP (User Present)           - Bit 0: 0x01
 *   UV (User Verified)          - Bit 2: 0x04
 *   BE (Backup Eligibility)     - Bit 3: 0x08
 *   BS (Backup State)           - Bit 4: 0x10
 *   AT (Attested Credential)    - Bit 6: 0x40
 *   ED (Extension Data)         - Bit 7: 0x80
 *
 *   Registration flags: UP + UV + BE + BS + AT = 0x5D
 *   Assertion flags:    UP + UV + BE + BS      = 0x1D
 */
public class AuthenticatorDataBuilder {

    private static final byte FLAGS_REGISTRATION = 0x5D;
    private static final byte FLAGS_ASSERTION = 0x1D;

    /** Software authenticator AAGUID (all zeros, 16 bytes) */
    private static final byte[] SOFTWARE_AAGUID = new byte[16];

    /**
     * Build authenticator data for passkey registration.
     * Structure: rpIdHash(32) || flags(1) || signCount(4) || aaguid(16) || credIdLen(2) || credId || coseKey
     */
    public static byte[] buildForRegistration(String rpId, byte[] credentialId, PublicKey publicKey) throws Exception {
        ByteArrayOutputStream authData = new ByteArrayOutputStream();

        // 1. RP ID Hash (32 bytes) - SHA-256 of rpId
        byte[] rpIdHash = PasskeyCrypto.sha256(rpId);
        authData.write(rpIdHash);

        // 2. Flags (1 byte) - 0x5D for registration
        authData.write(FLAGS_REGISTRATION);

        // 3. Sign count (4 bytes, big-endian) - start at 0
        authData.write(new byte[]{0x00, 0x00, 0x00, 0x00});

        // 4. AAGUID (16 bytes) - all zeros for software authenticator
        authData.write(SOFTWARE_AAGUID);

        // 5. Credential ID length (2 bytes, big-endian)
        int credIdLen = credentialId.length;
        authData.write((credIdLen >> 8) & 0xFF);
        authData.write(credIdLen & 0xFF);

        // 6. Credential ID
        authData.write(credentialId);

        // 7. COSE public key (CBOR-encoded)
        byte[] coseKey = encodeCOSEPublicKey(publicKey);
        authData.write(coseKey);

        return authData.toByteArray();
    }

    /**
     * Build authenticator data for passkey assertion.
     * Structure: rpIdHash(32) || flags(1) || signCount(4) = 37 bytes
     */
    public static byte[] buildForAssertion(String rpId) throws Exception {
        ByteArrayOutputStream authData = new ByteArrayOutputStream();

        // 1. RP ID Hash (32 bytes)
        byte[] rpIdHash = PasskeyCrypto.sha256(rpId);
        authData.write(rpIdHash);

        // 2. Flags (1 byte) - 0x1D for assertion
        authData.write(FLAGS_ASSERTION);

        // 3. Sign count (4 bytes, big-endian) - 0
        authData.write(new byte[]{0x00, 0x00, 0x00, 0x00});

        return authData.toByteArray();
    }

    /**
     * Encode P256 public key as COSE_Key (CBOR).
     * Structure: {1: 2, 3: -7, -1: 1, -2: x(32), -3: y(32)}
     *   kty (1): EC2 (2)
     *   alg (3): ES256 (-7)
     *   crv (-1): P-256 (1)
     *   x (-2): x-coordinate (32 bytes)
     *   y (-3): y-coordinate (32 bytes)
     *
     * Key pitfall: ECPublicKey.getW().getAffineX/Y() returns BigInteger which may be
     * less than 32 bytes. Must left-pad to exactly 32 bytes for COSE key encoding.
     */
    private static byte[] encodeCOSEPublicKey(PublicKey publicKey) {
        ECPublicKey ecKey = (ECPublicKey) publicKey;
        byte[] x = padTo32Bytes(ecKey.getW().getAffineX());
        byte[] y = padTo32Bytes(ecKey.getW().getAffineY());

        ByteArrayOutputStream coseKey = new ByteArrayOutputStream();

        // Map with 5 items
        writeBytes(coseKey, CBOREncoder.startMap(5));

        // 1 (kty): 2 (EC2)
        writeBytes(coseKey, CBOREncoder.encodeUInt(1));
        writeBytes(coseKey, CBOREncoder.encodeUInt(2));

        // 3 (alg): -7 (ES256) -> encode as negative: -7 = -1 - 6
        writeBytes(coseKey, CBOREncoder.encodeUInt(3));
        writeBytes(coseKey, CBOREncoder.encodeNegInt(6));

        // -1 (crv): 1 (P-256) -> -1 = -1 - 0
        writeBytes(coseKey, CBOREncoder.encodeNegInt(0));
        writeBytes(coseKey, CBOREncoder.encodeUInt(1));

        // -2 (x): x-coordinate -> -2 = -1 - 1
        writeBytes(coseKey, CBOREncoder.encodeNegInt(1));
        writeBytes(coseKey, CBOREncoder.encodeBytes(x));

        // -3 (y): y-coordinate -> -3 = -1 - 2
        writeBytes(coseKey, CBOREncoder.encodeNegInt(2));
        writeBytes(coseKey, CBOREncoder.encodeBytes(y));

        return coseKey.toByteArray();
    }

    /**
     * Encode attestation object (CBOR map).
     * Structure: {"fmt": "none", "attStmt": {}, "authData": bytes}
     */
    public static byte[] encodeAttestationObject(byte[] authData) {
        ByteArrayOutputStream attestationObject = new ByteArrayOutputStream();

        // Map with 3 items
        writeBytes(attestationObject, CBOREncoder.startMap(3));

        // "fmt": "none"
        writeBytes(attestationObject, CBOREncoder.encodeText("fmt"));
        writeBytes(attestationObject, CBOREncoder.encodeText("none"));

        // "attStmt": {}
        writeBytes(attestationObject, CBOREncoder.encodeText("attStmt"));
        writeBytes(attestationObject, CBOREncoder.startMap(0));

        // "authData": bytes
        writeBytes(attestationObject, CBOREncoder.encodeText("authData"));
        writeBytes(attestationObject, CBOREncoder.encodeBytes(authData));

        return attestationObject.toByteArray();
    }

    /**
     * Build client data JSON for registration.
     * Keys are sorted for consistent output (matching iOS JSONSerialization.sortedKeys).
     */
    public static byte[] buildClientDataJSONForRegistration(byte[] challenge, String origin) {
        return buildClientDataJSON("webauthn.create", challenge, origin);
    }

    /**
     * Build client data JSON for assertion.
     */
    public static byte[] buildClientDataJSONForAssertion(byte[] challenge, String origin) {
        return buildClientDataJSON("webauthn.get", challenge, origin);
    }

    private static byte[] buildClientDataJSON(String type, byte[] challenge, String origin) {
        // Build JSON with sorted keys to match iOS JSONSerialization.sortedKeys
        // Sorted key order: challenge, crossOrigin, origin, type
        String challengeB64 = Base64URLUtils.encode(challenge);
        StringBuilder json = new StringBuilder();
        json.append("{");
        json.append("\"challenge\":\"").append(challengeB64).append("\",");
        json.append("\"crossOrigin\":false,");
        json.append("\"origin\":\"").append(escapeJsonString(origin)).append("\",");
        json.append("\"type\":\"").append(type).append("\"");
        json.append("}");
        return json.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Pad a BigInteger's byte representation to exactly 32 bytes.
     * BigInteger.toByteArray() may return fewer than 32 bytes (if leading zeros)
     * or 33 bytes (if sign bit needs an extra byte).
     */
    private static byte[] padTo32Bytes(BigInteger value) {
        byte[] raw = value.toByteArray();

        if (raw.length == 32) {
            return raw;
        } else if (raw.length > 32) {
            // BigInteger may prepend a 0x00 byte for positive numbers
            byte[] padded = new byte[32];
            System.arraycopy(raw, raw.length - 32, padded, 0, 32);
            return padded;
        } else {
            // Left-pad with zeros
            byte[] padded = new byte[32];
            System.arraycopy(raw, 0, padded, 32 - raw.length, raw.length);
            return padded;
        }
    }

    private static void writeBytes(ByteArrayOutputStream out, byte[] data) {
        out.write(data, 0, data.length);
    }

    private static String escapeJsonString(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
