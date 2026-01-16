import Foundation

/// Utility functions for the PearPass Autofill Extension
enum Utils {

    // MARK: - Secure Buffer Utilities

    /// Securely clears a Data buffer by overwriting with zeros
    /// - Parameter data: The data buffer to clear (passed as inout to modify in place)
    static func clearBuffer(_ data: inout Data) {
        guard !data.isEmpty else { return }
        data.resetBytes(in: 0..<data.count)
    }

    /// Converts a string to a Data buffer using UTF-8 encoding
    /// - Parameter string: The string to convert
    /// - Returns: UTF-8 encoded Data
    static func stringToBuffer(_ string: String) -> Data {
        return Data(string.utf8)
    }

    /// Converts a Data buffer to a UTF-8 string
    /// - Parameter data: The data buffer to convert
    /// - Returns: UTF-8 decoded string, or nil if decoding fails
    static func bufferToString(_ data: Data) -> String? {
        return String(data: data, encoding: .utf8)
    }

    /// Executes a callback with a data buffer, then securely clears it
    /// - Parameters:
    ///   - data: The data buffer to use (will be cleared after callback completes)
    ///   - callback: Async callback that uses the data
    /// - Returns: The result of the callback
    static func withBuffer<T>(_ data: inout Data, callback: (Data) async throws -> T) async rethrows -> T {
        defer {
            clearBuffer(&data)
        }
        return try await callback(data)
    }
    
    /// Gets the storage path for the vault
    /// - Parameter customPath: Optional custom path to use instead of the default
    /// - Returns: The storage path to use for the vault, or nil if unable to determine
    static func getVaultStoragePath(customPath: String? = nil) -> String? {
        // If a custom path is provided, use it
        if let path = customPath {
            return path
        }
        
        // Otherwise, get the app group shared directory path
        guard let sharedContainerURL = FileManager.default.containerURL(
            forSecurityApplicationGroupIdentifier: "group.com.pears.pass"
        ) else {
            print("[Utils] Failed to get shared container URL")
            return nil
        }
        
        // Return the path with the pearpass subdirectory
        let storagePath = "file://" + sharedContainerURL.path + "/pearpass"
        print("[Utils] Generated storage path: \(storagePath)")
        return storagePath
    }
    
    /// App group identifier used for sharing data between the main app and extensions
    static let appGroupIdentifier = "group.com.pears.pass"
    
    /// Gets the shared container URL for the app group
    static var sharedContainerURL: URL? {
        return FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier)
    }
}