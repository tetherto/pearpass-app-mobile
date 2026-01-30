import SwiftUI
import AuthenticationServices

struct CredentialsListView: View {
    @ObservedObject var viewModel: ExtensionViewModel
    let vault: Vault
    let serviceIdentifiers: [ASCredentialServiceIdentifier]
    let onCancel: () -> Void
    let onComplete: (String, String) -> Void
    let vaultClient: PearPassVaultClient?
    
    @State private var credentials: [Credential] = []
    @State private var isLoading: Bool = false
    @State private var errorMessage: String?
    @State private var hasUserSearched: Bool = false
    
    var filteredCredentials: [Credential] {
        var filtered = credentials
        
        // If user is searching, show all credentials that match the search
        if !viewModel.searchText.isEmpty {
            filtered = credentials.filter { credential in
                credential.name.localizedCaseInsensitiveContains(viewModel.searchText) ||
                credential.username.localizedCaseInsensitiveContains(viewModel.searchText)
            }
        } else if !hasUserSearched && !serviceIdentifiers.isEmpty {
            // Only apply domain filtering if user hasn't searched yet
            let matchingCredentials = credentials.filter { credential in
                matchesServiceIdentifiers(credential: credential)
            }
            
            // If we have matching credentials, show only those; otherwise show all
            if !matchingCredentials.isEmpty {
                filtered = matchingCredentials
            }
        }
        // If hasUserSearched is true and searchText is empty, show all credentials (no filtering)
        
        return filtered
    }
    
    private func matchesServiceIdentifiers(credential: Credential) -> Bool {
        guard !credential.websites.isEmpty else { return false }
        
        for identifier in serviceIdentifiers {
            let identifierDomain = extractDomain(from: identifier.identifier)
            
            for website in credential.websites {
                let websiteDomain = extractDomain(from: website)
                
                // Check if domains match (considering subdomains)
                if domainsMatch(identifierDomain, websiteDomain) {
                    print("CredentialsListView: Domain match found! Credential '\(credential.name)' website '\(websiteDomain)' matches identifier '\(identifierDomain)'")
                    return true
                }
            }
        }
        
        return false
    }
    
    private func extractDomain(from urlString: String) -> String {
        var domain = urlString.lowercased()
        
        // Remove protocol if present
        if domain.hasPrefix("https://") {
            domain = String(domain.dropFirst(8))
        } else if domain.hasPrefix("http://") {
            domain = String(domain.dropFirst(7))
        }
        
        // Remove path and query parameters
        if let firstSlash = domain.firstIndex(of: "/") {
            domain = String(domain[..<firstSlash])
        }
        
        // Remove port if present
        if let colon = domain.firstIndex(of: ":") {
            domain = String(domain[..<colon])
        }
        
        // Remove www. prefix
        if domain.hasPrefix("www.") {
            domain = String(domain.dropFirst(4))
        }
        
        return domain
    }
    
    private func domainsMatch(_ domain1: String, _ domain2: String) -> Bool {
        // Exact match
        if domain1 == domain2 {
            return true
        }
        
        // Check if one is a subdomain of the other
        if domain1.hasSuffix("." + domain2) || domain2.hasSuffix("." + domain1) {
            return true
        }
        
        // Special case for common domains (e.g., google.com matches accounts.google.com)
        let domain1Parts = domain1.split(separator: ".")
        let domain2Parts = domain2.split(separator: ".")
        
        if domain1Parts.count >= 2 && domain2Parts.count >= 2 {
            // Get the main domain (last two parts, e.g., "google.com")
            let mainDomain1 = domain1Parts.suffix(2).joined(separator: ".")
            let mainDomain2 = domain2Parts.suffix(2).joined(separator: ".")
            
            if mainDomain1 == mainDomain2 {
                return true
            }
        }
        
        return false
    }
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                SimpleBackgroundView()
                
                VStack(spacing: 0) {
                    CancelHeader(onCancel: onCancel)
                    
                    HStack(spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                                .fill(Constants.Colors.vaultIconBackground)
                                .frame(width: 56, height: 56)
                            
                            Image("Logo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 31, height: 42)
                        }
                        
                        SearchBar(text: $viewModel.searchText, credentialCount: filteredCredentials.count)
                            .onChange(of: viewModel.searchText) { _ in
                                // Once user starts typing, disable domain filtering permanently
                                if !viewModel.searchText.isEmpty && !hasUserSearched {
                                    hasUserSearched = true
                                    print("CredentialsListView: User started searching, domain filtering disabled permanently for this session")
                                }
                            }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    
                    ScrollView {
                        LazyVStack(spacing: 1) {
                            ForEach(filteredCredentials, id: \.id) { credential in
                                CredentialRow(credential: credential) {
                                    handleCredentialSelection(credential)
                                }
                            }
                        }
                        .padding(.top, 16)
                    }
                    
                    Spacer(minLength: 0)
                }
            }
        }
        .onAppear {
            loadCredentials()
        }
    }
    
    // MARK: - Private Methods
    
    private func loadCredentials() {
        print("CredentialsListView: Loading credentials for vault \(vault.name)")
        
        // Print the domain we're looking for credentials for
        if !serviceIdentifiers.isEmpty {
            print("CredentialsListView: Looking for credentials for domains:")
            for identifier in serviceIdentifiers {
                print("  - \(identifier.identifier) (Type: \(identifier.type == .domain ? "Domain" : identifier.type == .URL ? "URL" : "Unknown"))")
            }
        }
        
        guard let client = vaultClient else {
            print("CredentialsListView: No vault client available, cannot load credentials")
            return
        }
        
        loadCredentialsFromActiveVault()
    }
    
    
    private func loadCredentialsFromActiveVault() {
        guard let client = vaultClient else {
            print("CredentialsListView: No vault client available")
            return
        }
        
        print("CredentialsListView: Loading records from vault \(vault.name) (ID: \(vault.id))")
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                // First, try to fetch records directly (works if vault is already active from VaultPasswordView)
                do {
                    print("CredentialsListView: Attempting to fetch records from active vault")
                    let records = try await client.activeVaultList(filterKey: "record/")
                    print("CredentialsListView: Received \(records.count) records from active vault")
                    
                    // If we got records, parse them
                    let parsedCredentials = try await parseCredentials(records)
                    
                    await MainActor.run {
                        self.credentials = parsedCredentials
                        self.isLoading = false
                        print("CredentialsListView: Loaded \(parsedCredentials.count) credentials from active vault")
                    }
                    return
                    
                } catch {
                    print("CredentialsListView: Failed to fetch from active vault directly: \(error.localizedDescription)")
                    print("CredentialsListView: Vault might not be active yet, attempting to activate...")
                }
                
                // If direct fetch failed, the vault is not active yet
                // Check if this is an unprotected vault (no encryption) or protected vault
                let isProtected = try await client.checkVaultIsProtected(vaultId: vault.id)
                print("CredentialsListView: Vault \(vault.name) is protected: \(isProtected)")

                if isProtected {
                    // Protected vault - use getVaultById with master encryption
                    let vaultData = try await client.getVaultById(vaultId: vault.id)
                    print("CredentialsListView: Successfully activated protected vault \(vault.name): \(vaultData)")
                } else {
                    // Unprotected vault - activate directly with master vault key
                    print("CredentialsListView: Activating unprotected vault \(vault.name)")

                    // Get the master encryption key that was used to decrypt the vault storage
                    let masterEncryptionData = try await client.vaultsGet(key: "masterEncryption")
                    guard let hashedPassword = masterEncryptionData["hashedPassword"] as? String else {
                        throw PearPassVaultError.unknown("No hashed password available in master encryption")
                    }

                    // For unprotected vaults, we can use the master vault's decrypted key directly
                    let decryptedKeyResult = try await client.decryptVaultKey(
                        ciphertext: masterEncryptionData["ciphertext"] as? String ?? "",
                        nonce: masterEncryptionData["nonce"] as? String ?? "",
                        hashedPassword: hashedPassword
                    )

                    guard let encryptionKey = decryptedKeyResult?["value"] as? String ??
                                             decryptedKeyResult?["key"] as? String ??
                                             decryptedKeyResult?["data"] as? String else {
                        throw PearPassVaultError.decryptionFailed
                    }

                    // Initialize the active vault with the decrypted key
                    _ = try await client.activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
                    print("CredentialsListView: Successfully activated unprotected vault \(vault.name)")
                }

                // Now fetch records from the newly active vault
                let records = try await client.activeVaultList(filterKey: "record/")
                print("CredentialsListView: Received \(records.count) records from newly activated vault")
                
                let parsedCredentials = try await parseCredentials(records)
                
                await MainActor.run {
                    self.credentials = parsedCredentials
                    self.isLoading = false
                    print("CredentialsListView: Loaded \(parsedCredentials.count) credentials from activated vault")
                }
                
            } catch {
                await MainActor.run {
                    self.isLoading = false
                    self.errorMessage = error.localizedDescription
                    print("CredentialsListView: Error loading from vault: \(error.localizedDescription)")
                }
            }
        }
    }
    
    private func parseCredentials(_ records: [[String: Any]]) async throws -> [Credential] {
        return records.compactMap { record -> Credential? in
            print("CredentialsListView: Processing record: \(record)")
            
            guard let id = record["id"] as? String else {
                print("CredentialsListView: Skipping record with missing id: \(record)")
                return nil
            }
            
            // Check if there's a data field (like in RN logs)
            var recordData: [String: Any] = [:]
            if let data = record["data"] as? [String: Any] {
                recordData = data
            } else {
                recordData = record
            }
            
            let name = recordData["title"] as? String ?? recordData["name"] as? String ?? "Unknown"
            let username = recordData["username"] as? String ?? recordData["email"] as? String ?? ""
            let password = recordData["password"] as? String ?? ""
            let websites = recordData["websites"] as? [String] ?? []
            
            print("CredentialsListView: Successfully parsed credential: \(name) (\(username)), password length: \(password.count), websites: \(websites)")
            
            return Credential(
                id: id,
                name: name,
                username: username,
                password: password,
                websites: websites
            )
        }
    }
    
    // MARK: - Credential Selection
    
    private func handleCredentialSelection(_ credential: Credential) {
        print("CredentialsListView: Selected credential: \(credential.name) (\(credential.username)), password length: \(credential.password.count)")
        onComplete(credential.username, credential.password)
    }
}

struct SearchBar: View {
    @Binding var text: String
    let credentialCount: Int
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            
            TextField(NSLocalizedString("Search in all folders...", comment: "Search placeholder"), text: $text)
                .textFieldStyle(PlainTextFieldStyle())
                .foregroundColor(.white)
            
            Text("\(credentialCount)")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.gray)
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .fill(Constants.Colors.searchBackground)
        )
    }
}

struct CredentialRow: View {
    let credential: Credential
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                        .fill(Constants.Colors.credentialBackground)
                        .frame(width: 45, height: 45)
                    
                    Text(getInitials())
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Constants.Colors.primaryGreen)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(credential.name)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                    
                    Text(credential.username)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.clear)
        }
    }
    
    private func getInitials() -> String {
        let words = credential.name.components(separatedBy: " ")
        if words.count >= 2 {
            let firstInitial = String(words[0].prefix(1)).uppercased()
            let secondInitial = String(words[1].prefix(1)).uppercased()
            return firstInitial + secondInitial
        } else {
            return String(credential.name.prefix(2)).uppercased()
        }
    }
}
