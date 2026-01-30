import SwiftUI
import LocalAuthentication

struct MasterPasswordView: View {
    @ObservedObject var viewModel: ExtensionViewModel
    let onCancel: () -> Void
    let vaultClient: PearPassVaultClient?
    let presentationWindow: UIWindow?
    
    @State private var isLoading: Bool = false
    @State private var errorMessage: String?
    @State private var isAuthenticatingBiometric: Bool = false
    @State private var isAuthenticatingPasskey: Bool = false
    @State private var keyboardHeight: CGFloat = 0
    
    private var showFaceIDButton: Bool {
        KeychainHelper.shared.canUseBiometrics()
    }
    
    private var showPasskeyButton: Bool {
        if #available(iOS 16.0, *) {
            return PasskeyHelper.shared.canUsePasskey()
        } else {
            return false
        }
    }
    
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
                                    .frame(height: max(50, (contentGeometry.size.height - keyboardHeight - 400) / 2))

                                HStack {
                                    Text("•••")
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(.white)

                                    Text(NSLocalizedString("Enter Master Password", comment: "Master password prompt"))
                                        .font(.system(size: 20, weight: .medium))
                                        .foregroundColor(.white)
                                }

                                VStack(spacing: 20) {
                                    PasswordInput(password: $viewModel.masterPassword)

                                    if let errorMessage = errorMessage {
                                        Text(errorMessage)
                                            .font(.system(size: 14))
                                            .foregroundColor(.red)
                                            .multilineTextAlignment(.center)
                                            .padding(.horizontal)
                                    }

                                    Button(action: {
                                        handleLogin()
                                    }) {
                                        ZStack {
                                            if isLoading {
                                                HStack(spacing: 8) {
                                                    ProgressView()
                                                        .progressViewStyle(CircularProgressViewStyle(tint: .black))
                                                        .scaleEffect(0.8)
                                                    Text(NSLocalizedString("Authenticating...", comment: "Authentication in progress"))
                                                        .font(.system(size: 16, weight: .semibold))
                                                        .foregroundColor(.black)
                                                }
                                            } else {
                                                Text(NSLocalizedString("Continue", comment: "Continue button"))
                                                    .font(.system(size: 16, weight: .semibold))
                                                    .foregroundColor(.black)
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                .fill(Constants.Colors.primaryGreen)
                                        )
                                    }
                                    .disabled(viewModel.masterPassword.isEmpty || isLoading)
                                    .opacity(viewModel.masterPassword.isEmpty || isLoading ? 0.6 : 1.0)

                                    VStack(spacing: 12) {
                                        if showPasskeyButton {
                                            Button(action: {
                                                if #available(iOS 16.0, *) {
                                                    handlePasskeyLogin()
                                                }
                                            }) {
                                                Text(NSLocalizedString("Use Passkey", comment: "Passkey button text"))
                                                    .font(.system(size: 16, weight: .semibold))
                                                    .foregroundColor(Constants.Colors.lightGray)
                                                    .frame(maxWidth: .infinity)
                                                    .padding(.vertical, 12)
                                                    .background(
                                                        ZStack {
                                                            RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                                .fill(Constants.Colors.primaryBackground)
                                                            RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                                                .stroke(Constants.Colors.primaryGreen, lineWidth: 2)
                                                        }
                                                    )
                                            }
                                            .disabled(isAuthenticatingPasskey)
                                            .opacity(isAuthenticatingPasskey ? 0.6 : 1.0)
                                        }

                                        if showFaceIDButton {
                                            Button(action: {
                                                handleFaceIDLogin()
                                            }) {
                                                HStack {
                                                    Image(systemName: getFaceIDIconName())
                                                        .foregroundColor(Constants.Colors.primaryGreen)

                                                    Text(getFaceIDButtonText())
                                                        .foregroundColor(Constants.Colors.primaryGreen)
                                                        .font(.system(size: 16, weight: .medium))
                                                }
                                            }
                                            .disabled(isAuthenticatingBiometric)
                                            .opacity(isAuthenticatingBiometric ? 0.6 : 1.0)
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
        .onAppear {
            // Clear password and error state when view appears to prevent blinking
            viewModel.masterPassword = ""
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
    
    private func handleLogin() {
        guard let client = vaultClient else {
            errorMessage = NSLocalizedString("Vault client not initialized", comment: "Error when vault client is not initialized")
            return
        }

        errorMessage = nil

        // Capture password and clear from viewModel immediately
        let password = viewModel.masterPassword
        viewModel.masterPassword = ""

        Task {
            await MainActor.run { isLoading = true }

            do {
                try await authenticateWithPassword(password, client: client)

                await MainActor.run {
                    isLoading = false
                    viewModel.currentFlow = .vaultSelection
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = error.localizedDescription.isEmpty ?
                        NSLocalizedString("Invalid password", comment: "Invalid password error") :
                        error.localizedDescription
                }
            }
        }
    }
    
    // MARK: - Authentication Functions

    private func authenticateWithPassword(_ password: String, client: PearPassVaultClient) async throws {
        // Convert password string to Data buffer for secure handling
        var passwordBuffer = Utils.stringToBuffer(password)
        defer {
            // Securely clear the password buffer after use
            Utils.clearBuffer(&passwordBuffer)
        }

        guard let masterPasswordEncryption = try await client.getMasterPasswordEncryption() else {
            throw NSError(domain: "MasterPasswordView", code: 1001, userInfo: [
                NSLocalizedDescriptionKey: NSLocalizedString("Failed to get master password encryption data", comment: "Error description")
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
        // Check if vaults are already initialized
        let vaultStatus = try await client.vaultsGetStatus()
        if vaultStatus.isInitialized && !vaultStatus.isLocked {
            return
        }

        // Case 1: We have ciphertext, nonce, and hashedPassword (from biometric auth)
        // Use the simplified initWithCredentials API
        if !ciphertext.isEmpty && !nonce.isEmpty, let hashedPwd = hashedPassword, !hashedPwd.isEmpty {
            try await client.initWithCredentials(
                ciphertext: ciphertext,
                nonce: nonce,
                hashedPassword: hashedPwd
            )
            return
        }

        // Case 2: We need to use the password to decrypt
        // Use the simplified initWithPassword API
        if password.isEmpty {
            throw NSError(domain: "MasterPasswordView", code: 1003, userInfo: [
                NSLocalizedDescriptionKey: NSLocalizedString("Password is required", comment: "Error description")
            ])
        }

        try await client.initWithPassword(password: password)
    }
    
    // MARK: - Biometric Authentication
    
    private func getFaceIDIconName() -> String {
        let biometricType = KeychainHelper.shared.getBiometricType()
        switch biometricType {
        case .faceID:
            return "faceid"
        case .touchID:
            return "touchid"
        default:
            return "lock.shield"
        }
    }
    
    private func getFaceIDButtonText() -> String {
        let biometricType = KeychainHelper.shared.getBiometricType()
        switch biometricType {
        case .faceID:
            return NSLocalizedString("Use Face ID", comment: "Face ID button text")
        case .touchID:
            return NSLocalizedString("Use Touch ID", comment: "Touch ID button text")
        default:
            return NSLocalizedString("Use Biometrics", comment: "Generic biometrics button text")
        }
    }
    
    private func handleFaceIDLogin() {
        guard let client = vaultClient else {
            errorMessage = NSLocalizedString("Vault client not initialized", comment: "Error when vault client is not initialized")
            return
        }
        
        errorMessage = nil
        isAuthenticatingBiometric = true
        
        Task {
            do {
                // Get encryption data with biometric authentication
                guard let encryptionData = try await KeychainHelper.shared.getEncryptionData(withBiometricAuth: true) else {
                    await MainActor.run {
                        isAuthenticatingBiometric = false
                        errorMessage = NSLocalizedString("Failed to retrieve encryption data", comment: "Failed to retrieve encryption data error")
                    }
                    return
                }
                
                try await initialize(
                    ciphertext: encryptionData.ciphertext,
                    nonce: encryptionData.nonce,
                    salt: "",
                    hashedPassword: encryptionData.hashedPassword,
                    password: Data(), // No password needed for biometric auth
                    client: client
                )
                
                let vaults = try await client.listVaults()
                
                await MainActor.run {
                    isAuthenticatingBiometric = false
                    viewModel.vaults = vaults
                    // Move to vault selection
                    viewModel.currentFlow = .vaultSelection
                }
                
            } catch {
                await MainActor.run {
                    isAuthenticatingBiometric = false
                    
                    errorMessage = (error as NSError).code == -128 ?
                        NSLocalizedString("Authentication canceled", comment: "Authentication canceled by user") :
                        NSLocalizedString("Face ID authentication failed", comment: "Face ID authentication failed")
                }
            }
        }
    }
    
    
    @available(iOS 16.0, *)
    private func handlePasskeyLogin() {
        guard let client = vaultClient else {
            errorMessage = NSLocalizedString("Vault client not initialized", comment: "Error when vault client is not initialized")
            return
        }
        
        guard let window = presentationWindow else {
            errorMessage = NSLocalizedString("Unable to get presentation window", comment: "Error when unable to get window")
            return
        }
        
        errorMessage = nil
        isAuthenticatingPasskey = true
        
        Task {
            do {
                let encryptionData = try await PasskeyHelper.shared.authenticateWithPasskey(presentationAnchor: window)
                
                guard let encryptionData = encryptionData else {
                    await MainActor.run {
                        isAuthenticatingPasskey = false
                        errorMessage = NSLocalizedString("Failed to retrieve encryption data from passkey. The passkey may not have the master password stored.", comment: "No largeBlob data error")
                    }
                    return
                }
                    try await initialize(
                        ciphertext: encryptionData.ciphertext,
                        nonce: encryptionData.nonce,
                        salt: encryptionData.salt,
                        hashedPassword: encryptionData.hashedPassword,
                        password: Data(), // No password needed for passkey auth
                        client: client
                    )
                
                let vaults = try await client.listVaults()
                
                await MainActor.run {
                    isAuthenticatingPasskey = false
                    viewModel.vaults = vaults
                    // Move to vault selection
                    viewModel.currentFlow = .vaultSelection
                }
                
            } catch {
                await MainActor.run {
                    isAuthenticatingPasskey = false
                    
                    errorMessage = (error as NSError).code == -128 ?
                        NSLocalizedString("Authentication canceled", comment: "Authentication canceled by user") :
                        error.localizedDescription
                }
            }
        }
    }
}
