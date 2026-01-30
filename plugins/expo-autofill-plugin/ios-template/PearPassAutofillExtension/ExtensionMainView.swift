import SwiftUI
import AuthenticationServices

// Global initialization state to prevent race conditions across multiple view instances
private class InitializationState: ObservableObject {
    static let shared = InitializationState()
    @Published var isInitializing = true  // Start as true to show loading initially
    private var isInitializingFlag = false
    private var hasInitializedOnce = false

    private init() {}

    @MainActor
    func startInitialization() -> Bool {
        if isInitializingFlag {
            print("InitializationState: Already initializing, returning false")
            return false
        }
        isInitializingFlag = true
        // Only show loading state on first initialization
        if !hasInitializedOnce {
            isInitializing = true
        }
        return true
    }

    @MainActor
    func finishInitialization() {
        isInitializingFlag = false
        isInitializing = false
        hasInitializedOnce = true
    }
}

struct ExtensionMainView: View {
    @StateObject private var viewModel = ExtensionViewModel()
    @State private var vaultClient: PearPassVaultClient?
    @StateObject private var initializationState = InitializationState.shared

    let serviceIdentifiers: [ASCredentialServiceIdentifier]
    let presentationWindow: UIWindow?
    let onCancel: () -> Void
    let onComplete: (String, String) -> Void
    let onVaultClientCreated: ((PearPassVaultClient) -> Void)?

    // Passkey-specific properties (iOS 17+)
    let passkeyRpId: String?
    let passkeyClientDataHash: Data?
    let onPasskeySelected: ((PasskeyCredential) -> Void)?

    // User initialization state
    @State private var hasPasswordSet: Bool = false
    @State private var isLoggedIn: Bool = false
    @State private var isVaultOpen: Bool = false

    // Standard initializer for password-only flows
    init(serviceIdentifiers: [ASCredentialServiceIdentifier] = [], presentationWindow: UIWindow? = nil, onCancel: @escaping () -> Void, onComplete: @escaping (String, String) -> Void, onVaultClientCreated: ((PearPassVaultClient) -> Void)? = nil) {
        self.serviceIdentifiers = serviceIdentifiers
        self.presentationWindow = presentationWindow
        self.onCancel = onCancel
        self.onComplete = onComplete
        self.onVaultClientCreated = onVaultClientCreated
        self.passkeyRpId = nil
        self.passkeyClientDataHash = nil
        self.onPasskeySelected = nil
    }

    // Extended initializer for passkey flows (iOS 17+)
    @available(iOS 17.0, *)
    init(
        serviceIdentifiers: [ASCredentialServiceIdentifier] = [],
        presentationWindow: UIWindow? = nil,
        passkeyRpId: String?,
        passkeyClientDataHash: Data?,
        onCancel: @escaping () -> Void,
        onComplete: @escaping (String, String) -> Void,
        onPasskeySelected: ((PasskeyCredential) -> Void)?,
        onVaultClientCreated: ((PearPassVaultClient) -> Void)? = nil
    ) {
        self.serviceIdentifiers = serviceIdentifiers
        self.presentationWindow = presentationWindow
        self.onCancel = onCancel
        self.onComplete = onComplete
        self.onVaultClientCreated = onVaultClientCreated
        self.passkeyRpId = passkeyRpId
        self.passkeyClientDataHash = passkeyClientDataHash
        self.onPasskeySelected = onPasskeySelected
    }

    private func initialize() {
        guard vaultClient == nil else { return }


        // Initialize the vault client in read-only mode for credential lookup
        let client = PearPassVaultClient(debugMode: true, readOnly: true)
        vaultClient = client

        // Notify parent view controller so it can store reference for cleanup
        onVaultClientCreated?(client)

        // Initialize user after vault client is ready
        Task {
            do {
                // Wait for vault client to be fully initialized
                try await vaultClient?.waitForInitialization()

                // Now initialize the user
                await initializeUser()
            } catch {
            }
        }
    }

    /// Initializes the user by checking password, login and vault status
    /// Implements the initializeUser logic from JavaScript
    private func initializeUser() async {
        guard let client = vaultClient else {
            return
        }

        // Prevent concurrent initialization using shared state with synchronous flag
        let shouldContinue = await initializationState.startInitialization()

        guard shouldContinue else {
            return
        }


        do {
            // Get vault status and active vault status sequentially to avoid race conditions
            let vaultsStatusRes = try await client.vaultsGetStatus()
            let activeVaultStatusRes = try await client.activeVaultGetStatus()

            // Now get master password encryption, passing the vault status to avoid duplicate call
            let masterPasswordEncryption = try await client.getMasterPasswordEncryption(vaultStatus: vaultsStatusRes)

            // Check if password is set by verifying all required fields exist
            let passwordSet = masterPasswordEncryption != nil &&
                             masterPasswordEncryption?.ciphertext != nil &&
                             masterPasswordEncryption?.nonce != nil &&
                             masterPasswordEncryption?.salt != nil

            // Check if user is logged in (vault is initialized and unlocked)
            let loggedIn = vaultsStatusRes.isInitialized && !vaultsStatusRes.isLocked

            // Check if active vault is open
            let vaultOpen = loggedIn &&
                           activeVaultStatusRes.isInitialized &&
                           !activeVaultStatusRes.isLocked

            // Check if biometrics are available for quick login
            // This only checks biometricsEnabled flag, not encryptionData, so won't trigger Face ID
            let biometricsAvailable = KeychainHelper.shared.canUseBiometrics()

            // Update state on main thread
            await MainActor.run {
                self.hasPasswordSet = passwordSet
                self.isLoggedIn = loggedIn
                self.isVaultOpen = vaultOpen

                // Set the appropriate flow based on password configuration
                if !passwordSet {
                    self.viewModel.currentFlow = .missingConfiguration
                } else if !loggedIn {
                    self.viewModel.currentFlow = .masterPassword
                } else {
                    print("ExtensionMainView: User is logged in, keeping current flow")
                }

                // Reset initialization state after flow is set
                initializationState.finishInitialization()
            }

        } catch {

            // Try to at least check if password is set
            var passwordSet = false
            do {
                if let masterPasswordEncryption = try? await client.getMasterPasswordEncryption(vaultStatus: nil) {
                    passwordSet = masterPasswordEncryption.ciphertext != nil &&
                                 masterPasswordEncryption.nonce != nil &&
                                 masterPasswordEncryption.salt != nil
                }
            } catch {
            }

            // Set default values on error
            await MainActor.run {
                self.hasPasswordSet = passwordSet
                self.isLoggedIn = false
                self.isVaultOpen = false

                // Only show missing configuration if password is not set
                if !passwordSet {
                    self.viewModel.currentFlow = .missingConfiguration
                } else {
                    // Password is set but something else went wrong, show master password screen
                    self.viewModel.currentFlow = .masterPassword
                }

                // Reset initialization state after flow is set
                initializationState.finishInitialization()
            }
        }
    }


    var body: some View {
        ZStack {
            SimpleBackgroundView()

            if initializationState.isInitializing {
                // Show loading state while initializing
                VStack(spacing: 20) {
                    ProgressView()
                        .scaleEffect(1.2)
                        .foregroundColor(.white)

                    Text(NSLocalizedString("Loading...", comment: "Loading indicator text"))
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.8))
                }
            } else {
                switch viewModel.currentFlow {
                case .missingConfiguration:
                    MissingConfigurationView(onCancel: onCancel)

                case .masterPassword:
                    MasterPasswordView(viewModel: viewModel, onCancel: onCancel, vaultClient: vaultClient, presentationWindow: presentationWindow)

                case .vaultSelection:
                    VaultSelectionView(viewModel: viewModel, onCancel: onCancel, vaultClient: vaultClient)

                case .vaultPassword(let vault):
                    VaultPasswordView(viewModel: viewModel, vault: vault, onCancel: onCancel, vaultClient: vaultClient)

                case .credentialsList(let vault):
                    CredentialsListView(
                        viewModel: viewModel,
                        vault: vault,
                        serviceIdentifiers: serviceIdentifiers,
                        onCancel: onCancel,
                        onComplete: onComplete,
                        vaultClient: vaultClient,
                        passkeyRpId: passkeyRpId,
                        onPasskeySelected: onPasskeySelected
                    )
                }
            }
        }
        .animation(.easeInOut(duration: 0.3), value: viewModel.currentFlow)
        .onAppear {
            initialize()
        }
    }
}

#if DEBUG
struct ExtensionMainView_Previews: PreviewProvider {
    static var previews: some View {
        ExtensionMainView(onCancel: {}, onComplete: { _, _ in })
    }
}
#endif
