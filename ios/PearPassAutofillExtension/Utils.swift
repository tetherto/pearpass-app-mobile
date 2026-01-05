import Foundation

/// Utility functions for the PearPass Autofill Extension
enum Utils {
    
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
            forSecurityApplicationGroupIdentifier: "group.com.noxtton.pearpass"
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
    static let appGroupIdentifier = "group.com.noxtton.pearpass"
    
    /// Gets the shared container URL for the app group
    static var sharedContainerURL: URL? {
        return FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier)
    }
}