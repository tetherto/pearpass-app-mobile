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
    @Binding var websites: [String]
    @Binding var comment: String

    /// Selected folder name (nil if user hasn't picked one). Driven by the
    /// confirmation dialog opened from the folder row.
    @Binding var selectedFolder: String?
    /// Folder names available in the active vault. Pulled in V2HostView via
    /// `client.listFolders()` after master-password unlock.
    var availableFolders: [String] = []

    /// New attachments queued for upload (added via document picker, not yet
    /// persisted). User can remove rows individually before save.
    @Binding var attachments: [AttachmentFile]
    /// Attachments already on the existing record. Removing a row excludes
    /// it from `keepAttachmentIds` so UPDATE_PASSKEY drops it.
    @Binding var existingAttachments: [AttachmentMetadata]
    /// Inline error from the file picker — fires when an upload exceeds the
    /// 6 MB cap. Cleared on a fresh successful upload.
    @Binding var fileSizeError: String?

    var saveError: String? = nil
    /// Disables Save/Discard while the passkey is being generated and the
    /// ADD/UPDATE job is being written so the user cannot fire the save
    /// twice or dismiss mid-flight.
    var isSaving: Bool = false

    @State private var showFolderPicker: Bool = false
    @State private var showFilePicker: Bool = false

    var onBack: () -> Void = {}
    var onClose: () -> Void = {}
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
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                            // Title
                            PPInputField(
                                label: NSLocalizedString("Title", comment: "V2 passkey form field"),
                                text: $titleText,
                                placeholder: NSLocalizedString("Title", comment: "V2 passkey form field")
                            )

                            // Section: Credentials
                            sectionHeader(NSLocalizedString("Credentials", comment: "V2 passkey form section"))
                                .padding(.top, PPSpacing.s24)
                                .padding(.bottom, PPSpacing.s8)

                            // Email/Username read-only — user can't edit the
                            // username they're registering the passkey for; it
                            // comes from the relying party's request.
                            PPInputField(
                                label: NSLocalizedString("Email / Username", comment: "V2 passkey form field"),
                                text: $username,
                                placeholder: NSLocalizedString("Email / Username", comment: "V2 passkey form field"),
                                isEditable: false
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

                            // Unified websites card — all input rows + the
                            // "+ Add Another Website" button share one
                            // rounded border, with horizontal dividers
                            // between rows. Empty entries are filtered at
                            // save time so blank rows don't pollute the
                            // record's websites array.
                            VStack(spacing: 0) {
                                ForEach(websites.indices, id: \.self) { idx in
                                    websiteRow(index: idx)

                                    Rectangle()
                                        .fill(PPColors.borderPrimary)
                                        .frame(height: 1)
                                }

                                Button(action: {
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        websites.append("")
                                    }
                                }) {
                                    HStack(spacing: PPSpacing.s4) {
                                        Image(systemName: "plus")
                                            .font(.system(size: PPFontSizes.s14, weight: .medium))
                                        Text(NSLocalizedString("Add Another Website", comment: "V2 add another website link"))
                                            .font(PPTypography.labelEmphasized)
                                    }
                                    .foregroundColor(PPColors.primary)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .contentShape(Rectangle())
                                    .padding(PPSpacing.s12)
                                }
                                .buttonStyle(.plain)
                                .disabled(isSaving)
                            }
                            .background(
                                ZStack {
                                    RoundedRectangle(cornerRadius: PPRadii.r8)
                                        .fill(PPColors.surfacePrimary)
                                    RoundedRectangle(cornerRadius: PPRadii.r8)
                                        .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
                                }
                            )

                            Spacer().frame(height: PPSpacing.s16)

                            // Folder picker — single folder per record (the
                            // backend RecordData.folder is a single optional
                            // string). Visually mirrors PPInputField with a
                            // chevron-down trailing icon; tapping opens the
                            // confirmation dialog with the available folders.
                            // "None" clears the selection.
                            folderPickerRow
                            .confirmationDialog(
                                NSLocalizedString("Select Folder", comment: "V2 folder picker dialog title"),
                                isPresented: $showFolderPicker,
                                titleVisibility: .visible
                            ) {
                                ForEach(availableFolders, id: \.self) { folder in
                                    Button(folder) { selectedFolder = folder }
                                }
                                if selectedFolder != nil {
                                    Button(NSLocalizedString("None", comment: "V2 folder clear option"), role: .destructive) {
                                        selectedFolder = nil
                                    }
                                }
                                Button(NSLocalizedString("Cancel", comment: "Cancel button"), role: .cancel) {}
                            }

                            Spacer().frame(height: PPSpacing.s8)

                            PPInputField(
                                label: NSLocalizedString("Comment", comment: "V2 passkey form field"),
                                text: $comment,
                                placeholder: NSLocalizedString("Optional", comment: "V2 comment placeholder")
                            )

                            // Spacer().frame(height: PPSpacing.s16)
                            //
                            // PPButton(
                            //     title: NSLocalizedString("Upload File", comment: "V2 upload file button"),
                            //     variant: .secondary,
                            //     isEnabled: !isSaving,
                            //     action: { showFilePicker = true }
                            // )

                            if !existingAttachments.isEmpty || !attachments.isEmpty {
                                Spacer().frame(height: PPSpacing.s16)

                                VStack(spacing: PPSpacing.s8) {
                                    ForEach(existingAttachments, id: \.id) { attachment in
                                        attachmentRow(
                                            name: attachment.name,
                                            onDelete: {
                                                existingAttachments.removeAll { $0.id == attachment.id }
                                            }
                                        )
                                    }
                                    ForEach(attachments) { attachment in
                                        attachmentRow(
                                            name: attachment.name,
                                            onDelete: {
                                                attachments.removeAll { $0.id == attachment.id }
                                            }
                                        )
                                    }
                                }
                            }
                    }
                    .padding(PPSpacing.s16)
                }
                .safeAreaInset(edge: .bottom, spacing: 0) {
                    // Pinned footer — divider + Save/Discard. `safeAreaInset`
                    // reserves space at the ScrollView's bottom edge so the
                    // focused input scrolls into view above the footer when
                    // the keyboard appears.
                    VStack(spacing: 0) {
                        Rectangle()
                            .fill(PPColors.borderPrimary)
                            .frame(height: 1)
                            .padding(.horizontal, PPSpacing.s12)

                        VStack(spacing: 0) {
                            if let saveError = saveError {
                                Text(saveError)
                                    .font(PPTypography.caption)
                                    .foregroundColor(PPColors.surfaceError)
                                    .multilineTextAlignment(.center)
                                    .frame(maxWidth: .infinity)
                                    .padding(.bottom, PPSpacing.s8)
                            }

                            if let fileSizeError = fileSizeError {
                                Text(fileSizeError)
                                    .font(PPTypography.caption)
                                    .foregroundColor(PPColors.surfaceError)
                                    .multilineTextAlignment(.center)
                                    .frame(maxWidth: .infinity)
                                    .padding(.bottom, PPSpacing.s8)
                            }

                            PPButton(
                                title: NSLocalizedString("Save & Add Login", comment: "V2 save button"),
                                variant: .primary,
                                isEnabled: !isSaving,
                                isLoading: isSaving,
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
                    .background(PPColors.surfacePrimary)
                }
            }
        }
        .background(PPColors.surfacePrimary)
        .sheet(isPresented: $showFilePicker) {
            DocumentPickerView { url in
                handleFileSelected(url: url)
            }
        }
    }

    /// Attachment row — file icon + filename + delete button. Mirrors V1
    /// PasskeyFormView.{existing,}attachmentRow.
    private func attachmentRow(name: String, onDelete: @escaping () -> Void) -> some View {
        HStack(spacing: PPSpacing.s12) {
            Image(systemName: isImageFile(name) ? "photo" : "doc.fill")
                .foregroundColor(PPColors.textSecondary)
                .frame(width: 24)
            Text(name)
                .font(PPTypography.label)
                .foregroundColor(PPColors.textPrimary)
                .lineLimit(1)
                .truncationMode(.middle)
            Spacer()
            Button(action: onDelete) {
                Image(systemName: "trash.fill")
                    .font(.system(size: 14))
                    .foregroundColor(PPColors.surfaceError)
            }
            .buttonStyle(.plain)
        }
        .padding(PPSpacing.s12)
        .background(
            ZStack {
                RoundedRectangle(cornerRadius: PPRadii.r8)
                    .fill(PPColors.surfacePrimary)
                RoundedRectangle(cornerRadius: PPRadii.r8)
                    .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
            }
        )
    }

    private func isImageFile(_ name: String) -> Bool {
        let lower = name.lowercased()
        return lower.hasSuffix(".png") || lower.hasSuffix(".jpg")
            || lower.hasSuffix(".jpeg") || lower.hasSuffix(".gif")
            || lower.hasSuffix(".heic") || lower.hasSuffix(".webp")
    }

    /// Reads the picked file, enforces the 6 MB cap, and appends it to
    /// `attachments`. Mirrors V1 PasskeyFormView.handleFileSelected.
    private func handleFileSelected(url: URL) {
        guard url.startAccessingSecurityScopedResource() else { return }
        defer { url.stopAccessingSecurityScopedResource() }

        do {
            let fileData = try Data(contentsOf: url)
            let sizeMB = Double(fileData.count) / (1024.0 * 1024.0)
            if sizeMB > 6.0 {
                fileSizeError = NSLocalizedString(
                    "Your file is too large. Please upload one that's 6 MB or smaller.",
                    comment: "V2 file size error"
                )
                return
            }
            fileSizeError = nil
            attachments.append(
                AttachmentFile(id: UUID().uuidString, name: url.lastPathComponent, data: fileData)
            )
        } catch {
            NSLog("[PasskeyFormV2View] file read error: \(error)")
        }
    }

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(PPTypography.caption)
            .foregroundColor(PPColors.textSecondary)
    }

    /// Folder picker row styled like PPInputField — caption-sized "Folder"
    /// label on top, body value below ("Choose Folder" placeholder when
    /// nothing is selected), with a chevron-down on the right indicating
    /// the dropdown affordance. Tap opens the confirmation dialog wired
    /// up at the call site.
    private var folderPickerRow: some View {
        Button(action: { showFolderPicker = true }) {
            HStack(alignment: .center, spacing: PPSpacing.s4) {
                VStack(alignment: .leading, spacing: PPSpacing.s4) {
                    Text(NSLocalizedString("Folder", comment: "V2 folder picker label"))
                        .font(PPTypography.caption)
                        .foregroundColor(PPColors.textPrimary)

                    Text(selectedFolder ?? NSLocalizedString("Choose Folder", comment: "V2 folder picker placeholder"))
                        .font(PPTypography.labelEmphasized)
                        .foregroundColor(selectedFolder == nil ? PPColors.textSecondary : PPColors.textPrimary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Image("Icons/ChevronDown", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 16, height: 16)
                    .foregroundColor(PPColors.textPrimary)
            }
            .padding(PPSpacing.s12)
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: PPRadii.r8)
                        .fill(PPColors.surfacePrimary)
                    RoundedRectangle(cornerRadius: PPRadii.r8)
                        .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
                }
            )
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    /// Single website row inside the unified websites card. No own border —
    /// the surrounding VStack carries the rounded-rect background, and a
    /// 1pt divider sits below each row to separate it from the next.
    private func websiteRow(index: Int) -> some View {
        VStack(alignment: .leading, spacing: PPSpacing.s4) {
            Text(NSLocalizedString("Website", comment: "V2 passkey form field"))
                .font(PPTypography.caption)
                .foregroundColor(PPColors.textPrimary)

            TextField(
                "",
                text: $websites[index],
                prompt: Text(NSLocalizedString("Enter Website", comment: "V2 website placeholder"))
                    .foregroundColor(PPColors.textSecondary)
            )
            .font(PPTypography.labelEmphasized)
            .foregroundColor(PPColors.textPrimary)
            .keyboardType(.URL)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled(true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(PPSpacing.s12)
    }
}
