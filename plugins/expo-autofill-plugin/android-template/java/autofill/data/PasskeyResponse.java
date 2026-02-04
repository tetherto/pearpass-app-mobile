package com.pears.pass.autofill.data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Response data for passkey registration.
 * Matches the browser extension's credential response structure exactly.
 */
public class PasskeyResponse {
    private final String clientDataJSON;       // Base64URL
    private final String attestationObject;    // Base64URL
    private final String authenticatorData;    // Base64URL
    private final String publicKey;            // Base64URL SPKI
    private final int publicKeyAlgorithm;      // -7 for ES256
    private final List<String> transports;     // ["internal"]

    public PasskeyResponse(String clientDataJSON, String attestationObject,
                           String authenticatorData, String publicKey,
                           int publicKeyAlgorithm, List<String> transports) {
        this.clientDataJSON = clientDataJSON;
        this.attestationObject = attestationObject;
        this.authenticatorData = authenticatorData;
        this.publicKey = publicKey;
        this.publicKeyAlgorithm = publicKeyAlgorithm;
        this.transports = transports;
    }

    public String getClientDataJSON() { return clientDataJSON; }
    public String getAttestationObject() { return attestationObject; }
    public String getAuthenticatorData() { return authenticatorData; }
    public String getPublicKey() { return publicKey; }
    public int getPublicKeyAlgorithm() { return publicKeyAlgorithm; }
    public List<String> getTransports() { return transports; }

    /**
     * Serialize to Map for vault storage.
     */
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("clientDataJSON", clientDataJSON);
        map.put("attestationObject", attestationObject);
        map.put("authenticatorData", authenticatorData);
        map.put("publicKey", publicKey);
        map.put("publicKeyAlgorithm", publicKeyAlgorithm);
        map.put("transports", transports);
        return map;
    }

    /**
     * Deserialize from Map (vault record data).
     */
    @SuppressWarnings("unchecked")
    public static PasskeyResponse fromMap(Map<String, Object> map) {
        if (map == null) return null;

        String clientDataJSON = (String) map.get("clientDataJSON");
        String attestationObject = (String) map.get("attestationObject");
        String authenticatorData = (String) map.get("authenticatorData");
        String publicKey = (String) map.get("publicKey");

        int publicKeyAlgorithm = -7;
        Object algObj = map.get("publicKeyAlgorithm");
        if (algObj instanceof Number) {
            publicKeyAlgorithm = ((Number) algObj).intValue();
        }

        List<String> transports = Arrays.asList("internal");
        Object transportsObj = map.get("transports");
        if (transportsObj instanceof List) {
            transports = (List<String>) transportsObj;
        }

        if (clientDataJSON == null || attestationObject == null ||
            authenticatorData == null || publicKey == null) {
            return null;
        }

        return new PasskeyResponse(clientDataJSON, attestationObject,
                authenticatorData, publicKey, publicKeyAlgorithm, transports);
    }
}
