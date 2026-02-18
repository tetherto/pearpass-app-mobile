package com.pears.pass.autofill.data;

import java.util.ArrayList;
import java.util.List;

/**
 * Form data for passkey registration.
 * Captures user-entered metadata to store alongside the passkey credential.
 */
public class PasskeyFormData {
    private final String title;
    private final String username;
    private final List<String> websites;
    private final String note;
    private final String folder;
    private final String existingRecordId;
    private final long passkeyCreatedAt;
    private final List<AttachmentFile> attachments;
    private final List<String> keepAttachmentIds;

    /**
     * File attachment model matching iOS AttachmentFile struct.
     */
    public static class AttachmentFile {
        private final String id;
        private final String name;
        private final byte[] data;

        public AttachmentFile(String id, String name, byte[] data) {
            this.id = id;
            this.name = name;
            this.data = data;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public byte[] getData() { return data; }
    }

    public PasskeyFormData(String title, String username, List<String> websites,
                           String note, String folder, String existingRecordId,
                           long passkeyCreatedAt, List<AttachmentFile> attachments,
                           List<String> keepAttachmentIds) {
        this.title = title;
        this.username = username;
        this.websites = websites;
        this.note = note;
        this.folder = folder;
        this.existingRecordId = existingRecordId;
        this.passkeyCreatedAt = passkeyCreatedAt;
        this.attachments = attachments != null ? attachments : new ArrayList<>();
        this.keepAttachmentIds = keepAttachmentIds != null ? keepAttachmentIds : new ArrayList<>();
    }

    public String getTitle() { return title; }
    public String getUsername() { return username; }
    public List<String> getWebsites() { return websites; }
    public String getNote() { return note; }
    public String getFolder() { return folder; }
    public String getExistingRecordId() { return existingRecordId; }
    public long getPasskeyCreatedAt() { return passkeyCreatedAt; }
    public List<AttachmentFile> getAttachments() { return attachments; }
    public List<String> getKeepAttachmentIds() { return keepAttachmentIds; }
}
