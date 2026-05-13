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
    /// Mirrors V1 ExtensionMainView's InitializationState.shared — guards
    /// against concurrent init when SwiftUI re-runs `.onAppear` (sheet
    /// remounts, body re-render, etc.). Cheaper than a singleton for V2's
    /// per-invocation lifecycle but covers the same race.
    @State private var hasStartedInitialization: Bool = false
    /// Mirrors V1 PasskeyRegistrationView's `isClosing` overlay — the
    /// extension cleanup runs synchronously before the sheet dismisses, so
    /// briefly painting "Closing..." gives the user feedback that the
    /// cancel/dismiss intent registered.
    @State private var isClosing: Bool = false

    @State private var credentials: [VaultRecord] = []
    @State private var isLoadingCredentials: Bool = false
    @State private var isVaultDropdownOpen: Bool = false
    /// True while initWithPassword / initWithCredentials is in flight from
    /// either the master-password Continue button or the Face ID button.
    /// Drives the spinner label and the disabled state on both buttons.
    @State private var isAuthenticating: Bool = false
    /// Inline error message rendered under the password field on the master
    /// password screen — invalid password, missing keychain data, biometric
    /// cancel, etc. Cleared when a new auth attempt starts.
    @State private var masterPasswordError: String? = nil
    /// Sticky once the user has typed any non-empty query; clearing the search
    /// after that point shows the full vault instead of re-applying the
    /// initial domain filter (mirrors V1 + Android V2 behavior).
    @State private var hasUserSearched: Bool = false

    // Passkey form state (registration mode only)
    @State private var showPasskeyForm: Bool = false
    @State private var formTitleText: String = ""
    @State private var formUsername: String = ""
    @State private var formPasskeyDate: String = ""
    @State private var formWebsites: [String] = [""]
    @State private var formFolder: String? = nil
    /// Folders pulled from `client.listFolders()` after a successful unlock.
    /// Drives the folder picker dialog inside the passkey form.
    @State private var loadedFolders: [String] = []
    @State private var formComment: String = ""
    @State private var formSaveError: String?
    /// Inline error under the websites card on URL validation failure.
    @State private var formWebsiteError: String? = nil
    @State private var isSavingPasskey: Bool = false
    /// Set when the user picks an existing matching record on registration —
    /// causes save to fire UPDATE_PASSKEY (or refresh a pending ADD) instead
    /// of a fresh ADD_PASSKEY.
    @State private var selectedExistingRecord: VaultRecord? = nil

    /// New attachments queued in the form (not yet persisted) — uploaded via
    /// the document picker. Mirrors V1 PasskeyFormView.attachments.
    @State private var formAttachments: [AttachmentFile] = []
    /// Attachments that already exist on `selectedExistingRecord`. The user can
    /// remove rows individually; surviving IDs flow into `keepAttachmentIds`
    /// on save so UPDATE_PASSKEY preserves them. Mirrors V1
    /// PasskeyFormView.existingAttachments.
    @State private var formExistingAttachments: [AttachmentMetadata] = []
    /// Inline error rendered in the form footer when an upload exceeds the
    /// 6 MB cap (V1 parity).
    @State private var formFileSizeError: String? = nil

    /// Confirmation state for the "Replace Passkey" alert — V1 parity. When
    /// the user picks a registration match that already has a passkey, we
    /// stash the record here and prompt before opening the form.
    @State private var pendingReplacePasskeyRecord: VaultRecord? = nil
    @State private var showReplacePasskeyAlert: Bool = false

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
    /// Set when the system invokes passkey assertion (iOS 17+). Tapping a
    /// passkey row routes here instead of `onComplete` so the extension
    /// returns an ASPasskeyAssertionCredential with a valid signed
    /// assertion — the same code path V1 took via `onPasskeySelected`.
    var onCompletePasskeyAssertion: ((PasskeyCredential) -> Void)? = nil
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
                    onBack: handleClose
                )
            } else if showPasskeyForm {
                passkeyFormView
            } else {
                routedView
            }

            if isClosing {
                Color.black.opacity(0.6).ignoresSafeArea()
                VStack(spacing: PPSpacing.s12) {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(PPColors.primary)
                        .scaleEffect(1.2)
                    Text(NSLocalizedString("Closing...", comment: "Cleanup overlay text"))
                        .font(PPTypography.label)
                        .foregroundColor(PPColors.textPrimary)
                }
                .padding(PPSpacing.s24)
                .background(
                    RoundedRectangle(cornerRadius: PPRadii.r16)
                        .fill(PPColors.surfacePrimary)
                )
            }

        }
        // Toast lives as an overlay on the outer ZStack rather than as a
        // ZStack child so the body's hit-test tree (and SwiftUI focus
        // handling for the password field) isn't reshuffled when the toast
        // appears/dismisses. Without this, the SecureField loses focus and
        // becomes uneditable on toast dismissal.
        .overlay(alignment: .top) {
            if let toast = masterPasswordError, !toast.isEmpty {
                HStack(spacing: PPSpacing.s8) {
                    Image("Icons/AppLogo", bundle: .main)
                        .resizable()
                        .frame(width: 24, height: 24)
                    Text(toast)
                        .font(PPTypography.label)
                        .foregroundColor(PPColors.textPrimary)
                        .multilineTextAlignment(.leading)
                }
                .padding(.horizontal, PPSpacing.s16)
                .padding(.vertical, PPSpacing.s12)
                .background(
                    RoundedRectangle(cornerRadius: PPRadii.r20)
                        .fill(PPColors.surfacePrimary)
                        .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 2)
                )
                .padding(.top, PPSpacing.s16)
                .transition(.move(edge: .top).combined(with: .opacity))
                .allowsHitTesting(false)
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
        .animation(.easeInOut(duration: 0.2), value: isClosing)
        .animation(.spring(response: 0.35, dampingFraction: 0.85), value: masterPasswordError)
        .alert(
            NSLocalizedString("Replace Passkey", comment: "V2 replace passkey alert title"),
            isPresented: $showReplacePasskeyAlert
        ) {
            Button(NSLocalizedString("Cancel", comment: "Cancel button"), role: .cancel) {
                pendingReplacePasskeyRecord = nil
            }
            Button(NSLocalizedString("Replace", comment: "V2 replace passkey confirm button"), role: .destructive) {
                if let record = pendingReplacePasskeyRecord {
                    openPasskeyFormForExisting(record: record)
                }
                pendingReplacePasskeyRecord = nil
            }
        } message: {
            Text(NSLocalizedString("This login already has a passkey. Do you want to replace it?", comment: "V2 replace passkey alert message"))
        }
    }

    /// Surfaces an auth error in the toast overlay for 3 seconds then clears
    /// it (V1 parity — see MasterPasswordView.showToastMessage). Cancelling
    /// any existing dismissal lets a quick second error replace the first
    /// instead of compounding the timer.
    private func showAuthErrorToast(_ message: String) {
        masterPasswordError = message
        let snapshot = message
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            if masterPasswordError == snapshot {
                masterPasswordError = nil
            }
        }
    }

    /// Mirrors V1 PasskeyRegistrationView.handleCancel — paints the closing
    /// overlay before dispatching the actual onCancel so the user sees the
    /// dismiss register before the sheet animates away.
    private func handleClose() {
        isClosing = true
        onCancel()
    }

    // MARK: - Routing

    @ViewBuilder
    private var routedView: some View {
        switch viewModel.currentFlow {
        case .missingConfiguration:
            MissingConfigurationV2View(onBack: handleClose)

        case .masterPassword:
            MasterPasswordV2View(
                headerTitle: mode == .registration
                    ? NSLocalizedString("Add a passkey", comment: "V2 master password header — registration")
                    : NSLocalizedString("Sign in", comment: "V2 sheet header — credential assertion"),
                password: bindingFor(\.masterPassword),
                isAuthenticating: isAuthenticating,
                onClose: handleClose,
                onContinue: handleMasterPasswordContinue,
                onFaceIDLogin: handleFaceIDLogin,
                onPasskeyLogin: handlePasskeyLogin
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
                onClose: handleClose,
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
                onAddNewLogin: handleAddNewLogin
            )
        }
    }

    private var passkeyFormView: some View {
        PasskeyFormV2View(
            headerTitle: NSLocalizedString("Create Passkey", comment: "V2 sheet header — passkey registration"),
            titleText: $formTitleText,
            username: $formUsername,
            passkeyDate: $formPasskeyDate,
            websites: $formWebsites,
            comment: $formComment,
            selectedFolder: $formFolder,
            availableFolders: loadedFolders,
            attachments: $formAttachments,
            existingAttachments: $formExistingAttachments,
            fileSizeError: $formFileSizeError,
            websiteError: $formWebsiteError,
            saveError: formSaveError,
            isSaving: isSavingPasskey,
            onBack: { showPasskeyForm = false },
            onClose: handleClose,
            onSave: handleFormSave,
            onDiscard: { showPasskeyForm = false }
        )
    }

    // MARK: - Initialization

    private func initializeIfNeeded() {
        guard vaultClient == nil, !hasStartedInitialization else { return }
        hasStartedInitialization = true

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

            // Mirrors V1 — registration mode (PasskeyRegistrationView) skips
            // the master-password prompt when the vault is already unlocked
            // by the main app. Assertion mode (ExtensionMainView) does NOT
            // skip even when logged in (V1 keeps the masterPassword flow).
            let loggedIn = vaultsStatusRes.isInitialized && !vaultsStatusRes.isLocked

            if !passwordSet {
                await MainActor.run {
                    viewModel.currentFlow = .missingConfiguration
                    isInitializing = false
                }
                return
            }

            if !loggedIn || mode == .assertion {
                await MainActor.run {
                    viewModel.currentFlow = .masterPassword
                    isInitializing = false
                }
                return
            }

            // Registration + logged in — pull the vault list and route
            // directly to CombinedItemsV2View on the first vault.
            let vaults = try await client.listVaults()
            await MainActor.run {
                let sortedVaults = sortedByMostRecent(vaults)
                viewModel.vaults = sortedVaults
                viewModel.authenticateWithMasterPassword()
                if let first = sortedVaults.first {
                    viewModel.selectedVault = first
                    viewModel.currentFlow = .credentialsList(vault: first)
                    loadCredentials(for: first)
                } else {
                    // Edge case — logged in but no vaults; fall back to
                    // master password screen so the user gets feedback.
                    viewModel.currentFlow = .masterPassword
                }
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
        guard let client = vaultClient else {
            showAuthErrorToast(NSLocalizedString("Vault client not initialized", comment: "Vault client init error"))
            return
        }
        let password = viewModel.masterPassword
        guard !password.isEmpty else { return }

        isAuthenticating = true
        masterPasswordError = nil

        Task {
            do {
                guard let passwordData = password.data(using: .utf8) else {
                    await MainActor.run { isAuthenticating = false }
                    return
                }
                try await client.initWithPassword(password: passwordData)
                let vaults = try await client.listVaults()

                await MainActor.run {
                    isAuthenticating = false
                    let sortedVaults = sortedByMostRecent(vaults)
                    viewModel.vaults = sortedVaults
                    viewModel.authenticateWithMasterPassword()
                    if let first = sortedVaults.first {
                        viewModel.selectedVault = first
                        viewModel.currentFlow = .credentialsList(vault: first)
                        loadCredentials(for: first)
                    }
                }
            } catch {
                NSLog("[V2HostView] master-password unlock error: \(error)")
                await MainActor.run {
                    isAuthenticating = false
                    showAuthErrorToast(NSLocalizedString("Invalid master password", comment: "Invalid master password error"))
                }
            }
        }
    }

    /// Mirrors V1 MasterPasswordView.handleFaceIDLogin — fetch the keychain
    /// encryption blob behind a biometric prompt, then unlock the vault via
    /// initWithCredentials. Errors are surfaced inline; the user can fall
    /// back to the password field if biometric auth fails or is canceled.
    private func handleFaceIDLogin() {
        guard let client = vaultClient else {
            showAuthErrorToast(NSLocalizedString("Vault client not initialized", comment: "Vault client init error"))
            return
        }

        // Resign first responder before iOS hands off to the biometric
        // prompt — the SecureField holds it and SwiftUI doesn't restore
        // it cleanly when the prompt dismisses, leaving the input visually
        // focused but unable to receive keystrokes. UIApplication.shared
        // is unavailable in app extensions, so dismiss via the window the
        // controller passed in.
        presentationWindow?.endEditing(true)

        isAuthenticating = true
        masterPasswordError = nil

        Task {
            do {
                guard let encryptionData = try await KeychainHelper.shared.getEncryptionData(withBiometricAuth: true) else {
                    await MainActor.run {
                        isAuthenticating = false
                        showAuthErrorToast(NSLocalizedString("Failed to retrieve encryption data", comment: "Failed to retrieve encryption data error"))
                    }
                    return
                }

                try await client.initWithCredentials(
                    ciphertext: encryptionData.ciphertext,
                    nonce: encryptionData.nonce,
                    hashedPassword: encryptionData.hashedPassword
                )

                let vaults = try await client.listVaults()

                await MainActor.run {
                    isAuthenticating = false
                    let sortedVaults = sortedByMostRecent(vaults)
                    viewModel.vaults = sortedVaults
                    viewModel.authenticateWithMasterPassword()
                    if let first = sortedVaults.first {
                        viewModel.selectedVault = first
                        viewModel.currentFlow = .credentialsList(vault: first)
                        loadCredentials(for: first)
                    }
                }
            } catch {
                NSLog("[V2HostView] Face ID unlock error: \(error)")
                await MainActor.run {
                    isAuthenticating = false
                    let nsError = error as NSError
                    if nsError.code == -128 {
                        showAuthErrorToast(NSLocalizedString("Authentication canceled", comment: "Biometric auth canceled"))
                    } else {
                        showAuthErrorToast(NSLocalizedString("Face ID authentication failed", comment: "Face ID auth failed error"))
                    }
                }
            }
        }
    }

    /// Mirrors V1 MasterPasswordView.handlePasskeyLogin (iOS 16+) — invoke
    /// PasskeyHelper which prompts the system passkey UI and returns the
    /// vault encryption blob from the registered passkey's largeBlob, then
    /// unlock via initWithCredentials.
    private func handlePasskeyLogin() {
        guard #available(iOS 16.0, *) else { return }
        guard let client = vaultClient else {
            showAuthErrorToast(NSLocalizedString("Vault client not initialized", comment: "Vault client init error"))
            return
        }
        guard let window = presentationWindow else {
            showAuthErrorToast(NSLocalizedString("Unable to get presentation window", comment: "Missing window error"))
            return
        }
        // Same first-responder dance as handleFaceIDLogin — release before
        // the system passkey prompt steals input focus.
        presentationWindow?.endEditing(true)

        isAuthenticating = true
        masterPasswordError = nil

        Task {
            do {
                let encryptionData = try await PasskeyHelper.shared.authenticateWithPasskey(presentationAnchor: window)
                guard let encryptionData = encryptionData,
                      let hashedPassword = encryptionData.hashedPassword else {
                    await MainActor.run {
                        isAuthenticating = false
                        showAuthErrorToast(NSLocalizedString("Failed to retrieve encryption data from passkey", comment: "Missing largeBlob error"))
                    }
                    return
                }

                try await client.initWithCredentials(
                    ciphertext: encryptionData.ciphertext,
                    nonce: encryptionData.nonce,
                    hashedPassword: hashedPassword
                )

                let vaults = try await client.listVaults()

                await MainActor.run {
                    isAuthenticating = false
                    let sortedVaults = sortedByMostRecent(vaults)
                    viewModel.vaults = sortedVaults
                    viewModel.authenticateWithMasterPassword()
                    if let first = sortedVaults.first {
                        viewModel.selectedVault = first
                        viewModel.currentFlow = .credentialsList(vault: first)
                        loadCredentials(for: first)
                    }
                }
            } catch {
                NSLog("[V2HostView] Passkey unlock error: \(error)")
                await MainActor.run {
                    isAuthenticating = false
                    let nsError = error as NSError
                    if nsError.code == -128 {
                        showAuthErrorToast(NSLocalizedString("Authentication canceled", comment: "Passkey auth canceled"))
                    } else {
                        showAuthErrorToast(NSLocalizedString("Passkey authentication failed", comment: "Passkey auth failed error"))
                    }
                }
            }
        }
    }

    private func handleSelectCredential(_ id: String) {
        guard let record = credentials.first(where: { $0.id == id }) else { return }
        // Registration: tapping a matching record that already has a passkey
        // first prompts the user to confirm replacement (V1 parity, see
        // ExistingCredentialSelectionView). Records without an existing
        // passkey skip the alert and open the form directly.
        if mode == .registration {
            if record.data?.credential != nil {
                pendingReplacePasskeyRecord = record
                showReplacePasskeyAlert = true
                return
            }
            openPasskeyFormForExisting(record: record)
            return
        }
        // Assertion: passkey records sign an assertion; password records
        // complete with username + password. Mirrors V1 CredentialsListView
        // which routed passkey rows through onPasskeySelected and password
        // rows through onComplete; V2 dispatches by record type instead of
        // by separate sections.
        if let passkeyCredential = record.data?.credential,
           let onCompletePasskeyAssertion = onCompletePasskeyAssertion {
            onCompletePasskeyAssertion(passkeyCredential)
            return
        }
        let username = record.data?.username ?? ""
        let password = record.data?.password ?? ""
        onComplete(username, password)
    }

    private func handleAddNewLogin() {
        // Brand-new record path — wipe any prior existing-record selection so
        // save creates ADD_PASSKEY rather than UPDATE_PASSKEY.
        selectedExistingRecord = nil
        formComment = ""
        formFolder = nil
        formAttachments = []
        formExistingAttachments = []
        formFileSizeError = nil
        // Prefill form from registration context when available.
        if let ctx = registrationContext {
            formTitleText = ctx.rpName.isEmpty ? ctx.rpId : ctx.rpName
            formUsername = ctx.userName
            formWebsites = [ctx.rpId]
        } else {
            formWebsites = [""]
        }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formPasskeyDate = formatter.string(from: Date())
        formSaveError = nil
        formWebsiteError = nil
        showPasskeyForm = true
    }

    /// Prefills the form for an existing record and routes to it. Extracted
    /// from `handleSelectCredential` so the "Replace Passkey" alert confirm
    /// path can reuse it.
    private func openPasskeyFormForExisting(record: VaultRecord) {
        selectedExistingRecord = record
        formTitleText = record.data?.title ?? ""
        formUsername = record.data?.username ?? ""
        let recordWebsites = record.data?.websites ?? []
        if recordWebsites.isEmpty {
            formWebsites = [registrationContext?.rpId ?? ""]
        } else {
            formWebsites = recordWebsites
        }
        formFolder = record.folder
        formComment = record.data?.note ?? ""
        formExistingAttachments = record.data?.attachments ?? []
        formAttachments = []
        formFileSizeError = nil
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formPasskeyDate = formatter.string(from: Date())
        formSaveError = nil
        formWebsiteError = nil
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

        // Validate website entries — first malformed one blocks save.
        formWebsiteError = nil
        let trimmedWebsites = formWebsites.map { $0.trimmingCharacters(in: .whitespaces) }
        for entry in trimmedWebsites where !entry.isEmpty {
            let candidate = addHttps(entry)
            guard let host = URL(string: candidate)?.host, host.contains(".") else {
                formWebsiteError = NSLocalizedString("Wrong format of website", comment: "V2 website validation error")
                return
            }
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

                // 3. Build form data — drop empty rows, normalize via addHttps.
                let websites = trimmedWebsites
                    .filter { !$0.isEmpty }
                    .map { self.addHttps($0) }
                let formData = PasskeyFormData(
                    title: formTitleText,
                    username: formUsername,
                    websites: websites,
                    note: formComment,
                    folder: formFolder ?? selectedExistingRecord?.folder,
                    attachments: formAttachments,
                    keepAttachmentIds: formExistingAttachments.map { $0.id },
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
            // Spinner only on initial load — switches keep stale items visible until swap.
            let showLoader = await MainActor.run { credentials.isEmpty }
            if showLoader {
                await MainActor.run { isLoadingCredentials = true }
            }
            do {
                let records = try await fetchVaultRecords(client: client, vault: vault)

                // Folders must be fetched while the vault is active —
                // `client.listFolders()` returns empty otherwise. Vault
                // activation happens inside `fetchVaultRecords`, so this
                // call is guaranteed to run with an active vault.
                let folders = (try? await client.listFolders()) ?? []

                // Registration mode scopes the pending-job merge to rpId +
                // userName so passkeys queued for unrelated sites don't
                // surface in the existing-matches list. Assertion mode keeps
                // the merge unscoped — the domain filter in
                // `filteredCredentials` handles that side.
                let pending = await loadPendingPasskeysFromJobs(
                    vaultClient: client,
                    existingRecords: records,
                    currentVaultId: viewModel.selectedVault?.id,
                    filterRpId: mode == .registration ? registrationContext?.rpId : nil,
                    filterUserName: mode == .registration ? registrationContext?.userName : nil
                )
                let pendingIds = Set(pending.map { $0.id })
                let merged = records.filter { !pendingIds.contains($0.id) } + pending

                await MainActor.run {
                    credentials = merged
                    loadedFolders = folders
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

    /// Activate target vault first so dropdown switches rebind correctly,
    /// then fetch (search for registration, full list for assertion).
    private func fetchVaultRecords(client: PearPassVaultClient, vault: Vault) async throws -> [VaultRecord] {
        try await activateVault(client: client, vault: vault)
        if mode == .registration, let ctx = registrationContext {
            return try await client.searchLoginRecords(rpId: ctx.rpId, username: ctx.userName)
        }
        return try await client.activeVaultList(filterKey: "record/")
    }

    /// Protected vaults: `getVaultById` (handles close internally).
    /// Unprotected: explicit `activeVaultClose` then `activeVaultInit`
    /// so switches rebind instead of leaving the prior vault active.
    private func activateVault(client: PearPassVaultClient, vault: Vault) async throws {
        // Already active — skip.
        if let activeId = try? await currentActiveVaultId(client: client),
           activeId == vault.id {
            return
        }

        let isProtected = try await client.checkVaultIsProtected(vaultId: vault.id)
        if isProtected {
            _ = try await client.getVaultById(vaultId: vault.id)
            return
        }
        try? await client.activeVaultClose()

        let masterEncryption = try await client.vaultsGet(key: "masterEncryption")
        guard let hashedPassword = masterEncryption["hashedPassword"] as? String else {
            throw PearPassVaultError.unknown("No hashed password available in master encryption")
        }
        guard let ciphertext = masterEncryption["ciphertext"] as? String else {
            throw PearPassVaultError.unknown("Missing ciphertext in master encryption")
        }
        guard let nonce = masterEncryption["nonce"] as? String else {
            throw PearPassVaultError.unknown("Missing nonce in master encryption")
        }
        let decryptedKey = try await client.decryptVaultKey(
            ciphertext: ciphertext,
            nonce: nonce,
            hashedPassword: hashedPassword
        )
        guard let encryptionKey = decryptedKey?["value"] as? String
            ?? decryptedKey?["key"] as? String
            ?? decryptedKey?["data"] as? String else {
            throw PearPassVaultError.decryptionFailed
        }
        _ = try await client.activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
    }

    /// Currently-active vault id, or nil if none active.
    private func currentActiveVaultId(client: PearPassVaultClient) async throws -> String? {
        let status = try await client.activeVaultGetStatus()
        guard status.isInitialized && !status.isLocked else { return nil }
        let current = try await client.activeVaultGet(key: "vault")
        return current["id"] as? String
    }

    /// Decode pending ADD_PASSKEY / UPDATE_PASSKEY jobs from the encrypted job
    /// file into VaultRecord objects so newly-registered passkeys are visible
    /// before the main app processes the job queue. Mirror of V1
    /// CredentialsListView.loadPendingPasskeysFromJobs (assertion) and
    /// PasskeyRegistrationView.loadPendingRecordsFromJobs (registration).
    ///
    /// `filterRpId` / `filterUserName` are set in registration mode to scope
    /// the merge to rpId + userName so unrelated pending passkeys don't
    /// surface in the existing-matches list. Both nil in assertion mode.
    private func loadPendingPasskeysFromJobs(
        vaultClient: PearPassVaultClient,
        existingRecords: [VaultRecord],
        currentVaultId: String?,
        filterRpId: String? = nil,
        filterUserName: String? = nil
    ) async -> [VaultRecord] {
        guard JobFileManager.jobFileExists() else { return [] }

        guard let hashedPassword = await PasskeyJobCreator.getHashedPassword(from: vaultClient) else {
            NSLog("[V2HostView] Could not get hashed password for job file decryption")
            return []
        }

        // Mirrors V1 PasskeyRegistrationView.loadPendingRecordsFromJobs:
        // record-level rpId + userName match for pending payloads.
        func matchesFilter(rpId: String, userName: String) -> Bool {
            if let filterRpId = filterRpId,
               rpId.caseInsensitiveCompare(filterRpId) != .orderedSame {
                return false
            }
            if let filterUserName = filterUserName, !filterUserName.isEmpty {
                let recordUsername = userName.trimmingCharacters(in: .whitespaces)
                let usernameMatches = !recordUsername.isEmpty &&
                    recordUsername.caseInsensitiveCompare(filterUserName) == .orderedSame
                let hasNoUsername = recordUsername.isEmpty
                if !(usernameMatches || hasNoUsername) { return false }
            }
            return true
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
                // Vault scope — drop jobs queued for a different vault.
                if let currentVaultId = currentVaultId, job.vaultId != currentVaultId {
                    continue
                }
                switch job.payload {
                case .addPasskey(let payload):
                    guard !existingPasskeyIds.contains(payload.recordId) else { continue }
                    guard matchesFilter(rpId: payload.rpId, userName: payload.userName) else { continue }
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
                    guard matchesFilter(rpId: payload.rpId, userName: payload.userName) else { continue }
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
    /// Then mode-specific record-type filter (V1 parity):
    ///   - Assertion + passkey context (passkeyRpId set): passkeys only
    ///   - Assertion + password context: passwords only
    ///   - Registration: mixed (search results may include both types)
    private var filteredCredentials: [VaultRecord] {
        let query = viewModel.searchText.trimmingCharacters(in: .whitespaces)
        let baseFiltered: [VaultRecord]
        if !query.isEmpty {
            // Locale-aware compare so non-ASCII queries (Georgian, German ß,
            // Turkish dotted-i) match consistently — mirrors V1
            // CredentialsListView.filteredCredentials.
            baseFiltered = credentials.filter { record in
                let title = record.data?.title ?? ""
                let username = record.data?.username ?? ""
                return title.localizedCaseInsensitiveContains(query) ||
                       username.localizedCaseInsensitiveContains(query)
            }
        } else if hasUserSearched {
            baseFiltered = credentials
        } else if let target = targetDomain, !target.isEmpty {
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
            baseFiltered = matching.isEmpty ? credentials : matching
        } else {
            baseFiltered = credentials
        }

        return applyRecordTypeFilter(baseFiltered)
    }

    /// V1 parity: CredentialsListView used `hasPasskeySupport` to render
    /// passkey rows xor password rows (never mixed). V2 funnels everything
    /// through one list, so we restrict by record type at filter time so
    /// the visible set matches V1's mode-exclusive sections. Registration
    /// mode keeps the mixed match list (V1 ExistingCredentialSelectionView).
    private func applyRecordTypeFilter(_ records: [VaultRecord]) -> [VaultRecord] {
        if mode == .registration { return records }
        let isPasskeyAssertion = (passkeyRpId?.isEmpty == false)
        return records.filter { record in
            let isPasskey = record.data?.credential != nil
            return isPasskeyAssertion ? isPasskey : !isPasskey
        }
    }

    /// All paths funnel through extractDomain so the target side is normalized
    /// the same way as the record-website side (lowercase, no scheme/path/port,
    /// no leading www.) — without this an rpId like "www.example.com" wouldn't
    /// match a record website saved at "https://example.com/login".
    private var targetDomain: String? {
        if let ctx = registrationContext { return extractDomain(from: ctx.rpId) }
        if let rpId = passkeyRpId, !rpId.isEmpty { return extractDomain(from: rpId) }
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

    /// Lowercases + prepends `https://` when no scheme is present.
    private func addHttps(_ urlString: String) -> String {
        let lower = urlString.lowercased()
        if lower.hasPrefix("http://") || lower.hasPrefix("https://") {
            return lower
        }
        return "https://\(lower)"
    }

    /// Most-recently-created first, so `.first` = last-added vault default.
    private func sortedByMostRecent(_ vaults: [Vault]) -> [Vault] {
        vaults.sorted { $0.createdAt > $1.createdAt }
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
