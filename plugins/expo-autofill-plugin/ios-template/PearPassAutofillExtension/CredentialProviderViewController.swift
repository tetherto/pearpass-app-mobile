//
//  CredentialProviderViewController.swift
//  PearPassAutoFillExtension
//
//  Created by Andriy Klitsuk on 22/08/25.
//

import AuthenticationServices
import SwiftUI

class CredentialProviderViewController: ASCredentialProviderViewController {

    private var extensionHostingController: UIHostingController<ExtensionMainView>?
    private var serviceIdentifiers: [ASCredentialServiceIdentifier] = []
    private var vaultClient: PearPassVaultClient?
    private var hasCleanedUp = false

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    /// Called when the view is about to disappear - similar to Android's onPause()
    /// This handles backgrounding, swiping away, etc.
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        print("CredentialProviderViewController: viewWillDisappear - performing cleanup")

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
            print("CredentialProviderViewController: Already cleaned up, skipping")
            return
        }

        print("CredentialProviderViewController: Performing synchronous cleanup...")

        guard let client = vaultClient else {
            print("CredentialProviderViewController: No vault client to clean up")
            hasCleanedUp = true
            return
        }

        // Mark as cleaned up immediately to prevent re-entry
        hasCleanedUp = true

        // Clear reference immediately (like Android)
        vaultClient = nil

        print("CredentialProviderViewController: Closing vault client...")

        // Use a semaphore to wait synchronously (like Android's .get(500ms))
        let semaphore = DispatchSemaphore(value: 0)
        var cleanupCompleted = false

        Task {
            do {
                _ = try await client.close()
                print("CredentialProviderViewController: Vault client closed successfully")
                cleanupCompleted = true
            } catch {
                print("CredentialProviderViewController: Error closing vault client: \(error.localizedDescription)")
            }
            semaphore.signal()
        }

        // Wait up to 500ms for cleanup (matching Android timeout)
        let timeout = DispatchTime.now() + .milliseconds(500)
        let result = semaphore.wait(timeout: timeout)

        if result == .timedOut {
            print("CredentialProviderViewController: Cleanup timed out after 500ms, continuing anyway")
        } else if cleanupCompleted {
            print("CredentialProviderViewController: Cleanup completed successfully")
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
        print("CredentialProviderViewController: Received service identifiers:")
        for identifier in serviceIdentifiers {
            print("  - Type: \(identifier.type.rawValue), Identifier: \(identifier.identifier)")
        }

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


}
