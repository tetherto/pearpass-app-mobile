import SwiftUI

struct VaultPasswordView: View {
    @ObservedObject var viewModel: ExtensionViewModel
    let vault: Vault
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?

    @State private var isLoading: Bool = false
    @State private var errorMessage: String?
    @State private var keyboardHeight: CGFloat = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                SharedBackgroundView()
                
                VStack(spacing: 0) {
                    CancelHeader {
                        onCancel()
                    }

                    GeometryReader { contentGeometry in
                        ScrollView {
                            VStack(spacing: 32) {
                                Spacer()
                                    .frame(height: max(50, (contentGeometry.size.height - keyboardHeight - 450) / 2.5))

                                Text(String(format: NSLocalizedString("Unlock with the %@ Vault password", comment: "Vault unlock prompt"), vault.name))
                                    .font(.system(size: 20, weight: .medium))
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.center)

                                VStack(spacing: 20) {
                                    if let error = errorMessage {
                                        Text(error)
                                            .font(.system(size: 14))
                                            .foregroundColor(.red)
                                            .multilineTextAlignment(.center)
                                            .padding(.horizontal, 16)
                                    }

                                    PasswordInput(password: $viewModel.vaultPassword)

                                    Button(action: {
                                        unlockVault()
                                    }) {
                                        if isLoading {
                                            ProgressView()
                                                .progressViewStyle(CircularProgressViewStyle(tint: .black))
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 12)
                                                .background(
                                                    RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                        .fill(Constants.Colors.primaryGreen)
                                                )
                                        } else {
                                            Text(NSLocalizedString("Continue", comment: "Continue button"))
                                                .font(.system(size: 16, weight: .semibold))
                                                .foregroundColor(.black)
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 12)
                                                .background(
                                                    RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                        .fill(Constants.Colors.primaryGreen)
                                                )
                                        }
                                    }
                                    .disabled(viewModel.vaultPassword.isEmpty || isLoading)
                                    .opacity(viewModel.vaultPassword.isEmpty || isLoading ? 0.6 : 1.0)

                                    Button(action: {
                                        viewModel.goBackToVaultSelection()
                                    }) {
                                        Text(NSLocalizedString("Select Vaults", comment: "Select vaults button"))
                                            .font(.system(size: 16, weight: .medium))
                                            .foregroundColor(Constants.Colors.primaryGreen)
                                            .frame(maxWidth: .infinity)
                                            .padding(.vertical, 12)
                                            .background(
                                                RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                    .stroke(Constants.Colors.primaryGreen, lineWidth: 2)
                                            )
                                    }
                                }
                                .padding(.horizontal, 24)

                                Spacer()
                                    .frame(height: 50)
                            }
                        }
                    }
                    .animation(.easeInOut(duration: 0.3), value: keyboardHeight)
                }
            }
        }
        .onAppear {
            // Clear password when view appears
            viewModel.vaultPassword = ""
            errorMessage = nil

            // Listen for keyboard notifications
            NotificationCenter.default.addObserver(
                forName: UIResponder.keyboardWillShowNotification,
                object: nil,
                queue: .main
            ) { notification in
                if let keyboardFrame = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                    keyboardHeight = keyboardFrame.height
                }
            }

            NotificationCenter.default.addObserver(
                forName: UIResponder.keyboardWillHideNotification,
                object: nil,
                queue: .main
            ) { _ in
                keyboardHeight = 0
            }
        }
        .onDisappear {
            // Remove keyboard observers
            NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
            NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
        }
    }

    // MARK: - Private Methods

    private func unlockVault() {
        print("VaultPasswordView: Unlocking vault \(vault.name) with password")

        guard let client = vaultClient else {
            print("VaultPasswordView: Vault client not available, using fallback method")
            viewModel.authenticateWithVaultPassword()
            return
        }

        guard !viewModel.vaultPassword.isEmpty else {
            print("VaultPasswordView: Password is empty")
            errorMessage = NSLocalizedString("Password is required", comment: "Empty password error")
            return
        }

        // Capture password and clear from viewModel immediately
        let password = viewModel.vaultPassword
        viewModel.vaultPassword = ""

        isLoading = true
        errorMessage = nil

        Task {
            // Convert password string to Data buffer
            var passwordBuffer = Utils.stringToBuffer(password)
            defer {
                // Securely clear the password buffer after use
                Utils.clearBuffer(&passwordBuffer)
            }

            do {
                print("VaultPasswordView: Attempting to unlock vault \(vault.name) (ID: \(vault.id)) with password (buffer)")

                // This matches the RN app's refetchVault -> fetchVault -> getVaultById pattern
                // Using the Data-based version of getVaultById
                let vaultData = try await client.getVaultById(
                    vaultId: vault.id,
                    password: passwordBuffer
                )

                print("VaultPasswordView: Successfully unlocked vault \(vault.name)")
                print("VaultPasswordView: Vault data received: \(vaultData)")

                await MainActor.run {
                    self.isLoading = false
                    // Navigate to credentials list - vault is now active and ready
                    viewModel.currentFlow = .credentialsList(vault: vault)
                    print("VaultPasswordView: Navigated to credentials list")
                }

            } catch PearPassVaultError.decryptionFailed {
                print("VaultPasswordView: Decryption failed - invalid password")
                await MainActor.run {
                    self.isLoading = false
                    self.errorMessage = NSLocalizedString("Invalid vault password", comment: "Invalid vault password error")
                }
            } catch PearPassVaultError.locked {
                print("VaultPasswordView: Vault is locked")
                await MainActor.run {
                    self.isLoading = false
                    self.errorMessage = NSLocalizedString("Vault is locked. Please try again.", comment: "Vault locked error")
                }
            } catch {
                print("VaultPasswordView: Failed to unlock vault: \(error.localizedDescription)")
                await MainActor.run {
                    self.isLoading = false
                    self.errorMessage = NSLocalizedString("Failed to unlock vault. Please check your password and try again.", comment: "Generic vault unlock error")
                }
            }
        }
    }
}
