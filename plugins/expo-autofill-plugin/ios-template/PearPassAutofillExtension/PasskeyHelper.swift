import Foundation
import AuthenticationServices
import Security

/// PasskeyHelper for PearPass Autofill Extension
/// This helper manages passkey authentication for the autofill extension
/// It reads passkey data from the shared keychain storage managed by the main app
@available(iOS 16.0, *)
class PasskeyHelper: NSObject {
    static let shared = PasskeyHelper()
    
    private let domain = "dev-passkey-demo.noxtton.com"
    private let userIdentifier = "PearPass User"
    
    private override init() {
        super.init()
    }
    
    // MARK: - Check Passkey Support
    
    /// Checks if passkeys are supported on this device
    func isPasskeySupported() -> Bool {
        // Since this class is marked @available(iOS 16.0, *), we can just return true
        return true
    }
    
    /// Checks if passkey is enabled by reading from the keychain
    /// This delegates to KeychainHelper to avoid duplication
    func isPasskeyEnabled() -> Bool {
        return KeychainHelper.shared.isPasskeyEnabled()
    }
    
    /// Checks if passkeys are available for use
    func canUsePasskey() -> Bool {
        return isPasskeySupported() && isPasskeyEnabled()
    }
    
    // MARK: - Passkey Authentication
    
    /// Structure to hold the master password encryption data
    struct MasterPasswordEncryption: Codable {
        let ciphertext: String
        let nonce: String
        let salt: String
        let hashedPassword: String?
    }
    
    /// Authenticates using passkey and retrieves the master password encryption data
    @MainActor
    func authenticateWithPasskey(presentationAnchor: ASPresentationAnchor) async throws -> MasterPasswordEncryption? {
        guard isPasskeySupported() else {
            throw PasskeyError.notSupported
        }
        
        guard isPasskeyEnabled() else {
            throw PasskeyError.notEnabled
        }
        
        
        // Create assertion request
        let publicKeyCredentialProvider = ASAuthorizationPlatformPublicKeyCredentialProvider(relyingPartyIdentifier: domain)
        let assertionRequest = publicKeyCredentialProvider.createCredentialAssertionRequest(challenge: generateChallenge())
        
        // Configure the request to read the large blob extension for iOS 17+
        if #available(iOS 17.0, *) {
            // Request to read the large blob data
            assertionRequest.largeBlob = .read
        }
        
        // Create authorization controller
        let authController = ASAuthorizationController(authorizationRequests: [assertionRequest])
        
        // Create delegate handler and presentation context
        let delegate = PasskeyAuthorizationDelegate()
        let presentationContext = PasskeyPresentationContext(anchor: presentationAnchor)
        
        authController.delegate = delegate
        authController.presentationContextProvider = presentationContext
        
        // Perform authorization
        authController.performRequests()
        
        // Wait for result - the delegate is retained by the continuation
        return try await delegate.waitForResult()
    }
    
    
    // MARK: - Helper Methods
    
    /// Generates a random challenge for passkey authentication
    private func generateChallenge() -> Data {
        var bytes = [UInt8](repeating: 0, count: 32)
        _ = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        return Data(bytes)
    }
    
    // MARK: - Error Types
    
    enum PasskeyError: LocalizedError {
        case notSupported
        case notEnabled
        case authenticationFailed
        case noDataRetrieved
        case decodingFailed
        
        var errorDescription: String? {
            switch self {
            case .notSupported:
                return NSLocalizedString("Passkeys are not supported on this device", comment: "Passkey not supported error")
            case .notEnabled:
                return NSLocalizedString("Passkey is not enabled. Please enable it in the main app.", comment: "Passkey not enabled error")
            case .authenticationFailed:
                return NSLocalizedString("Passkey authentication failed", comment: "Passkey authentication failed error")
            case .noDataRetrieved:
                return NSLocalizedString("Failed to retrieve data from passkey", comment: "No data from passkey error")
            case .decodingFailed:
                return NSLocalizedString("Failed to decode passkey data", comment: "Passkey decoding error")
            }
        }
    }
}

// MARK: - Passkey Authorization Delegate

@available(iOS 16.0, *)
private class PasskeyAuthorizationDelegate: NSObject, ASAuthorizationControllerDelegate {
    private var continuation: CheckedContinuation<PasskeyHelper.MasterPasswordEncryption?, Error>?
    
    func waitForResult() async throws -> PasskeyHelper.MasterPasswordEncryption? {
        return try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
        }
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let credential = authorization.credential as? ASAuthorizationPlatformPublicKeyCredentialAssertion else {
            continuation?.resume(throwing: PasskeyHelper.PasskeyError.authenticationFailed)
            return
        }
        
        // Extract the large blob data from the credential
        var largeBlobData: Data?
        
        // iOS 17+ has direct largeBlob property access
        if #available(iOS 17.0, *) {
            if let largeBlob = credential.largeBlob {
                // Extract data from ASAuthorizationPublicKeyCredentialLargeBlobAssertionOutput
                // Structure: largeBlob.result -> OperationResult.read(data:) -> tuple -> Data?
                largeBlobData = extractDataFromLargeBlob(largeBlob)
            }
        }
        
        // Try to decode the master password encryption data if we have it
        if let blobData = largeBlobData {
            do {
                // The blob data is base64url encoded JSON (as stored by the React Native app)
                let blobString = String(data: blobData, encoding: .utf8) ?? ""
                
                // Decode base64url to get JSON data
                let jsonData = Data(base64urlEncoded: blobString) ?? blobData
                
                // Parse the JSON to get encryption data
                let encryptionData = try JSONDecoder().decode(PasskeyHelper.MasterPasswordEncryption.self, from: jsonData)
                
                continuation?.resume(returning: encryptionData)
                return
            } catch {
                // Try alternative parsing if standard decoder fails
                if let jsonString = String(data: blobData, encoding: .utf8),
                   let encryptionData = parseAlternativeFormat(jsonString: jsonString) {
                    continuation?.resume(returning: encryptionData)
                    return
                }
            }
        }
        
        // If we don't have large blob data (iOS 16 or failed to read), return nil
        continuation?.resume(returning: nil)
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        if (error as NSError).code == ASAuthorizationError.canceled.rawValue {
            continuation?.resume(throwing: NSError(domain: "PasskeyHelper", code: -128, userInfo: [
                NSLocalizedDescriptionKey: NSLocalizedString("Authentication canceled", comment: "Authentication canceled by user")
            ]))
        } else {
            continuation?.resume(throwing: error)
        }
    }
    
    /// Extract data from the largeBlob structure using Mirror reflection
    @available(iOS 17.0, *)
    private func extractDataFromLargeBlob(_ largeBlob: Any) -> Data? {
        // Navigate through: largeBlob.result -> OperationResult.read -> tuple -> Data?
        let mirror = Mirror(reflecting: largeBlob)
        
        for child in mirror.children {
            if child.label == "result" {
                let resultMirror = Mirror(reflecting: child.value)
                
                for resultChild in resultMirror.children {
                    if resultChild.label == "read" {
                        let tupleMirror = Mirror(reflecting: resultChild.value)
                        
                        for tupleChild in tupleMirror.children {
                            if let optionalData = tupleChild.value as? Data?,
                               let data = optionalData {
                                return data
                            }
                        }
                    }
                }
            }
        }
        
        return nil
    }
    
    /// Parse alternative JSON format if the standard decoder fails
    private func parseAlternativeFormat(jsonString: String) -> PasskeyHelper.MasterPasswordEncryption? {
        guard let data = jsonString.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let ciphertext = json["ciphertext"] as? String,
              let nonce = json["nonce"] as? String,
              let salt = json["salt"] as? String else {
            return nil
        }
        
        let hashedPassword = json["hashedPassword"] as? String
        
        return PasskeyHelper.MasterPasswordEncryption(
            ciphertext: ciphertext,
            nonce: nonce,
            salt: salt,
            hashedPassword: hashedPassword
        )
    }
}

// MARK: - Presentation Context Provider

@available(iOS 16.0, *)
private class PasskeyPresentationContext: NSObject, ASAuthorizationControllerPresentationContextProviding {
    private let anchor: ASPresentationAnchor
    
    init(anchor: ASPresentationAnchor) {
        self.anchor = anchor
    }
    
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return anchor
    }
}

// MARK: - Data Extension for Base64URL

extension Data {
    /// Initialize Data from base64url encoded string
    init?(base64urlEncoded: String) {
        // Convert base64url to base64
        var base64 = base64urlEncoded
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        
        // Add padding if needed
        while base64.count % 4 != 0 {
            base64.append("=")
        }
        
        self.init(base64Encoded: base64)
    }
    
    /// Convert Data to base64url encoded string
    func base64urlEncodedString() -> String {
        return self.base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }
}
