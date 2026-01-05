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
        print("InitializationState: startInitialization called, current flag=\(isInitializingFlag)")
        if isInitializingFlag {
            print("InitializationState: Already initializing, returning false")
            return false
        }
        print("InitializationState: Setting flag to true, proceeding")
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
    
    // User initialization state
    @State private var hasPasswordSet: Bool = false
    @State private var isLoggedIn: Bool = false
    @State private var isVaultOpen: Bool = false
    
    init(serviceIdentifiers: [ASCredentialServiceIdentifier] = [], presentationWindow: UIWindow? = nil, onCancel: @escaping () -> Void, onComplete: @escaping (String, String) -> Void, onVaultClientCreated: ((PearPassVaultClient) -> Void)? = nil) {
        self.serviceIdentifiers = serviceIdentifiers
        self.presentationWindow = presentationWindow
        self.onCancel = onCancel
        self.onComplete = onComplete
        self.onVaultClientCreated = onVaultClientCreated
        print("ExtensionMainView: Basic initialization completed")
        
        // Print the domain information
        if !serviceIdentifiers.isEmpty {
            print("ExtensionMainView: Service identifiers received:")
            for identifier in serviceIdentifiers {
                print("  - Domain/URL: \(identifier.identifier)")
                print("  - Type: \(identifier.type == .domain ? "Domain" : identifier.type == .URL ? "URL" : "Unknown")")
            }
        } else {
            print("ExtensionMainView: No service identifiers provided")
        }
    }
    
    private func initialize() {
        guard vaultClient == nil else { return }

        print("ExtensionMainView: Initializing PearPassVaultClient")

        // Initialize the vault client with debug mode enabled
        let client = PearPassVaultClient(debugMode: false)
        vaultClient = client

        // Notify parent view controller so it can store reference for cleanup
        onVaultClientCreated?(client)

        print("ExtensionMainView: PearPassVaultClient created")
        
        // Initialize user after vault client is ready
        Task {
            do {
                // Wait for vault client to be fully initialized
                print("ExtensionMainView: Waiting for vault client initialization...")
                try await vaultClient?.waitForInitialization()
                print("ExtensionMainView: Vault client is ready")
                
                // Now initialize the user
                await initializeUser()
            } catch {
                print("ExtensionMainView: Failed to initialize vault client: \(error.localizedDescription)")
            }
        }
    }
    
    /// Initializes the user by checking password, login and vault status
    /// Implements the initializeUser logic from JavaScript
    private func initializeUser() async {
        guard let client = vaultClient else {
            print("ExtensionMainView: Cannot initialize user - vault client is nil")
            return
        }
        
        // Prevent concurrent initialization using shared state with synchronous flag
        let shouldContinue = await initializationState.startInitialization()
        
        guard shouldContinue else { 
            print("ExtensionMainView: Initialization skipped due to concurrent call")
            return 
        }
        
        
        print("ExtensionMainView: Calling initializeUser")
        
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
                
                print("ExtensionMainView: User initialization complete")
                print("  - hasPasswordSet: \(passwordSet)")
                print("  - isLoggedIn: \(loggedIn)")
                print("  - isVaultOpen: \(vaultOpen)")
                print("  - biometricsAvailable: \(biometricsAvailable)")
                
                // Set the appropriate flow based on password configuration
                if !passwordSet {
                    print("ExtensionMainView: Setting flow to missingConfiguration (passwordSet=false)")
                    self.viewModel.currentFlow = .missingConfiguration
                } else if !loggedIn {
                    print("ExtensionMainView: Setting flow to masterPassword (passwordSet=true, loggedIn=false)")
                    self.viewModel.currentFlow = .masterPassword
                } else {
                    print("ExtensionMainView: User is logged in, keeping current flow")
                }
                
                // Reset initialization state after flow is set
                initializationState.finishInitialization()
            }
            
        } catch {
            print("ExtensionMainView: Error initializing user: \(error.localizedDescription)")
            
            // Try to at least check if password is set
            var passwordSet = false
            do {
                if let masterPasswordEncryption = try? await client.getMasterPasswordEncryption(vaultStatus: nil) {
                    passwordSet = masterPasswordEncryption.ciphertext != nil &&
                                 masterPasswordEncryption.nonce != nil &&
                                 masterPasswordEncryption.salt != nil
                }
            } catch {
                print("ExtensionMainView: Could not check password status: \(error.localizedDescription)")
            }
            
            // Set default values on error
            await MainActor.run {
                self.hasPasswordSet = passwordSet
                self.isLoggedIn = false
                self.isVaultOpen = false
                
                // Only show missing configuration if password is not set
                if !passwordSet {
                    print("ExtensionMainView: Error handler - Setting flow to missingConfiguration (passwordSet=false)")
                    self.viewModel.currentFlow = .missingConfiguration
                } else {
                    // Password is set but something else went wrong, show master password screen
                    print("ExtensionMainView: Error handler - Setting flow to masterPassword (passwordSet=true)")
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
                    CredentialsListView(viewModel: viewModel, vault: vault, serviceIdentifiers: serviceIdentifiers, onCancel: onCancel, onComplete: onComplete, vaultClient: vaultClient)
                }
            }
        }
        .animation(.easeInOut(duration: 0.3), value: viewModel.currentFlow)
        .onAppear {
            print("ExtensionMainView: View appeared, initializing...")
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
