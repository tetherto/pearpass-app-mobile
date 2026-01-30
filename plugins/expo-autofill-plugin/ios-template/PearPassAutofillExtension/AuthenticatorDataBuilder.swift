//
//  AuthenticatorDataBuilder.swift
//  PearPassAutoFillExtension
//
//  Builds WebAuthn authenticator data structures
//  Compatible with browser extension's buildAuthenticatorData.js
//

import Foundation
import CryptoKit

struct AuthenticatorDataBuilder {

    // MARK: - Flags

    /// WebAuthn authenticator data flags
    struct Flags: OptionSet {
        let rawValue: UInt8

        /// User Present (UP) - Bit 0
        static let userPresent = Flags(rawValue: 1 << 0)
        /// User Verified (UV) - Bit 2
        static let userVerified = Flags(rawValue: 1 << 2)
        /// Backup Eligibility (BE) - Bit 3
        static let backupEligible = Flags(rawValue: 1 << 3)
        /// Backup State (BS) - Bit 4
        static let backupState = Flags(rawValue: 1 << 4)
        /// Attested Credential Data (AT) - Bit 6
        static let attestedCredentialData = Flags(rawValue: 1 << 6)
        /// Extension Data (ED) - Bit 7
        static let extensionData = Flags(rawValue: 1 << 7)

        /// Standard flags for registration: UP + UV + BE + BS + AT = 0x5D
        /// Matches browser extension exactly
        static let registration: Flags = [
            .userPresent,
            .userVerified,
            .backupEligible,
            .backupState,
            .attestedCredentialData
        ]

        /// Standard flags for assertion: UP + UV + BE + BS = 0x1D
        static let assertion: Flags = [
            .userPresent,
            .userVerified,
            .backupEligible,
            .backupState
        ]
    }

    // MARK: - Constants

    /// Software authenticator AAGUID (all zeros)
    /// Matches browser extension's software authenticator
    static let softwareAAGUID = Data(repeating: 0, count: 16)

    // MARK: - Build Authenticator Data for Registration

    /// Build authenticator data for passkey registration
    /// Structure: rpIdHash (32) || flags (1) || signCount (4) || aaguid (16) || credIdLen (2) || credId || coseKey
    /// - Parameters:
    ///   - rpId: Relying party identifier (domain)
    ///   - credentialId: Credential ID bytes
    ///   - publicKey: P256 signing public key
    /// - Returns: Complete authenticator data bytes
    static func buildForRegistration(
        rpId: String,
        credentialId: Data,
        publicKey: P256.Signing.PublicKey
    ) -> Data {
        var authData = Data()

        // 1. RP ID Hash (32 bytes) - SHA-256 of rpId
        let rpIdHash = PasskeyCrypto.sha256(rpId)
        authData.append(rpIdHash)

        // 2. Flags (1 byte) - 0x5D for registration
        authData.append(Flags.registration.rawValue)

        // 3. Sign count (4 bytes, big-endian) - start at 0
        authData.append(contentsOf: [0x00, 0x00, 0x00, 0x00])

        // 4. AAGUID (16 bytes) - all zeros for software authenticator
        authData.append(softwareAAGUID)

        // 5. Credential ID length (2 bytes, big-endian)
        let credIdLength = UInt16(credentialId.count)
        authData.append(contentsOf: withUnsafeBytes(of: credIdLength.bigEndian) { Array($0) })

        // 6. Credential ID
        authData.append(credentialId)

        // 7. COSE public key (CBOR-encoded)
        let coseKey = encodeCOSEPublicKey(publicKey)
        authData.append(coseKey)

        return authData
    }

    // MARK: - Build Authenticator Data for Assertion

    /// Build authenticator data for passkey assertion
    /// Structure: rpIdHash (32) || flags (1) || signCount (4)
    /// - Parameters:
    ///   - rpId: Relying party identifier (domain)
    ///   - signCount: Current signature counter value (default 0)
    /// - Returns: Authenticator data bytes for assertion (37 bytes)
    static func buildForAssertion(
        rpId: String,
        signCount: UInt32 = 0
    ) -> Data {
        var authData = Data()

        // 1. RP ID Hash (32 bytes) - SHA-256 of rpId
        let rpIdHash = PasskeyCrypto.sha256(rpId)
        authData.append(rpIdHash)

        // 2. Flags (1 byte) - 0x1D for assertion
        authData.append(Flags.assertion.rawValue)

        // 3. Sign count (4 bytes, big-endian)
        authData.append(contentsOf: withUnsafeBytes(of: signCount.bigEndian) { Array($0) })

        return authData
    }

    // MARK: - COSE Key Encoding

    /// Encode P256 public key as COSE_Key (CBOR)
    /// Structure: {1: 2, 3: -7, -1: 1, -2: x, -3: y}
    /// - kty (1): EC2 (2)
    /// - alg (3): ES256 (-7)
    /// - crv (-1): P-256 (1)
    /// - x (-2): x-coordinate (32 bytes)
    /// - y (-3): y-coordinate (32 bytes)
    /// - Parameter publicKey: P256 signing public key
    /// - Returns: CBOR-encoded COSE key
    private static func encodeCOSEPublicKey(_ publicKey: P256.Signing.PublicKey) -> Data {
        // Get raw X9.63 representation: 04 || x (32 bytes) || y (32 bytes)
        let rawKey = publicKey.x963Representation
        let xCoord = rawKey[1..<33]
        let yCoord = rawKey[33..<65]

        var coseKey = Data()

        // Map with 5 items
        coseKey.append(CBOREncoder.startMap(count: 5))

        // 1 (kty): 2 (EC2)
        coseKey.append(CBOREncoder.encodeUInt(1))
        coseKey.append(CBOREncoder.encodeUInt(2))

        // 3 (alg): -7 (ES256) -> encode as negative: -7 = -1 - 6
        coseKey.append(CBOREncoder.encodeUInt(3))
        coseKey.append(CBOREncoder.encodeNegInt(6))

        // -1 (crv): 1 (P-256) -> -1 = -1 - 0
        coseKey.append(CBOREncoder.encodeNegInt(0))
        coseKey.append(CBOREncoder.encodeUInt(1))

        // -2 (x): x-coordinate -> -2 = -1 - 1
        coseKey.append(CBOREncoder.encodeNegInt(1))
        coseKey.append(CBOREncoder.encodeBytes(Data(xCoord)))

        // -3 (y): y-coordinate -> -3 = -1 - 2
        coseKey.append(CBOREncoder.encodeNegInt(2))
        coseKey.append(CBOREncoder.encodeBytes(Data(yCoord)))

        return coseKey
    }

    // MARK: - Attestation Object

    /// Encode attestation object (CBOR map)
    /// Structure: {"fmt": "none", "attStmt": {}, "authData": bytes}
    /// - Parameter authData: Authenticator data bytes
    /// - Returns: CBOR-encoded attestation object
    static func encodeAttestationObject(authData: Data) -> Data {
        var attestationObject = Data()

        // Map with 3 items
        attestationObject.append(CBOREncoder.startMap(count: 3))

        // "fmt": "none" - no attestation
        attestationObject.append(CBOREncoder.encodeText("fmt"))
        attestationObject.append(CBOREncoder.encodeText("none"))

        // "attStmt": {} - empty attestation statement
        attestationObject.append(CBOREncoder.encodeText("attStmt"))
        attestationObject.append(CBOREncoder.startMap(count: 0))

        // "authData": bytes
        attestationObject.append(CBOREncoder.encodeText("authData"))
        attestationObject.append(CBOREncoder.encodeBytes(authData))

        return attestationObject
    }

    // MARK: - Client Data JSON

    /// Build client data JSON for registration
    /// - Parameters:
    ///   - challenge: Challenge bytes
    ///   - origin: Origin URL string
    /// - Returns: Client data JSON as Data
    static func buildClientDataJSONForRegistration(
        challenge: Data,
        origin: String
    ) -> Data {
        let clientData: [String: Any] = [
            "type": "webauthn.create",
            "challenge": challenge.base64URLEncodedString(),
            "origin": origin,
            "crossOrigin": false
        ]

        // Use sorted keys for consistent output
        let options = JSONSerialization.WritingOptions.sortedKeys
        return (try? JSONSerialization.data(withJSONObject: clientData, options: options)) ?? Data()
    }

    /// Build client data JSON for assertion
    /// - Parameters:
    ///   - challenge: Challenge bytes
    ///   - origin: Origin URL string
    /// - Returns: Client data JSON as Data
    static func buildClientDataJSONForAssertion(
        challenge: Data,
        origin: String
    ) -> Data {
        let clientData: [String: Any] = [
            "type": "webauthn.get",
            "challenge": challenge.base64URLEncodedString(),
            "origin": origin,
            "crossOrigin": false
        ]

        let options = JSONSerialization.WritingOptions.sortedKeys
        return (try? JSONSerialization.data(withJSONObject: clientData, options: options)) ?? Data()
    }
}
