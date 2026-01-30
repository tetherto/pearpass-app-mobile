//
//  ExistingCredentialSelectionView.swift
//  PearPassAutoFillExtension
//
//  Shows matching existing credentials when creating a passkey,
//  letting user attach to existing or create new.
//

import SwiftUI

@available(iOS 17.0, *)
struct ExistingCredentialSelectionView: View {
    let matchingRecords: [VaultRecord]
    let rpId: String
    let userName: String
    let onSelectRecord: (VaultRecord) -> Void
    let onCreateNew: () -> Void
    let onCancel: () -> Void

    @State private var showReplaceAlert = false
    @State private var recordToReplace: VaultRecord?
    @State private var searchText = ""

    private var filteredRecords: [VaultRecord] {
        if searchText.trimmingCharacters(in: .whitespaces).isEmpty {
            return matchingRecords
        }
        let query = searchText.trimmingCharacters(in: .whitespaces)
        return matchingRecords.filter { record in
            let title = record.data?.title ?? ""
            let username = record.data?.username ?? ""
            let websites = record.data?.websites ?? []
            return title.localizedCaseInsensitiveContains(query)
                || username.localizedCaseInsensitiveContains(query)
                || websites.contains { $0.localizedCaseInsensitiveContains(query) }
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            CancelHeader {
                onCancel()
            }

            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text(NSLocalizedString("Save Passkey", comment: "Save passkey title"))
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)

                        Text(matchingRecords.isEmpty
                            ? NSLocalizedString("We didn't find an existing login for this website. Create a new one or search an item to save your passkey.", comment: "No existing credentials description")
                            : NSLocalizedString("Choose where to store this Passkey, or create a new item.", comment: "Existing credentials description"))
                            .font(.system(size: 15))
                            .foregroundColor(.white.opacity(0.7))
                    }
                    .padding(.top, 8)

                    // Search bar
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(Color(red: 0xBA/255, green: 0xBA/255, blue: 0xBA/255))

                        ZStack(alignment: .leading) {
                            if searchText.isEmpty {
                                Text(NSLocalizedString("Search...", comment: "Search placeholder"))
                                    .foregroundColor(Color(red: 0xBA/255, green: 0xBA/255, blue: 0xBA/255))
                            }
                            TextField("", text: $searchText)
                                .textFieldStyle(PlainTextFieldStyle())
                                .foregroundColor(Color(red: 0xE0/255, green: 0xE0/255, blue: 0xE0/255))
                        }

                        if !searchText.isEmpty {
                            Button(action: { searchText = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(Color(red: 0xBA/255, green: 0xBA/255, blue: 0xBA/255))
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .frame(height: 44)
                    .background(
                        RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                            .fill(Constants.Colors.darkBackground)
                    )

                    // Existing credentials list or empty state
                    if filteredRecords.isEmpty {
                        Spacer().frame(height: 80)
                        HStack {
                            Spacer()
                            Text(NSLocalizedString("No matching login found, search it or create a new login to store this passkey.", comment: "Empty state message"))
                                .font(.system(size: 14))
                                .foregroundColor(.white.opacity(0.7))
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 20)
                                .padding(.vertical, 16)
                                .background(
                                    RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                                        .fill(Color(red: 0x30/255, green: 0x30/255, blue: 0x30/255))
                                )
                            Spacer()
                        }
                    } else {
                        VStack(spacing: 0) {
                            ForEach(Array(filteredRecords.enumerated()), id: \.offset) { _, record in
                                credentialRow(record: record)
                            }
                        }
                    }
                }
                .padding(.horizontal, Constants.Layout.horizontalPadding)
            }

            // Create new login button pinned to bottom
            Button(action: onCreateNew) {
                Text(NSLocalizedString("Create new login", comment: "Create new login button"))
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(
                        RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                            .fill(Constants.Colors.primaryGreen)
                    )
            }
            .padding(.horizontal, Constants.Layout.horizontalPadding)
            .padding(.vertical, 12)
        }
        .alert(
            NSLocalizedString("Replace Passkey", comment: "Replace passkey alert title"),
            isPresented: $showReplaceAlert
        ) {
            Button(NSLocalizedString("Cancel", comment: "Cancel button"), role: .cancel) {
                recordToReplace = nil
            }
            Button(NSLocalizedString("Replace", comment: "Replace button"), role: .destructive) {
                if let record = recordToReplace {
                    onSelectRecord(record)
                }
                recordToReplace = nil
            }
        } message: {
            Text(NSLocalizedString("This login already has a passkey. Do you want to replace it?", comment: "Replace passkey alert message"))
        }
    }

    private func credentialRow(record: VaultRecord) -> some View {
        let title = record.data?.title ?? NSLocalizedString("Untitled", comment: "Untitled record")
        let username = record.data?.username ?? ""
        let hasPasskey = record.data?.credential != nil

        return Button(action: {
            if hasPasskey {
                recordToReplace = record
                showReplaceAlert = true
            } else {
                onSelectRecord(record)
            }
        }) {
            HStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                        .fill(Constants.Colors.credentialBackground)
                        .frame(width: 45, height: 45)

                    Text(String(title.prefix(1)).uppercased())
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Constants.Colors.primaryGreen)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)

                    if !username.isEmpty {
                        Text(username)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.5))
                    }
                }

                Spacer()
            }
            .padding(.vertical, 8)
        }
    }
}
