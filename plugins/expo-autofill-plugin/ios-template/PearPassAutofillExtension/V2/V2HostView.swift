//
//  V2HostView.swift
//  PearPassAutoFillExtension
//
//  Root SwiftUI view for the V2 assertion + registration flows
//  (mirror of ExtensionMainView and PasskeyRegistrationView combined).
//  Reuses ExtensionViewModel for auth state and bridges its @Published state
//  to the V2 view bindings.
//

import SwiftUI
import AuthenticationServices

/// iOS-version-agnostic registration context. Lets V2HostView (which targets all
/// iOS versions for assertion) accept registration data without depending on
/// PasskeyRegistrationRequest (iOS 17+).
struct V2RegistrationContext {
    let rpId: String
    let rpName: String
    let userId: Data
    let userName: String
    let userDisplayName: String
    let challenge: Data
}

struct V2HostView: View {

    @StateObject private var viewModel = ExtensionViewModel()
    @State private var vaultClient: PearPassVaultClient?
    @State private var isInitializing: Bool = true
    @State private var initialError: String?

    @State private var credentials: [VaultRecord] = []
    @State private var isLoadingCredentials: Bool = false
    @State private var isVaultDropdownOpen: Bool = false
    /// Sticky once the user has typed any non-empty query; clearing the search
    /// after that point shows the full vault instead of re-applying the
    /// initial domain filter (mirrors V1 + Android V2 behavior).
    @State private var hasUserSearched: Bool = false

    // Passkey form state (registration mode only)
    @State private var showPasskeyForm: Bool = false
    @State private var formTitleText: String = ""
    @State private var formUsername: String = ""
    @State private var formPasskeyDate: String = ""
    @State private var formWebsite: String = ""
    @State private var formComment: String = ""
    @State private var formSaveError: String?
    @State private var isSavingPasskey: Bool = false
    @State private var loadedFolders: [String] = []
    /// Set when the user picks an existing matching record on registration —
    /// causes save to fire UPDATE_PASSKEY (or refresh a pending ADD) instead
    /// of a fresh ADD_PASSKEY.
    @State private var selectedExistingRecord: VaultRecord? = nil

    let serviceIdentifiers: [ASCredentialServiceIdentifier]
    let presentationWindow: UIWindow?
    var mode: CombinedItemsMode = .assertion
    var registrationContext: V2RegistrationContext? = nil
    /// Relying-party identifier from `requestParameters.relyingPartyIdentifier`
    /// when the system invokes passkey assertion. Authoritative target for
    /// the initial domain filter on assertion — `serviceIdentifiers` is not
    /// guaranteed to be populated for passkey requests.
    var passkeyRpId: String? = nil
    let onCancel: () -> Void
    let onComplete: (String, String) -> Void
    var onCompleteRegistration: ((PasskeyCredential, Data, Data) -> Void)? = nil
    let onVaultClientCreated: ((PearPassVaultClient) -> Void)?

    var body: some View {
        ZStack {
            PPColors.surfacePrimary.ignoresSafeArea()

            if isInitializing {
                LoadingV2View()
            } else if let _ = initialError {
                ErrorBoundaryV2View(
                    title: NSLocalizedString("Autofill Error", comment: "V2 error screen title"),
                    subtitle: NSLocalizedString("Unable to initialize autofill", comment: "V2 error screen subtitle"),
                    message: NSLocalizedString("An unexpected error occurred. Please try again.", comment: "V2 error screen body"),
                    onBack: onCancel
                )
            } else if showPasskeyForm {
                passkeyFormView
            } else {
                routedView
            }
        }
        .onAppear { initializeIfNeeded() }
        .onChange(of: viewModel.searchText) { newValue in
            if !newValue.isEmpty && !hasUserSearched {
                hasUserSearched = true
            }
        }
        .animation(.easeInOut(duration: 0.25), value: viewModel.currentFlow)
        .animation(.easeInOut(duration: 0.25), value: isInitializing)
        .animation(.easeInOut(duration: 0.25), value: showPasskeyForm)
    }

    // MARK: - Routing

    @ViewBuilder
    private var routedView: some View {
        switch viewModel.currentFlow {
        case .missingConfiguration:
            MissingConfigurationV2View(onBack: onCancel)

        case .masterPassword:
            MasterPasswordV2View(
                headerTitle: mode == .registration
                    ? NSLocalizedString("Create Passkey", comment: "V2 sheet header — passkey registration")
                    : NSLocalizedString("Sign in", comment: "V2 sheet header — credential assertion"),
                password: bindingFor(\.masterPassword),
                onClose: onCancel,
                onContinue: handleMasterPasswordContinue
            )

        case .vaultSelection, .vaultPassword, .credentialsList:
            CombinedItemsV2View(
                headerTitle: mode == .registration
                    ? NSLocalizedString("Create Passkey", comment: "V2 sheet header — passkey registration")
                    : NSLocalizedString("Sign in", comment: "V2 sheet header — credential assertion"),
                mode: mode,
                searchText: bindingFor(\.searchText),
                selectedVaultId: Binding(
                    get: { viewModel.selectedVault?.id },
                    set: { newId in
                        if let id = newId,
                           let vault = viewModel.vaults.first(where: { $0.id == id }) {
                            viewModel.selectVault(vault)
                        }
                    }
                ),
                isVaultDropdownOpen: $isVaultDropdownOpen,
                vaults: viewModel.vaults.map { CombinedVaultOption(id: $0.id, name: $0.name) },
                credentials: filteredCredentials.map { record in
                    CombinedCredentialOption(
                        id: record.id,
                        title: record.data?.title ?? "(Untitled)",
                        username: record.data?.username,
                        initials: initials(for: record.data?.title)
                    )
                },
                isLoading: isLoadingCredentials,
                requiresVaultPassword: false,
                vaultPassword: bindingFor(\.vaultPassword),
                onClose: onCancel,
                onSelectVault: { vaultId in
                    if let vault = viewModel.vaults.first(where: { $0.id == vaultId }) {
                        viewModel.selectVault(vault)
                        isVaultDropdownOpen = false
                        // Switching vaults resets search state so the new vault
                        // gets a fresh initial-domain filter pass.
                        viewModel.searchText = ""
                        hasUserSearched = false
                        loadCredentials(for: vault)
                    }
                },
                onSelectCredential: handleSelectCredential,
                onAddNewLogin: handleAddNewLogin,
                onUnlockVault: {}
            )
        }
    }

    private var passkeyFormView: some View {
        PasskeyFormV2View(
            headerTitle: NSLocalizedString("Create Passkey", comment: "V2 sheet header — passkey registration"),
            titleText: $formTitleText,
            username: $formUsername,
            passkeyDate: $formPasskeyDate,
            website: $formWebsite,
            comment: $formComment,
            folderName: nil,
            saveError: formSaveError,
            isSaving: isSavingPasskey,
            onBack: { showPasskeyForm = false },
            onClose: onCancel,
            onSelectFolder: {},
            onSave: handleFormSave,
            onDiscard: { showPasskeyForm = false }
        )
    }

    // MARK: - Initialization

    private func initializeIfNeeded() {
        guard vaultClient == nil else { return }

        let client = PearPassVaultClient(debugMode: true, readOnly: true)
        vaultClient = client
        onVaultClientCreated?(client)

        Task {
            do {
                try await client.waitForInitialization()
                await initializeUser(client: client)
            } catch {
                await MainActor.run {
                    initialError = String(describing: error)
                    isInitializing = false
                }
            }
        }
    }

    private func initializeUser(client: PearPassVaultClient) async {
        do {
            let vaultsStatusRes = try await client.vaultsGetStatus()
            let masterPasswordEncryption = try await client.getMasterPasswordEncryption(vaultStatus: vaultsStatusRes)

            let passwordSet = masterPasswordEncryption != nil &&
                              masterPasswordEncryption?.ciphertext != nil &&
                              masterPasswordEncryption?.nonce != nil &&
                              masterPasswordEncryption?.salt != nil

            await MainActor.run {
                viewModel.currentFlow = passwordSet ? .masterPassword : .missingConfiguration
                isInitializing = false
            }
        } catch {
            var passwordSet = false
            if let mpe = try? await client.getMasterPasswordEncryption(vaultStatus: nil) {
                passwordSet = mpe.ciphertext != nil && mpe.nonce != nil && mpe.salt != nil
            }
            await MainActor.run {
                viewModel.currentFlow = passwordSet ? .masterPassword : .missingConfiguration
                isInitializing = false
            }
        }
    }

    // MARK: - Auth flow actions

    private func handleMasterPasswordContinue() {
        guard let client = vaultClient else { return }
        let password = viewModel.masterPassword
        guard !password.isEmpty else { return }

        Task {
            do {
                guard let passwordData = password.data(using: .utf8) else { return }
                try await client.initWithPassword(password: passwordData)
                let vaults = try await client.listVaults()
                let folders = (try? await client.listFolders()) ?? []

                await MainActor.run {
                    viewModel.vaults = vaults
                    loadedFolders = folders
                    viewModel.authenticateWithMasterPassword()
                    if let first = vaults.first {
                        viewModel.selectedVault = first
                        viewModel.currentFlow = .credentialsList(vault: first)
                        loadCredentials(for: first)
                    }
                }
            } catch {
                NSLog("[V2HostView] master-password unlock error: \(error)")
            }
        }
    }

    private func handleSelectCredential(_ id: String) {
        guard let record = credentials.first(where: { $0.id == id }) else { return }
        // Registration: tapping a matching record opens the passkey form
        // prefilled with that record so save fires UPDATE_PASSKEY (V1 parity).
        if mode == .registration {
            selectedExistingRecord = record
            formTitleText = record.data?.title ?? ""
            formUsername = record.data?.username ?? ""
            formWebsite = record.data?.websites.first ?? (registrationContext?.rpId ?? "")
            formComment = record.data?.note ?? ""
            let formatter = DateFormatter()
            formatter.dateStyle = .medium
            formPasskeyDate = formatter.string(from: Date())
            formSaveError = nil
            showPasskeyForm = true
            return
        }
        // Assertion: complete the autofill request with username/password.
        let username = record.data?.username ?? ""
        let password = record.data?.password ?? ""
        onComplete(username, password)
    }

    private func handleAddNewLogin() {
        // Brand-new record path — wipe any prior existing-record selection so
        // save creates ADD_PASSKEY rather than UPDATE_PASSKEY.
        selectedExistingRecord = nil
        formComment = ""
        // Prefill form from registration context when available.
        if let ctx = registrationContext {
            formTitleText = ctx.rpName.isEmpty ? ctx.rpId : ctx.rpName
            formUsername = ctx.userName
            formWebsite = ctx.rpId
        }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formPasskeyDate = formatter.string(from: Date())
        formSaveError = nil
        showPasskeyForm = true
    }

    // MARK: - Passkey save (registration only) — mirrors V1 handleFormSave.

    private func handleFormSave() {
        guard let ctx = registrationContext,
              let onCompleteRegistration = onCompleteRegistration,
              let client = vaultClient,
              let vault = viewModel.selectedVault else {
            formSaveError = NSLocalizedString("Missing registration context", comment: "V2 passkey save error")
            return
        }
        guard !formTitleText.trimmingCharacters(in: .whitespaces).isEmpty else {
            formSaveError = NSLocalizedString("Title is required", comment: "V2 passkey save error")
            return
        }

        isSavingPasskey = true
        formSaveError = nil

        Task {
            do {
                // 1. Generate passkey crypto.
                let (credential, attestationObject, credentialIdData) = try generatePasskey(ctx: ctx)

                // 2. Hashed password for job-file encryption.
                guard let hashedPassword = await PasskeyJobCreator.getHashedPassword(from: client) else {
                    throw PasskeyJobError.noHashedPassword
                }

                // 3. Build form data — folder preserved from existing record
                //    when updating (folder picker not yet wired in V2).
                let websites = formWebsite.isEmpty ? [] : [formWebsite]
                let formData = PasskeyFormData(
                    title: formTitleText,
                    username: formUsername,
                    websites: websites,
                    note: formComment,
                    folder: selectedExistingRecord?.folder,
                    attachments: [],
                    keepAttachmentIds: [],
                    passkeyCreatedAt: Int64(Date().timeIntervalSince1970 * 1000),
                    existingRecord: selectedExistingRecord
                )

                // 4. Pick ADD vs UPDATE flow — mirror of V1
                //    PasskeyRegistrationView.handleFormSave.
                if let existingRecord = formData.existingRecord {
                    let isPendingAdd = (try? JobFileManager.hasPendingAddJob(
                        forRecordId: existingRecord.id,
                        hashedPassword: hashedPassword
                    )) ?? false

                    // Drop any prior pending jobs for this record before
                    // queueing the replacement (V1 parity).
                    try JobFileManager.removeJobsForRecord(existingRecord.id, hashedPassword: hashedPassword)

                    if isPendingAdd {
                        // The record only exists as a pending ADD — replace it
                        // with a fresh ADD carrying the new passkey instead of
                        // emitting an UPDATE against a record that isn't in the DB.
                        _ = try PasskeyJobCreator.createAddPasskeyJob(
                            vaultId: vault.id,
                            credential: credential,
                            formData: formData,
                            rpId: ctx.rpId,
                            rpName: ctx.rpName,
                            userId: ctx.userId.base64URLEncodedString(),
                            userName: ctx.userName,
                            userDisplayName: ctx.userDisplayName,
                            hashedPassword: hashedPassword
                        )
                    } else {
                        _ = try PasskeyJobCreator.createUpdatePasskeyJob(
                            vaultId: vault.id,
                            existingRecordId: existingRecord.id,
                            credential: credential,
                            formData: formData,
                            rpId: ctx.rpId,
                            rpName: ctx.rpName,
                            userId: ctx.userId.base64URLEncodedString(),
                            userName: ctx.userName,
                            userDisplayName: ctx.userDisplayName,
                            hashedPassword: hashedPassword,
                            passkeyCreatedAt: formData.passkeyCreatedAt
                        )
                    }
                } else {
                    _ = try PasskeyJobCreator.createAddPasskeyJob(
                        vaultId: vault.id,
                        credential: credential,
                        formData: formData,
                        rpId: ctx.rpId,
                        rpName: ctx.rpName,
                        userId: ctx.userId.base64URLEncodedString(),
                        userName: ctx.userName,
                        userDisplayName: ctx.userDisplayName,
                        hashedPassword: hashedPassword
                    )
                }

                // 5. Hand control back to the system — passkey is ready.
                await MainActor.run {
                    isSavingPasskey = false
                    onCompleteRegistration(credential, attestationObject, credentialIdData)
                }
            } catch {
                NSLog("[V2HostView] Save error: \(error)")
                await MainActor.run {
                    isSavingPasskey = false
                    formSaveError = NSLocalizedString("Failed to save passkey", comment: "V2 passkey save error")
                }
            }
        }
    }

    /// Generates a passkey + authenticator data + attestation object.
    /// Mirrors V1 PasskeyRegistrationView.generatePasskey().
    private func generatePasskey(ctx: V2RegistrationContext) throws -> (PasskeyCredential, Data, Data) {
        let privateKey = PasskeyCrypto.generatePrivateKey()
        let privateKeyB64 = PasskeyCrypto.exportPrivateKey(privateKey)
        guard let privateKeyData = Data(base64URLEncoded: privateKeyB64) else {
            throw PearPassVaultError.unknown("Failed to decode private key")
        }
        let publicKeyB64 = PasskeyCrypto.exportPublicKey(privateKey.publicKey)

        let (credentialIdData, credentialIdB64) = PasskeyCrypto.generateCredentialId()

        let authData = AuthenticatorDataBuilder.buildForRegistration(
            rpId: ctx.rpId,
            credentialId: credentialIdData,
            publicKey: privateKey.publicKey
        )

        let attestationObject = AuthenticatorDataBuilder.encodeAttestationObject(authData: authData)

        let clientDataJSON = AuthenticatorDataBuilder.buildClientDataJSONForRegistration(
            challenge: ctx.challenge,
            origin: "https://\(ctx.rpId)"
        )

        let response = PasskeyResponse(
            clientDataJSON: clientDataJSON.base64URLEncodedString(),
            attestationObject: attestationObject.base64URLEncodedString(),
            authenticatorData: authData.base64URLEncodedString(),
            publicKey: publicKeyB64,
            publicKeyAlgorithm: -7,
            transports: ["internal"]
        )

        let credential = PasskeyCredential.create(
            credentialId: credentialIdB64,
            response: response,
            privateKeyBuffer: privateKeyData,
            userId: ctx.userId.base64URLEncodedString()
        )

        return (credential, attestationObject, credentialIdData)
    }

    // MARK: - Data loading

    /// Mirrors V1's two flows:
    ///  - Registration → searchLoginRecords(rpId:username:) to surface existing
    ///    matches (including passkeys) for the relying party.
    ///  - Assertion → activeVaultList("record/") + domain filter (filteredCredentials).
    /// In both modes pending passkey jobs (not yet processed by the main app)
    /// are merged in so freshly-registered passkeys appear immediately.
    private func loadCredentials(for vault: Vault) {
        guard let client = vaultClient else { return }
        Task {
            await MainActor.run { isLoadingCredentials = true }
            do {
                let records = try await fetchVaultRecords(client: client, vault: vault)

                let pending = await loadPendingPasskeysFromJobs(
                    vaultClient: client,
                    existingRecords: records
                )
                let pendingIds = Set(pending.map { $0.id })
                let merged = records.filter { !pendingIds.contains($0.id) } + pending

                await MainActor.run {
                    credentials = merged
                    isLoadingCredentials = false
                }
            } catch {
                NSLog("[V2HostView] loadCredentials error: \(error)")
                await MainActor.run {
                    credentials = []
                    isLoadingCredentials = false
                }
            }
        }
    }

    /// Fetch records, attempting the listing first (works when the vault is
    /// already active after `initWithPassword`) and falling back to a manual
    /// vault activation on failure. Mirrors V1 CredentialsListView two-stage
    /// load — registration mode uses `searchLoginRecords` for rpId/username
    /// scoped results, assertion mode uses the full `activeVaultList`.
    private func fetchVaultRecords(client: PearPassVaultClient, vault: Vault) async throws -> [VaultRecord] {
        if mode == .registration, let ctx = registrationContext {
            do {
                return try await client.searchLoginRecords(rpId: ctx.rpId, username: ctx.userName)
            } catch {
                try await activateVault(client: client, vault: vault)
                return try await client.searchLoginRecords(rpId: ctx.rpId, username: ctx.userName)
            }
        }
        do {
            return try await client.activeVaultList(filterKey: "record/")
        } catch {
            try await activateVault(client: client, vault: vault)
            return try await client.activeVaultList(filterKey: "record/")
        }
    }

    /// Vault activation ladder mirroring V1: protected vaults open via
    /// `getVaultById`; unprotected vaults decrypt their key from
    /// `masterEncryption` then `activeVaultInit`. Throws on failure so the
    /// caller can surface the empty state.
    private func activateVault(client: PearPassVaultClient, vault: Vault) async throws {
        let isProtected = try await client.checkVaultIsProtected(vaultId: vault.id)
        if isProtected {
            _ = try await client.getVaultById(vaultId: vault.id)
            return
        }
        let masterEncryption = try await client.vaultsGet(key: "masterEncryption")
        guard let hashedPassword = masterEncryption["hashedPassword"] as? String else {
            throw PearPassVaultError.unknown("No hashed password available in master encryption")
        }
        let decryptedKey = try await client.decryptVaultKey(
            ciphertext: masterEncryption["ciphertext"] as? String ?? "",
            nonce: masterEncryption["nonce"] as? String ?? "",
            hashedPassword: hashedPassword
        )
        guard let encryptionKey = decryptedKey?["value"] as? String
            ?? decryptedKey?["key"] as? String
            ?? decryptedKey?["data"] as? String else {
            throw PearPassVaultError.decryptionFailed
        }
        _ = try await client.activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
    }

    /// Decode pending ADD_PASSKEY / UPDATE_PASSKEY jobs from the encrypted job
    /// file into VaultRecord objects so newly-registered passkeys are visible
    /// before the main app processes the job queue. Mirror of V1
    /// CredentialsListView.loadPendingPasskeysFromJobs.
    private func loadPendingPasskeysFromJobs(
        vaultClient: PearPassVaultClient,
        existingRecords: [VaultRecord]
    ) async -> [VaultRecord] {
        guard JobFileManager.jobFileExists() else { return [] }

        guard let hashedPassword = await PasskeyJobCreator.getHashedPassword(from: vaultClient) else {
            NSLog("[V2HostView] Could not get hashed password for job file decryption")
            return []
        }

        do {
            let jobs = try JobFileManager.readJobs(hashedPassword: hashedPassword)
            // Only block ADD jobs whose recordId already has a passkey; password-only
            // records should not suppress an incoming passkey.
            let existingPasskeyIds = Set(existingRecords.compactMap { record -> String? in
                guard record.data?.credential != nil else { return nil }
                return record.id
            })

            var pending: [VaultRecord] = []

            for job in jobs where job.status == .pending || job.status == .inProgress {
                switch job.payload {
                case .addPasskey(let payload):
                    guard !existingPasskeyIds.contains(payload.recordId) else { continue }
                    guard let credential = passkeyCredentialFromJobPayload(
                        credentialId: payload.credentialId,
                        publicKey: payload.publicKey,
                        privateKey: payload.privateKey,
                        clientDataJSON: payload.clientDataJSON,
                        attestationObject: payload.attestationObject,
                        authenticatorData: payload.authenticatorData,
                        algorithm: payload.algorithm,
                        transports: payload.transports,
                        userId: payload.userId
                    ) else { continue }

                    let websites = payload.websites ?? ["https://\(payload.rpId)"]
                    let recordData = RecordData(
                        title: payload.title ?? payload.rpName,
                        username: payload.userName,
                        password: "",
                        passwordUpdatedAt: 0,
                        passkeyCreatedAt: Int64(payload.createdAt),
                        credential: credential,
                        note: payload.note ?? "",
                        websites: websites,
                        customFields: [],
                        attachments: []
                    )
                    let record = VaultRecord(
                        id: payload.recordId,
                        version: 1,
                        type: "login",
                        vaultId: job.vaultId,
                        data: recordData,
                        isFavorite: false,
                        createdAt: Int64(payload.createdAt),
                        updatedAt: Int64(job.updatedAt),
                        folder: payload.folder
                    )
                    pending.append(record)

                case .updatePasskey(let payload):
                    guard let credential = passkeyCredentialFromJobPayload(
                        credentialId: payload.credentialId,
                        publicKey: payload.publicKey,
                        privateKey: payload.privateKey,
                        clientDataJSON: payload.clientDataJSON,
                        attestationObject: payload.attestationObject,
                        authenticatorData: payload.authenticatorData,
                        algorithm: payload.algorithm,
                        transports: payload.transports,
                        userId: payload.userId
                    ) else { continue }

                    if let existingRecord = existingRecords.first(where: { $0.id == payload.existingRecordId }),
                       let existingData = existingRecord.data {
                        let augmentedData = RecordData(
                            title: existingData.title,
                            username: existingData.username,
                            password: existingData.password,
                            passwordUpdatedAt: existingData.passwordUpdatedAt,
                            passkeyCreatedAt: Int64(payload.createdAt),
                            credential: credential,
                            note: existingData.note,
                            websites: existingData.websites,
                            customFields: existingData.customFields,
                            attachments: existingData.attachments
                        )
                        let augmentedRecord = VaultRecord(
                            id: existingRecord.id,
                            version: existingRecord.version,
                            type: existingRecord.type,
                            vaultId: existingRecord.vaultId,
                            data: augmentedData,
                            isFavorite: existingRecord.isFavorite,
                            createdAt: existingRecord.createdAt,
                            updatedAt: existingRecord.updatedAt,
                            folder: existingRecord.folder
                        )
                        pending.append(augmentedRecord)
                    } else {
                        let websites = ["https://\(payload.rpId)"]
                        let recordData = RecordData(
                            title: payload.rpName,
                            username: payload.userName,
                            password: "",
                            passwordUpdatedAt: 0,
                            passkeyCreatedAt: Int64(payload.createdAt),
                            credential: credential,
                            note: payload.note ?? "",
                            websites: websites,
                            customFields: [],
                            attachments: []
                        )
                        let record = VaultRecord(
                            id: payload.existingRecordId,
                            version: 1,
                            type: "login",
                            vaultId: payload.vaultId,
                            data: recordData,
                            isFavorite: false,
                            createdAt: Int64(payload.createdAt),
                            updatedAt: Int64(job.updatedAt),
                            folder: nil
                        )
                        pending.append(record)
                    }
                }
            }

            return pending
        } catch {
            NSLog("[V2HostView] Failed to read pending jobs: \(error.localizedDescription)")
            return []
        }
    }

    private func passkeyCredentialFromJobPayload(
        credentialId: String,
        publicKey: String,
        privateKey: String,
        clientDataJSON: String,
        attestationObject: String,
        authenticatorData: String,
        algorithm: Int,
        transports: [String],
        userId: String
    ) -> PasskeyCredential? {
        guard let privateKeyData = Data(base64URLEncoded: privateKey) else {
            NSLog("[V2HostView] Failed to decode private key from job payload")
            return nil
        }
        return PasskeyCredential.create(
            credentialId: credentialId,
            response: PasskeyResponse(
                clientDataJSON: clientDataJSON,
                attestationObject: attestationObject,
                authenticatorData: authenticatorData,
                publicKey: publicKey,
                publicKeyAlgorithm: algorithm,
                transports: transports
            ),
            privateKeyBuffer: privateKeyData,
            userId: userId
        )
    }

    // MARK: - Helpers

    /// Three-branch filter mirroring Android CombinedItemsFragment.applyFilter
    /// and V1 CredentialsListView.filteredCredentials:
    ///   1. searchText non-empty   → title/username substring match
    ///   2. searchText empty, !hasUserSearched → initial domain filter (with
    ///      fall-through to all records when nothing matches)
    ///   3. searchText empty,  hasUserSearched → all records (sticky)
    private var filteredCredentials: [VaultRecord] {
        let query = viewModel.searchText.trimmingCharacters(in: .whitespaces)
        if !query.isEmpty {
            let q = query.lowercased()
            return credentials.filter { record in
                let title = (record.data?.title ?? "").lowercased()
                let username = (record.data?.username ?? "").lowercased()
                return title.contains(q) || username.contains(q)
            }
        }

        if hasUserSearched { return credentials }

        guard let target = targetDomain, !target.isEmpty else { return credentials }
        let t = target.lowercased()
        let matching = credentials.filter { record in
            let websites = record.data?.websites ?? []
            for site in websites {
                let domain = extractDomain(from: site).lowercased()
                if domain == t || domain.hasSuffix(".\(t)") || t.hasSuffix(".\(domain)") {
                    return true
                }
            }
            return false
        }
        return matching.isEmpty ? credentials : matching
    }

    private var targetDomain: String? {
        if let ctx = registrationContext { return ctx.rpId }
        // Passkey assertion: rpId is authoritative.
        if let rpId = passkeyRpId, !rpId.isEmpty { return rpId }
        // Password assertion: pull domain from first ASCredentialServiceIdentifier.
        if let first = serviceIdentifiers.first {
            return extractDomain(from: first.identifier)
        }
        return nil
    }

    /// Mirrors V1 CredentialsListView.extractDomain — protocol, path, port,
    /// www. prefix stripped and result lowercased so domain comparisons in
    /// the initial filter survive www-prefixed websites.
    private func extractDomain(from urlOrHost: String) -> String {
        var s = urlOrHost.lowercased()
        if let r = s.range(of: "://") { s = String(s[r.upperBound...]) }
        if let slash = s.firstIndex(of: "/") { s = String(s[..<slash]) }
        if let colon = s.firstIndex(of: ":") { s = String(s[..<colon]) }
        if s.hasPrefix("www.") { s = String(s.dropFirst(4)) }
        return s
    }

    private func initials(for title: String?) -> String {
        guard let title = title, !title.isEmpty else { return "?" }
        let words = title.split(separator: " ")
        if words.count >= 2,
           let firstChar = words[0].first,
           let secondChar = words[1].first {
            return String(firstChar).uppercased() + String(secondChar).uppercased()
        }
        return String(title.prefix(2)).uppercased()
    }

    private func bindingFor(_ keyPath: ReferenceWritableKeyPath<ExtensionViewModel, String>) -> Binding<String> {
        Binding(
            get: { viewModel[keyPath: keyPath] },
            set: { viewModel[keyPath: keyPath] = $0 }
        )
    }
}
