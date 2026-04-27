//
//  CombinedItemsV2View.swift
//  PearPassAutoFillExtension
//
//  V2 combined vault + credentials screen. Mirrors android-template/res/layout/fragment_combined_items_v2.xml.
//  Replaces V1 VaultSelection + VaultPassword + CredentialsList + ExistingCredentialSelection.
//

import SwiftUI

enum CombinedItemsMode {
    case assertion       // login form fill
    case registration    // passkey create
}

struct CombinedVaultOption: Identifiable, Equatable {
    let id: String
    let name: String
}

struct CombinedCredentialOption: Identifiable, Equatable {
    let id: String
    let title: String
    let username: String?
    let initials: String
}

struct CombinedItemsV2View: View {

    var headerTitle: String = "Add a passkey"
    var mode: CombinedItemsMode = .registration

    @Binding var searchText: String
    @Binding var selectedVaultId: String?
    @Binding var isVaultDropdownOpen: Bool

    var vaults: [CombinedVaultOption] = []
    var credentials: [CombinedCredentialOption] = []

    var isLoading: Bool = false
    var requiresVaultPassword: Bool = false
    @Binding var vaultPassword: String

    var onClose: () -> Void = {}
    var onSelectVault: (String) -> Void = { _ in }
    var onSelectCredential: (String) -> Void = { _ in }
    var onAddNewLogin: () -> Void = {}
    var onUnlockVault: () -> Void = {}

    var body: some View {
        VStack(spacing: 0) {
            PPSheetHeader(
                title: headerTitle,
                showLogo: true,
                showClose: true,
                onClose: onClose
            )

            PPSearchField(text: $searchText, placeholder: "Search in All Items")
                .padding(.horizontal, PPSpacing.s16)
                .padding(.bottom, PPSpacing.s16)
                .background(PPColors.background)

            PPContentCard {
                VStack(spacing: 0) {
                    // Vault selector + optional dropdown
                    VStack(spacing: 0) {
                        vaultSelectorRow

                        if isVaultDropdownOpen {
                            Rectangle()
                                .fill(PPColors.borderPrimary)
                                .frame(height: 1)

                            VStack(spacing: PPSpacing.s8) {
                                ForEach(vaults) { vault in
                                    PPVaultInlineItemView(
                                        name: vault.name,
                                        isSelected: vault.id == selectedVaultId,
                                        onTap: { onSelectVault(vault.id) }
                                    )
                                }
                            }
                            .padding(PPSpacing.s12)
                        }
                    }
                    .background(
                        ZStack {
                            RoundedRectangle(cornerRadius: PPRadii.r8)
                                .fill(Color.clear)
                            RoundedRectangle(cornerRadius: PPRadii.r8)
                                .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
                        }
                    )
                    .padding(.horizontal, PPSpacing.s16)

                    // Divider above content
                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)
                        .padding(.horizontal, PPSpacing.s12)
                        .padding(.top, PPSpacing.s12)

                    // Body
                    contentArea

                    // Divider above add new
                    if mode == .registration {
                        Rectangle()
                            .fill(PPColors.borderPrimary)
                            .frame(height: 1)
                            .padding(.horizontal, PPSpacing.s12)

                        PPButton(
                            title: "Add New Login",
                            variant: .primary,
                            leadingIcon: Image("Icons/Plus", bundle: .main),
                            action: onAddNewLogin
                        )
                        .padding(.horizontal, PPSpacing.s16)
                        .padding(.top, PPSpacing.s16)
                        .padding(.bottom, PPSpacing.s12)
                    }
                }
                .padding(.top, PPSpacing.s16)
            }
        }
        .background(PPColors.surfacePrimary)
    }

    // MARK: - Subviews

    private var vaultSelectorRow: some View {
        Button(action: { isVaultDropdownOpen.toggle() }) {
            HStack(spacing: PPSpacing.s8) {
                Image("Icons/Lock", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 16, height: 16)
                    .foregroundColor(PPColors.textPrimary)

                Text(currentVaultName)
                    .font(PPTypography.labelEmphasized)
                    .foregroundColor(PPColors.textPrimary)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .frame(maxWidth: .infinity, alignment: .leading)

                Image("Icons/ChevronDown", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 16, height: 16)
                    .foregroundColor(PPColors.textPrimary)
                    .rotationEffect(isVaultDropdownOpen ? .degrees(180) : .degrees(0))
            }
            .padding(PPSpacing.s12)
        }
        .buttonStyle(.plain)
    }

    private var currentVaultName: String {
        guard let id = selectedVaultId,
              let vault = vaults.first(where: { $0.id == id }) else {
            return "Select Vault"
        }
        return vault.name
    }

    @ViewBuilder
    private var contentArea: some View {
        if isLoading {
            HStack {
                Spacer()
                ProgressView()
                    .progressViewStyle(.circular)
                    .tint(PPColors.primary)
                    .frame(width: 40, height: 40)
                Spacer()
            }
            .padding(.vertical, PPSpacing.s24)
        } else if credentials.isEmpty {
            emptyState
        } else {
            credentialsList
        }
        // Vault password prompt branch is intentionally removed — business logic
        // does not support per-vault passwords yet (master password is sufficient).
    }

    private var credentialsList: some View {
        ScrollView {
            VStack(spacing: 0) {
                ForEach(credentials) { credential in
                    PPCredentialItemView(
                        initials: credential.initials,
                        title: credential.title,
                        username: credential.username,
                        onTap: { onSelectCredential(credential.id) }
                    )
                }
            }
            .padding(.horizontal, PPSpacing.s16)
            .padding(.top, PPSpacing.s8)
        }
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack {
            switch mode {
            case .assertion:
                Text("No matching items in this vault")
                    .font(PPTypography.label)
                    .foregroundColor(PPColors.textSecondary)
                    .multilineTextAlignment(.leading)
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s16)

            case .registration:
                registrationEmptyText

            }
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .topLeading)
    }

    /// Registration-mode empty state: "save it as a new item" is the actionable
    /// phrase — green + underlined; tapping anywhere on the paragraph fires
    /// onAddNewLogin (mirrors Android's clickable span behavior).
    private var registrationEmptyText: some View {
        let highlight = Text("save it as a new item")
            .foregroundColor(PPColors.primary)
            .underline()
        let prefix = Text("We couldn't find a matching item in this vault. Would you like to ")
        let suffix = Text(" or look in another vault?")

        return (prefix + highlight + suffix)
            .font(PPTypography.label)
            .foregroundColor(PPColors.textSecondary)
            .multilineTextAlignment(.leading)
            .padding(.horizontal, PPSpacing.s16)
            .padding(.top, PPSpacing.s16)
            .contentShape(Rectangle())
            .onTapGesture { onAddNewLogin() }
    }

    // Vault password prompt UI removed — business logic doesn't yet support
    // per-vault passwords; master password covers it.
    /*
    private var vaultPasswordPrompt: some View {
        VStack(spacing: 0) {
            Text("Unlock Vault")
                .font(PPTypography.bodyEmphasized)
                .foregroundColor(PPColors.textPrimary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
                .padding(.top, PPSpacing.s24)

            Text("Enter vault password to continue")
                .font(PPTypography.label)
                .foregroundColor(PPColors.textSecondary)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
                .padding(.top, PPSpacing.s8)

            Spacer().frame(height: PPSpacing.s24)

            PPPasswordField(
                label: "Password",
                text: $vaultPassword,
                placeholder: "Vault password"
            )

            Spacer()

            PPButton(title: "Continue", variant: .primary, action: onUnlockVault)
                .padding(.top, PPSpacing.s16)
                .padding(.bottom, PPSpacing.s16)
        }
        .padding(.horizontal, PPSpacing.s16)
    }
    */
}
