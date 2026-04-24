import SwiftUI

struct VaultPasswordViewV2: View {
    @Environment(\.pearpassTheme) private var theme
    @ObservedObject var viewModel: ExtensionViewModel
    let vault: Vault
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?

    @State private var isLoading: Bool = false
    @State private var errorMessage: String?

    var body: some View {
        ZStack {
            theme.colorBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                PPSheetHeader(
                    title: NSLocalizedString("Add a passkey", comment: "Passkey sheet header"),
                    onBack: { viewModel.goBackToVaultSelection() },
                    onCancel: onCancel
                )

                ScrollView {
                    VStack(spacing: Tokens.Spacing.s32) {
                        VStack(spacing: Tokens.Spacing.s8) {
                            PPTitle(
                                String(format: NSLocalizedString("Unlock %@", comment: "Vault unlock title"), vault.name)
                            )
                            .multilineTextAlignment(.center)

                            PPText(
                                NSLocalizedString("Enter the vault password to continue", comment: "Vault unlock subtitle"),
                                variant: .body,
                                color: theme.colorTextSecondary
                            )
                            .multilineTextAlignment(.center)
                        }
                        .padding(.top, Tokens.Spacing.s32)

                        PPPasswordField(
                            label: NSLocalizedString("Vault password", comment: "Vault password field label"),
                            value: $viewModel.vaultPassword,
                            placeholder: NSLocalizedString("Enter Vault Password", comment: "Vault password placeholder"),
                            error: errorMessage
                        )
                    }
                    .padding(.horizontal, Tokens.Spacing.s16)
                }

                PPButton(
                    NSLocalizedString("Continue", comment: "Continue button"),
                    variant: .primary,
                    fullWidth: true,
                    isLoading: isLoading,
                    isDisabled: viewModel.vaultPassword.isEmpty,
                    action: unlockVault
                )
                .padding(.horizontal, Tokens.Spacing.s16)
                .padding(.bottom, Tokens.Spacing.s24)
            }
        }
        .onAppear {
            viewModel.vaultPassword = ""
            errorMessage = nil
        }
    }

    private func unlockVault() {
        guard let client = vaultClient else {
            viewModel.authenticateWithVaultPassword()
            return
        }

        guard !viewModel.vaultPassword.isEmpty else {
            errorMessage = NSLocalizedString("Password is required", comment: "Empty password error")
            return
        }

        let password = viewModel.vaultPassword
        viewModel.vaultPassword = ""

        isLoading = true
        errorMessage = nil

        Task {
            var passwordBuffer = Utils.stringToBuffer(password)
            defer { Utils.clearBuffer(&passwordBuffer) }

            do {
                _ = try await client.getVaultById(vaultId: vault.id, password: passwordBuffer)

                await MainActor.run {
                    isLoading = false
                    viewModel.currentFlow = .credentialsList(vault: vault)
                }
            } catch PearPassVaultError.decryptionFailed {
                await MainActor.run {
                    isLoading = false
                    errorMessage = NSLocalizedString("Invalid vault password", comment: "Invalid vault password error")
                }
            } catch PearPassVaultError.locked {
                await MainActor.run {
                    isLoading = false
                    errorMessage = NSLocalizedString("Vault is locked. Please try again.", comment: "Vault locked error")
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = NSLocalizedString("Failed to unlock vault. Please check your password and try again.", comment: "Generic vault unlock error")
                }
            }
        }
    }
}
