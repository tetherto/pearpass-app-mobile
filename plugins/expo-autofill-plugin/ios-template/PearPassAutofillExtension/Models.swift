import Foundation
import SwiftUI

struct Vault: Equatable {
    let id: String
    let name: String
    let version: Int
    let records: [[String: Any]]
    let devices: [[String: Any]]
    let createdAt: Date
    let updatedAt: Date
    let encryption: VaultEncryption?
    
    struct VaultEncryption: Equatable {
        let ciphertext: String
        let nonce: String
        let hashedPassword: String?
        let salt: String?
        
        static func == (lhs: VaultEncryption, rhs: VaultEncryption) -> Bool {
            return lhs.ciphertext == rhs.ciphertext && 
                   lhs.nonce == rhs.nonce &&
                   lhs.hashedPassword == rhs.hashedPassword &&
                   lhs.salt == rhs.salt
        }
    }
    
    static func == (lhs: Vault, rhs: Vault) -> Bool {
        return lhs.id == rhs.id &&
               lhs.name == rhs.name &&
               lhs.version == rhs.version &&
               lhs.createdAt == rhs.createdAt &&
               lhs.updatedAt == rhs.updatedAt &&
               lhs.encryption == rhs.encryption
    }
}

struct Credential {
    let id: String
    let name: String
    let username: String
    let password: String
    let websites: [String]
}

enum AuthFlow: Equatable {
    case missingConfiguration
    case masterPassword
    case vaultSelection
    case vaultPassword(vault: Vault)
    case credentialsList(vault: Vault)
    
    static func == (lhs: AuthFlow, rhs: AuthFlow) -> Bool {
        switch (lhs, rhs) {
        case (.missingConfiguration, .missingConfiguration),
             (.masterPassword, .masterPassword),
             (.vaultSelection, .vaultSelection):
            return true
        case (.vaultPassword(let lhsVault), .vaultPassword(let rhsVault)),
             (.credentialsList(let lhsVault), .credentialsList(let rhsVault)):
            return lhsVault.id == rhsVault.id
        default:
            return false
        }
    }
}

class ExtensionViewModel: ObservableObject {
    @Published var currentFlow: AuthFlow = .masterPassword
    @Published var masterPassword: String = ""
    @Published var vaultPassword: String = ""
    @Published var selectedVault: Vault?
    @Published var searchText: String = ""
    @Published var vaults: [Vault] = []  // Store actual vaults from the API
    
    func authenticateWithMasterPassword() {
        currentFlow = .vaultSelection
        masterPassword = ""
    }
    
    func selectVault(_ vault: Vault) {
        selectedVault = vault
        currentFlow = .vaultPassword(vault: vault)
    }
    
    func authenticateWithVaultPassword() {
        guard let vault = selectedVault else { return }
        currentFlow = .credentialsList(vault: vault)
        vaultPassword = ""
    }
    
    func goBackToVaultSelection() {
        currentFlow = .vaultSelection
        selectedVault = nil
    }
}