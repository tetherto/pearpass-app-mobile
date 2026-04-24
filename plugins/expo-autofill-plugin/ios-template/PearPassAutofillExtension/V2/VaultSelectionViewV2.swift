import SwiftUI

struct VaultSelectionViewV2: View {
    @Environment(\.pearpassTheme) private var theme
    @ObservedObject var viewModel: ExtensionViewModel
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yyyy"
        return formatter
    }()

    var body: some View {
        ZStack {
            theme.colorBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                PPSheetHeader(title: NSLocalizedString("Add a passkey", comment: "Passkey sheet header"), onCancel: onCancel)

                if viewModel.vaults.isEmpty {
                    Spacer()
                    VStack(spacing: Tokens.Spacing.s16) {
                        PPTitle(NSLocalizedString("Select a vault", comment: "Vault selection title"))
                            .multilineTextAlignment(.center)
                        PPText(
                            NSLocalizedString("No vaults available", comment: "No vaults message"),
                            variant: .body,
                            color: theme.colorTextSecondary
                        )
                        .multilineTextAlignment(.center)
                    }
                    .padding(.horizontal, Tokens.Spacing.s24)
                    Spacer()
                } else {
                    ScrollView {
                        VStack(spacing: Tokens.Spacing.s24) {
                            PPTitle(NSLocalizedString("Select a vault", comment: "Vault selection title"))
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding(.top, Tokens.Spacing.s32)

                            VStack(spacing: Tokens.Spacing.s12) {
                                ForEach(viewModel.vaults, id: \.id) { vault in
                                    vaultRow(vault)
                                }
                            }
                        }
                        .padding(.horizontal, Tokens.Spacing.s16)
                        .padding(.bottom, Tokens.Spacing.s24)
                    }
                }
            }
        }
    }

    private func vaultRow(_ vault: Vault) -> some View {
        Button {
            onVaultPress(vault)
        } label: {
            HStack(spacing: Tokens.Spacing.s12) {
                Image(systemName: "lock.fill")
                    .font(.system(size: Tokens.FontSize.s16))
                    .foregroundColor(theme.colorPrimary)

                VStack(alignment: .leading, spacing: Tokens.Spacing.s2) {
                    PPText(vault.name, variant: .bodyEmphasized)
                    PPText(
                        String(
                            format: NSLocalizedString("Created %@", comment: "Vault created date"),
                            Self.dateFormatter.string(from: vault.createdAt)
                        ),
                        variant: .label,
                        color: theme.colorTextSecondary
                    )
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: Tokens.FontSize.s14))
                    .foregroundColor(theme.colorTextSecondary)
            }
            .padding(Tokens.Spacing.s16)
            .background(
                RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                    .fill(theme.colorSurfacePrimary)
            )
            .overlay(
                RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                    .stroke(theme.colorBorderPrimary, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    private func onVaultPress(_ vault: Vault) {
        guard let client = vaultClient else {
            viewModel.selectVault(vault)
            return
        }

        Task {
            do {
                let isProtected = try await client.checkVaultIsProtected(
                    vaultId: vault.id,
                    savedVaults: viewModel.vaults
                )

                await MainActor.run {
                    viewModel.selectedVault = vault
                    viewModel.currentFlow = isProtected
                        ? .vaultPassword(vault: vault)
                        : .credentialsList(vault: vault)
                }
            } catch {
                await MainActor.run {
                    viewModel.selectedVault = vault
                    viewModel.currentFlow = .vaultPassword(vault: vault)
                }
            }
        }
    }
}
