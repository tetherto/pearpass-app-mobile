//
//  VaultPasswordV2View.swift
//  PearPassAutoFillExtension
//
//  V2 per-vault password unlock screen — visual + binding shell that
//  mirrors V1 VaultPasswordView in the V2 design system. Not wired into
//  V2HostView routing yet because the backend doesn't support per-vault
//  passwords on the autofill path. Kept ready so reconnecting the flow
//  doesn't require redesigning the screen when the feature lands.
//

import SwiftUI

struct VaultPasswordV2View: View {

    var headerTitle: String = NSLocalizedString("Sign in", comment: "V2 sheet header — credential assertion")
    /// Rendered as the localized "Unlock with the X Vault password" title —
    /// caller passes the selected vault's display name.
    var vaultName: String = ""

    @Binding var password: String

    /// Inline auth-error message shown under the password field (invalid
    /// vault password, vault locked, etc.). Cleared by the caller when a
    /// new attempt starts.
    var errorMessage: String? = nil
    /// Disables Continue / Select Vaults and swaps the Continue label to
    /// "Authenticating..." while the unlock is in flight.
    var isAuthenticating: Bool = false

    var onClose: () -> Void = {}
    var onContinue: () -> Void = {}
    /// Sends the user back to vault selection so they can pick a different
    /// vault instead of guessing the password.
    var onSelectVaults: () -> Void = {}

    private var continueButtonTitle: String {
        isAuthenticating
            ? NSLocalizedString("Authenticating...", comment: "Authentication in progress")
            : NSLocalizedString("Continue", comment: "Continue button")
    }

    private var continueEnabled: Bool {
        !password.isEmpty && !isAuthenticating
    }

    private var titleText: String {
        String(
            format: NSLocalizedString("Unlock with the %@ Vault password", comment: "Vault unlock prompt"),
            vaultName
        )
    }

    var body: some View {
        VStack(spacing: 0) {
            PPSheetHeader(
                title: headerTitle,
                showLogo: true,
                showClose: true,
                onClose: onClose
            )

            PPContentCard {
                VStack(spacing: 0) {
                    VStack(spacing: 0) {
                        Text(titleText)
                            .font(PPTypography.title)
                            .foregroundColor(PPColors.textPrimary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                            .padding(.top, PPSpacing.s16)

                        Spacer().frame(height: PPSpacing.s46)

                        PPPasswordField(
                            label: NSLocalizedString("Password", comment: "V2 password input label"),
                            text: $password,
                            placeholder: NSLocalizedString("Vault password", comment: "Vault password placeholder")
                        )

                        if let errorMessage = errorMessage, !errorMessage.isEmpty {
                            Text(errorMessage)
                                .font(PPTypography.caption)
                                .foregroundColor(PPColors.surfaceError)
                                .multilineTextAlignment(.leading)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.top, PPSpacing.s8)
                        }

                        Spacer()
                    }
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s24)

                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)

                    VStack(spacing: PPSpacing.s8) {
                        PPButton(
                            title: continueButtonTitle,
                            variant: .primary,
                            isEnabled: continueEnabled,
                            action: onContinue
                        )

                        PPButton(
                            title: NSLocalizedString("Select Vaults", comment: "Select vaults button"),
                            variant: .secondary,
                            isEnabled: !isAuthenticating,
                            action: onSelectVaults
                        )
                    }
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s16)
                    .padding(.bottom, PPSpacing.s12)
                }
            }
        }
    }
}
