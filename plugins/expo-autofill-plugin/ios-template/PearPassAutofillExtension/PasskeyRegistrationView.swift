//
//  PasskeyRegistrationView.swift
//  PearPassAutoFillExtension
//
//  UI for passkey registration flow
//

import SwiftUI
import AuthenticationServices
import CryptoKit

@available(iOS 17.0, *)
struct PasskeyRegistrationView: View {
    let request: PasskeyRegistrationRequest
    let presentationWindow: UIWindow?
    let onComplete: (PasskeyCredential, Data, Data) -> Void  // credential, attestationObject, credentialId
    let onCancel: () -> Void
    let onVaultClientCreated: ((PearPassVaultClient) -> Void)?

    @StateObject private var viewModel = ExtensionViewModel()
    @State private var vaultClient: PearPassVaultClient?
    @State private var isLoading = false
    @State private var error: String?
    @State private var selectedVault: Vault?
    @State private var currentStep: RegistrationStep = .initializing

    // User initialization state
    @State private var hasPasswordSet: Bool = false
    @State private var isLoggedIn: Bool = false

    // Search results for existing credential matching
    @State private var matchingRecords: [VaultRecord] = []
    @State private var selectedExistingRecord: VaultRecord? = nil
    @State private var loadedFolders: [String] = []
    @State private var isClosing = false

    enum RegistrationStep {
        case initializing
        case initializationError
        case masterPassword
        case vaultSelection
        case vaultPassword
        case searchingCredentials
        case selectingExisting
        case editingForm
        case saving
    }

    var body: some View {
        ZStack {
            SimpleBackgroundView()

            switch currentStep {
            case .initializing:
                loadingView

            case .initializationError:
                MissingConfigurationView(onCancel: handleCancel)

            case .masterPassword:
                MasterPasswordView(
                    viewModel: viewModel,
                    onCancel: handleCancel,
                    vaultClient: vaultClient,
                    presentationWindow: presentationWindow
                )

            case .vaultSelection:
                VaultSelectionView(
                    viewModel: viewModel,
                    onCancel: handleCancel,
                    vaultClient: vaultClient
                )

            case .vaultPassword:
                if let vault = selectedVault {
                    VaultPasswordView(
                        viewModel: viewModel,
                        vault: vault,
                        onCancel: handleCancel,
                        vaultClient: vaultClient
                    )
                }

            case .searchingCredentials:
                loadingView

            case .selectingExisting:
                ExistingCredentialSelectionView(
                    matchingRecords: matchingRecords,
                    rpId: request.rpId,
                    userName: request.userName,
                    onSelectRecord: { record in
                        selectedExistingRecord = record
                        currentStep = .editingForm
                    },
                    onCreateNew: {
                        selectedExistingRecord = nil
                        currentStep = .editingForm
                    },
                    onCancel: handleCancel
                )

            case .editingForm:
                PasskeyFormView(
                    request: request,
                    vaultClient: vaultClient,
                    selectedVault: selectedVault,
                    existingRecord: selectedExistingRecord,
                    preloadedFolders: loadedFolders,
                    onSave: { formData in
                        handleFormSave(formData: formData)
                    },
                    onCancel: handleCancel
                )

            case .saving:
                savingView
            }
        }
        .animation(.easeInOut(duration: 0.3), value: currentStep)
        .overlay {
            if isClosing {
                VStack(spacing: 12) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Constants.Colors.primaryGreen))
                        .scaleEffect(1.2)
                    Text("Closing...")
                        .foregroundColor(.white.opacity(0.8))
                        .font(.subheadline)
                }
                .padding(24)
                .background(Color(.black).opacity(0.8))
                .cornerRadius(12)
            }
        }
        .onAppear {
            initialize()
        }
        .onChange(of: viewModel.currentFlow) { newFlow in
            handleFlowChange(newFlow)
        }
    }
    
    private func handleCancel() {
        isClosing = true
        onCancel()
    }

    // MARK: - Views

    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .scaleEffect(1.2)
                .progressViewStyle(CircularProgressViewStyle(tint: Constants.Colors.primaryGreen))

            Text(NSLocalizedString("Loading...", comment: "Loading indicator"))
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.8))
        }
    }

    private var savingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .scaleEffect(1.2)
                .progressViewStyle(CircularProgressViewStyle(tint: Constants.Colors.primaryGreen))

            Text(NSLocalizedString("Creating passkey...", comment: "Creating passkey indicator"))
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.8))
        }
    }

    // MARK: - Initialization

    private func initialize() {

        guard vaultClient == nil else {
            return
        }

        // Initialize with readOnly: true — all writes go through the job queue
        let client = PearPassVaultClient(debugMode: true, readOnly: true)

        vaultClient = client

        onVaultClientCreated?(client)

        Task {
            do {
                try await client.waitForInitialization()
                await initializeUser()
            } catch {
                await MainActor.run {
                    self.error = NSLocalizedString("Failed to initialize", comment: "Initialization error")
                    self.currentStep = .initializationError
                }
            }
        }
    }

    private func initializeUser() async {
        guard let client = vaultClient else { return }

        do {
            let vaultsStatusRes = try await client.vaultsGetStatus()
            let activeVaultStatusRes = try await client.activeVaultGetStatus()
            let masterPasswordEncryption = try await client.getMasterPasswordEncryption(vaultStatus: vaultsStatusRes)

            let passwordSet = masterPasswordEncryption != nil &&
                             masterPasswordEncryption?.ciphertext != nil &&
                             masterPasswordEncryption?.nonce != nil &&
                             masterPasswordEncryption?.salt != nil

            let loggedIn = vaultsStatusRes.isInitialized && !vaultsStatusRes.isLocked

            await MainActor.run {
                self.hasPasswordSet = passwordSet
                self.isLoggedIn = loggedIn

                if !passwordSet {
                    // Cannot create passkey without master password
                    self.error = NSLocalizedString("Please set up PearPass first", comment: "Setup required error")
                    self.currentStep = .initializationError
                } else if !loggedIn {
                    self.viewModel.currentFlow = .masterPassword
                    self.currentStep = .masterPassword
                } else {
                    self.viewModel.currentFlow = .vaultSelection
                    self.currentStep = .vaultSelection
                }
            }
        } catch {
            await MainActor.run {
                self.error = NSLocalizedString("Failed to check authentication status", comment: "Auth check error")
                self.currentStep = .initializationError
            }
        }
    }

    // MARK: - Flow Handling

    private func handleFlowChange(_ flow: AuthFlow) {
        switch flow {
        case .masterPassword:
            currentStep = .masterPassword
        case .vaultSelection:
            currentStep = .vaultSelection
        case .vaultPassword(let vault):
            selectedVault = vault
            currentStep = .vaultPassword
        case .credentialsList(let vault):
            // User has unlocked a vault — search for matching credentials
            selectedVault = vault
            currentStep = .searchingCredentials
            searchForExistingCredentials(vault: vault)
        default:
            break
        }
    }

    // MARK: - Credential Search

    private func searchForExistingCredentials(vault: Vault) {
        guard let client = vaultClient else {
            currentStep = .editingForm
            return
        }

        Task {
            do {
                // Ensure vault is active
                try await activateVaultIfNeeded(client: client, vault: vault)

                let matches = try await client.searchLoginRecords(
                    rpId: request.rpId,
                    username: request.userName
                )

                // Preload folders while vault is active
                let folders = try await client.listFolders()

                await MainActor.run {
                    self.loadedFolders = folders
                    self.matchingRecords = matches
                    if matches.isEmpty {
                        // No matches — go directly to form
                        self.selectedExistingRecord = nil
                        self.currentStep = .editingForm
                    } else {
                        // Show selection screen
                        self.currentStep = .selectingExisting
                    }
                }
            } catch {
                await MainActor.run {
                    print("[PasskeyRegistrationView] Error searching credentials: \(error)")
                    // On error, go directly to form
                    self.selectedExistingRecord = nil
                    self.currentStep = .editingForm
                }
            }
        }
    }

    // MARK: - Form Save Handler

    private func handleFormSave(formData: PasskeyFormData) {
        guard let vault = selectedVault, let client = vaultClient else {
            return
        }

        currentStep = .saving

        Task {
            do {
                // 1. Generate passkey
                let (credential, attestationObject, credentialIdData) = try generatePasskey()

                // 2. Get the hashed password for job file encryption
                guard let hashedPassword = await PasskeyJobCreator.getHashedPassword(from: client) else {
                    throw PasskeyJobError.noHashedPassword
                }

                // 3. Create job via the job queue (deferred write)
                if let existingRecord = formData.existingRecord {
                    // UPDATE_PASSKEY: merge passkey into existing record
                    _ = try PasskeyJobCreator.createUpdatePasskeyJob(
                        vaultId: vault.id,
                        existingRecordId: existingRecord.id,
                        credential: credential,
                        rpId: request.rpId,
                        rpName: request.rpName,
                        userId: request.userId.base64URLEncodedString(),
                        userName: request.userName,
                        userDisplayName: request.userDisplayName,
                        hashedPassword: hashedPassword,
                        passkeyCreatedAt: formData.passkeyCreatedAt
                    )
                } else {
                    // ADD_PASSKEY: create new record
                    _ = try PasskeyJobCreator.createAddPasskeyJob(
                        vaultId: vault.id,
                        credential: credential,
                        formData: formData,
                        rpId: request.rpId,
                        rpName: request.rpName,
                        userId: request.userId.base64URLEncodedString(),
                        userName: request.userName,
                        userDisplayName: request.userDisplayName,
                        hashedPassword: hashedPassword
                    )
                }

                // 4. Complete registration — the passkey is returned to the system
                //    immediately. The main app will process the job on next launch/resume.
                await MainActor.run {
                    onComplete(credential, attestationObject, credentialIdData)
                }
            } catch {
                await MainActor.run {
                    print("[PasskeyRegistrationView] Save error: \(error)")
                    self.currentStep = .editingForm
                }
            }
        }
    }

    // MARK: - Passkey Generation

    private func generatePasskey() throws -> (PasskeyCredential, Data, Data) {
        // 1. Generate key pair
        let privateKey = PasskeyCrypto.generatePrivateKey()
        let privateKeyB64 = PasskeyCrypto.exportPrivateKey(privateKey)
        guard let privateKeyData = Data(base64URLEncoded: privateKeyB64) else {
            throw PearPassVaultError.unknown("Failed to decode private key")
        }
        let publicKeyB64 = PasskeyCrypto.exportPublicKey(privateKey.publicKey)

        // 2. Generate credential ID
        let (credentialIdData, credentialIdB64) = PasskeyCrypto.generateCredentialId()

        // 3. Build authenticator data
        let authData = AuthenticatorDataBuilder.buildForRegistration(
            rpId: request.rpId,
            credentialId: credentialIdData,
            publicKey: privateKey.publicKey
        )

        // 4. Build attestation object
        let attestationObject = AuthenticatorDataBuilder.encodeAttestationObject(authData: authData)

        // 5. Build client data JSON
        let clientDataJSON = AuthenticatorDataBuilder.buildClientDataJSONForRegistration(
            challenge: request.challenge,
            origin: "https://\(request.rpId)"
        )

        // 6. Create the credential response
        let response = PasskeyResponse(
            clientDataJSON: clientDataJSON.base64URLEncodedString(),
            attestationObject: attestationObject.base64URLEncodedString(),
            authenticatorData: authData.base64URLEncodedString(),
            publicKey: publicKeyB64,
            publicKeyAlgorithm: -7,
            transports: ["internal"]
        )

        // 7. Create the full credential
        let credential = PasskeyCredential.create(
            credentialId: credentialIdB64,
            response: response,
            privateKeyBuffer: privateKeyData,
            userId: request.userId.base64URLEncodedString()
        )

        return (credential, attestationObject, credentialIdData)
    }

    /// Activates the vault if it's not already active
    private func activateVaultIfNeeded(client: PearPassVaultClient, vault: Vault) async throws {
        let activeStatus = try await client.activeVaultGetStatus()
        if activeStatus.isInitialized && !activeStatus.isLocked {
            return
        }

        let isProtected = try await client.checkVaultIsProtected(vaultId: vault.id)

        if isProtected {
            let _ = try await client.getVaultById(vaultId: vault.id)
        } else {
            let masterEncryptionData = try await client.vaultsGet(key: "masterEncryption")
            guard let hashedPassword = masterEncryptionData["hashedPassword"] as? String else {
                throw PearPassVaultError.unknown("No hashed password available in master encryption")
            }

            let decryptedKeyResult = try await client.decryptVaultKey(
                ciphertext: masterEncryptionData["ciphertext"] as? String ?? "",
                nonce: masterEncryptionData["nonce"] as? String ?? "",
                hashedPassword: hashedPassword
            )

            guard let encryptionKey = decryptedKeyResult?["value"] as? String ??
                                     decryptedKeyResult?["key"] as? String ??
                                     decryptedKeyResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }

            _ = try await client.activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
        }
    }
}
