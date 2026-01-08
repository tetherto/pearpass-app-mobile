import Foundation
import Security
import LocalAuthentication

/// KeychainHelper for PearPass Autofill Extension
/// This helper only reads from the shared keychain storage managed by the main app
/// The extension does not store any data, it only reads what the main app has stored
class KeychainHelper {
    static let shared = KeychainHelper()
    
    private let biometricEnabledKey = "biometricsEnabled"
    private let passkeyEnabledKey = "passkeyEnabled"
    private let encryptionDataKey = "encryptionData"
    private let accessGroup = "group.com.pears.pass"
    
    private init() {}
    
    // MARK: - Biometric Support Check
    
    func isBiometricSupported() -> Bool {
        let context = LAContext()
        var error: NSError?
        return context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    }
    
    func getBiometricType() -> LABiometryType {
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return .none
        }
        
        return context.biometryType
    }
    
    // MARK: - Encryption Data Structure
    
    struct EncryptionData: Codable {
        let ciphertext: String
        let nonce: String
        let hashedPassword: String
    }
    
    // MARK: - Keychain Operations
    
    /// Generic method to check if a boolean flag is enabled in keychain
    private func isKeychainFlagEnabled(_ key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecAttrAccessGroup as String: accessGroup
        ]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        
        if status == errSecSuccess,
           let data = item as? Data,
           let stringValue = String(data: data, encoding: .utf8) {
            return stringValue == "true"
        }
        
        return false
    }
    
    /// Checks if biometrics are enabled by reading from the keychain
    func isBiometricsEnabled() -> Bool {
        isKeychainFlagEnabled(biometricEnabledKey)
    }
    
    /// Checks if passkey is enabled by reading from the keychain
    func isPasskeyEnabled() -> Bool {
        isKeychainFlagEnabled(passkeyEnabledKey)
    }
    
    // MARK: - Read Encryption Data from Shared Keychain
    
    /// Retrieves encryption data stored by the main app using expo-secure-store
    func getEncryptionData(withBiometricAuth: Bool = false) async throws -> EncryptionData? {
        if withBiometricAuth && isBiometricSupported() {
            let context = LAContext()
            context.localizedFallbackTitle = "Use Password"
            
            do {
                let success = try await context.evaluatePolicy(
                    .deviceOwnerAuthenticationWithBiometrics,
                    localizedReason: "Authenticate to access PearPass"
                )
                
                if !success {
                    return nil
                }
                
                return try await retrieveEncryptionDataFromKeychain(context: context)
            } catch {
                throw error
            }
        } else {
            return try await retrieveEncryptionDataFromKeychain(context: nil)
        }
    }
    
    /// Internal method to retrieve data from keychain
    private func retrieveEncryptionDataFromKeychain(context: LAContext?) async throws -> EncryptionData? {
        var query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: encryptionDataKey,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
            kSecAttrAccessGroup as String: accessGroup
        ]
        
        if let context = context {
            query[kSecUseAuthenticationContext as String] = context
        }
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        
        switch status {
        case errSecSuccess:
            guard let data = item as? Data else { return nil }
            return try parseEncryptionData(from: data)
            
        case errSecItemNotFound:
            return nil
            
        case errSecUserCanceled:
            throw NSError(domain: "KeychainHelper", code: Int(status), userInfo: [
                NSLocalizedDescriptionKey: "Authentication was canceled"
            ])
            
        case errSecAuthFailed:
            throw NSError(domain: "KeychainHelper", code: Int(status), userInfo: [
                NSLocalizedDescriptionKey: "Authentication failed"
            ])
            
        default:
            throw NSError(domain: "KeychainHelper", code: Int(status), userInfo: [
                NSLocalizedDescriptionKey: "Failed to retrieve encryption data from keychain"
            ])
        }
    }
    
    /// Parse encryption data from keychain data
    private func parseEncryptionData(from data: Data) throws -> EncryptionData? {
        // Try to parse as JSON string first (expo-secure-store format)
        if let jsonString = String(data: data, encoding: .utf8),
           let jsonData = jsonString.data(using: .utf8) {
            do {
                return try JSONDecoder().decode(EncryptionData.self, from: jsonData)
            } catch {
                // Try alternative parsing if standard decoder fails
                if let parsed = parseAlternativeFormat(jsonString: jsonString) {
                    return parsed
                }
            }
        }
        
        // Try direct binary decoding
        return try? JSONDecoder().decode(EncryptionData.self, from: data)
    }
    
    /// Parse alternative JSON format if the standard decoder fails
    private func parseAlternativeFormat(jsonString: String) -> EncryptionData? {
        guard let data = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let ciphertext = json["ciphertext"] as? String,
              let nonce = json["nonce"] as? String,
              let hashedPassword = json["hashedPassword"] as? String else {
            return nil
        }
        
        return EncryptionData(ciphertext: ciphertext, nonce: nonce, hashedPassword: hashedPassword)
    }
    
    // MARK: - Check Biometrics Availability
    
    /// Checks if biometrics are available and enabled for use
    func canUseBiometrics() -> Bool {
        return isBiometricSupported() && isBiometricsEnabled()
    }
}