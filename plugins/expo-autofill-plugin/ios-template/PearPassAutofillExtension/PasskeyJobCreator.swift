//
//  PasskeyJobCreator.swift
//  PearPassAutoFillExtension
//
//  Creates job queue entries for passkey registration and updates.
//  Instead of writing directly to the vault (which requires exclusive
//  file locks held by the main app), jobs are encrypted and saved to
//  a shared file. The main app processes them on next launch/resume.
//

import Foundation

// MARK: - Errors

enum PasskeyJobError: LocalizedError {
    case noHashedPassword
    case invalidHashedPassword
    case jobCreationFailed(String)

    var errorDescription: String? {
        switch self {
        case .noHashedPassword:
            return "No hashed password available from vault"
        case .invalidHashedPassword:
            return "Hashed password has invalid format or length"
        case .jobCreationFailed(let reason):
            return "Failed to create job: \(reason)"
        }
    }
}

// MARK: - PasskeyJobCreator

enum PasskeyJobCreator {

    // MARK: - Create ADD_PASSKEY Job

    /// Creates an ADD_PASSKEY job, saves any file attachments, and appends to the job queue.
    ///
    /// - Parameters:
    ///   - vaultId: The target vault ID.
    ///   - credential: The generated passkey credential.
    ///   - formData: The user-edited form data (title, websites, note, folder, attachments).
    ///   - rpId: Relying party identifier (e.g. "github.com").
    ///   - rpName: Relying party display name.
    ///   - userId: WebAuthn user handle (base64URL).
    ///   - userName: WebAuthn user name.
    ///   - userDisplayName: WebAuthn user display name.
    ///   - hashedPassword: The 32-byte encryption key from vault masterEncryption.
    /// - Returns: The UUID of the created job.
    /// - Throws: `PasskeyJobError`, `JobFileError`, or `JobEncryptionError`.
    static func createAddPasskeyJob(
        vaultId: String,
        credential: PasskeyCredential,
        formData: PasskeyFormData,
        rpId: String,
        rpName: String,
        userId: String,
        userName: String,
        userDisplayName: String,
        hashedPassword: Data
    ) throws -> String {
        let jobId = UUID().uuidString
        let now = Date().timeIntervalSince1970 * 1000 // milliseconds
        let recordId = formData.existingRecord?.id ?? UUID().uuidString

        // Save file attachments to pearpass_jobs/attachments/
        var jobAttachments: [JobAttachment] = []
        for attachment in formData.attachments {
            let relativePath = try JobFileManager.saveAttachment(
                data: attachment.data,
                attachmentId: attachment.id,
                originalFilename: attachment.name
            )
            jobAttachments.append(JobAttachment(
                id: attachment.id,
                name: attachment.name,
                relativePath: relativePath
            ))
        }

        // Normalize websites
        var websites: [String] = formData.websites
        if websites.isEmpty {
            websites = ["https://\(rpId)"]
        }

        // Build payload
        let payload = AddPasskeyPayload(
            rpId: rpId,
            rpName: rpName,
            userId: userId,
            userName: userName,
            userDisplayName: userDisplayName,
            credentialId: credential.id,
            publicKey: credential.response.publicKey,
            privateKey: credential._privateKeyBuffer.base64URLEncodedString(),
            clientDataJSON: credential.response.clientDataJSON,
            attestationObject: credential.response.attestationObject,
            authenticatorData: credential.response.authenticatorData,
            algorithm: credential.response.publicKeyAlgorithm,
            createdAt: Double(formData.passkeyCreatedAt),
            transports: credential.response.transports,
            recordId: recordId,
            title: formData.title,
            note: formData.note.isEmpty ? nil : formData.note,
            folder: formData.folder,
            websites: websites,
            attachments: jobAttachments
        )

        // Build job
        let job = Job(
            id: jobId,
            type: .addPasskey,
            status: .pending,
            createdAt: now,
            updatedAt: now,
            retryCount: 0,
            maxRetries: 3,
            vaultId: vaultId,
            payload: .addPasskey(payload),
            error: nil
        )

        // Append to encrypted queue
        try JobFileManager.appendJob(job, hashedPassword: hashedPassword)

        NSLog("[PasskeyJobCreator] Created ADD_PASSKEY job \(jobId) for vault \(vaultId)")
        return jobId
    }

    // MARK: - Create UPDATE_PASSKEY Job

    /// Creates an UPDATE_PASSKEY job and appends it to the job queue.
    /// Used when adding a passkey to an existing login record.
    ///
    /// - Parameters:
    ///   - vaultId: The target vault ID.
    ///   - existingRecordId: The ID of the existing record to merge the passkey into.
    ///   - credential: The generated passkey credential.
    ///   - rpId: Relying party identifier.
    ///   - rpName: Relying party display name.
    ///   - userId: WebAuthn user handle (base64URL).
    ///   - userName: WebAuthn user name.
    ///   - userDisplayName: WebAuthn user display name.
    ///   - hashedPassword: The 32-byte encryption key from vault masterEncryption.
    ///   - passkeyCreatedAt: Timestamp (ms) when the passkey was created.
    /// - Returns: The UUID of the created job.
    /// - Throws: `PasskeyJobError`, `JobFileError`, or `JobEncryptionError`.
    static func createUpdatePasskeyJob(
        vaultId: String,
        existingRecordId: String,
        credential: PasskeyCredential,
        rpId: String,
        rpName: String,
        userId: String,
        userName: String,
        userDisplayName: String,
        hashedPassword: Data,
        passkeyCreatedAt: Int64
    ) throws -> String {
        let jobId = UUID().uuidString
        let now = Date().timeIntervalSince1970 * 1000

        let payload = UpdatePasskeyPayload(
            existingRecordId: existingRecordId,
            rpId: rpId,
            rpName: rpName,
            userId: userId,
            userName: userName,
            userDisplayName: userDisplayName,
            credentialId: credential.id,
            publicKey: credential.response.publicKey,
            privateKey: credential._privateKeyBuffer.base64URLEncodedString(),
            clientDataJSON: credential.response.clientDataJSON,
            attestationObject: credential.response.attestationObject,
            authenticatorData: credential.response.authenticatorData,
            algorithm: credential.response.publicKeyAlgorithm,
            createdAt: Double(passkeyCreatedAt),
            transports: credential.response.transports,
            vaultId: vaultId
        )

        let job = Job(
            id: jobId,
            type: .updatePasskey,
            status: .pending,
            createdAt: now,
            updatedAt: now,
            retryCount: 0,
            maxRetries: 3,
            vaultId: vaultId,
            payload: .updatePasskey(payload),
            error: nil
        )

        try JobFileManager.appendJob(job, hashedPassword: hashedPassword)

        NSLog("[PasskeyJobCreator] Created UPDATE_PASSKEY job \(jobId) for record \(existingRecordId)")
        return jobId
    }

    // MARK: - Get Hashed Password

    /// Fetches the hashed password from the vault's masterEncryption metadata.
    /// The hashed password is a hex-encoded string representing a 32-byte key.
    ///
    /// - Parameter vaultClient: An initialized and authenticated vault client.
    /// - Returns: The 32-byte hashed password as `Data`, or `nil` if unavailable.
    static func getHashedPassword(from vaultClient: PearPassVaultClient) async -> Data? {
        do {
            let masterEncryptionData = try await vaultClient.vaultsGet(key: "masterEncryption")

            guard let hashedPasswordHex = masterEncryptionData["hashedPassword"] as? String else {
                NSLog("[PasskeyJobCreator] No hashedPassword in masterEncryption")
                return nil
            }

            // The hashedPassword is stored as a hex string — convert to raw bytes
            guard let data = Data(hexString: hashedPasswordHex) else {
                NSLog("[PasskeyJobCreator] Failed to decode hashedPassword hex string")
                return nil
            }

            guard data.count == JobEncryption.keyBytes else {
                NSLog("[PasskeyJobCreator] hashedPassword is \(data.count) bytes, expected \(JobEncryption.keyBytes)")
                return nil
            }

            return data
        } catch {
            NSLog("[PasskeyJobCreator] Error fetching masterEncryption: \(error.localizedDescription)")
            return nil
        }
    }
}

// MARK: - Hex String Extension

extension Data {
    /// Initialize Data from a hex-encoded string.
    /// Returns nil if the string contains non-hex characters or has odd length.
    init?(hexString: String) {
        let hex = hexString.lowercased()
        guard hex.count % 2 == 0 else { return nil }

        var data = Data(capacity: hex.count / 2)
        var index = hex.startIndex

        while index < hex.endIndex {
            let nextIndex = hex.index(index, offsetBy: 2)
            let byteString = hex[index..<nextIndex]
            guard let byte = UInt8(byteString, radix: 16) else { return nil }
            data.append(byte)
            index = nextIndex
        }

        self = data
    }

    /// Returns a hex-encoded string representation of the data.
    func hexEncodedString() -> String {
        return map { String(format: "%02x", $0) }.joined()
    }
}
