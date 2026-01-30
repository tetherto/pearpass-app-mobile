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
    let matchingRecords: [[String: Any]]
    let rpId: String
    let userName: String
    let onSelectRecord: ([String: Any]) -> Void
    let onCreateNew: () -> Void
    let onCancel: () -> Void

    @State private var showReplaceAlert = false
    @State private var recordToReplace: [String: Any]?

    var body: some View {
        VStack(spacing: 0) {
            CancelHeader {
                onCancel()
            }

            ScrollView {
                VStack(spacing: 16) {
                    // Header
                    VStack(spacing: 8) {
                        ZStack {
                            RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                                .fill(Constants.Colors.vaultIconBackground)
                                .frame(width: 64, height: 64)

                            Image(systemName: "person.badge.key.fill")
                                .font(.system(size: 28))
                                .foregroundColor(Constants.Colors.primaryGreen)
                        }

                        Text(NSLocalizedString("Save Passkey", comment: "Save passkey title"))
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(.white)

                        Text(String(format: NSLocalizedString("We found existing logins for %@. You can add the passkey to one of them or create a new login.", comment: "Existing credentials description"), rpId))
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.7))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 8)
                    }
                    .padding(.top, 16)
                    .padding(.bottom, 8)

                    // Existing credentials list
                    VStack(spacing: 8) {
                        ForEach(Array(matchingRecords.enumerated()), id: \.offset) { _, record in
                            credentialRow(record: record)
                        }
                    }

                    // Create new login button
                    Button(action: onCreateNew) {
                        HStack(spacing: 8) {
                            Image(systemName: "plus.circle.fill")
                            Text(NSLocalizedString("Create new login", comment: "Create new login button"))
                        }
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                .fill(Constants.Colors.primaryGreen)
                        )
                    }
                    .padding(.top, 8)

                    Spacer().frame(height: 30)
                }
                .padding(.horizontal, Constants.Layout.horizontalPadding)
            }
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

    private func credentialRow(record: [String: Any]) -> some View {
        let data = record["data"] as? [String: Any] ?? [:]
        let title = data["title"] as? String ?? NSLocalizedString("Untitled", comment: "Untitled record")
        let username = data["username"] as? String ?? ""
        let websites = data["websites"] as? [String] ?? []
        let firstWebsite = websites.first ?? ""
        let hasPasskey = data["credential"] is [String: Any]

        return Button(action: {
            if hasPasskey {
                recordToReplace = record
                showReplaceAlert = true
            } else {
                onSelectRecord(record)
            }
        }) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(title)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                    Spacer()
                    if hasPasskey {
                        Image(systemName: "person.badge.key.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Constants.Colors.primaryGreen.opacity(0.7))
                    }
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.4))
                }

                if !username.isEmpty {
                    HStack(spacing: 6) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        Text(username)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }

                if !firstWebsite.isEmpty {
                    HStack(spacing: 6) {
                        Image(systemName: "globe")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.5))
                        Text(firstWebsite)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                    .fill(Constants.Colors.credentialBackground)
            )
        }
    }
}
