import SwiftUI

struct VaultSelectionView: View {
    @ObservedObject var viewModel: ExtensionViewModel
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?
    @State private var keyboardHeight: CGFloat = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                SharedBackgroundView()
                
                VStack(spacing: 0) {
                    CancelHeader {
                        onCancel()
                    }

                    if viewModel.vaults.isEmpty {
                        GeometryReader { contentGeometry in
                            ScrollView {
                                VStack(spacing: 32) {
                                    Spacer()
                                        .frame(height: max(20, (contentGeometry.size.height - keyboardHeight - 200) / 3))

                                    Text(NSLocalizedString("Select a vault", comment: "Vault selection title"))
                                        .font(.system(size: 20, weight: .medium))
                                        .foregroundColor(.white)

                                    Text(NSLocalizedString("No vaults available", comment: "No vaults message"))
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                        .padding()

                                    Spacer()
                                        .frame(height: 50)
                                }
                            }
                        }
                        .animation(.easeInOut(duration: 0.3), value: keyboardHeight)
                    } else {
                        GeometryReader { contentGeometry in
                            ScrollView {
                                VStack(spacing: 32) {
                                    Spacer()
                                        .frame(height: max(10, (contentGeometry.size.height - keyboardHeight - CGFloat(viewModel.vaults.count * 80) - 200) / 3))

                                    Text(NSLocalizedString("Select a vault", comment: "Vault selection title"))
                                        .font(.system(size: 20, weight: .medium))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 24)

                                    VStack(spacing: 16) {
                                        ForEach(viewModel.vaults, id: \.id) { vault in
                                            VaultRow(vault: vault) {
                                                onVaultPress(vault)
                                            }
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
        }
        .onAppear {
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
    
    private func onVaultPress(_ vault: Vault) {
        print("VaultSelectionView: Vault pressed - \(vault.name) (ID: \(vault.id))")
        
        // Check if vault client is available
        guard let client = vaultClient else {
            print("VaultSelectionView: Vault client not available")
            viewModel.selectVault(vault)
            return
        }
        
        // Check if the vault is protected using the already stored vaults
        Task {
            do {
                let isProtected = try await client.checkVaultIsProtected(
                    vaultId: vault.id, 
                    savedVaults: viewModel.vaults
                )
                
                await MainActor.run {
                    print("VaultSelectionView: Vault \(vault.name) is protected: \(isProtected)")
                    
                    // Navigate based on protection status
                    viewModel.selectedVault = vault
                    if isProtected {
                        // Vault is protected, go to password view
                        viewModel.currentFlow = .vaultPassword(vault: vault)
                    } else {
                        // Vault is not protected, go directly to credentials list
                        viewModel.currentFlow = .credentialsList(vault: vault)
                    }
                }
                
            } catch {
                await MainActor.run {
                    print("VaultSelectionView: Error checking vault protection: \(error.localizedDescription)")
                    // On error, assume vault is protected and go to password view for safety
                    viewModel.selectedVault = vault
                    viewModel.currentFlow = .vaultPassword(vault: vault)
                }
            }
        }
    }
}

struct VaultRow: View {
    let vault: Vault
    let action: () -> Void
    
    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yyyy"
        return formatter
    }()
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image("CircleLock")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 20, height: 20)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(vault.name)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                    
                    Text("Created \(Self.dateFormatter.string(from: vault.createdAt))")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                }
                
                Spacer()
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                    .stroke(Constants.Colors.borderGray, lineWidth: 1)
            )
        }
    }
}