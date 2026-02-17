//
//  Job.swift
//  PearPassAutoFillExtension
//
//  Codable models for the job queue system.
//  These models define the encrypted job file format used to defer
//  write operations from the autofill extension to the main app.
//

import Foundation

// MARK: - Job Type

enum JobType: String, Codable {
    case addPasskey = "ADD_PASSKEY"
    case updatePasskey = "UPDATE_PASSKEY"
}

// MARK: - Job Status

enum JobStatus: String, Codable {
    case pending = "PENDING"
    case inProgress = "IN_PROGRESS"
    case completed = "COMPLETED"
    case failed = "FAILED"
}

// MARK: - Job

struct Job: Codable {
    let id: String
    let type: JobType
    var status: JobStatus
    let createdAt: Double
    var updatedAt: Double
    var retryCount: Int
    let maxRetries: Int
    let vaultId: String
    let payload: JobPayload
    var error: String?
}

// MARK: - Job Payload

/// The payload is serialized as a flat JSON object.
/// The `type` field on Job determines which payload variant it is.
/// On the wire, `payload` is just the data object with all fields directly on it.
enum JobPayload: Codable {
    case addPasskey(AddPasskeyPayload)
    case updatePasskey(UpdatePasskeyPayload)

    // MARK: - Flat Decoding

    /// Decodes the payload from a flat JSON object.
    /// The decoder does not know which variant to use, so the parent `Job`
    /// must set the correct type after decoding via `init(from:)`.
    init(from decoder: Decoder) throws {
        // Try decoding as AddPasskeyPayload first (it has `recordId` field)
        if let addPayload = try? AddPasskeyPayload(from: decoder) {
            // Distinguish by presence of `recordId` (ADD_PASSKEY has it, UPDATE_PASSKEY does not)
            self = .addPasskey(addPayload)
            return
        }
        // Fall back to UpdatePasskeyPayload
        let updatePayload = try UpdatePasskeyPayload(from: decoder)
        self = .updatePasskey(updatePayload)
    }

    func encode(to encoder: Encoder) throws {
        switch self {
        case .addPasskey(let payload):
            try payload.encode(to: encoder)
        case .updatePasskey(let payload):
            try payload.encode(to: encoder)
        }
    }
}

// MARK: - Add Passkey Payload

struct AddPasskeyPayload: Codable {
    let rpId: String
    let rpName: String
    let userId: String
    let userName: String
    let userDisplayName: String
    let credentialId: String
    let publicKey: String
    let privateKey: String
    let clientDataJSON: String
    let attestationObject: String
    let authenticatorData: String
    let algorithm: Int
    let createdAt: Double
    let transports: [String]
    let recordId: String
    var title: String?
    var note: String?
    var folder: String?
    var websites: [String]?
    var attachments: [JobAttachment]
}

// MARK: - Update Passkey Payload

struct UpdatePasskeyPayload: Codable {
    let existingRecordId: String
    let rpId: String
    let rpName: String
    let userId: String
    let userName: String
    let userDisplayName: String
    let credentialId: String
    let publicKey: String
    let privateKey: String
    let clientDataJSON: String
    let attestationObject: String
    let authenticatorData: String
    let algorithm: Int
    let createdAt: Double
    let transports: [String]
    let vaultId: String
    var note: String?
    var attachments: [JobAttachment] = []
    var keepAttachmentIds: [String] = []
}

// MARK: - Job Attachment

struct JobAttachment: Codable {
    let id: String
    let name: String
    let relativePath: String
}
