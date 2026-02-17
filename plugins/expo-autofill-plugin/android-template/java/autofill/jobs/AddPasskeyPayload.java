package com.pears.pass.autofill.jobs;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Payload for ADD_PASSKEY jobs.
 * Contains all WebAuthn credential fields, user-edited metadata, and attachment references.
 *
 * All binary fields (credentialId, publicKey, privateKey, clientDataJSON,
 * attestationObject, authenticatorData, userId) are stored as base64URL strings.
 */
public class AddPasskeyPayload {

    // WebAuthn relying party fields
    private final String rpId;
    private final String rpName;

    // WebAuthn user fields
    private final String userId;
    private final String userName;
    private final String userDisplayName;

    // WebAuthn credential fields (all base64URL encoded)
    private final String credentialId;
    private final String publicKey;
    private final String privateKey;
    private final String clientDataJSON;
    private final String attestationObject;
    private final String authenticatorData;

    // Credential metadata
    private final int algorithm;
    private final long createdAt;
    private final List<String> transports;

    // Record identification
    private final String recordId;

    // User-edited fields (optional)
    private final String title;
    private final String note;
    private final String folder;
    private final List<String> websites;

    // File attachments
    private final List<JobAttachment> attachments;

    public AddPasskeyPayload(String rpId, String rpName,
                             String userId, String userName, String userDisplayName,
                             String credentialId, String publicKey, String privateKey,
                             String clientDataJSON, String attestationObject,
                             String authenticatorData,
                             int algorithm, long createdAt, List<String> transports,
                             String recordId,
                             String title, String note, String folder,
                             List<String> websites,
                             List<JobAttachment> attachments) {
        this.rpId = rpId;
        this.rpName = rpName;
        this.userId = userId;
        this.userName = userName;
        this.userDisplayName = userDisplayName;
        this.credentialId = credentialId;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.clientDataJSON = clientDataJSON;
        this.attestationObject = attestationObject;
        this.authenticatorData = authenticatorData;
        this.algorithm = algorithm;
        this.createdAt = createdAt;
        this.transports = transports != null ? transports : new ArrayList<>();
        this.recordId = recordId;
        this.title = title;
        this.note = note;
        this.folder = folder;
        this.websites = websites;
        this.attachments = attachments != null ? attachments : new ArrayList<>();
    }

    // Getters

    public String getRpId() { return rpId; }
    public String getRpName() { return rpName; }
    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserDisplayName() { return userDisplayName; }
    public String getCredentialId() { return credentialId; }
    public String getPublicKey() { return publicKey; }
    public String getPrivateKey() { return privateKey; }
    public String getClientDataJSON() { return clientDataJSON; }
    public String getAttestationObject() { return attestationObject; }
    public String getAuthenticatorData() { return authenticatorData; }
    public int getAlgorithm() { return algorithm; }
    public long getCreatedAt() { return createdAt; }
    public List<String> getTransports() { return transports; }
    public String getRecordId() { return recordId; }
    public String getTitle() { return title; }
    public String getNote() { return note; }
    public String getFolder() { return folder; }
    public List<String> getWebsites() { return websites; }
    public List<JobAttachment> getAttachments() { return attachments; }

    /**
     * Serialize to JSON for inclusion in the encrypted job file.
     */
    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();

        // Relying party
        json.put("rpId", rpId);
        json.put("rpName", rpName);

        // User
        json.put("userId", userId);
        json.put("userName", userName);
        json.put("userDisplayName", userDisplayName);

        // Credential
        json.put("credentialId", credentialId);
        json.put("publicKey", publicKey);
        json.put("privateKey", privateKey);
        json.put("clientDataJSON", clientDataJSON);
        json.put("attestationObject", attestationObject);
        json.put("authenticatorData", authenticatorData);

        // Metadata
        json.put("algorithm", algorithm);
        json.put("createdAt", createdAt);

        JSONArray transportsArray = new JSONArray();
        for (String transport : transports) {
            transportsArray.put(transport);
        }
        json.put("transports", transportsArray);

        // Record
        json.put("recordId", recordId);

        // User-edited fields (only include if non-null)
        if (title != null) {
            json.put("title", title);
        }
        if (note != null) {
            json.put("note", note);
        }
        if (folder != null) {
            json.put("folder", folder);
        }
        if (websites != null && !websites.isEmpty()) {
            JSONArray websitesArray = new JSONArray();
            for (String website : websites) {
                websitesArray.put(website);
            }
            json.put("websites", websitesArray);
        }

        // Attachments
        JSONArray attachmentsArray = new JSONArray();
        for (JobAttachment attachment : attachments) {
            attachmentsArray.put(attachment.toJSON());
        }
        json.put("attachments", attachmentsArray);

        return json;
    }

    /**
     * Deserialize from JSON when reading the encrypted job file.
     */
    public static AddPasskeyPayload fromJSON(JSONObject json) throws JSONException {
        // Transports
        List<String> transports = new ArrayList<>();
        JSONArray transportsArray = json.optJSONArray("transports");
        if (transportsArray != null) {
            for (int i = 0; i < transportsArray.length(); i++) {
                transports.add(transportsArray.getString(i));
            }
        }

        // Websites
        List<String> websites = null;
        JSONArray websitesArray = json.optJSONArray("websites");
        if (websitesArray != null) {
            websites = new ArrayList<>();
            for (int i = 0; i < websitesArray.length(); i++) {
                websites.add(websitesArray.getString(i));
            }
        }

        // Attachments
        List<JobAttachment> attachments = new ArrayList<>();
        JSONArray attachmentsArray = json.optJSONArray("attachments");
        if (attachmentsArray != null) {
            for (int i = 0; i < attachmentsArray.length(); i++) {
                attachments.add(JobAttachment.fromJSON(attachmentsArray.getJSONObject(i)));
            }
        }

        return new AddPasskeyPayload(
                json.getString("rpId"),
                json.getString("rpName"),
                json.getString("userId"),
                json.getString("userName"),
                json.getString("userDisplayName"),
                json.getString("credentialId"),
                json.getString("publicKey"),
                json.getString("privateKey"),
                json.getString("clientDataJSON"),
                json.getString("attestationObject"),
                json.getString("authenticatorData"),
                json.optInt("algorithm", -7),
                json.getLong("createdAt"),
                transports,
                json.getString("recordId"),
                json.optString("title", null),
                json.optString("note", null),
                json.optString("folder", null),
                websites,
                attachments
        );
    }
}
