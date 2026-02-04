package com.pears.pass.autofill.data;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

public class CredentialItem {
    private String id;
    private String title;
    private String username;
    private String password;
    private String url;
    private String notes;
    private List<String> websites;

    // Passkey fields
    private boolean hasPasskey;
    private long passkeyCreatedAt;
    private Map<String, Object> credential;
    private String privateKeyBuffer;  // Base64URL-encoded PKCS#8
    private String userId;            // Base64URL user ID
    private String credentialId;      // Base64URL credential ID

    public CredentialItem(String id, String title, String username, String password) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.websites = new ArrayList<>();
        this.hasPasskey = false;
    }

    public CredentialItem(String id, String title, String username, String password, List<String> websites) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.websites = websites != null ? websites : new ArrayList<>();
        this.hasPasskey = false;
    }

    /**
     * Constructor with passkey data.
     */
    public CredentialItem(String id, String title, String username, String password,
                          List<String> websites, boolean hasPasskey, long passkeyCreatedAt,
                          Map<String, Object> credential, String privateKeyBuffer,
                          String userId, String credentialId) {
        this.id = id;
        this.title = title;
        this.username = username;
        this.password = password;
        this.websites = websites != null ? websites : new ArrayList<>();
        this.hasPasskey = hasPasskey;
        this.passkeyCreatedAt = passkeyCreatedAt;
        this.credential = credential;
        this.privateKeyBuffer = privateKeyBuffer;
        this.userId = userId;
        this.credentialId = credentialId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<String> getWebsites() {
        return websites;
    }

    public void setWebsites(List<String> websites) {
        this.websites = websites != null ? websites : new ArrayList<>();
    }

    // Passkey getters and setters

    public boolean hasPasskey() {
        return hasPasskey;
    }

    public void setHasPasskey(boolean hasPasskey) {
        this.hasPasskey = hasPasskey;
    }

    public long getPasskeyCreatedAt() {
        return passkeyCreatedAt;
    }

    public void setPasskeyCreatedAt(long passkeyCreatedAt) {
        this.passkeyCreatedAt = passkeyCreatedAt;
    }

    public Map<String, Object> getCredential() {
        return credential;
    }

    public void setCredential(Map<String, Object> credential) {
        this.credential = credential;
    }

    public String getPrivateKeyBuffer() {
        return privateKeyBuffer;
    }

    public void setPrivateKeyBuffer(String privateKeyBuffer) {
        this.privateKeyBuffer = privateKeyBuffer;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(String credentialId) {
        this.credentialId = credentialId;
    }

    /**
     * Get the passkey credential parsed from the raw credential map.
     */
    public PasskeyCredential getPasskeyCredential() {
        if (!hasPasskey || credential == null) {
            return null;
        }
        return PasskeyCredential.fromMap(credential);
    }
}
