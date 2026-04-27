//
//  PasskeyFormV2View.swift
//  PearPassAutoFillExtension
//
//  V2 passkey form screen. Mirrors android-template/res/layout/fragment_passkey_form_v2.xml.
//  Sheet header (back + close + "Create Passkey") + scrollable form + bottom buttons.
//

import SwiftUI

struct PasskeyFormV2View: View {

    var headerTitle: String = NSLocalizedString("Create Passkey", comment: "V2 sheet header — passkey registration")

    @Binding var titleText: String
    @Binding var username: String
    @Binding var passkeyDate: String
    @Binding var website: String
    @Binding var comment: String
    var folderName: String?

    var titleError: String? = nil
    var websiteError: String? = nil
    var saveError: String? = nil
    /// Disables Save/Discard while the passkey is being generated and the
    /// ADD/UPDATE job is being written so the user cannot fire the save
    /// twice or dismiss mid-flight.
    var isSaving: Bool = false

    var onBack: () -> Void = {}
    var onClose: () -> Void = {}
    var onSelectFolder: () -> Void = {}
    var onSave: () -> Void = {}
    var onDiscard: () -> Void = {}

    var body: some View {
        VStack(spacing: 0) {
            PPSheetHeaderBack(
                title: headerTitle,
                onBack: onBack,
                onClose: onClose
            )

            PPContentCard {
                VStack(spacing: 0) {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            // Title
                            PPInputField(
                                label: NSLocalizedString("Title", comment: "V2 passkey form field"),
                                text: $titleText,
                                placeholder: NSLocalizedString("Title", comment: "V2 passkey form field")
                            )

                            if let titleError = titleError {
                                Text(titleError)
                                    .font(PPTypography.caption)
                                    .foregroundColor(PPColors.surfaceError)
                                    .padding(.top, PPSpacing.s4)
                            }

                            // Section: Credentials
                            sectionHeader(NSLocalizedString("Credentials", comment: "V2 passkey form section"))
                                .padding(.top, PPSpacing.s24)
                                .padding(.bottom, PPSpacing.s8)

                            PPInputField(
                                label: NSLocalizedString("Email or Username", comment: "V2 passkey form field"),
                                text: $username,
                                placeholder: NSLocalizedString("Email or Username", comment: "V2 passkey form field"),
                                keyboardType: .emailAddress
                            )

                            Spacer().frame(height: PPSpacing.s8)

                            PPInputField(
                                label: NSLocalizedString("Passkey", comment: "V2 passkey form field"),
                                text: $passkeyDate,
                                placeholder: NSLocalizedString("Date", comment: "V2 passkey form placeholder"),
                                isEditable: false
                            )

                            // Section: Details
                            sectionHeader(NSLocalizedString("Details", comment: "V2 passkey form section"))
                                .padding(.top, PPSpacing.s24)
                                .padding(.bottom, PPSpacing.s8)

                            PPInputField(
                                label: NSLocalizedString("Website", comment: "V2 passkey form field"),
                                text: $website,
                                placeholder: NSLocalizedString("https://...", comment: "V2 website placeholder"),
                                keyboardType: .URL
                            )

                            if let websiteError = websiteError {
                                Text(websiteError)
                                    .font(PPTypography.caption)
                                    .foregroundColor(PPColors.surfaceError)
                                    .padding(.top, PPSpacing.s4)
                            }

                            Spacer().frame(height: PPSpacing.s8)

                            PPInputField(
                                label: NSLocalizedString("Comment", comment: "V2 passkey form field"),
                                text: $comment,
                                placeholder: NSLocalizedString("Optional", comment: "V2 comment placeholder")
                            )

                            Spacer().frame(height: PPSpacing.s8)

                            // Folder selector
                            PPListItem(
                                title: folderName ?? NSLocalizedString("Select folder", comment: "V2 folder picker default"),
                                leadingIcon: nil,
                                onTap: onSelectFolder
                            )
                        }
                        .padding(PPSpacing.s16)
                    }

                    // Divider
                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)
                        .padding(.horizontal, PPSpacing.s12)

                    // Bottom: error + save + discard
                    VStack(spacing: 0) {
                        if let saveError = saveError {
                            Text(saveError)
                                .font(PPTypography.caption)
                                .foregroundColor(PPColors.surfaceError)
                                .multilineTextAlignment(.center)
                                .frame(maxWidth: .infinity)
                                .padding(.bottom, PPSpacing.s8)
                        }

                        PPButton(
                            title: isSaving
                                ? NSLocalizedString("Saving...", comment: "V2 save button — in flight")
                                : NSLocalizedString("Save & Add Login", comment: "V2 save button"),
                            variant: .primary,
                            isEnabled: !isSaving,
                            action: onSave
                        )

                        PPButton(
                            title: NSLocalizedString("Discard", comment: "V2 discard button"),
                            variant: .secondary,
                            isEnabled: !isSaving,
                            action: onDiscard
                        )
                        .padding(.top, PPSpacing.s8)
                    }
                    .padding(.horizontal, PPSpacing.s16)
                    .padding(.top, PPSpacing.s16)
                    .padding(.bottom, PPSpacing.s12)
                }
            }
        }
        .background(PPColors.surfacePrimary)
    }

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(PPTypography.label)
            .foregroundColor(PPColors.textSecondary)
    }
}
