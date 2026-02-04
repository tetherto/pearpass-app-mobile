package com.pears.pass.autofill.data;

import com.pears.pass.autofill.crypto.Base64URLUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * Complete passkey credential matching browser extension structure.
 * Stored in vault records under the "credential" field.
 */
public class PasskeyCredential {
    private final String id;                        // Base64URL credential ID
    private final String rawId;                     // Base64URL (same as id)
    private final String type;                      // "public-key"
    private final PasskeyResponse response;
    private final String authenticatorAttachment;   // "platform"
    private final boolean credPropsRk;              // Resident key / discoverable credential
    private final byte[] privateKeyBuffer;          // PKCS#8 private key (binary)
    private final String userId;                    // Base64URL user ID

    public PasskeyCredential(String id, String rawId, String type,
                             PasskeyResponse response, String authenticatorAttachment,
                             boolean credPropsRk, byte[] privateKeyBuffer, String userId) {
        this.id = id;
        this.rawId = rawId;
        this.type = type;
        this.response = response;
        this.authenticatorAttachment = authenticatorAttachment;
        this.credPropsRk = credPropsRk;
        this.privateKeyBuffer = privateKeyBuffer;
        this.userId = userId;
    }

    /**
     * Factory method for creating a new passkey credential.
     */
    public static PasskeyCredential create(String credentialId, PasskeyResponse response,
                                            byte[] privateKeyBuffer, String userId) {
        return new PasskeyCredential(
                credentialId, credentialId, "public-key",
                response, "platform", true,
                privateKeyBuffer, userId
        );
    }

    public String getId() { return id; }
    public String getRawId() { return rawId; }
    public String getType() { return type; }
    public PasskeyResponse getResponse() { return response; }
    public String getAuthenticatorAttachment() { return authenticatorAttachment; }
    public boolean isCredPropsRk() { return credPropsRk; }
    public byte[] getPrivateKeyBuffer() { return privateKeyBuffer; }
    public String getUserId() { return userId; }

    /**
     * Serialize to Map for vault storage.
     * Encodes private key buffer as Base64URL string.
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("rawId", rawId);
        map.put("type", type);
        map.put("response", response.toMap());
        map.put("authenticatorAttachment", authenticatorAttachment);

        Map<String, Object> credProps = new HashMap<>();
        credProps.put("rk", credPropsRk);
        Map<String, Object> clientExtResults = new HashMap<>();
        clientExtResults.put("credProps", credProps);
        map.put("clientExtensionResults", clientExtResults);

        map.put("_privateKeyBuffer", Base64URLUtils.encode(privateKeyBuffer));
        map.put("_userId", userId);

        return map;
    }

    /**
     * Deserialize from Map (vault record data).
     * Decodes Base64URL string to private key buffer.
     */
    @SuppressWarnings("unchecked")
    public static PasskeyCredential fromMap(Map<String, Object> map) {
        if (map == null) return null;

        String id = (String) map.get("id");
        String rawId = (String) map.get("rawId");
        String type = (String) map.get("type");
        String authenticatorAttachment = (String) map.get("authenticatorAttachment");
        String userId = (String) map.get("_userId");

        // Parse response
        Map<String, Object> responseMap = (Map<String, Object>) map.get("response");
        PasskeyResponse response = PasskeyResponse.fromMap(responseMap);

        // Parse private key buffer
        String privateKeyB64 = (String) map.get("_privateKeyBuffer");
        if (id == null || rawId == null || type == null || response == null || privateKeyB64 == null || userId == null) {
            return null;
        }
        byte[] privateKeyBuffer = Base64URLUtils.decode(privateKeyB64);

        // Parse client extension results
        boolean rk = true;
        Map<String, Object> clientExtResults = (Map<String, Object>) map.get("clientExtensionResults");
        if (clientExtResults != null) {
            Map<String, Object> credPropsMap = (Map<String, Object>) clientExtResults.get("credProps");
            if (credPropsMap != null && credPropsMap.get("rk") instanceof Boolean) {
                rk = (Boolean) credPropsMap.get("rk");
            }
        }

        return new PasskeyCredential(id, rawId, type, response,
                authenticatorAttachment != null ? authenticatorAttachment : "platform",
                rk, privateKeyBuffer, userId);
    }
}
