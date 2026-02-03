//
//  CredentialProviderViewController.swift
//  PearPassAutoFillExtension
//
//  Created by Andriy Klitsuk on 22/08/25.
//

import AuthenticationServices
import SwiftUI
import CryptoKit

class CredentialProviderViewController: ASCredentialProviderViewController {

    private var extensionHostingController: UIViewController?
    private var serviceIdentifiers: [ASCredentialServiceIdentifier] = []
    private var vaultClient: PearPassVaultClient?
    private var hasCleanedUp = false
    private var isSettingUpPasskeyRegistration = false  // Guard against duplicate calls

    // Passkey-specific properties (iOS 17+)
    private var passkeyClientDataHash: Data?
    private var passkeyRpId: String?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    /// Called when the view is about to disappear - similar to Android's onPause()
    /// This handles backgrounding, swiping away, etc.
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)


        // Perform synchronous cleanup to ensure resources are released
        // before the extension actually disappears
        performCleanupSync()
    }

    /// Cleanup resources before dismissing the extension
    /// Similar to Android's cleanup() method in AuthenticationActivity
    /// This MUST complete before the extension context is cancelled/completed
    private func performCleanupSync() {
        // Prevent duplicate cleanup (important if both onCancel and viewWillDisappear are called)
        guard !hasCleanedUp else {
            return
        }


        // Reset setup flags
        isSettingUpPasskeyRegistration = false

        guard let client = vaultClient else {
            hasCleanedUp = true
            return
        }

        // Mark as cleaned up immediately to prevent re-entry
        hasCleanedUp = true

        // Clear reference immediately (like Android)
        vaultClient = nil


        // Use a semaphore to wait synchronously (like Android's .get(500ms))
        let semaphore = DispatchSemaphore(value: 0)
        var cleanupCompleted = false

        Task {
            do {
                _ = try await client.close()
                cleanupCompleted = true
            } catch {
            }
            semaphore.signal()
        }

        // Wait up to 1000ms for cleanup
        let timeout = DispatchTime.now() + .milliseconds(1000)
        let result = semaphore.wait(timeout: timeout)

        if result == .timedOut {
        } else if cleanupCompleted {
        }
    }

    private func setupSwiftUIView() {
        let mainView = ExtensionMainView(
            serviceIdentifiers: serviceIdentifiers,
            presentationWindow: self.view.window,
            onCancel: { [weak self] in
                // Cleanup BEFORE cancelling (critical!)
                self?.performCleanupSync()
                self?.cancel(nil)
            },
            onComplete: { [weak self] username, password in
                // Cleanup BEFORE completing (critical!)
                self?.performCleanupSync()
                let passwordCredential = ASPasswordCredential(user: username, password: password)
                self?.extensionContext.completeRequest(withSelectedCredential: passwordCredential, completionHandler: nil)
            },
            onVaultClientCreated: { [weak self] client in
                // Store vault client reference so we can clean it up later
                self?.vaultClient = client
            }
        )

        let hostingController = UIHostingController(rootView: mainView)

        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.didMove(toParent: self)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        extensionHostingController = hostingController
    }

    /*
     Prepare your UI to list available credentials for the user to choose from. The items in
     'serviceIdentifiers' describe the service the user is logging in to, so your extension can
     prioritize the most relevant credentials in the list.
    */
    override func prepareCredentialList(for serviceIdentifiers: [ASCredentialServiceIdentifier]) {

        self.serviceIdentifiers = serviceIdentifiers

        // Reset cleanup flag for new session
        hasCleanedUp = false

        // Only setup the view once
        if extensionHostingController == nil {
            setupSwiftUIView()
        }
    }

    /*
     Implement this method if your extension supports showing credentials in the QuickType bar.
     When the user selects a credential from your app, this method will be called with the
     ASPasswordCredentialIdentity your app has previously saved to the ASCredentialIdentityStore.
     Provide the password by completing the extension request with the associated ASPasswordCredential.
     If using the credential would require showing custom UI for authenticating the user, cancel
     the request with error code ASExtensionError.userInteractionRequired.
    */
    override func provideCredentialWithoutUserInteraction(for credentialIdentity: ASPasswordCredentialIdentity) {
        self.extensionContext.cancelRequest(withError: NSError(domain: ASExtensionErrorDomain, code:ASExtensionError.userInteractionRequired.rawValue))
    }

    /*
     Implement this method if provideCredentialWithoutUserInteraction(for:) can fail with
     ASExtensionError.userInteractionRequired. In this case, the system may present your extension's
     UI and call this method. Show appropriate UI for authenticating the user then provide the password
     by completing the extension request with the associated ASPasswordCredential.
    */
    override func prepareInterfaceToProvideCredential(for credentialIdentity: ASPasswordCredentialIdentity) {
        // Reset cleanup flag for new session
        hasCleanedUp = false
        // UI is now handled by SwiftUI views
    }

    @IBAction func cancel(_ sender: AnyObject?) {
        self.extensionContext.cancelRequest(withError: NSError(domain: ASExtensionErrorDomain, code: ASExtensionError.userCanceled.rawValue))
    }

    // MARK: - Passkey Registration (iOS 17+)

    @available(iOS 17.0, *)
    override func prepareInterface(
        forPasskeyRegistration registrationRequest: ASCredentialRequest
    ) {

        // Guard against duplicate calls from iOS
        guard !isSettingUpPasskeyRegistration else {
            return
        }
        isSettingUpPasskeyRegistration = true

        guard let passkeyRequest = registrationRequest as? ASPasskeyCredentialRequest else {
            isSettingUpPasskeyRegistration = false
            extensionContext.cancelRequest(withError: ASExtensionError(.failed))
            return
        }

        // Clean up any existing vault client to avoid BareKit conflicts
        if vaultClient != nil {
            performCleanupSync()
        } else {
        }

        // Remove any existing hosting controller
        if let existingHostingController = extensionHostingController {
            existingHostingController.willMove(toParent: nil)
            existingHostingController.view.removeFromSuperview()
            existingHostingController.removeFromParent()
            extensionHostingController = nil
        } else {
        }

        // Reset cleanup flag for new session
        hasCleanedUp = false

        // Store passkey-specific data - cast to ASPasskeyCredentialIdentity for passkey-specific properties
        passkeyClientDataHash = passkeyRequest.clientDataHash

        if let passkeyIdentity = passkeyRequest.credentialIdentity as? ASPasskeyCredentialIdentity {
            // Use safe value(forKey:) access to avoid crashes on null Objective-C strings
            passkeyRpId = (passkeyIdentity as NSObject).value(forKey: "relyingPartyIdentifier") as? String
            let userName = (passkeyIdentity as NSObject).value(forKey: "userName") as? String ?? "unknown"
        } else {
        }

        // Create registration request
        let registrationRequest = PasskeyRegistrationRequest(from: passkeyRequest)

        // Present registration UI
        let registrationView = PasskeyRegistrationView(
            request: registrationRequest,
            presentationWindow: self.view.window,
            onComplete: { [weak self] credential, attestationObject, credentialId in
                self?.completePasskeyRegistration(
                    credential: credential,
                    attestationObject: attestationObject,
                    credentialId: credentialId
                )
            },
            onCancel: { [weak self] in
                self?.isSettingUpPasskeyRegistration = false
                self?.performCleanupSync()
                self?.extensionContext.cancelRequest(withError: ASExtensionError(.userCanceled))
            },
            onVaultClientCreated: { [weak self] client in
                self?.vaultClient = client
            }
        )

        let hostingController = UIHostingController(rootView: registrationView)

        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.didMove(toParent: self)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        extensionHostingController = hostingController
    }

    @available(iOS 17.0, *)
    private func completePasskeyRegistration(
        credential: PasskeyCredential,
        attestationObject: Data,
        credentialId: Data
    ) {

        isSettingUpPasskeyRegistration = false
        performCleanupSync()

        // rpId comes from the request, not the credential (browser extension format)
        let passkeyCredential = ASPasskeyRegistrationCredential(
            relyingParty: passkeyRpId ?? "",
            clientDataHash: passkeyClientDataHash ?? Data(),
            credentialID: credentialId,
            attestationObject: attestationObject
        )

        extensionContext.completeRegistrationRequest(using: passkeyCredential)
    }

    // MARK: - Passkey Assertion (iOS 17+)

    @available(iOS 17.0, *)
    override func prepareCredentialList(
        for serviceIdentifiers: [ASCredentialServiceIdentifier],
        requestParameters: ASPasskeyCredentialRequestParameters
    ) {

        // Reset cleanup flag for new session
        hasCleanedUp = false

        // Store passkey-specific data
        passkeyClientDataHash = requestParameters.clientDataHash
        passkeyRpId = requestParameters.relyingPartyIdentifier

        self.serviceIdentifiers = serviceIdentifiers

        // Setup UI that shows both passwords and passkeys
        setupPasskeyCredentialList(
            serviceIdentifiers: serviceIdentifiers,
            rpId: requestParameters.relyingPartyIdentifier,
            clientDataHash: requestParameters.clientDataHash
        )
    }

    @available(iOS 17.0, *)
    private func setupPasskeyCredentialList(
        serviceIdentifiers: [ASCredentialServiceIdentifier],
        rpId: String,
        clientDataHash: Data
    ) {
        let mainView = ExtensionMainView(
            serviceIdentifiers: serviceIdentifiers,
            presentationWindow: self.view.window,
            passkeyRpId: rpId,
            passkeyClientDataHash: clientDataHash,
            onCancel: { [weak self] in
                self?.performCleanupSync()
                self?.cancel(nil)
            },
            onComplete: { [weak self] username, password in
                self?.performCleanupSync()
                let passwordCredential = ASPasswordCredential(user: username, password: password)
                self?.extensionContext.completeRequest(withSelectedCredential: passwordCredential, completionHandler: nil)
            },
            onPasskeySelected: { [weak self] credential in
                self?.completePasskeyAssertion(credential: credential, clientDataHash: clientDataHash)
            },
            onVaultClientCreated: { [weak self] client in
                self?.vaultClient = client
            }
        )

        let hostingController = UIHostingController(rootView: mainView)

        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.didMove(toParent: self)

        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hostingController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            hostingController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        extensionHostingController = hostingController
    }

    @available(iOS 17.0, *)
    private func completePasskeyAssertion(credential: PasskeyCredential, clientDataHash: Data) {

        do {
            // Import private key from stored PKCS#8 (convert buffer to Base64URL for crypto function)
            let privateKeyB64 = credential._privateKeyBuffer.base64URLEncodedString()
            let privateKey = try PasskeyCrypto.importPrivateKey(pkcs8Base64URL: privateKeyB64)

            // Build authenticator data for assertion
            // rpId comes from the request, not the credential (browser extension format)
            let rpId = passkeyRpId ?? ""
            let authData = AuthenticatorDataBuilder.buildForAssertion(rpId: rpId)

            // Sign the assertion
            let signature = try PasskeyCrypto.signAssertion(
                privateKey: privateKey,
                authenticatorData: authData,
                clientDataHash: clientDataHash
            )

            guard let credentialIdData = Data(base64URLEncoded: credential.id),
                  let signatureData = Data(base64URLEncoded: signature),
                  let userHandleData = Data(base64URLEncoded: credential._userId) else {
                throw PasskeyCryptoError.invalidKeyFormat
            }


            performCleanupSync()

            let assertionCredential = ASPasskeyAssertionCredential(
                userHandle: userHandleData,
                relyingParty: rpId,
                signature: signatureData,
                clientDataHash: clientDataHash,
                authenticatorData: authData,
                credentialID: credentialIdData
            )

            extensionContext.completeAssertionRequest(using: assertionCredential)

        } catch {
            performCleanupSync()
            extensionContext.cancelRequest(withError: ASExtensionError(.failed))
        }
    }

    // MARK: - Passkey Without User Interaction (iOS 17+)

    @available(iOS 17.0, *)
    override func provideCredentialWithoutUserInteraction(for credentialRequest: ASCredentialRequest) {
        // For now, always require user interaction for passkeys
        // This could be optimized in the future for seamless authentication
        if credentialRequest is ASPasskeyCredentialRequest {
            extensionContext.cancelRequest(withError: ASExtensionError(.userInteractionRequired))
            return
        }

        // Fall back to password behavior
        if let passwordRequest = credentialRequest as? ASPasswordCredentialRequest {
            // Existing password logic - require user interaction
            extensionContext.cancelRequest(withError: ASExtensionError(.userInteractionRequired))
        }
    }

    @available(iOS 17.0, *)
    override func prepareInterfaceToProvideCredential(for credentialRequest: ASCredentialRequest) {

        hasCleanedUp = false

        if let passkeyRequest = credentialRequest as? ASPasskeyCredentialRequest,
           let passkeyIdentity = passkeyRequest.credentialIdentity as? ASPasskeyCredentialIdentity {
            // Handle passkey assertion with specific credential
            passkeyClientDataHash = passkeyRequest.clientDataHash

            // Use safe value(forKey:) access to avoid crashes on null Objective-C strings
            let rpId = (passkeyIdentity as NSObject).value(forKey: "relyingPartyIdentifier") as? String ?? ""
            passkeyRpId = rpId

            // Setup passkey selection UI
            let serviceIdentifier = ASCredentialServiceIdentifier(
                identifier: rpId.isEmpty ? "unknown" : rpId,
                type: .domain
            )
            setupPasskeyCredentialList(
                serviceIdentifiers: [serviceIdentifier],
                rpId: rpId.isEmpty ? "unknown" : rpId,
                clientDataHash: passkeyRequest.clientDataHash
            )
        }
    }
}
