package com.pears.pass.autofill.jobs;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Payload for UPDATE_PASSKEY jobs.
 * Contains the fields needed to merge a new passkey credential into an existing login record.
 *
 * Unlike AddPasskeyPayload, this does not include user-edited fields (title, note, folder,
 * websites) or attachments, since the existing record already has those.
 *
 * All binary fields are stored as base64URL strings.
 */
public class UpdatePasskeyPayload {

    // Existing record to merge into
    private final String existingRecordId;

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

    // Target vault
    private final String vaultId;

    public UpdatePasskeyPayload(String existingRecordId,
                                String rpId, String rpName,
                                String userId, String userName, String userDisplayName,
                                String credentialId, String publicKey, String privateKey,
                                String clientDataJSON, String attestationObject,
                                String authenticatorData,
                                int algorithm, long createdAt, List<String> transports,
                                String vaultId) {
        this.existingRecordId = existingRecordId;
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
        this.vaultId = vaultId;
    }

    // Getters

    public String getExistingRecordId() { return existingRecordId; }
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
    public String getVaultId() { return vaultId; }

    /**
     * Serialize to JSON for inclusion in the encrypted job file.
     */
    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();

        json.put("existingRecordId", existingRecordId);

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

        json.put("vaultId", vaultId);

        return json;
    }

    /**
     * Deserialize from JSON when reading the encrypted job file.
     */
    public static UpdatePasskeyPayload fromJSON(JSONObject json) throws JSONException {
        // Transports
        List<String> transports = new ArrayList<>();
        JSONArray transportsArray = json.optJSONArray("transports");
        if (transportsArray != null) {
            for (int i = 0; i < transportsArray.length(); i++) {
                transports.add(transportsArray.getString(i));
            }
        }

        return new UpdatePasskeyPayload(
                json.getString("existingRecordId"),
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
                json.getString("vaultId")
        );
    }
}
