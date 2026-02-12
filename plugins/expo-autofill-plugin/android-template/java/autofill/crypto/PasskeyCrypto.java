package com.pears.pass.autofill.crypto;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.UUID;

/**
 * Cryptographic operations for WebAuthn passkeys.
 * Ensures compatibility with iOS CryptoKit's PKCS#8/SPKI key formats.
 *
 * Key compatibility:
 *   Java ECPrivateKey.getEncoded() = PKCS#8 DER (same as iOS P256.Signing.PrivateKey.derRepresentation)
 *   Java ECPublicKey.getEncoded() = SPKI DER (same as iOS PublicKey.derRepresentation)
 *   Java SHA256withECDSA = DER-encoded ECDSA (same as iOS CryptoKit)
 */
public class PasskeyCrypto {

    /**
     * Generate ECDSA P-256 key pair compatible with browser extension.
     *
     * @return KeyPair with EC P-256 keys
     */
    public static KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(new ECGenParameterSpec("secp256r1"));
        return keyGen.generateKeyPair();
    }

    /**
     * Export private key to PKCS#8 DER format as Base64URL string.
     */
    public static String exportPrivateKeyPKCS8(PrivateKey privateKey) {
        return Base64URLUtils.encode(privateKey.getEncoded());
    }

    /**
     * Export public key to SPKI DER format as Base64URL string.
     */
    public static String exportPublicKeySPKI(PublicKey publicKey) {
        return Base64URLUtils.encode(publicKey.getEncoded());
    }

    /**
     * Import a PKCS#8 private key from Base64URL string.
     */
    public static PrivateKey importPrivateKey(String pkcs8Base64URL) throws Exception {
        byte[] keyData = Base64URLUtils.decode(pkcs8Base64URL);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyData);
        KeyFactory keyFactory = KeyFactory.getInstance("EC");
        return keyFactory.generatePrivate(keySpec);
    }

    /**
     * Import a SPKI public key from Base64URL string.
     */
    public static PublicKey importPublicKey(String spkiBase64URL) throws Exception {
        byte[] keyData = Base64URLUtils.decode(spkiBase64URL);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyData);
        KeyFactory keyFactory = KeyFactory.getInstance("EC");
        return keyFactory.generatePublic(keySpec);
    }

    /**
     * Sign a WebAuthn assertion.
     * Matches browser extension's signing algorithm exactly.
     *
     * @param privateKey   ECDSA P-256 private key
     * @param authData     Raw authenticator data bytes
     * @param clientDataHash SHA-256 hash of clientDataJSON (32 bytes)
     * @return DER-encoded signature as Base64URL string
     */
    public static String signAssertion(PrivateKey privateKey, byte[] authData, byte[] clientDataHash) throws Exception {
        // Concatenate: authenticatorData || clientDataHash
        byte[] dataToSign = new byte[authData.length + clientDataHash.length];
        System.arraycopy(authData, 0, dataToSign, 0, authData.length);
        System.arraycopy(clientDataHash, 0, dataToSign, authData.length, clientDataHash.length);

        // Sign with SHA256withECDSA (produces DER-encoded signature, same as iOS CryptoKit)
        Signature sig = Signature.getInstance("SHA256withECDSA");
        sig.initSign(privateKey);
        sig.update(dataToSign);
        byte[] signature = sig.sign();

        return Base64URLUtils.encode(signature);
    }

    /**
     * Compute SHA-256 hash of data.
     *
     * @return 32-byte SHA-256 hash
     */
    public static byte[] sha256(byte[] data) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        return digest.digest(data);
    }

    /**
     * Compute SHA-256 hash of a string (UTF-8 encoded).
     *
     * @return 32-byte SHA-256 hash
     */
    public static byte[] sha256(String string) throws Exception {
        return sha256(string.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    /**
     * Generate a random credential ID.
     * Uses UUID format matching browser extension.
     *
     * @return Credential ID as raw 16 bytes
     */
    public static byte[] generateCredentialId() {
        UUID uuid = UUID.randomUUID();
        String uuidString = uuid.toString().replace("-", "");
        byte[] bytes = new byte[16];

        for (int i = 0; i < 16; i++) {
            String hex = uuidString.substring(i * 2, i * 2 + 2);
            bytes[i] = (byte) Integer.parseInt(hex, 16);
        }

        return bytes;
    }
}
