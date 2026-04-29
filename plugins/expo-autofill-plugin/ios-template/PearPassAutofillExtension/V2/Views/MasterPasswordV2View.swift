//
//  MasterPasswordV2View.swift
//  PearPassAutoFillExtension
//
//  V2 master password screen. Mirrors android-template/res/layout/fragment_master_password_v2.xml.
//  Sheet header (logo + close + title) + content card with title/subtitle/password + Continue button.
//  Biometric (Face ID / Touch ID) unlock button mirrors V1 MasterPasswordView.
//

import SwiftUI

struct MasterPasswordV2View: View {

    var headerTitle: String = NSLocalizedString("Add a passkey", comment: "V2 sheet header default")
    @Binding var password: String

    /// Disables Continue + Face ID + Use Passkey and swaps the Continue label
    /// to "Authenticating..." while a vault unlock is in flight. Auth errors
    /// are surfaced via the toast overlay rendered in V2HostView, not inline.
    var isAuthenticating: Bool = false

    var onClose: () -> Void = {}
    var onContinue: () -> Void = {}
    /// Fired when the user taps the biometric button. Hidden when biometrics
    /// are unavailable on the device or the user has not enabled them in the
    /// main app keychain.
    var onFaceIDLogin: () -> Void = {}
    /// Fired when the user taps the passkey button. Hidden when the device
    /// can't use a passkey for vault unlock (iOS 16+ + main app must have
    /// registered a passkey + flag enabled).
    var onPasskeyLogin: () -> Void = {}

    private var showBiometricButton: Bool {
        KeychainHelper.shared.canUseBiometrics()
    }

    private var showPasskeyButton: Bool {
        if #available(iOS 16.0, *) {
            return PasskeyHelper.shared.canUsePasskey()
        }
        return false
    }

    private var biometricButtonTitle: String {
        switch KeychainHelper.shared.getBiometricType() {
        case .faceID:
            return NSLocalizedString("Use Face ID", comment: "Face ID button text")
        case .touchID:
            return NSLocalizedString("Use Touch ID", comment: "Touch ID button text")
        default:
            return NSLocalizedString("Use Biometrics", comment: "Generic biometrics button text")
        }
    }

    private var biometricIconName: String {
        switch KeychainHelper.shared.getBiometricType() {
        case .faceID: return "faceid"
        case .touchID: return "touchid"
        default: return "lock.shield"
        }
    }

    private var continueButtonTitle: String {
        isAuthenticating
            ? NSLocalizedString("Authenticating...", comment: "Authentication in progress")
            : NSLocalizedString("Continue", comment: "V2 continue button")
    }

    private var continueEnabled: Bool {
        !password.isEmpty && !isAuthenticating
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
                    // Body
                    VStack(spacing: 0) {
                        Text(NSLocalizedString("Enter Your Master Password", comment: "V2 master password screen title"))
                            .font(PPTypography.title)
                            .foregroundColor(PPColors.textPrimary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                            .padding(.top, PPSpacing.s16)

                        Text(NSLocalizedString("Please enter your master password to continue", comment: "V2 master password screen subtitle"))
                            .font(PPTypography.label)
                            .foregroundColor(PPColors.textSecondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                            .padding(.top, PPSpacing.s8)

                        Spacer().frame(height: PPSpacing.s46)

                        PPPasswordField(
                            label: NSLocalizedString("Password", comment: "V2 password input label"),
                            text: $password,
                            placeholder: NSLocalizedString("Enter Master Password", comment: "V2 password input placeholder")
                        )

                        Spacer()

                        // Biometric retry — sits at the bottom of the body
                        // 16pt above the footer divider (per design), so the
                        // password input has the visual weight of the screen.
                        if showBiometricButton {
                            Button(action: onFaceIDLogin) {
                                Text(NSLocalizedString("Try with Face ID", comment: "V2 biometric retry link"))
                                    .font(Font.custom(PPFontFamily.inter, size: PPFontSizes.s14))
                                    .foregroundColor(PPColors.primary)
                                    .underline()
                                    .multilineTextAlignment(.center)
                                    .frame(maxWidth: .infinity)
                                    .padding(.bottom, PPSpacing.s16)
                                    .contentShape(Rectangle())
                            }
                            .buttonStyle(.plain)
                            .disabled(isAuthenticating)
                        }
                    }
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s24)

                    // Top border for footer
                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)

                    VStack(spacing: PPSpacing.s8) {
                        PPButton(
                            title: continueButtonTitle,
                            variant: .primary,
                            isEnabled: continueEnabled,
                            isLoading: isAuthenticating,
                            action: onContinue
                        )

                        if showPasskeyButton {
                            PPButton(
                                title: NSLocalizedString("Use Passkey", comment: "Passkey button text"),
                                variant: .secondary,
                                isEnabled: !isAuthenticating,
                                action: onPasskeyLogin
                            )
                        }
                    }
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s16)
                    .padding(.bottom, PPSpacing.s12)
                }
            }
        }
    }
}
