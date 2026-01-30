//
//  PasskeyFormView.swift
//  PearPassAutoFillExtension
//
//  Editable form for passkey credential creation/editing.
//  Matches the main React Native app's validation and data structure.
//

import SwiftUI
import UniformTypeIdentifiers

/// File attachment model
struct AttachmentFile: Identifiable {
    let id: String
    let name: String
    let data: Data
}

@available(iOS 17.0, *)
struct PasskeyFormView: View {
    let request: PasskeyRegistrationRequest
    let vaultClient: PearPassVaultClient?
    let selectedVault: Vault?
    let existingRecord: [String: Any]?
    let preloadedFolders: [String]
    let onSave: (PasskeyFormData) -> Void
    let onCancel: () -> Void

    // Form state
    @State private var title: String = ""
    @State private var username: String = ""
    @State private var website: String = ""
    @State private var comment: String = ""
    @State private var selectedFolder: String? = nil
    @State private var attachments: [AttachmentFile] = []
    @State private var passkeyCreatedAt: Int64 = 0

    // Validation errors (set on submit, cleared on edit)
    @State private var titleError: String? = nil
    @State private var websiteError: String? = nil

    // UI state
    @State private var isSaving = false
    @State private var saveError: String? = nil
    @State private var showFolderPicker = false
    @State private var showFilePicker = false
    @State private var fileSizeError: String? = nil

    // Existing record tracking
    private var isUpdatingExisting: Bool { existingRecord != nil }

    var body: some View {
        VStack(spacing: 0) {
            // Header: folder selector (left) + Cancel button (right)
            headerView

            ScrollView {
                VStack(spacing: 12) {
                    // Title field (required)
                    fieldCard {

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Title*")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.6))
                            TextField(NSLocalizedString("Insert title", comment: "Title placeholder"), text: $title)
                                .font(.system(size: 16))
                                .foregroundColor(.white)
                                .autocorrectionDisabled()
                                .onChange(of: title) { _ in
                                    titleError = nil
                                }
                        }
                        if let error = titleError {
                            errorLabel(error)
                        }
                    }

                    // Email or username field
                    fieldCard {
                        HStack(spacing: 12) {
                            Image(systemName: "person.fill")
                                .foregroundColor(.white.opacity(0.5))
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(NSLocalizedString("Email or username", comment: "Username label"))
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                                TextField(NSLocalizedString("Email or username", comment: "Username placeholder"), text: $username)
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                                    .autocorrectionDisabled()
                                    .textInputAutocapitalization(.never)
                            }
                        }
                    }

                    // Passkey info (read-only)
                    fieldCard {
                        HStack(spacing: 12) {
                            Image(systemName: "person.badge.key.fill")
                                .foregroundColor(.white.opacity(0.5))
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(NSLocalizedString("Passkey", comment: "Passkey label"))
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                                Text(formatPasskeyDate(passkeyCreatedAt))
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                            }
                            Spacer()
                        }
                    }

                    // Website field
                    fieldCard {
                        HStack(spacing: 12) {
                            Image(systemName: "globe")
                                .foregroundColor(.white.opacity(0.5))
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(NSLocalizedString("Website", comment: "Website label"))
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                                TextField("https://", text: $website)
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                                    .autocorrectionDisabled()
                                    .textInputAutocapitalization(.never)
                                    .keyboardType(.URL)
                                    .onChange(of: website) { _ in
                                        websiteError = nil
                                    }
                            }
                        }
                        if let error = websiteError {
                            errorLabel(error)
                        }
                    }

                    // Comment field
                    fieldCard {
                        HStack(spacing: 12) {
                            Image(systemName: "doc.text.fill")
                                .foregroundColor(.white.opacity(0.5))
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(NSLocalizedString("Comment", comment: "Comment label"))
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                                TextField("", text: $comment, prompt: Text(NSLocalizedString("Add comment", comment: "Comment placeholder")).foregroundColor(.white.opacity(0.3)))
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                            }
                        }
                    }

                    // Attachments display
                    if !attachments.isEmpty {
                        VStack(spacing: 4) {
                            ForEach(attachments) { attachment in
                                attachmentRow(attachment)
                            }
                        }
                    }

                    Spacer().frame(height: 16)
                }
                .padding(.horizontal, Constants.Layout.horizontalPadding)
            }

            // Bottom buttons (pinned)
            VStack(spacing: 8) {
                // Error messages
                if let error = saveError {
                    Text(error)
                        .font(.system(size: 13))
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 8)
                }

                if let error = fileSizeError {
                    Text(error)
                        .font(.system(size: 13))
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 8)
                }

                // Save button
                Button(action: handleSave) {
                    if isSaving {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .black))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(
                                RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                    .fill(Constants.Colors.primaryGreen)
                            )
                    } else {
                        Text(NSLocalizedString("Save", comment: "Save button"))
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(
                            RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                .fill(Constants.Colors.primaryGreen)
                        )
                    }
                }
                .disabled(isSaving)
                .opacity(isSaving ? 0.6 : 1.0)

                // Upload File button
                Button(action: { showFilePicker = true }) {
                    Text(NSLocalizedString("Upload File", comment: "Upload file button"))
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Constants.Colors.primaryGreen)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                            .stroke(Constants.Colors.primaryGreen, lineWidth: 2)
                    )
                }
                .disabled(isSaving)
            }
            .padding(.horizontal, Constants.Layout.horizontalPadding)
            .padding(.bottom, 16)
        }
        .onAppear {
            initializeForm()
        }
        .sheet(isPresented: $showFolderPicker) {
            folderPickerSheet
        }
        .sheet(isPresented: $showFilePicker) {
            DocumentPickerView { url in
                handleFileSelected(url: url)
            }
        }
    }

    // MARK: - Header

    private var headerView: some View {
        HStack {
            // Folder selector on the left
            Button(action: { showFolderPicker = true }) {
                HStack(spacing: 4) {
                    Image(systemName: "chevron.down")
                        .font(.system(size: 10))
                    Text(selectedFolder ?? NSLocalizedString("No folder", comment: "No folder label"))
                        .font(.system(size: 14))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                        .fill(Color.white.opacity(0.1))
                )
            }

            Spacer()

            // Cancel button on the right (matching CancelHeader pattern)
            Button(action: onCancel) {
                Text("Cancel")
                    .font(.system(size: 16))
                    .foregroundColor(Constants.Colors.primaryGreen)
            }
        }
        .padding(.horizontal, Constants.Layout.horizontalPadding)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }

    // MARK: - Folder Picker

    private var folderPickerSheet: some View {
        NavigationView {
            List {
                Button(action: {
                    selectedFolder = nil
                    showFolderPicker = false
                }) {
                    HStack {
                        Text(NSLocalizedString("No folder", comment: "No folder option"))
                            .foregroundColor(.primary)
                        Spacer()
                        if selectedFolder == nil {
                            Image(systemName: "checkmark")
                                .foregroundColor(Color(red: 0xB0/255, green: 0xD9/255, blue: 0x44/255))
                        }
                    }
                }

                ForEach(preloadedFolders, id: \.self) { folder in
                    Button(action: {
                        selectedFolder = folder
                        showFolderPicker = false
                    }) {
                        HStack {
                            Text(folder)
                                .foregroundColor(.primary)
                            Spacer()
                            if selectedFolder == folder {
                                Image(systemName: "checkmark")
                                    .foregroundColor(Color(red: 0xB0/255, green: 0xD9/255, blue: 0x44/255))
                            }
                        }
                    }
                }
            }
            .navigationTitle(NSLocalizedString("Select Folder", comment: "Folder picker title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(NSLocalizedString("Done", comment: "Done button")) {
                        showFolderPicker = false
                    }
                }
            }
        }
        .presentationDetents([.medium])
    }

    // MARK: - Field Components

    private func fieldCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            content()
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .fill(Color.white.opacity(0.05))
        )
        .overlay(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    private func errorLabel(_ message: String) -> some View {
        HStack(spacing: 4) {
            Image(systemName: "exclamationmark.circle.fill")
                .font(.system(size: 10))
            Text(message)
                .font(.system(size: 11, weight: .medium))
        }
        .foregroundColor(.red)
        .padding(.top, 2)
    }

    private func attachmentRow(_ attachment: AttachmentFile) -> some View {
        HStack(spacing: 12) {
            Image(systemName: isImageFile(attachment.name) ? "photo" : "doc.fill")
                .foregroundColor(.white.opacity(0.5))
                .frame(width: 24)
            Text(attachment.name)
                .font(.system(size: 14))
                .foregroundColor(.white)
                .lineLimit(1)
            Spacer()
            Button(action: {
                attachments.removeAll { $0.id == attachment.id }
            }) {
                Image(systemName: "trash.fill")
                    .font(.system(size: 14))
                    .foregroundColor(.red.opacity(0.7))
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .fill(Color.white.opacity(0.05))
        )
        .overlay(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }

    // MARK: - Initialization

    private func initializeForm() {
        if let record = existingRecord {
            // Pre-populate from existing record
            let data = record["data"] as? [String: Any] ?? [:]
            title = data["title"] as? String ?? ""
            username = data["username"] as? String ?? ""
            let websites = data["websites"] as? [String] ?? []
            website = websites.first ?? ""
            comment = data["note"] as? String ?? ""
            selectedFolder = record["folder"] as? String
            if let existingPasskeyCreatedAt = data["passkeyCreatedAt"] as? Int64 {
                passkeyCreatedAt = existingPasskeyCreatedAt
            } else {
                passkeyCreatedAt = Int64(Date().timeIntervalSince1970 * 1000)
            }
        } else {
            // Pre-populate from passkey request
            title = request.rpName
            username = request.userName
            website = "https://\(request.rpId)"
            comment = ""
            selectedFolder = nil
            passkeyCreatedAt = Int64(Date().timeIntervalSince1970 * 1000)
        }
    }

    // MARK: - Validation (matches main app rules)

    private func validate() -> Bool {
        var isValid = true

        // Title: required
        if title.trimmingCharacters(in: .whitespaces).isEmpty {
            titleError = NSLocalizedString("Title is required", comment: "Title validation error")
            isValid = false
        }

        // Website: optional, but if provided must be valid URL
        let trimmedWebsite = website.trimmingCharacters(in: .whitespaces)
        if !trimmedWebsite.isEmpty {
            let urlString = addHttps(trimmedWebsite)
            if let url = URL(string: urlString),
               let host = url.host,
               host.contains(".") {
                // Valid URL
            } else {
                websiteError = NSLocalizedString("Wrong format of website", comment: "Website validation error")
                isValid = false
            }
        }

        return isValid
    }

    // MARK: - Save

    private func handleSave() {
        guard !isSaving else { return }

        // Run validation
        guard validate() else { return }

        isSaving = true
        saveError = nil

        // Normalize website
        let trimmedWebsite = website.trimmingCharacters(in: .whitespaces)
        var websites: [String] = []
        if !trimmedWebsite.isEmpty {
            websites.append(addHttps(trimmedWebsite))
        }

        let formData = PasskeyFormData(
            title: title.trimmingCharacters(in: .whitespaces),
            username: username,
            websites: websites,
            note: comment,
            folder: selectedFolder,
            attachments: attachments,
            passkeyCreatedAt: passkeyCreatedAt,
            existingRecord: existingRecord
        )

        onSave(formData)
    }

    // MARK: - File Handling

    private func handleFileSelected(url: URL) {
        guard url.startAccessingSecurityScopedResource() else { return }
        defer { url.stopAccessingSecurityScopedResource() }

        do {
            let fileData = try Data(contentsOf: url)

            // Validate file size: max 6 MB
            let sizeMB = Double(fileData.count) / (1024.0 * 1024.0)
            if sizeMB > 6.0 {
                fileSizeError = NSLocalizedString("Your file is too large. Please upload one that's 6 MB or smaller.", comment: "File size error")
                return
            }

            fileSizeError = nil
            let fileName = url.lastPathComponent
            let attachment = AttachmentFile(
                id: UUID().uuidString,
                name: fileName,
                data: fileData
            )
            attachments.append(attachment)
        } catch {
            print("[PasskeyFormView] Error reading file: \(error)")
        }
    }

    // MARK: - Helpers

    private func addHttps(_ urlString: String) -> String {
        let lower = urlString.lowercased()
        if lower.hasPrefix("http://") || lower.hasPrefix("https://") {
            return lower
        }
        return "https://\(lower)"
    }

    private func formatPasskeyDate(_ timestamp: Int64) -> String {
        let date = Date(timeIntervalSince1970: TimeInterval(timestamp) / 1000.0)
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yyyy HH:mm"
        return "Created on \(formatter.string(from: date))"
    }

    private func isImageFile(_ name: String) -> Bool {
        let imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"]
        let ext = (name as NSString).pathExtension.lowercased()
        return imageExtensions.contains(ext)
    }
}

// MARK: - Form Data Model

struct PasskeyFormData {
    let title: String
    let username: String
    let websites: [String]
    let note: String
    let folder: String?
    let attachments: [AttachmentFile]
    let passkeyCreatedAt: Int64
    let existingRecord: [String: Any]?
}

// MARK: - Document Picker

struct DocumentPickerView: UIViewControllerRepresentable {
    let onPick: (URL) -> Void

    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [UTType.item])
        picker.allowsMultipleSelection = false
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onPick: onPick)
    }

    class Coordinator: NSObject, UIDocumentPickerDelegate {
        let onPick: (URL) -> Void

        init(onPick: @escaping (URL) -> Void) {
            self.onPick = onPick
        }

        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
            guard let url = urls.first else { return }
            onPick(url)
        }
    }
}
