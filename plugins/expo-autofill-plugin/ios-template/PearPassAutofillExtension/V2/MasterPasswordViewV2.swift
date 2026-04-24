import SwiftUI
import LocalAuthentication

struct MasterPasswordViewV2: View {
    @Environment(\.pearpassTheme) private var theme
    @ObservedObject var viewModel: ExtensionViewModel
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?
    let presentationWindow: UIWindow?

    @State private var isLoading: Bool = false
    @State private var isAuthenticatingBiometric: Bool = false
    @State private var errorMessage: String?

    private var showFaceIDButton: Bool {
        KeychainHelper.shared.canUseBiometrics()
    }

    var body: some View {
        ZStack {
            theme.colorBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                PPSheetHeader(title: NSLocalizedString("Add a passkey", comment: "Passkey sheet header"), onCancel: onCancel)

                ScrollView {
                    VStack(spacing: Tokens.Spacing.s32) {
                        VStack(spacing: Tokens.Spacing.s8) {
                            PPTitle(NSLocalizedString("Enter Your Master Password", comment: "Master password title"))
                                .multilineTextAlignment(.center)

                            PPText(
                                NSLocalizedString("Please enter your master password to continue", comment: "Master password subtitle"),
                                variant: .body,
                                color: theme.colorTextSecondary
                            )
                            .multilineTextAlignment(.center)
                        }
                        .padding(.top, Tokens.Spacing.s32)

                        PPPasswordField(
                            label: NSLocalizedString("Password", comment: "Password field label"),
                            value: $viewModel.masterPassword,
                            placeholder: NSLocalizedString("Enter Master Password", comment: "Password placeholder"),
                            error: errorMessage
                        )
                    }
                    .padding(.horizontal, Tokens.Spacing.s16)
                }

                VStack(spacing: Tokens.Spacing.s16) {
                    if showFaceIDButton {
                        Button(action: handleFaceIDLogin) {
                            Text(faceIDLinkText())
                                .font(.pearpass(size: Tokens.FontSize.s14, weight: Tokens.FontWeight.medium))
                                .foregroundColor(theme.colorLinkText)
                                .underline()
                        }
                        .disabled(isAuthenticatingBiometric)
                    }

                    PPButton(
                        NSLocalizedString("Continue", comment: "Continue button"),
                        variant: .primary,
                        fullWidth: true,
                        isLoading: isLoading,
                        isDisabled: viewModel.masterPassword.isEmpty,
                        action: handleLogin
                    )
                }
                .padding(.horizontal, Tokens.Spacing.s16)
                .padding(.bottom, Tokens.Spacing.s24)
            }
        }
    }

    private func faceIDLinkText() -> String {
        let type = KeychainHelper.shared.getBiometricType()
        switch type {
        case .faceID:  return NSLocalizedString("Try again with Face ID", comment: "Face ID fallback link")
        case .touchID: return NSLocalizedString("Try again with Touch ID", comment: "Touch ID fallback link")
        default:       return NSLocalizedString("Try again with Biometrics", comment: "Biometric fallback link")
        }
    }

    private func handleLogin() {
        guard let client = vaultClient else {
            errorMessage = NSLocalizedString("Vault client not initialized", comment: "Vault client error")
            return
        }

        let password = viewModel.masterPassword
        viewModel.masterPassword = ""

        Task {
            await MainActor.run {
                isLoading = true
                errorMessage = nil
            }

            do {
                try await authenticateWithPassword(password, client: client)
                await MainActor.run {
                    isLoading = false
                    viewModel.currentFlow = .vaultSelection
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = NSLocalizedString("Invalid master password", comment: "Invalid master password error")
                }
            }
        }
    }

    private func authenticateWithPassword(_ password: String, client: PearPassVaultClient) async throws {
        var passwordBuffer = Utils.stringToBuffer(password)
        defer { Utils.clearBuffer(&passwordBuffer) }

        guard let masterPasswordEncryption = try await client.getMasterPasswordEncryption() else {
            throw NSError(domain: "MasterPasswordViewV2", code: 1001, userInfo: [
                NSLocalizedDescriptionKey: NSLocalizedString("Failed to get master password encryption data", comment: "Encryption data error")
            ])
        }

        try await initialize(
            ciphertext: masterPasswordEncryption.ciphertext,
            nonce: masterPasswordEncryption.nonce,
            salt: masterPasswordEncryption.salt,
            hashedPassword: masterPasswordEncryption.hashedPassword,
            password: passwordBuffer,
            client: client
        )

        let vaults = try await client.listVaults()
        await MainActor.run { viewModel.vaults = vaults }
    }

    private func initialize(
        ciphertext: String,
        nonce: String,
        salt: String,
        hashedPassword: String?,
        password: Data,
        client: PearPassVaultClient
    ) async throws {
        let vaultStatus = try await client.vaultsGetStatus()
        if vaultStatus.isInitialized && !vaultStatus.isLocked {
            return
        }

        if !ciphertext.isEmpty && !nonce.isEmpty, let hashedPwd = hashedPassword, !hashedPwd.isEmpty {
            try await client.initWithCredentials(
                ciphertext: ciphertext,
                nonce: nonce,
                hashedPassword: hashedPwd
            )
            return
        }

        if password.isEmpty {
            throw NSError(domain: "MasterPasswordViewV2", code: 1003, userInfo: [
                NSLocalizedDescriptionKey: NSLocalizedString("Password is required", comment: "Empty password error")
            ])
        }

        try await client.initWithPassword(password: password)
    }

    private func handleFaceIDLogin() {
        guard let client = vaultClient else {
            errorMessage = NSLocalizedString("Vault client not initialized", comment: "Vault client error")
            return
        }

        isAuthenticatingBiometric = true
        errorMessage = nil

        Task {
            do {
                guard let encryptionData = try await KeychainHelper.shared.getEncryptionData(withBiometricAuth: true) else {
                    await MainActor.run {
                        isAuthenticatingBiometric = false
                        errorMessage = NSLocalizedString("Failed to retrieve encryption data", comment: "Encryption data error")
                    }
                    return
                }

                try await initialize(
                    ciphertext: encryptionData.ciphertext,
                    nonce: encryptionData.nonce,
                    salt: "",
                    hashedPassword: encryptionData.hashedPassword,
                    password: Data(),
                    client: client
                )

                let vaults = try await client.listVaults()

                await MainActor.run {
                    isAuthenticatingBiometric = false
                    viewModel.vaults = vaults
                    viewModel.currentFlow = .vaultSelection
                }
            } catch {
                await MainActor.run {
                    isAuthenticatingBiometric = false
                    errorMessage = (error as NSError).code == -128
                        ? NSLocalizedString("Authentication canceled", comment: "Biometric canceled")
                        : NSLocalizedString("Biometric authentication failed", comment: "Biometric failed")
                }
            }
        }
    }
}
