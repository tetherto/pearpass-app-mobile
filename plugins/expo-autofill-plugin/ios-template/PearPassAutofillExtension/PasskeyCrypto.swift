//
//  PasskeyCrypto.swift
//  PearPassAutoFillExtension
//
//  Cryptographic operations for WebAuthn passkeys using CryptoKit
//  Ensures compatibility with browser extension's PKCS#8/SPKI key formats
//

import Foundation
import CryptoKit

enum PasskeyCryptoError: Error, LocalizedError {
    case keyGenerationFailed
    case keyImportFailed(String)
    case signingFailed(String)
    case invalidKeyFormat
    case hashingFailed

    var errorDescription: String? {
        switch self {
        case .keyGenerationFailed:
            return "Failed to generate key pair"
        case .keyImportFailed(let reason):
            return "Failed to import key: \(reason)"
        case .signingFailed(let reason):
            return "Failed to sign data: \(reason)"
        case .invalidKeyFormat:
            return "Invalid key format"
        case .hashingFailed:
            return "Failed to compute hash"
        }
    }
}

struct PasskeyCrypto {

    // MARK: - Key Generation

    /// Generate ECDSA P-256 key pair compatible with browser extension
    /// - Returns: Tuple of (privateKeyPKCS8, publicKeySPKI) as Base64URL strings
    static func generateKeyPair() -> (privateKey: String, publicKey: String) {
        let privateKey = P256.Signing.PrivateKey()

        let privateKeyDER = privateKey.derRepresentation
        let publicKeyDER = privateKey.publicKey.derRepresentation

        return (
            privateKeyDER.base64URLEncodedString(),
            publicKeyDER.base64URLEncodedString()
        )
    }

    /// Generate key pair returning the CryptoKit key object
    /// - Returns: P256.Signing.PrivateKey
    static func generatePrivateKey() -> P256.Signing.PrivateKey {
        P256.Signing.PrivateKey()
    }

    // MARK: - Key Import

    /// Import a PKCS#8 private key from Base64URL string
    /// Compatible with browser extension's exported private keys
    /// - Parameter pkcs8Base64URL: Base64URL encoded PKCS#8 private key
    /// - Returns: P256.Signing.PrivateKey
    static func importPrivateKey(pkcs8Base64URL: String) throws -> P256.Signing.PrivateKey {
        guard let keyData = Data(base64URLEncoded: pkcs8Base64URL) else {
            throw PasskeyCryptoError.invalidKeyFormat
        }

        do {
            return try P256.Signing.PrivateKey(derRepresentation: keyData)
        } catch {
            throw PasskeyCryptoError.keyImportFailed(error.localizedDescription)
        }
    }

    /// Import a SPKI public key from Base64URL string
    /// Compatible with browser extension's exported public keys
    /// - Parameter spkiBase64URL: Base64URL encoded SPKI public key
    /// - Returns: P256.Signing.PublicKey
    static func importPublicKey(spkiBase64URL: String) throws -> P256.Signing.PublicKey {
        guard let keyData = Data(base64URLEncoded: spkiBase64URL) else {
            throw PasskeyCryptoError.invalidKeyFormat
        }

        do {
            return try P256.Signing.PublicKey(derRepresentation: keyData)
        } catch {
            throw PasskeyCryptoError.keyImportFailed(error.localizedDescription)
        }
    }

    /// Export private key to PKCS#8 DER format as Base64URL string
    /// - Parameter privateKey: P256 signing private key
    /// - Returns: Base64URL encoded PKCS#8 private key
    static func exportPrivateKey(_ privateKey: P256.Signing.PrivateKey) -> String {
        privateKey.derRepresentation.base64URLEncodedString()
    }

    /// Export public key to SPKI DER format as Base64URL string
    /// - Parameter publicKey: P256 signing public key
    /// - Returns: Base64URL encoded SPKI public key
    static func exportPublicKey(_ publicKey: P256.Signing.PublicKey) -> String {
        publicKey.derRepresentation.base64URLEncodedString()
    }

    // MARK: - Signing

    /// Sign a WebAuthn assertion
    /// Matches browser extension's signing algorithm exactly
    /// - Parameters:
    ///   - privateKey: ECDSA P-256 private key
    ///   - authenticatorData: Raw authenticator data bytes
    ///   - clientDataHash: SHA-256 hash of clientDataJSON (32 bytes)
    /// - Returns: DER-encoded signature as Base64URL string
    static func signAssertion(
        privateKey: P256.Signing.PrivateKey,
        authenticatorData: Data,
        clientDataHash: Data
    ) throws -> String {
        // Concatenate: authenticatorData || clientDataHash
        var dataToSign = authenticatorData
        dataToSign.append(clientDataHash)

        do {
            let signature = try privateKey.signature(for: dataToSign)
            return signature.derRepresentation.base64URLEncodedString()
        } catch {
            throw PasskeyCryptoError.signingFailed(error.localizedDescription)
        }
    }

    /// Sign with raw client data JSON (hashes internally)
    /// Convenience method that computes the client data hash
    /// - Parameters:
    ///   - privateKey: ECDSA P-256 private key
    ///   - authenticatorData: Raw authenticator data bytes
    ///   - clientDataJSON: Raw client data JSON bytes
    /// - Returns: DER-encoded signature as Base64URL string
    static func signAssertionWithClientData(
        privateKey: P256.Signing.PrivateKey,
        authenticatorData: Data,
        clientDataJSON: Data
    ) throws -> String {
        let clientDataHash = sha256(clientDataJSON)
        return try signAssertion(
            privateKey: privateKey,
            authenticatorData: authenticatorData,
            clientDataHash: clientDataHash
        )
    }

    // MARK: - Hashing

    /// Compute SHA-256 hash of data
    /// - Parameter data: Data to hash
    /// - Returns: 32-byte SHA-256 hash
    static func sha256(_ data: Data) -> Data {
        Data(SHA256.hash(data: data))
    }

    /// Compute SHA-256 hash of a string (UTF-8 encoded)
    /// - Parameter string: String to hash
    /// - Returns: 32-byte SHA-256 hash
    static func sha256(_ string: String) -> Data {
        sha256(Data(string.utf8))
    }

    // MARK: - Credential ID Generation

    /// Generate a random credential ID
    /// Uses UUID format matching browser extension
    /// - Returns: Credential ID as (raw bytes, Base64URL string)
    static func generateCredentialId() -> (data: Data, base64URL: String) {
        let uuid = UUID()
        var bytes = [UInt8](repeating: 0, count: 16)

        // Convert UUID to bytes (matching browser extension's uuidToBytes)
        let uuidString = uuid.uuidString.replacingOccurrences(of: "-", with: "")
        for (index, char) in uuidString.enumerated() {
            if index % 2 == 0 && index / 2 < 16 {
                let startIndex = uuidString.index(uuidString.startIndex, offsetBy: index)
                let endIndex = uuidString.index(startIndex, offsetBy: 2)
                if let byte = UInt8(String(uuidString[startIndex..<endIndex]), radix: 16) {
                    bytes[index / 2] = byte
                }
            }
        }

        let data = Data(bytes)
        return (data, data.base64URLEncodedString())
    }
}
