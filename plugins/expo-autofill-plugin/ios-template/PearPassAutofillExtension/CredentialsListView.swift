import SwiftUI
import AuthenticationServices

struct CredentialsListView: View {
    @ObservedObject var viewModel: ExtensionViewModel
    let vault: Vault
    let serviceIdentifiers: [ASCredentialServiceIdentifier]
    let onCancel: () -> Void
    let onComplete: (String, String) -> Void
    let vaultClient: PearPassVaultClient?

    // Passkey support (iOS 17+)
    var passkeyRpId: String? = nil
    var onPasskeySelected: ((PasskeyCredential) -> Void)? = nil

    @State private var credentials: [Credential] = []
    @State private var passkeyRecords: [VaultRecord] = []
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

    var filteredPasskeys: [VaultRecord] {
        var filtered = passkeyRecords

        // If user is searching, filter passkeys by search text
        if !viewModel.searchText.isEmpty {
            filtered = passkeyRecords.filter { record in
                let userName = record.data?.username ?? ""
                let title = record.data?.title ?? ""
                let websites = record.data?.websites ?? []
                let rpId = websites.first.flatMap { extractDomain(from: $0) } ?? ""

                return userName.localizedCaseInsensitiveContains(viewModel.searchText) ||
                       title.localizedCaseInsensitiveContains(viewModel.searchText) ||
                       rpId.localizedCaseInsensitiveContains(viewModel.searchText)
            }
        } else if let filterRpId = passkeyRpId, !filterRpId.isEmpty, !hasUserSearched {
            // Filter by RP ID if provided and user hasn't searched
            let matchingPasskeys = passkeyRecords.filter { record in
                let websites = record.data?.websites ?? []
                let rpId = websites.first.flatMap { extractDomain(from: $0) } ?? ""

                return rpId == filterRpId ||
                       rpId.hasSuffix(".\(filterRpId)") ||
                       filterRpId.hasSuffix(".\(rpId)")
            }

            if !matchingPasskeys.isEmpty {
                filtered = matchingPasskeys
            }
        }

        return filtered
    }

    var hasPasskeySupport: Bool {
        onPasskeySelected != nil
    }

    private func matchesServiceIdentifiers(credential: Credential) -> Bool {
        guard !credential.websites.isEmpty else { return false }

        for identifier in serviceIdentifiers {
            let identifierDomain = extractDomain(from: identifier.identifier)

            for website in credential.websites {
                let websiteDomain = extractDomain(from: website)

                // Check if domains match (considering subdomains)
                if domainsMatch(identifierDomain, websiteDomain) {
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

                        SearchBar(text: $viewModel.searchText, credentialCount: hasPasskeySupport ? filteredPasskeys.count : filteredCredentials.count + filteredPasskeys.count)
                            .onChange(of: viewModel.searchText) { _ in
                                // Once user starts typing, disable domain filtering permanently
                                if !viewModel.searchText.isEmpty && !hasUserSearched {
                                    hasUserSearched = true
                                }
                            }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)

                    ScrollView {
                        LazyVStack(spacing: 1) {
                            // Passkeys section (if available)
                            if hasPasskeySupport && !filteredPasskeys.isEmpty {
                                Section {
                                    ForEach(Array(filteredPasskeys.enumerated()), id: \.offset) { _, record in
                                        PasskeyRecordRow(record: record) {
                                            handlePasskeySelection(record)
                                        }
                                    }
                                } header: {
                                    HStack {
                                        Text("Passkeys")
                                            .font(.system(size: 12, weight: .semibold))
                                            .foregroundColor(.gray)
                                            .textCase(.uppercase)
                                        Spacer()
                                    }
                                    .padding(.horizontal, 16)
                                    .padding(.top, 16)
                                    .padding(.bottom, 8)
                                }
                            }

                            // Passwords section (hidden in passkey mode)
                            if !hasPasskeySupport && !filteredCredentials.isEmpty {
                                Section {
                                    ForEach(filteredCredentials, id: \.id) { credential in
                                        CredentialRow(credential: credential) {
                                            handleCredentialSelection(credential)
                                        }
                                    }
                                } header: {
                                    if hasPasskeySupport && !filteredPasskeys.isEmpty {
                                        HStack {
                                            Text("Passwords")
                                                .font(.system(size: 12, weight: .semibold))
                                                .foregroundColor(.gray)
                                                .textCase(.uppercase)
                                            Spacer()
                                        }
                                        .padding(.horizontal, 16)
                                        .padding(.top, 16)
                                        .padding(.bottom, 8)
                                    }
                                }
                            }
                        }
                        .padding(.top, hasPasskeySupport && !filteredPasskeys.isEmpty ? 0 : 16)
                    }

                    Spacer(minLength: 0)
                }
            }
        }
        .onAppear {
            loadAllCredentials()
        }
    }

    // MARK: - Private Methods

    /// Load all credentials (passwords and passkeys) from a single API call
    private func loadAllCredentials() {

        // Print the domain we're looking for credentials for
        if !serviceIdentifiers.isEmpty {
            for identifier in serviceIdentifiers {
            }
        }

        guard let client = vaultClient else {
            return
        }

        isLoading = true
        errorMessage = nil

        Task {
            do {
                var records: [VaultRecord] = []

                // First, try to fetch records directly (works if vault is already active)
                do {
                    records = try await client.activeVaultList(filterKey: "record/")
                } catch {

                    // Activate the vault first
                    let isProtected = try await client.checkVaultIsProtected(vaultId: vault.id)

                    if isProtected {
                        let vaultData = try await client.getVaultById(vaultId: vault.id)
                    } else {
                        let masterEncryptionData = try await client.vaultsGet(key: "masterEncryption")
                        guard let hashedPassword = masterEncryptionData["hashedPassword"] as? String else {
                            throw PearPassVaultError.unknown("No hashed password available in master encryption")
                        }

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

                        _ = try await client.activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
                    }

                    // Now fetch records from the newly active vault
                    records = try await client.activeVaultList(filterKey: "record/")
                }

                // Parse all records into passwords and passkeys
                let (parsedCredentials, parsedPasskeys) = parseAllRecords(records)

                await MainActor.run {
                    self.credentials = parsedCredentials
                    self.passkeyRecords = parsedPasskeys
                    self.isLoading = false
                }

            } catch {
                await MainActor.run {
                    self.isLoading = false
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }

    /// Parse records into passwords and passkeys based on their structure
    /// Passkeys have a `credential` field with `_privateKeyBuffer`, passwords have `username`/`password`
    private func parseAllRecords(_ records: [VaultRecord]) -> (passwords: [Credential], passkeys: [VaultRecord]) {
        var passwords: [Credential] = []
        var passkeys: [VaultRecord] = []

        for record in records {
            guard let recordData = record.data else { continue }

            // Check if this is a passkey (has a valid credential with private key)
            if recordData.credential != nil {
                let websites = recordData.websites
                let rpId = websites.first.flatMap { extractDomain(from: $0) } ?? ""
                let userName = recordData.username
                print("CredentialsListView: Detected passkey for rpId: \(rpId), userName: \(userName)")
                passkeys.append(record)
                // Don't continue - also parse as password credential if it has username/password
            }

            // Also parse as a password credential
            let name = recordData.title.isEmpty ? "Unknown" : recordData.title
            let username = recordData.username
            let password = recordData.password
            let websites = recordData.websites

            // Skip records that don't have password data (could be other types)
            guard !username.isEmpty || !password.isEmpty else {
                continue
            }

            passwords.append(Credential(
                id: record.id,
                name: name,
                username: username,
                password: password,
                websites: websites
            ))
        }

        return (passwords, passkeys)
    }

    // MARK: - Credential Selection

    private func handleCredentialSelection(_ credential: Credential) {
        onComplete(credential.username, credential.password)
    }

    private func handlePasskeySelection(_ record: VaultRecord) {
        guard let recordData = record.data,
              let credential = recordData.credential else {
            return
        }
        onPasskeySelected?(credential)
    }
}

// MARK: - Passkey Record Row

struct PasskeyRecordRow: View {
    let record: VaultRecord
    let action: () -> Void

    private var displayData: (title: String, userName: String) {
        let userName = record.data?.username ?? ""
        let title = record.data?.title ?? ""
        return (title, userName)
    }

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
                    Text(displayData.title.isEmpty ? "Passkey" : displayData.title)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)

                    Text(displayData.userName)
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
        let title = displayData.title
        guard !title.isEmpty else { return "PK" }
        let words = title.components(separatedBy: " ")
        if words.count >= 2 {
            let firstInitial = String(words[0].prefix(1)).uppercased()
            let secondInitial = String(words[1].prefix(1)).uppercased()
            return firstInitial + secondInitial
        } else {
            return String(title.prefix(2)).uppercased()
        }
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
