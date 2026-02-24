//
//  JobEncryption.swift
//  PearPassAutoFillExtension
//
//  Encrypt/decrypt job queue data using libsodium's crypto_secretbox
//  (XSalsa20-Poly1305) via the Swift Sodium library.
//
//  The encryption key is the vault's hashedPassword (32 bytes),
//  obtained from masterEncryption metadata after the user authenticates.
//

import Foundation
import Sodium

// MARK: - Errors

enum JobEncryptionError: LocalizedError {
    case encryptionFailed
    case decryptionFailed
    case invalidKeyLength
    case invalidNonceLength

    var errorDescription: String? {
        switch self {
        case .encryptionFailed:
            return "Failed to encrypt job data"
        case .decryptionFailed:
            return "Failed to decrypt job data"
        case .invalidKeyLength:
            return "Encryption key must be 32 bytes"
        case .invalidNonceLength:
            return "Nonce must be 24 bytes"
        }
    }
}

// MARK: - JobEncryption

enum JobEncryption {

    /// Shared Sodium instance (initializes libsodium on first access)
    private static let sodium = Sodium()

    /// Expected key length for crypto_secretbox (32 bytes)
    static let keyBytes = 32

    /// Nonce length for crypto_secretbox (24 bytes)
    static let nonceBytes = 24

    /// MAC (authentication tag) length for crypto_secretbox (16 bytes)
    static let macBytes = 16

    // MARK: - Encrypt

    /// Encrypts data using crypto_secretbox (XSalsa20-Poly1305).
    ///
    /// - Parameters:
    ///   - data: The plaintext data to encrypt.
    ///   - key: The 32-byte encryption key (hashedPassword).
    /// - Returns: A tuple of (nonce, ciphertext) where ciphertext includes the 16-byte auth tag.
    /// - Throws: `JobEncryptionError` if encryption fails or key is invalid.
    static func encrypt(data: Data, key: Data) throws -> (nonce: Data, ciphertext: Data) {
        guard key.count == keyBytes else {
            throw JobEncryptionError.invalidKeyLength
        }

        let messageBytes: Bytes = Array(data)
        let keyBytes: Bytes = Array(key)

        // seal returns (authenticatedCipherText, nonce) using a random nonce
        guard let result: (authenticatedCipherText: Bytes, nonce: Bytes) = sodium.secretBox.seal(
            message: messageBytes,
            secretKey: keyBytes
        ) else {
            throw JobEncryptionError.encryptionFailed
        }

        return (
            nonce: Data(result.nonce),
            ciphertext: Data(result.authenticatedCipherText)
        )
    }

    // MARK: - Decrypt

    /// Decrypts data using crypto_secretbox_open (XSalsa20-Poly1305).
    ///
    /// - Parameters:
    ///   - ciphertext: The authenticated ciphertext (includes 16-byte auth tag).
    ///   - nonce: The 24-byte nonce used during encryption.
    ///   - key: The 32-byte encryption key (hashedPassword).
    /// - Returns: The decrypted plaintext data.
    /// - Throws: `JobEncryptionError` if decryption fails or parameters are invalid.
    static func decrypt(ciphertext: Data, nonce: Data, key: Data) throws -> Data {
        guard key.count == keyBytes else {
            throw JobEncryptionError.invalidKeyLength
        }
        guard nonce.count == nonceBytes else {
            throw JobEncryptionError.invalidNonceLength
        }

        let ciphertextBytes: Bytes = Array(ciphertext)
        let nonceBytes: Bytes = Array(nonce)
        let keyBytes: Bytes = Array(key)

        guard let decrypted = sodium.secretBox.open(
            authenticatedCipherText: ciphertextBytes,
            secretKey: keyBytes,
            nonce: nonceBytes
        ) else {
            throw JobEncryptionError.decryptionFailed
        }

        return Data(decrypted)
    }
}
