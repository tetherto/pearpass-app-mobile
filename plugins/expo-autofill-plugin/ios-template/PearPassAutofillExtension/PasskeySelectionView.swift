//
//  PasskeySelectionView.swift
//  PearPassAutoFillExtension
//
//  UI for selecting a passkey for authentication
//  Works with raw record data (browser extension format)
//

import SwiftUI
import AuthenticationServices

struct PasskeySelectionView: View {
    let passkeyRecords: [[String: Any]]
    let rpId: String
    let onSelect: (PasskeyCredential) -> Void
    let onCancel: () -> Void

    @State private var searchText = ""

    var filteredRecords: [[String: Any]] {
        if searchText.isEmpty {
            return passkeyRecords
        }
        return passkeyRecords.filter { record in
            let data = record["data"] as? [String: Any] ?? record
            let userName = data["username"] as? String ?? ""
            let title = data["title"] as? String ?? ""
            let websites = data["websites"] as? [String] ?? []
            let recordRpId = websites.first.flatMap { extractDomain(from: $0) } ?? ""

            return userName.localizedCaseInsensitiveContains(searchText) ||
                   title.localizedCaseInsensitiveContains(searchText) ||
                   recordRpId.localizedCaseInsensitiveContains(searchText)
        }
    }

    private func extractDomain(from urlString: String) -> String {
        var domain = urlString.lowercased()
        if domain.hasPrefix("https://") { domain = String(domain.dropFirst(8)) }
        else if domain.hasPrefix("http://") { domain = String(domain.dropFirst(7)) }
        if let slash = domain.firstIndex(of: "/") { domain = String(domain[..<slash]) }
        if let colon = domain.firstIndex(of: ":") { domain = String(domain[..<colon]) }
        if domain.hasPrefix("www.") { domain = String(domain.dropFirst(4)) }
        return domain
    }

    var body: some View {
        VStack(spacing: 0) {
            headerView
            searchBar

            if filteredRecords.isEmpty {
                emptyStateView
            } else {
                passkeyList
            }
        }
        .background(Color(.systemGroupedBackground))
    }

    private var headerView: some View {
        HStack {
            Button(action: onCancel) {
                Text("Cancel")
                    .foregroundColor(.blue)
            }
            Spacer()
            Text("Select Passkey")
                .font(.headline)
            Spacer()
            Text("Cancel")
                .foregroundColor(.clear)
        }
        .padding()
        .background(Color(.systemBackground))
    }

    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.gray)
            TextField("Search passkeys", text: $searchText)
                .textFieldStyle(PlainTextFieldStyle())
            if !searchText.isEmpty {
                Button(action: { searchText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(10)
        .background(Color(.systemGray6))
        .cornerRadius(10)
        .padding(.horizontal)
        .padding(.vertical, 8)
    }

    private var passkeyList: some View {
        ScrollView {
            LazyVStack(spacing: 1) {
                Section {
                    ForEach(Array(filteredRecords.enumerated()), id: \.offset) { _, record in
                        PasskeyRecordRowView(record: record, rpId: rpId)
                            .contentShape(Rectangle())
                            .onTapGesture {
                                handleSelection(record)
                            }
                    }
                } header: {
                    HStack {
                        Text("Passkeys for \(rpId)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .textCase(.uppercase)
                        Spacer()
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                    .padding(.bottom, 8)
                }
            }
        }
    }

    private func handleSelection(_ record: [String: Any]) {
        let data = record["data"] as? [String: Any] ?? record
        guard let credentialDict = data["credential"] as? [String: Any],
              let credential = PasskeyCredential.fromDictionary(credentialDict) else {
            return
        }
        onSelect(credential)
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Spacer()
            Image(systemName: "key.slash")
                .font(.system(size: 48))
                .foregroundColor(.gray)
            Text("No passkeys found")
                .font(.headline)
                .foregroundColor(.primary)
            Text(searchText.isEmpty
                ? "No passkeys available for \(rpId)"
                : "No passkeys match your search")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Spacer()
        }
    }
}

// MARK: - Passkey Record Row View

struct PasskeyRecordRowView: View {
    let record: [String: Any]
    let rpId: String

    private var displayData: (title: String, userName: String) {
        let data = record["data"] as? [String: Any] ?? record
        let userName = data["username"] as? String ?? ""
        let title = data["title"] as? String ?? ""
        return (title, userName)
    }

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                    .fill(Constants.Colors.vaultIconBackground)
                    .frame(width: 45, height: 45)
                Image(systemName: "person.badge.key.fill")
                    .font(.system(size: 20))
                    .foregroundColor(Constants.Colors.primaryGreen)
            }

            VStack(alignment: .leading, spacing: 4) {
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

// MARK: - Combined Credentials View (Passwords + Passkeys)

struct CombinedCredentialsView: View {
    let passwords: [Credential]
    let passkeyRecords: [[String: Any]]
    let rpId: String?
    let serviceIdentifiers: [ASCredentialServiceIdentifier]
    let onPasswordSelected: (Credential) -> Void
    let onPasskeySelected: (PasskeyCredential) -> Void
    let onCancel: () -> Void

    @State private var searchText = ""
    @State private var selectedTab: CredentialType = .all

    enum CredentialType: String, CaseIterable {
        case all = "All"
        case passwords = "Passwords"
        case passkeys = "Passkeys"
    }

    private func extractDomain(from urlString: String) -> String {
        var domain = urlString.lowercased()
        if domain.hasPrefix("https://") { domain = String(domain.dropFirst(8)) }
        else if domain.hasPrefix("http://") { domain = String(domain.dropFirst(7)) }
        if let slash = domain.firstIndex(of: "/") { domain = String(domain[..<slash]) }
        if let colon = domain.firstIndex(of: ":") { domain = String(domain[..<colon]) }
        if domain.hasPrefix("www.") { domain = String(domain.dropFirst(4)) }
        return domain
    }

    var filteredPasswords: [Credential] {
        guard selectedTab != .passkeys else { return [] }

        if searchText.isEmpty {
            return passwords
        }
        return passwords.filter { credential in
            credential.name.localizedCaseInsensitiveContains(searchText) ||
            credential.username.localizedCaseInsensitiveContains(searchText) ||
            credential.websites.contains { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var filteredPasskeyRecords: [[String: Any]] {
        guard selectedTab != .passwords else { return [] }

        if searchText.isEmpty {
            return passkeyRecords
        }
        return passkeyRecords.filter { record in
            let data = record["data"] as? [String: Any] ?? record
            let userName = data["username"] as? String ?? ""
            let title = data["title"] as? String ?? ""
            let websites = data["websites"] as? [String] ?? []
            let recordRpId = websites.first.flatMap { extractDomain(from: $0) } ?? ""

            return userName.localizedCaseInsensitiveContains(searchText) ||
                   title.localizedCaseInsensitiveContains(searchText) ||
                   recordRpId.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onCancel) {
                    Text("Cancel")
                        .foregroundColor(.blue)
                }
                Spacer()
                Text("Select Credential")
                    .font(.headline)
                Spacer()
                Text("Cancel").foregroundColor(.clear)
            }
            .padding()
            .background(Color(.systemBackground))

            if !passwords.isEmpty && !passkeyRecords.isEmpty {
                Picker("Credential Type", selection: $selectedTab) {
                    ForEach(CredentialType.allCases, id: \.self) { type in
                        Text(type.rawValue).tag(type)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.horizontal)
                .padding(.vertical, 8)
            }

            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                TextField("Search", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding(10)
            .background(Color(.systemGray6))
            .cornerRadius(10)
            .padding(.horizontal)
            .padding(.vertical, 8)

            ScrollView {
                LazyVStack(spacing: 1) {
                    if !filteredPasskeyRecords.isEmpty {
                        Section {
                            ForEach(Array(filteredPasskeyRecords.enumerated()), id: \.offset) { _, record in
                                PasskeyRecordRowView(record: record, rpId: rpId ?? "")
                                    .contentShape(Rectangle())
                                    .onTapGesture {
                                        handlePasskeySelection(record)
                                    }
                            }
                        } header: {
                            sectionHeader(title: "Passkeys", count: filteredPasskeyRecords.count)
                        }
                    }

                    if !filteredPasswords.isEmpty {
                        Section {
                            ForEach(filteredPasswords, id: \.id) { credential in
                                PasswordRowView(credential: credential)
                                    .contentShape(Rectangle())
                                    .onTapGesture {
                                        onPasswordSelected(credential)
                                    }
                            }
                        } header: {
                            sectionHeader(title: "Passwords", count: filteredPasswords.count)
                        }
                    }

                    if filteredPasskeyRecords.isEmpty && filteredPasswords.isEmpty {
                        emptyState
                    }
                }
            }
        }
        .background(Color(.systemGroupedBackground))
    }

    private func handlePasskeySelection(_ record: [String: Any]) {
        let data = record["data"] as? [String: Any] ?? record
        guard let credentialDict = data["credential"] as? [String: Any],
              let credential = PasskeyCredential.fromDictionary(credentialDict) else {
            return
        }
        onPasskeySelected(credential)
    }

    private func sectionHeader(title: String, count: Int) -> some View {
        HStack {
            Text("\(title) (\(count))")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .textCase(.uppercase)
            Spacer()
        }
        .padding(.horizontal)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "key.slash")
                .font(.system(size: 48))
                .foregroundColor(.gray)
                .padding(.top, 40)

            Text("No credentials found")
                .font(.headline)
                .foregroundColor(.primary)

            Text(searchText.isEmpty
                ? "No credentials available"
                : "No credentials match your search")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
    }
}

// MARK: - Password Row View

struct PasswordRowView: View {
    let credential: Credential

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(Color.green.opacity(0.1))
                    .frame(width: 44, height: 44)
                Image(systemName: "key.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.green)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(credential.name)
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)

                Text(credential.username)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(.systemBackground))
    }
}
