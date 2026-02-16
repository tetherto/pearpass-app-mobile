//
//  JobFileManager.swift
//  PearPassAutoFillExtension
//
//  Manages reading, writing, and appending encrypted job files.
//  Also handles saving and cleaning up file attachments.
//
//  File format (binary):
//    [Header 16 bytes]
//      - Magic:    "PPJQ" (4 bytes)
//      - Version:  UInt16 little-endian (2 bytes)
//      - JobCount: UInt16 little-endian (2 bytes)
//      - Reserved: 8 bytes (zeros)
//    [Nonce 24 bytes]
//    [Encrypted payload (variable) - crypto_secretbox output including auth tag]
//

import Foundation

// MARK: - Errors

enum JobFileError: LocalizedError {
    case noSharedContainer
    case invalidFileFormat
    case invalidMagicBytes
    case unsupportedVersion
    case jobCountMismatch
    case serializationFailed
    case fileWriteFailed(String)

    var errorDescription: String? {
        switch self {
        case .noSharedContainer:
            return "Cannot access App Group shared container"
        case .invalidFileFormat:
            return "Job file has invalid format"
        case .invalidMagicBytes:
            return "Job file has invalid magic bytes (expected PPJQ)"
        case .unsupportedVersion:
            return "Job file version is not supported"
        case .jobCountMismatch:
            return "Job count in header does not match decoded jobs"
        case .serializationFailed:
            return "Failed to serialize jobs to JSON"
        case .fileWriteFailed(let reason):
            return "Failed to write job file: \(reason)"
        }
    }
}

// MARK: - JobFileManager

enum JobFileManager {

    // MARK: - Constants

    /// Magic bytes identifying a PearPass Job Queue file
    private static let magicBytes: [UInt8] = [0x50, 0x50, 0x4A, 0x51] // "PPJQ"

    /// Current file format version
    private static let currentVersion: UInt16 = 1

    /// Total header size in bytes
    private static let headerSize = 16

    /// Size of the reserved section in the header
    private static let reservedSize = 8

    /// Nonce size for crypto_secretbox
    private static let nonceSize = JobEncryption.nonceBytes

    /// Job file name
    private static let jobFileName = "jobs.enc"

    /// Attachments subdirectory name
    private static let attachmentsDir = "attachments"

    // MARK: - Base Directory

    /// Returns the base directory for job queue files: App Group Container/pearpass_jobs/
    static var baseDirectory: URL {
        get throws {
            guard let containerURL = Utils.sharedContainerURL else {
                throw JobFileError.noSharedContainer
            }
            return containerURL.appendingPathComponent("pearpass_jobs")
        }
    }

    /// Returns the full path to the jobs.enc file
    private static var jobFilePath: URL {
        get throws {
            return try baseDirectory.appendingPathComponent(jobFileName)
        }
    }

    /// Returns the full path to the attachments directory
    static var attachmentsDirectory: URL {
        get throws {
            return try baseDirectory.appendingPathComponent(attachmentsDir)
        }
    }

    // MARK: - File Existence

    /// Checks whether the encrypted job file exists.
    /// - Returns: `true` if jobs.enc exists at the expected path.
    static func jobFileExists() -> Bool {
        guard let path = try? jobFilePath else { return false }
        return FileManager.default.fileExists(atPath: path.path)
    }

    // MARK: - Read Jobs

    /// Reads and decrypts all jobs from the encrypted job file.
    ///
    /// - Parameter hashedPassword: The 32-byte key from vault masterEncryption.
    /// - Returns: An array of `Job` objects. Returns empty array if file does not exist.
    /// - Throws: `JobFileError` for format issues, `JobEncryptionError` for decryption failure.
    static func readJobs(hashedPassword: Data) throws -> [Job] {
        let filePath = try jobFilePath

        guard FileManager.default.fileExists(atPath: filePath.path) else {
            return []
        }

        let fileData = try Data(contentsOf: filePath)

        // Validate minimum size: header (16) + nonce (24) + at least 1 byte ciphertext
        guard fileData.count >= headerSize + nonceSize + 1 else {
            throw JobFileError.invalidFileFormat
        }

        // Parse header
        let header = fileData[0..<headerSize]
        try validateHeader(header)

        let jobCount = readUInt16LE(from: fileData, offset: 6)

        // Extract nonce
        let nonceStart = headerSize
        let nonceEnd = nonceStart + nonceSize
        let nonce = fileData[nonceStart..<nonceEnd]

        // Extract ciphertext (everything after the nonce)
        let ciphertext = fileData[nonceEnd...]

        // Decrypt
        let plaintext = try JobEncryption.decrypt(
            ciphertext: Data(ciphertext),
            nonce: Data(nonce),
            key: hashedPassword
        )

        // Parse JSON
        let decoder = JSONDecoder()
        let jobs = try decoder.decode([Job].self, from: plaintext)

        // Validate job count matches header (non-fatal: trust decoded data over header)
        if jobs.count != Int(jobCount) {
            NSLog("[JobFileManager] Warning: header job count (\(jobCount)) != decoded count (\(jobs.count))")
        }

        return jobs
    }

    // MARK: - Write Jobs

    /// Encrypts and writes an array of jobs to the job file.
    /// Uses atomic write to prevent corruption.
    ///
    /// - Parameters:
    ///   - jobs: The jobs to write.
    ///   - hashedPassword: The 32-byte encryption key.
    /// - Throws: `JobFileError` or `JobEncryptionError` on failure.
    static func writeJobs(_ jobs: [Job], hashedPassword: Data) throws {
        let filePath = try jobFilePath

        // Ensure base directory exists
        let baseDir = try baseDirectory
        try FileManager.default.createDirectory(at: baseDir, withIntermediateDirectories: true)

        // Serialize jobs to JSON
        let encoder = JSONEncoder()
        let jsonData: Data
        do {
            jsonData = try encoder.encode(jobs)
        } catch {
            throw JobFileError.serializationFailed
        }

        // Encrypt
        let (nonce, ciphertext) = try JobEncryption.encrypt(data: jsonData, key: hashedPassword)

        // Build file data: header + nonce + ciphertext
        var fileData = Data()

        // Header: magic (4) + version (2) + job count (2) + reserved (8) = 16 bytes
        fileData.append(contentsOf: magicBytes)
        fileData.append(contentsOf: uint16LEBytes(currentVersion))
        fileData.append(contentsOf: uint16LEBytes(UInt16(jobs.count)))
        fileData.append(contentsOf: [UInt8](repeating: 0, count: reservedSize))

        // Nonce
        fileData.append(nonce)

        // Ciphertext (includes auth tag)
        fileData.append(ciphertext)

        // Atomic write
        do {
            try fileData.write(to: filePath, options: .atomic)
        } catch {
            throw JobFileError.fileWriteFailed(error.localizedDescription)
        }
    }

    // MARK: - Append Job

    /// Reads existing jobs, appends a new one, and writes back atomically.
    ///
    /// - Parameters:
    ///   - job: The job to append.
    ///   - hashedPassword: The 32-byte encryption key.
    /// - Throws: `JobFileError` or `JobEncryptionError` on failure.
    static func appendJob(_ job: Job, hashedPassword: Data) throws {
        var jobs = try readJobs(hashedPassword: hashedPassword)
        jobs.append(job)
        try writeJobs(jobs, hashedPassword: hashedPassword)
    }

    // MARK: - Attachments

    /// Saves an attachment file to the attachments directory.
    ///
    /// - Parameters:
    ///   - data: The file data to save.
    ///   - attachmentId: A unique identifier for the attachment (UUID).
    ///   - originalFilename: The original filename (used to preserve extension).
    /// - Returns: The relative filename within the attachments/ directory.
    /// - Throws: File system errors.
    static func saveAttachment(data: Data, attachmentId: String, originalFilename: String) throws -> String {
        let ext = (originalFilename as NSString).pathExtension
        let filename = ext.isEmpty ? attachmentId : "\(attachmentId).\(ext)"

        let attachmentsDir = try attachmentsDirectory
        try FileManager.default.createDirectory(at: attachmentsDir, withIntermediateDirectories: true)

        let filePath = attachmentsDir.appendingPathComponent(filename)
        try data.write(to: filePath, options: .atomic)

        return filename
    }

    // MARK: - Remove Jobs by Record ID

    /// Removes all pending/in-progress jobs that target the given record ID.
    /// Used when replacing a passkey on a record that has a pending job (not yet in vault).
    ///
    /// - Parameters:
    ///   - recordId: The record ID to match against (matches `recordId` in ADD_PASSKEY
    ///               or `existingRecordId` in UPDATE_PASSKEY payloads).
    ///   - hashedPassword: The 32-byte encryption key.
    /// - Returns: The number of jobs removed.
    /// - Throws: `JobFileError` or `JobEncryptionError` on failure.
    @discardableResult
    static func removeJobsForRecord(_ recordId: String, hashedPassword: Data) throws -> Int {
        var jobs = try readJobs(hashedPassword: hashedPassword)
        let originalCount = jobs.count

        jobs.removeAll { job in
            guard job.status == .pending || job.status == .inProgress else { return false }

            switch job.payload {
            case .addPasskey(let payload):
                return payload.recordId == recordId
            case .updatePasskey(let payload):
                return payload.existingRecordId == recordId
            }
        }

        let removedCount = originalCount - jobs.count
        if removedCount > 0 {
            if jobs.isEmpty {
                try deleteJobFile()
            } else {
                try writeJobs(jobs, hashedPassword: hashedPassword)
            }
            NSLog("[JobFileManager] Removed \(removedCount) pending job(s) for record \(recordId)")
        }

        return removedCount
    }

    /// Checks whether there is a pending ADD_PASSKEY job for the given record ID.
    /// Used to determine if an "update" should actually be a new ADD (record not yet in vault).
    ///
    /// - Parameters:
    ///   - recordId: The record ID to look up.
    ///   - hashedPassword: The 32-byte encryption key.
    /// - Returns: `true` if a pending ADD_PASSKEY job exists for this record ID.
    static func hasPendingAddJob(forRecordId recordId: String, hashedPassword: Data) throws -> Bool {
        let jobs = try readJobs(hashedPassword: hashedPassword)
        return jobs.contains { job in
            guard job.status == .pending || job.status == .inProgress else { return false }
            if case .addPasskey(let payload) = job.payload {
                return payload.recordId == recordId
            }
            return false
        }
    }

    // MARK: - Cleanup

    /// Deletes the encrypted job file.
    static func deleteJobFile() throws {
        let filePath = try jobFilePath
        if FileManager.default.fileExists(atPath: filePath.path) {
            try FileManager.default.removeItem(at: filePath)
        }
    }

    /// Deletes the entire attachments directory and all files within it.
    static func deleteAttachmentsFolder() throws {
        let attachmentsDir = try attachmentsDirectory
        if FileManager.default.fileExists(atPath: attachmentsDir.path) {
            try FileManager.default.removeItem(at: attachmentsDir)
        }
    }

    // MARK: - Header Helpers

    /// Validates the 16-byte file header.
    private static func validateHeader(_ header: Data) throws {
        guard header.count >= headerSize else {
            throw JobFileError.invalidFileFormat
        }

        // Check magic bytes
        let magic = [UInt8](header[0..<4])
        guard magic == magicBytes else {
            throw JobFileError.invalidMagicBytes
        }

        // Check version
        let version = readUInt16LE(from: header, offset: 4)
        guard version == currentVersion else {
            throw JobFileError.unsupportedVersion
        }
    }

    /// Reads a UInt16 in little-endian format from data at the given offset.
    private static func readUInt16LE(from data: Data, offset: Int) -> UInt16 {
        let low = UInt16(data[data.startIndex + offset])
        let high = UInt16(data[data.startIndex + offset + 1])
        return low | (high << 8)
    }

    /// Converts a UInt16 to 2 bytes in little-endian format.
    private static func uint16LEBytes(_ value: UInt16) -> [UInt8] {
        return [UInt8(value & 0xFF), UInt8((value >> 8) & 0xFF)]
    }
}
