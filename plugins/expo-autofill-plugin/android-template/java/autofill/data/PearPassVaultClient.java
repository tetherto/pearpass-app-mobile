package com.pears.pass.autofill.data;

import android.content.Context;

import com.pears.pass.autofill.utils.SecureLog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.pears.pass.autofill.utils.VaultErrorUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class PearPassVaultClient {
    private static final String TAG = "PearPassVaultClient";

    // API Commands
    private enum API {
        STORAGE_PATH_SET(1),
        MASTER_VAULT_INIT(2),
        MASTER_VAULT_GET_STATUS(3),
        MASTER_VAULT_GET(4),
        MASTER_VAULT_CLOSE(5),
        MASTER_VAULT_ADD(6),
        MASTER_VAULT_LIST(7),
        ACTIVE_VAULT_FILE_ADD(8),
        ACTIVE_VAULT_FILE_REMOVE(9),
        ACTIVE_VAULT_FILE_GET(10),
        ACTIVE_VAULT_INIT(11),
        ACTIVE_VAULT_GET_STATUS(12),
        ACTIVE_VAULT_CLOSE(13),
        ACTIVE_VAULT_ADD(14),
        ACTIVE_VAULT_REMOVE(15),
        ACTIVE_VAULT_LIST(16),
        ACTIVE_VAULT_GET(17),
        ACTIVE_VAULT_CREATE_INVITE(18),
        ACTIVE_VAULT_DELETE_INVITE(19),
        PAIR_ACTIVE_VAULT(20),
        INIT_LISTENER(21),
        ON_UPDATE(22),
        ENCRYPTION_INIT(23),
        ENCRYPTION_GET_STATUS(24),
        ENCRYPTION_GET(25),
        ENCRYPTION_ADD(26),
        ENCRYPTION_CLOSE(27),
        ENCRYPTION_HASH_PASSWORD(28),
        ENCRYPTION_ENCRYPT_VAULT_KEY_WITH_HASHED_PASSWORD(29),
        ENCRYPTION_ENCRYPT_VAULT_WITH_KEY(30),
        ENCRYPTION_DECRYPT_VAULT_KEY(31),
        ENCRYPTION_GET_DECRYPTION_KEY(32),
        CLOSE_ALL_INSTANCES(33),
        CANCEL_PAIR_ACTIVE_VAULT(34),
        MASTER_PASSWORD_CREATE(43),
        MASTER_PASSWORD_INIT_WITH_PASSWORD(44),
        MASTER_PASSWORD_UPDATE(45),
        MASTER_PASSWORD_INIT_WITH_CREDENTIALS(46),
        SET_CORE_STORE_OPTIONS(49);

        private final int value;

        API(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    // Properties
    private final Context context;
    private final String storagePath;
    private final boolean debugMode;
    private final boolean readOnly;
    private BareHelper bareHelper;
    private boolean isWorkletInitialized = false;
    private volatile boolean isFullyInitialized = false;
    private volatile Exception initializationError = null;
    private final CompletableFuture<Void> initializationFuture = new CompletableFuture<>();

    // Synchronization for IPC calls
    private final Object ipcLock = new Object();
    private CompletableFuture<Map<String, Object>> currentRequest = null;

    // Data Classes
    public static class VaultStatus {
        public final boolean isInitialized;
        public final boolean isLocked;
        public final String id;

        public VaultStatus(boolean isInitialized, boolean isLocked, String id) {
            this.isInitialized = isInitialized;
            this.isLocked = isLocked;
            this.id = id;
        }
    }

    public static class EncryptionStatus {
        public final boolean status;
        public final boolean hasKey;

        public EncryptionStatus(boolean status, boolean hasKey) {
            this.status = status;
            this.hasKey = hasKey;
        }
    }

    public static class DecryptionKeyResult {
        public final String key;
        public final String salt;

        public DecryptionKeyResult(String key, String salt) {
            this.key = key;
            this.salt = salt;
        }
    }

    public static class MasterPasswordEncryption {
        public final String ciphertext;
        public final String nonce;
        public final String salt;
        public final String hashedPassword;

        public MasterPasswordEncryption(String ciphertext, String nonce, String salt, String hashedPassword) {
            this.ciphertext = ciphertext;
            this.nonce = nonce;
            this.salt = salt;
            this.hashedPassword = hashedPassword;
        }
    }

    public static class Vault {
        public final String id;
        public final String name;
        public final int version;
        public final List<Map<String, Object>> records;
        public final List<Map<String, Object>> devices;
        public final Date createdAt;
        public final Date updatedAt;
        public final VaultEncryption encryption;

        public static class VaultEncryption {
            public final String ciphertext;
            public final String nonce;
            public final String hashedPassword;
            public final String salt;

            public VaultEncryption(String ciphertext, String nonce, String hashedPassword, String salt) {
                this.ciphertext = ciphertext;
                this.nonce = nonce;
                this.hashedPassword = hashedPassword;
                this.salt = salt;
            }
        }

        public Vault(String id, String name, int version, List<Map<String, Object>> records,
                     List<Map<String, Object>> devices, Date createdAt, Date updatedAt, VaultEncryption encryption) {
            this.id = id;
            this.name = name;
            this.version = version;
            this.records = records;
            this.devices = devices;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.encryption = encryption;
        }
    }

    // Constructors

    public PearPassVaultClient(Context context, String storagePath, boolean debugMode) {
        this(context, storagePath, debugMode, true);
    }

    public PearPassVaultClient(Context context, String storagePath, boolean debugMode, boolean readOnly) {
        this.context = context;
        this.storagePath = storagePath;
        this.debugMode = debugMode;
        this.readOnly = readOnly;

        // Initialize the worklet synchronously on the current thread
        try {
            String pathToUse = Utils.getVaultStoragePath(context, storagePath);
            if (pathToUse == null) {
                logError("Failed to determine storage path");
                initializationError = new RuntimeException("Failed to determine storage path");
                return;
            }

            // Initialize the worklet on the current thread
            initializeWorklet();
            log("Worklet initialized successfully");

            // Set the storage path and core store options asynchronously
            setStoragePath(pathToUse)
                .thenCompose(v -> {
                    log("Setting core store options: readOnly=" + readOnly);
                    return setCoreStoreOptions(readOnly);
                })
                .whenComplete((result, error) -> {
                    if (error != null) {
                        logError("Failed to initialize: " + error.getMessage());
                        initializationError = new RuntimeException("Failed to initialize", error);
                        initializationFuture.completeExceptionally(initializationError);
                    } else {
                        log("Vault client fully initialized with readOnly=" + readOnly);
                        isFullyInitialized = true;
                        initializationFuture.complete(null);
                    }
                });
        } catch (Exception e) {
            logError("Failed to initialize: " + e.getMessage());
            initializationError = new RuntimeException("Failed to initialize", e);
            initializationFuture.completeExceptionally(initializationError);
        }
    }

    // Ensures the vault client is fully initialized before use
    public CompletableFuture<Void> waitForInitialization() {
        return initializationFuture;
    }

    private void initializeWorklet() throws Exception {
        if (bareHelper != null) {
            log("Worklet already initialized");
            return;
        }

        log("Starting BareKit initialization with BareHelper");

        // Create BareHelper with bundle name, type, and 64MB memory limit
        bareHelper = new BareHelper(context, "extension", "bundle", 64);
        log("BareHelper created successfully");

        // Start the worklet
        log("Starting worklet...");

        boolean success = bareHelper.startWorklet();

        if (success) {
            log("Worklet started successfully with BareHelper");
            isWorkletInitialized = true;
        } else {
            logError("Failed to start worklet with BareHelper");
            isWorkletInitialized = false;
            throw new PearPassVaultException("Vault is not initialized");
        }

        log("BareKit initialization completed");
    }

    // Request Handling
    private CompletableFuture<Map<String, Object>> sendRequest(int command, Map<String, Object> data) {
        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();

        // Allow STORAGE_PATH_SET and SET_CORE_STORE_OPTIONS commands during initialization
        if (command != API.STORAGE_PATH_SET.getValue() &&
            command != API.SET_CORE_STORE_OPTIONS.getValue() &&
            !isFullyInitialized) {
            future.completeExceptionally(new PearPassVaultException("Vault is not initialized"));
            return future;
        }

        if (bareHelper == null || !isWorkletInitialized) {
            future.completeExceptionally(new PearPassVaultException("Worklet is not initialized"));
            return future;
        }

        // Wait for any existing request to complete before proceeding
        CompletableFuture<Map<String, Object>> previousRequest;
        synchronized (ipcLock) {
            previousRequest = currentRequest;
            currentRequest = future;
        }

        // If there's a previous request, wait for it to complete
        if (previousRequest != null) {
            log("Request command " + command + " waiting for previous request to complete");
            previousRequest.whenComplete((result, error) -> {
                log("Previous request completed, now processing command " + command);
                executeRequest(command, data, future);
            });
        } else {
            // No previous request, execute immediately
            executeRequest(command, data, future);
        }

        return future;
    }

    private void executeRequest(int command, Map<String, Object> data, CompletableFuture<Map<String, Object>> future) {
        JSONObject message = new JSONObject();
        try {
            message.put("command", command);
            if (data != null) {
                message.put("data", new JSONObject(data));
            }
            message.put("source", "android-extension");
        } catch (JSONException e) {
            future.completeExceptionally(new PearPassVaultException("Failed to create request: " + e.getMessage()));
            return;
        }

        log("Sending request with command: " + command + ", data: " + (data != null ? data : "{}"));

        // Add extra logging for ENCRYPTION_INIT command
        if (command == API.ENCRYPTION_INIT.getValue()) {
            log("ENCRYPTION_INIT: About to call bareHelper.send()");
            log("ENCRYPTION_INIT: BareHelper state - " + bareHelper.toString());
            log("ENCRYPTION_INIT: Message content: " + message.toString());
            log("ENCRYPTION_INIT: Current thread: " + Thread.currentThread().getName());
        }

        try {
            bareHelper.send(message.toString(), new BareHelper.SendCallback() {
                @Override
                public void onResponse(String reply, Throwable error) {
                if (command == API.ENCRYPTION_INIT.getValue()) {
                    log("ENCRYPTION_INIT: Callback triggered - reply: " + (reply != null ? "present" : "null")
                        + ", error: " + (error != null ? error.getMessage() : "null"));
                }

                if (error != null) {
                    logError("Request command " + command + " failed with error: " + error.getMessage());
                    future.completeExceptionally(new PearPassVaultException(error.getMessage()));
                    clearCurrentRequest(future);
                } else if (reply != null) {
                    try {
                        JSONObject json = new JSONObject(reply);

                        // Check for errors in response
                        if (json.has("error")) {
                            String errorMsg = json.getString("error");
                            if (errorMsg.contains("ELOCKED")) {
                                future.completeExceptionally(new PearPassVaultException("Vault is locked"));
                            } else {
                                future.completeExceptionally(new PearPassVaultException(errorMsg));
                            }
                            clearCurrentRequest(future);
                        } else {
                            // The data field can be either a dictionary, string, or array
                            Object dataObj = json.opt("data");
                            Map<String, Object> result = null;

                            if (dataObj instanceof JSONObject) {
                                result = jsonObjectToMap((JSONObject) dataObj);
                            } else if (dataObj instanceof String) {
                                result = new HashMap<>();
                                result.put("value", dataObj);
                            } else if (dataObj instanceof JSONArray) {
                                result = new HashMap<>();
                                result.put("array", jsonArrayToList((JSONArray) dataObj));
                            }

                            if (command == API.ENCRYPTION_INIT.getValue()) {
                                log("ENCRYPTION_INIT: Successfully parsed response, result: " + result);
                            }
                            future.complete(result);
                            clearCurrentRequest(future);
                        }
                    } catch (JSONException e) {
                        logError("Failed to parse response for command " + command + ": " + e.getMessage());
                        future.completeExceptionally(new PearPassVaultException("Failed to parse response: " + e.getMessage()));
                        clearCurrentRequest(future);
                    }
                } else {
                    if (command == API.ENCRYPTION_INIT.getValue()) {
                        log("ENCRYPTION_INIT: Received null response");
                    }
                    future.complete(null);
                    clearCurrentRequest(future);
                }
                }
            });

            if (command == API.ENCRYPTION_INIT.getValue()) {
                log("ENCRYPTION_INIT: bareHelper.send() call completed without immediate crash");
            }

        } catch (Exception e) {
            logError("Exception in executeRequest for command " + command + ": " + e.getMessage());
            e.printStackTrace();
            future.completeExceptionally(new PearPassVaultException("Failed to send request: " + e.getMessage()));
            clearCurrentRequest(future);
        }
    }

    private void clearCurrentRequest(CompletableFuture<Map<String, Object>> completedFuture) {
        synchronized (ipcLock) {
            if (currentRequest == completedFuture) {
                currentRequest = null;
                log("Current request cleared, ready for next request");
            }
        }
    }

    // Storage Methods
    public CompletableFuture<Void> setStoragePath(String path) {
        return sendRequest(API.STORAGE_PATH_SET.getValue(), createMap("path", path))
                .thenAccept(result -> log("Storage path set to: " + path));
    }

    // Core Store Options
    public CompletableFuture<Void> setCoreStoreOptions(boolean readOnly) {
        Map<String, Object> coreStoreOptions = new HashMap<>();
        coreStoreOptions.put("readOnly", readOnly);
        Map<String, Object> params = new HashMap<>();
        params.put("coreStoreOptions", coreStoreOptions);
        return sendRequest(API.SET_CORE_STORE_OPTIONS.getValue(), params)
                .thenAccept(result -> log("Core store options set: readOnly=" + readOnly));
    }

    // Master Vault Methods
    public CompletableFuture<Void> vaultsInit(String encryptionKey, String hashedPassword) {
        Map<String, Object> params = new HashMap<>();
        params.put("encryptionKey", encryptionKey);
        params.put("hashedPassword", hashedPassword);
        return sendRequest(API.MASTER_VAULT_INIT.getValue(), params)
                .thenAccept(result -> log("Initialized vaults with encryption key and hashed password"));
    }

    /**
     * Initializes vaults using the provided master password.
     * @param passwordBuffer The master password as byte array
     */
    public CompletableFuture<Void> initWithPassword(byte[] passwordBuffer) {
        String passwordBase64 = android.util.Base64.encodeToString(passwordBuffer, android.util.Base64.NO_WRAP);
        return sendRequest(API.MASTER_PASSWORD_INIT_WITH_PASSWORD.getValue(), createMap("password", passwordBase64))
                .thenAccept(result -> {
                    if (result != null && result.containsKey("error")) {
                        throw new RuntimeException((String) result.get("error"));
                    }
                    log("Initialized vaults with password");
                });
    }

    /**
     * Initializes vaults using provided encryption credentials.(biometric auth).
     */
    public CompletableFuture<Void> initWithCredentials(String ciphertext, String nonce, String hashedPassword) {
        Map<String, Object> params = new HashMap<>();
        params.put("ciphertext", ciphertext);
        params.put("nonce", nonce);
        params.put("hashedPassword", hashedPassword);
        return sendRequest(API.MASTER_PASSWORD_INIT_WITH_CREDENTIALS.getValue(), params)
                .thenAccept(result -> {
                    if (result != null && result.containsKey("error")) {
                        throw new RuntimeException((String) result.get("error"));
                    }
                    log("Initialized vaults with credentials");
                });
    }

    public CompletableFuture<VaultStatus> vaultsGetStatus() {
        return sendRequest(API.MASTER_VAULT_GET_STATUS.getValue(), null)
                .thenApply(result -> {
                    boolean isInitialized = result != null && Boolean.TRUE.equals(result.get("status"));
                    boolean isLocked = !isInitialized;
                    String id = result != null ? (String) result.get("id") : null;
                    return new VaultStatus(isInitialized, isLocked, id);
                });
    }

    public CompletableFuture<Map<String, Object>> vaultsGet(String key) {
        return sendRequest(API.MASTER_VAULT_GET.getValue(), createMap("key", key))
                .thenApply(result -> result != null ? result : new HashMap<>());
    }

    public CompletableFuture<Void> vaultsClose() {
        return sendRequest(API.MASTER_VAULT_CLOSE.getValue(), null)
                .thenAccept(result -> {
                    if (result != null && result.containsKey("error")) {
                        logError("Master vault close returned error: " + result.get("error"));
                    }
                    log("Closed master vault");
                });
    }

    public CompletableFuture<Void> vaultsAdd(String key, Map<String, Object> data) {
        Map<String, Object> params = new HashMap<>();
        params.put("key", key);
        params.put("data", data);
        return sendRequest(API.MASTER_VAULT_ADD.getValue(), params)
                .thenAccept(result -> log("Added vault with key: " + key));
    }

    @SuppressWarnings("unchecked")
    public CompletableFuture<List<Map<String, Object>>> vaultsList(String filterKey) {
        return sendRequest(API.MASTER_VAULT_LIST.getValue(), createMap("filterKey", filterKey))
                .thenApply(result -> {
                    log("vaultsList raw result: " + (result != null ? result : "{}"));

                    if (result != null) {
                        if (result.containsKey("array")) {
                            List<Map<String, Object>> arrayWrapper = (List<Map<String, Object>>) result.get("array");
                            log("Found vaults in array wrapper: " + (arrayWrapper != null ? arrayWrapper.size() : 0) + " items");
                            return arrayWrapper != null ? arrayWrapper : new ArrayList<>();
                        } else if (result.containsKey("vaults")) {
                            List<Map<String, Object>> vaults = (List<Map<String, Object>>) result.get("vaults");
                            log("Found vaults in vaults key: " + (vaults != null ? vaults.size() : 0) + " items");
                            return vaults != null ? vaults : new ArrayList<>();
                        } else if (result.containsKey("data")) {
                            List<Map<String, Object>> data = (List<Map<String, Object>>) result.get("data");
                            log("Found vaults in data key: " + (data != null ? data.size() : 0) + " items");
                            return data != null ? data : new ArrayList<>();
                        }
                    }

                    log("No vaults found in response");
                    return new ArrayList<>();
                });
    }

    @SuppressWarnings("unchecked")
    public CompletableFuture<List<Vault>> listVaults() {
        return vaultsList("vault/").thenApply(vaults -> {
            log("Raw vaults response: " + vaults);
            log("Number of vaults received: " + vaults.size());

            List<Vault> vaultList = new ArrayList<>();

            for (Map<String, Object> vaultDict : vaults) {
                String id = (String) vaultDict.get("id");
                String name = (String) vaultDict.get("name");

                if (id == null || name == null) {
                    log("Skipping vault with missing id or name: " + vaultDict);
                    continue;
                }

                // Extract all fields from vault data
                int version = vaultDict.get("version") instanceof Number ? ((Number) vaultDict.get("version")).intValue() : 1;
                List<Map<String, Object>> records = (List<Map<String, Object>>) vaultDict.getOrDefault("records", new ArrayList<>());
                List<Map<String, Object>> devices = (List<Map<String, Object>>) vaultDict.getOrDefault("devices", new ArrayList<>());

                // Log detailed vault parsing info
                log("Vault " + name + " parsing details:");
                log("  - Records count: " + records.size());
                log("  - Devices count: " + devices.size());
                log("  - Version: " + version);

                // Parse timestamps (they come as milliseconds)
                Date createdAt = new Date();
                Object createdAtObj = vaultDict.get("createdAt");
                if (createdAtObj instanceof Number) {
                    createdAt = new Date(((Number) createdAtObj).longValue());
                } else {
                    log("Warning - createdAt field not found for vault " + id);
                }

                Date updatedAt = createdAt;
                Object updatedAtObj = vaultDict.get("updatedAt");
                if (updatedAtObj instanceof Number) {
                    updatedAt = new Date(((Number) updatedAtObj).longValue());
                }

                // Parse encryption data if present
                Vault.VaultEncryption encryption = null;
                Map<String, Object> encryptionData = (Map<String, Object>) vaultDict.get("encryption");
                if (encryptionData != null) {
                    String ciphertext = (String) encryptionData.get("ciphertext");
                    String nonce = (String) encryptionData.get("nonce");
                    if (ciphertext != null && nonce != null) {
                        String hashedPassword = (String) encryptionData.get("hashedPassword");
                        String salt = (String) encryptionData.get("salt");
                        encryption = new Vault.VaultEncryption(ciphertext, nonce, hashedPassword, salt);
                    }
                }

                log("Vault " + name + " parsed successfully");
                vaultList.add(new Vault(id, name, version, records, devices, createdAt, updatedAt, encryption));
            }

            log("Successfully parsed " + vaultList.size() + " vaults");
            return vaultList;
        });
    }

    public CompletableFuture<Boolean> checkVaultIsProtected(String vaultId, List<Vault> savedVaults) {
        CompletableFuture<List<Vault>> vaultsFuture;

        if (savedVaults != null && !savedVaults.isEmpty()) {
            vaultsFuture = CompletableFuture.completedFuture(savedVaults);
            log("Using saved vaults list (" + savedVaults.size() + " vaults)");
        } else {
            vaultsFuture = listVaults();
        }

        return vaultsFuture.thenApply(vaults -> {
            log("Fetched vaults list (" + vaults.size() + " vaults)");

            // Find the vault by ID
            Vault vault = null;
            for (Vault v : vaults) {
                if (v.id.equals(vaultId)) {
                    vault = v;
                    break;
                }
            }

            if (vault == null) {
                throw new RuntimeException("Vault not found");
            }

            // Check if vault has encryption data
            if (vault.encryption == null) {
                log("Vault " + vaultId + " has no encryption data");
                return false;
            }

            // Check if all required fields are present and non-empty
            boolean isProtected = !vault.encryption.ciphertext.isEmpty() &&
                    !vault.encryption.nonce.isEmpty() &&
                    vault.encryption.hashedPassword != null && !vault.encryption.hashedPassword.isEmpty() &&
                    vault.encryption.salt != null && !vault.encryption.salt.isEmpty();

            log("Vault " + vaultId + " protection status: " + isProtected);
            return isProtected;
        });
    }

    // Active Vault Methods
    public CompletableFuture<Map<String, Object>> activeVaultInit(String id, String encryptionKey) {
        log("Initializing active vault with id: " + id);
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("encryptionKey", encryptionKey);

        return sendRequest(API.ACTIVE_VAULT_INIT.getValue(), params)
                .thenApply(result -> {
                    if (result == null) {
                        result = new HashMap<>();
                        result.put("success", true);
                    }
                    return result;
                });
    }

    public CompletableFuture<VaultStatus> activeVaultGetStatus() {
        log("Getting active vault status");
        return sendRequest(API.ACTIVE_VAULT_GET_STATUS.getValue(), null)
                .thenApply(result -> {
                    boolean isInitialized = result != null && Boolean.TRUE.equals(result.get("status"));
                    boolean isLocked = !isInitialized;
                    String id = result != null ? (String) result.get("id") : null;

                    log("Active vault status: initialized=" + isInitialized + ", locked=" + isLocked + ", id=" + (id != null ? id : "none"));
                    return new VaultStatus(isInitialized, isLocked, id);
                });
    }

    public CompletableFuture<Map<String, Object>> activeVaultClose() {
        log("Closing active vault");
        return sendRequest(API.ACTIVE_VAULT_CLOSE.getValue(), null)
                .thenApply(result -> {
                    if (result == null) {
                        result = new HashMap<>();
                        result.put("success", true);
                    } else if (result.containsKey("error")) {
                        // Worklet returned an error but we still consider it "closed" for cleanup purposes
                        logError("Active vault close returned error: " + result.get("error"));
                        Map<String, Object> successResult = new HashMap<>();
                        successResult.put("success", true);
                        successResult.put("had_error", true);
                        return successResult;
                    }
                    return result;
                });
    }

    @SuppressWarnings("unchecked")
    public CompletableFuture<List<Map<String, Object>>> activeVaultList(String filterKey) {
        String filter = filterKey != null ? filterKey : "record/";
        log("Listing active vault records with filter: " + filter);

        return sendRequest(API.ACTIVE_VAULT_LIST.getValue(), createMap("filterKey", filter))
                .thenApply(result -> {
                    if (result != null) {
                        if (result.containsKey("array")) {
                            List<Map<String, Object>> arrayWrapper = (List<Map<String, Object>>) result.get("array");
                            log("Found " + (arrayWrapper != null ? arrayWrapper.size() : 0) + " records in active vault");
                            return arrayWrapper != null ? arrayWrapper : new ArrayList<>();
                        } else if (result.containsKey("data")) {
                            List<Map<String, Object>> data = (List<Map<String, Object>>) result.get("data");
                            log("Found " + (data != null ? data.size() : 0) + " records in active vault");
                            return data != null ? data : new ArrayList<>();
                        }
                    }

                    log("No records found in active vault");
                    return new ArrayList<>();
                });
    }

    public CompletableFuture<Map<String, Object>> activeVaultGet(String key) {
        log("Getting from active vault with key: " + key);
        return sendRequest(13, createMap("key", key))
                .thenApply(result -> {
                    log("Active vault get result for key '" + key + "': " + (result != null ? result : "{}"));
                    return result != null ? result : new HashMap<>();
                });
    }

    public CompletableFuture<List<Map<String, Object>>> initializeVaultAndFetchRecords(Vault vault) {
        log("Initializing vault " + vault.name + " and fetching records");

        return getVaultEncryptionKey(vault)
                .thenCompose(encryptionKey -> activeVaultInit(vault.id, encryptionKey))
                .thenCompose(result -> activeVaultList("record/"))
                .thenApply(records -> {
                    log("Successfully fetched " + records.size() + " records from vault " + vault.name);
                    return records;
                });
    }

    private CompletableFuture<String> getVaultEncryptionKey(Vault vault) {
        log("Getting encryption key for vault: " + vault.name);

        return vaultsGet("masterEncryption").thenCompose(masterEncryptionData -> {
            log("Master encryption data: " + masterEncryptionData);

            String hashedPassword = (String) masterEncryptionData.get("hashedPassword");
            if (hashedPassword == null) {
                throw new RuntimeException("No hashed password available in master encryption");
            }

            if (vault.encryption == null) {
                throw new RuntimeException("Vault has no encryption data");
            }

            log("Using hashed password from master encryption to decrypt vault key");

            return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, hashedPassword)
                    .thenApply(decryptedKeyResult -> {
                        String decryptedKey = extractValue(decryptedKeyResult, "value", "key", "data");
                        if (decryptedKey == null) {
                            throw new RuntimeException("Decryption failed");
                        }

                        log("Successfully decrypted vault encryption key");
                        return decryptedKey;
                    });
        });
    }

    /**
     * Extract a value from a map using multiple possible keys.
     * Tries each key in order and returns the first non-null value found.
     * @param map The map to extract from
     * @param keys The keys to try in order
     * @return The first non-null value found, or null if none found
     */
    private String extractValue(Map<String, Object> map, String... keys) {
        if (map == null) {
            return null;
        }
        for (String key : keys) {
            String value = (String) map.get(key);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    // Encryption Methods
    public CompletableFuture<Map<String, Object>> encryptionInit() {
        log("Initializing encryption subsystem");
        return sendRequest(API.ENCRYPTION_INIT.getValue(), null)
                .thenApply(result -> {
                    log("Encryption init result: " + result);
                    return result != null ? result : new HashMap<String, Object>();
                })
                .exceptionally(throwable -> {
                    String errorMessage = throwable.getMessage();
                    logError("Encryption init failed: " + errorMessage);

                    // Check if this is a database lock error (another instance has the db open)
                    if (VaultErrorUtils.isDatabaseLockError(throwable)) {
                        log("Detected database lock - encryption already initialized by another instance (likely main app)");
                        // Treat this as if encryption is already initialized
                        Map<String, Object> alreadyInitializedResult = new HashMap<String, Object>();
                        alreadyInitializedResult.put("success", true);
                        alreadyInitializedResult.put("initialized", true);
                        alreadyInitializedResult.put("shared_instance", true);
                        return alreadyInitializedResult;
                    }

                    // Return a success result even on failure to prevent blocking the flow
                    // The getMasterPasswordEncryption will handle the case where data is not available
                    Map<String, Object> defaultResult = new HashMap<String, Object>();
                    defaultResult.put("success", true);
                    defaultResult.put("initialized", false);
                    return defaultResult;
                });
    }

    public CompletableFuture<EncryptionStatus> encryptionGetStatus() {
        return sendRequest(API.ENCRYPTION_GET_STATUS.getValue(), null)
                .thenApply(result -> {
                    boolean status = result != null && Boolean.TRUE.equals(result.get("status"));
                    boolean hasKey = result != null && Boolean.TRUE.equals(result.get("hasKey"));
                    return new EncryptionStatus(status, hasKey);
                });
    }

    public CompletableFuture<Map<String, Object>> encryptionGet(String key) {
        return sendRequest(API.ENCRYPTION_GET.getValue(), createMap("key", key))
                .exceptionally(throwable -> {
                    String errorMessage = throwable.getMessage();
                    logError("Failed to get encryption data for key '" + key + "': " + errorMessage);

                    // Check if this is due to encryption not being initialized (likely due to lock)
                    if (errorMessage != null && errorMessage.contains("Encryption not initialised")) {
                        log("Encryption not accessible (locked by another instance) - cannot get key '" + key + "'");
                    }

                    return null; // Return null to indicate no data found
                });
    }

    public CompletableFuture<MasterPasswordEncryption> getMasterPasswordEncryption(VaultStatus vaultStatus) {
        // First, try to get existing master encryption (pass vault status if we have it)
        return getMasterEncryption(vaultStatus).thenCompose(existingEncryption -> {
            if (existingEncryption != null) {
                return CompletableFuture.completedFuture(existingEncryption);
            }

            log("No existing master encryption found in vault, checking encryption status");

            return encryptionGetStatus().thenCompose(statusRes -> {
                log("Encryption status check result: status=" + statusRes.status + ", hasKey=" + statusRes.hasKey);

                // Initialize encryption if not initialized
                if (!statusRes.status) {
                    log("Encryption not initialized, initializing now (attempting ENCRYPTION_INIT)");
                    log("Current thread: " + Thread.currentThread().getName());
                    log("Vault client worklet status: " + isWorkletInitialized);
                    log("BareHelper instance: " + (bareHelper != null ? "present" : "null"));

                    return encryptionInit().thenCompose(initResult -> {
                        log("ENCRYPTION_INIT completed, result: " + initResult);

                        // Check if this was a shared instance (lock error detected)
                        boolean isSharedInstance = initResult != null &&
                            Boolean.TRUE.equals(initResult.get("shared_instance"));

                        if (isSharedInstance) {
                            log("Encryption is locked by another instance - cannot proceed");
                            // Throw an exception so the calling code can detect the lock
                            throw new PearPassVaultException("Error initializing encryption: Error: lock hold by current process");
                        }

                        // After initialization, try to get master password encryption
                        return encryptionGet("masterPassword").thenApply(encryptionData -> {
                            if (encryptionData == null) {
                                log("No master password encryption found after initialization");
                                return null;
                            }

                            // Parse the response into MasterPasswordEncryption
                            String ciphertext = (String) encryptionData.get("ciphertext");
                            String nonce = (String) encryptionData.get("nonce");
                            String salt = (String) encryptionData.get("salt");
                            String hashedPassword = (String) encryptionData.get("hashedPassword");

                            if (ciphertext != null && nonce != null && salt != null) {
                                log("Successfully parsed master password encryption from initialized data");
                                return new MasterPasswordEncryption(ciphertext, nonce, salt, hashedPassword);
                            }
                            log("Master password encryption data incomplete after initialization");
                            return null;
                        });
                    }).exceptionally(encryptionInitException -> {
                        logError("ENCRYPTION_INIT failed with exception: " + encryptionInitException.getMessage());
                        encryptionInitException.printStackTrace();

                        // Check if this is a lock error and re-throw it
                        if (VaultErrorUtils.isDatabaseLockError(encryptionInitException)) {
                            log("Detected lock error in exception handler - re-throwing");
                            throw new RuntimeException(encryptionInitException);
                        }

                        // For other errors, return null
                        return null;
                    });
                } else {
                    // Encryption is initialized, try to get master password data directly
                    log("Encryption is already initialized, getting master password data directly");
                    return encryptionGet("masterPassword").thenApply(encryptionData -> {
                        if (encryptionData == null) {
                            log("No master password encryption found despite encryption being initialized");
                            return null;
                        }

                        // Parse the response into MasterPasswordEncryption
                        String ciphertext = (String) encryptionData.get("ciphertext");
                        String nonce = (String) encryptionData.get("nonce");
                        String salt = (String) encryptionData.get("salt");
                        String hashedPassword = (String) encryptionData.get("hashedPassword");

                        if (ciphertext != null && nonce != null && salt != null) {
                            log("Successfully parsed master password encryption from existing data");
                            return new MasterPasswordEncryption(ciphertext, nonce, salt, hashedPassword);
                        }
                        log("Master password encryption data incomplete from existing data");
                        return null;
                    });
                }
            }).exceptionally(throwable -> {
                logError("Error checking encryption status: " + throwable.getMessage());
                throwable.printStackTrace();

                // Check if this is a lock error and re-throw it
                if (VaultErrorUtils.isDatabaseLockError(throwable)) {
                    log("Detected lock error in outer exception handler - re-throwing");
                    throw new RuntimeException(throwable);
                }

                // For other errors, return null
                return null;
            });
        });
    }

    /**
     * Check if a master password was set by looking for existing vaults.
     * This is a safer approach that doesn't require encryption initialization.
     */
    private CompletableFuture<Boolean> checkIfMasterPasswordWasSet() {
        return vaultsList("vault/").thenApply(vaults -> {
            boolean hasVaults = !vaults.isEmpty();
            log("Vault check for master password detection: found " + vaults.size() + " vaults");
            return hasVaults;
        }).exceptionally(throwable -> {
            log("Could not check vaults to detect master password: " + throwable.getMessage());
            // If we can't check vaults, assume password is set to show master password screen
            // This is safer than showing missing configuration when a password might exist
            return true;
        });
    }

    /**
     * Safer version that doesn't cause initialization errors.
     * Returns null when unable to determine password status safely.
     */
    private MasterPasswordEncryption checkIfMasterPasswordWasSetSafely() {
        try {
            // Try to check vault status first to see if vaults are initialized
            VaultStatus status = vaultsGetStatus().get();
            if (!status.isInitialized) {
                log("Vaults not initialized, no master password set");
                return null;
            }

            // If vaults are initialized, try to list them
            List<Map<String, Object>> vaults = vaultsList("vault/").get();
            boolean hasVaults = !vaults.isEmpty();
            log("Safe vault check for master password detection: found " + vaults.size() + " vaults");

            if (hasVaults) {
                // Create a minimal encryption object to indicate password is set
                log("Master password detected based on existing vaults (safe method)");
                return new MasterPasswordEncryption("", "", "", null);
            } else {
                log("No master password detected - no vaults found (safe method)");
                return null;
            }
        } catch (Exception e) {
            log("Safe check failed, assuming no password set: " + e.getMessage());
            return null;
        }
    }

    private CompletableFuture<MasterPasswordEncryption> getMasterEncryption(VaultStatus vaultStatus) {
        CompletableFuture<VaultStatus> statusFuture;
        if (vaultStatus != null) {
            statusFuture = CompletableFuture.completedFuture(vaultStatus);
        } else {
            statusFuture = vaultsGetStatus();
        }

        return statusFuture.thenCompose(res -> {
            if (res.isInitialized && !res.isLocked) {
                return vaultsGet("masterEncryption").thenApply(data -> {
                    String ciphertext = (String) data.get("ciphertext");
                    String nonce = (String) data.get("nonce");
                    String salt = (String) data.get("salt");
                    String hashedPassword = (String) data.get("hashedPassword");

                    if (ciphertext != null && nonce != null && salt != null) {
                        return new MasterPasswordEncryption(ciphertext, nonce, salt, hashedPassword);
                    }
                    return null;
                });
            }
            return CompletableFuture.completedFuture(null);
        });
    }

    public CompletableFuture<String> hashPassword(String password) {
        return sendRequest(API.ENCRYPTION_HASH_PASSWORD.getValue(), createMap("password", password))
                .thenApply(result -> {
                    String hashedPassword = (String) result.get("hashedPassword");
                    if (hashedPassword == null) {
                        throw new RuntimeException("Encryption operation failed");
                    }
                    log("Successfully hashed password");
                    return hashedPassword;
                });
    }

    /**
     * Hashes a password using secure byte buffer.
     * The password is converted to Base64 for transmission (matching JS pattern).
     *
     * @param password The password as byte array
     * @return CompletableFuture with the hashed password
     */
    public CompletableFuture<String> hashPassword(byte[] password) {
        // Convert password to Base64 for transmission
        String passwordBase64 = com.pears.pass.autofill.utils.SecureBufferUtils.toBase64(password);

        return sendRequest(API.ENCRYPTION_HASH_PASSWORD.getValue(), createMap("password", passwordBase64))
                .thenApply(result -> {
                    String hashedPassword = (String) result.get("hashedPassword");
                    if (hashedPassword == null) {
                        throw new RuntimeException("Encryption operation failed");
                    }
                    log("Successfully hashed password (buffer)");
                    return hashedPassword;
                });
    }

    public CompletableFuture<DecryptionKeyResult> getDecryptionKey(String salt, String password) {
        Map<String, Object> params = new HashMap<>();
        params.put("salt", salt);
        params.put("password", password);

        return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), params)
                .thenApply(result -> {
                    String key = (String) result.get("value");
                    if (key == null) {
                        key = (String) result.get("key");
                    }
                    if (key == null) {
                        key = (String) result.get("hashedPassword");
                    }
                    if (key == null) {
                        logError("Failed to extract key from getDecryptionKey response: " + result);
                        throw new RuntimeException("Decryption failed");
                    }

                    log("Successfully generated decryption key");
                    return new DecryptionKeyResult(key, salt);
                });
    }

    /**
     * Gets the decryption key using secure byte buffer for password.
     * The password is converted to Base64 for transmission (matching JS pattern).
     *
     * @param salt The salt to use for key derivation
     * @param password The password as byte array
     * @return CompletableFuture with the decryption key result
     */
    public CompletableFuture<DecryptionKeyResult> getDecryptionKey(String salt, byte[] password) {
        // Convert password to Base64 for transmission
        String passwordBase64 = com.pears.pass.autofill.utils.SecureBufferUtils.toBase64(password);

        Map<String, Object> params = new HashMap<>();
        params.put("salt", salt);
        params.put("password", passwordBase64);

        return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), params)
                .thenApply(result -> {
                    String key = (String) result.get("value");
                    if (key == null) {
                        key = (String) result.get("key");
                    }
                    if (key == null) {
                        key = (String) result.get("hashedPassword");
                    }
                    if (key == null) {
                        logError("Failed to extract key from getDecryptionKey response: " + result);
                        throw new RuntimeException("Decryption failed");
                    }

                    log("Successfully generated decryption key (buffer)");
                    return new DecryptionKeyResult(key, salt);
                });
    }

    public CompletableFuture<Map<String, Object>> decryptVaultKey(String ciphertext, String nonce, String hashedPassword) {
        Map<String, Object> params = new HashMap<>();
        params.put("ciphertext", ciphertext);
        params.put("nonce", nonce);
        params.put("hashedPassword", hashedPassword);

        return sendRequest(API.ENCRYPTION_DECRYPT_VAULT_KEY.getValue(), params)
                .thenApply(result -> {
                    log("Decrypted vault key");
                    return result;
                });
    }

    public CompletableFuture<Map<String, Object>> encryptionClose() {
        log("Closing encryption");
        return sendRequest(API.ENCRYPTION_CLOSE.getValue(), null)
                .thenApply(result -> {
                    if (result == null) {
                        result = new HashMap<>();
                        result.put("success", true);
                    } else if (result.containsKey("error")) {
                        // Worklet returned an error but we still consider it "closed" for cleanup purposes
                        logError("Encryption close returned error: " + result.get("error"));
                        Map<String, Object> successResult = new HashMap<>();
                        successResult.put("success", true);
                        successResult.put("had_error", true);
                        return successResult;
                    }
                    return result;
                });
    }

    /**
     * Validate vault password without activating the vault
     */
    public CompletableFuture<Boolean> validateVaultPassword(String vaultId, String password) {
        log("Validating password for vault: " + vaultId);

        return listVaults()
            .thenCompose(vaults -> {
                // Find the vault with the matching ID
                Vault targetVault = null;
                for (Vault vault : vaults) {
                    if (vault.id.equals(vaultId)) {
                        targetVault = vault;
                        break;
                    }
                }

                if (targetVault == null) {
                    throw new RuntimeException("Vault not found with ID: " + vaultId);
                }

                final Vault vault = targetVault;

                // If vault has no encryption, it's not protected
                if (vault.encryption == null) {
                    log("Vault " + vault.name + " is not protected, validation successful");
                    return CompletableFuture.completedFuture(true);
                }

                // Check if vault has its own salt (for password-protected vaults)
                String saltToUse = vault.encryption.salt;

                // If vault doesn't have salt, it's encrypted with master password
                if (saltToUse == null || saltToUse.isEmpty()) {
                    log("Vault " + vault.name + " doesn't have its own salt, using master password");
                    // This vault is encrypted with master password, not its own password
                    // We should use the master password flow instead
                    return getMasterPasswordEncryption(null)
                        .thenCompose(masterPasswordEncryption -> {
                            if (masterPasswordEncryption == null || masterPasswordEncryption.hashedPassword == null) {
                                throw new RuntimeException("No master password available");
                            }

                            // Use the already hashed master password to decrypt
                            return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, masterPasswordEncryption.hashedPassword);
                        })
                        .thenApply(decryptedData -> {
                            if (decryptedData == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }

                            String encryptionKey = (String) decryptedData.get("value");
                            if (encryptionKey == null) {
                                encryptionKey = (String) decryptedData.get("key");
                            }
                            if (encryptionKey == null) {
                                encryptionKey = (String) decryptedData.get("data");
                            }
                            if (encryptionKey == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }

                            log("Password validation successful");
                            return true;
                        });
                }

                log("Vault " + vault.name + " has its own salt, using vault password");

                // Get decryption key using the vault's salt and password
                Map<String, Object> decryptionParams = new HashMap<>();
                decryptionParams.put("password", password);
                decryptionParams.put("salt", saltToUse);

                return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), decryptionParams)
                    .thenCompose(decryptionResult -> {
                        // Extract the key from the result
                        String hashedPassword = extractValue(decryptionResult, "value", "key", "hashedPassword");

                        if (hashedPassword == null) {
                            throw new RuntimeException("Failed to get decryption key");
                        }

                        log("Got decryption key, attempting to decrypt vault key");

                        // Decrypt the vault key using the hashed password
                        return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, hashedPassword)
                            .thenApply(decryptedData -> {
                                if (decryptedData == null) {
                                    log("Decryption returned null - incorrect password");
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }

                                String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                                if (encryptionKey == null) {
                                    log("No encryption key found in response: " + decryptedData);
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }

                                log("Password validation successful");
                                return true;
                            });
                    });
            })
            .exceptionally(ex -> {
                log("Failed to validate vault password: " + ex.getMessage());
                return false;
            });
    }

    /**
     * Get vault by ID and unlock it with the provided password
     */
    public CompletableFuture<Boolean> getVaultById(String vaultId, String password) {
        log("Getting vault by ID: " + vaultId + " with password");

        return listVaults()
            .thenCompose(vaults -> {
                // Find the vault with the matching ID
                Vault targetVault = null;
                for (Vault vault : vaults) {
                    if (vault.id.equals(vaultId)) {
                        targetVault = vault;
                        break;
                    }
                }

                if (targetVault == null) {
                    throw new RuntimeException("Vault not found with ID: " + vaultId);
                }

                final Vault vault = targetVault;

                // If vault has no encryption, it's not protected
                if (vault.encryption == null) {
                    log("Vault " + vault.name + " is not protected, initializing directly");
                    return activeVaultInit(vault.id, null)
                        .thenApply(result -> true);
                }

                // Check if vault has its own salt (for password-protected vaults)
                String saltToUse = vault.encryption.salt;

                // If vault doesn't have salt, it's encrypted with master password
                if (saltToUse == null || saltToUse.isEmpty()) {
                    log("Vault " + vault.name + " doesn't have its own salt, using master password");
                    // This vault is encrypted with master password, not its own password
                    // We should use the master password flow instead
                    return getMasterPasswordEncryption(null)
                        .thenCompose(masterPasswordEncryption -> {
                            if (masterPasswordEncryption == null || masterPasswordEncryption.hashedPassword == null) {
                                throw new RuntimeException("No master password available");
                            }

                            // Use the already hashed master password to decrypt
                            return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, masterPasswordEncryption.hashedPassword);
                        })
                        .thenCompose(decryptedData -> {
                            if (decryptedData == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }

                            String encryptionKey = (String) decryptedData.get("value");
                            if (encryptionKey == null) {
                                encryptionKey = (String) decryptedData.get("key");
                            }
                            if (encryptionKey == null) {
                                encryptionKey = (String) decryptedData.get("data");
                            }
                            if (encryptionKey == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }

                            // Initialize the active vault with the decrypted key
                            return activeVaultInit(vault.id, encryptionKey)
                                .thenApply(result -> true);
                        });
                }

                log("Vault " + vault.name + " has its own salt, using vault password");

                // Get decryption key using the vault's salt and password
                Map<String, Object> decryptionParams = new HashMap<>();
                decryptionParams.put("password", password);
                decryptionParams.put("salt", saltToUse);

                return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), decryptionParams)
                    .thenCompose(decryptionResult -> {
                        // Extract the key from the result
                        String hashedPassword = extractValue(decryptionResult, "value", "key", "hashedPassword");

                        if (hashedPassword == null) {
                            throw new RuntimeException("Failed to get decryption key");
                        }

                        log("Got decryption key, attempting to decrypt vault key");

                        // Decrypt the vault key using the hashed password
                        return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, hashedPassword)
                            .thenCompose(decryptedData -> {
                                if (decryptedData == null) {
                                    log("Decryption returned null - incorrect password");
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }

                                String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                                if (encryptionKey == null) {
                                    log("No encryption key found in response: " + decryptedData);
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }

                                log("Successfully decrypted vault key, initializing active vault");

                                // Initialize the active vault with the decrypted key
                                return activeVaultInit(vault.id, encryptionKey)
                                    .thenApply(result -> {
                                        log("Active vault initialized successfully");
                                        return true;
                                    });
                            });
                    });
            })
            .exceptionally(ex -> {
                log("Failed to get vault by ID: " + ex.getMessage());
                return false;
            });
    }

    /**
     * Validate vault password using secure byte buffer.
     * The password is converted to Base64 for transmission (matching JS pattern).
     *
     * @param vaultId The vault ID to validate password for
     * @param password The password as byte array
     * @return CompletableFuture with true if password is valid, false otherwise
     */
    public CompletableFuture<Boolean> validateVaultPassword(String vaultId, byte[] password) {
        log("Validating password for vault (buffer): " + vaultId);

        // Convert password to Base64 for transmission
        String passwordBase64 = com.pears.pass.autofill.utils.SecureBufferUtils.toBase64(password);

        return listVaults()
            .thenCompose(vaults -> {
                // Find the vault with the matching ID
                Vault targetVault = null;
                for (Vault vault : vaults) {
                    if (vault.id.equals(vaultId)) {
                        targetVault = vault;
                        break;
                    }
                }

                if (targetVault == null) {
                    throw new RuntimeException("Vault not found with ID: " + vaultId);
                }

                final Vault vault = targetVault;

                // If vault has no encryption, it's not protected
                if (vault.encryption == null) {
                    log("Vault " + vault.name + " is not protected, validation successful");
                    return CompletableFuture.completedFuture(true);
                }

                // Check if vault has its own salt (for password-protected vaults)
                String saltToUse = vault.encryption.salt;

                // If vault doesn't have salt, it's encrypted with master password
                if (saltToUse == null || saltToUse.isEmpty()) {
                    log("Vault " + vault.name + " doesn't have its own salt, using master password");
                    return getMasterPasswordEncryption(null)
                        .thenCompose(masterPasswordEncryption -> {
                            if (masterPasswordEncryption == null || masterPasswordEncryption.hashedPassword == null) {
                                throw new RuntimeException("No master password available");
                            }
                            return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, masterPasswordEncryption.hashedPassword);
                        })
                        .thenApply(decryptedData -> {
                            if (decryptedData == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }
                            String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                            if (encryptionKey == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }
                            log("Password validation successful");
                            return true;
                        });
                }

                log("Vault " + vault.name + " has its own salt, using vault password (buffer)");

                // Get decryption key using the vault's salt and password (Base64 encoded)
                Map<String, Object> decryptionParams = new HashMap<>();
                decryptionParams.put("password", passwordBase64);
                decryptionParams.put("salt", saltToUse);

                return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), decryptionParams)
                    .thenCompose(decryptionResult -> {
                        String hashedPassword = extractValue(decryptionResult, "value", "key", "hashedPassword");
                        if (hashedPassword == null) {
                            throw new RuntimeException("Failed to get decryption key");
                        }
                        log("Got decryption key, attempting to decrypt vault key");
                        return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, hashedPassword)
                            .thenApply(decryptedData -> {
                                if (decryptedData == null) {
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }
                                String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                                if (encryptionKey == null) {
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }
                                log("Password validation successful (buffer)");
                                return true;
                            });
                    });
            })
            .exceptionally(ex -> {
                log("Failed to validate vault password: " + ex.getMessage());
                return false;
            });
    }

    /**
     * Get vault by ID and unlock it using secure byte buffer for password.
     * The password is converted to Base64 for transmission (matching JS pattern).
     *
     * @param vaultId The vault ID to unlock
     * @param password The password as byte array
     * @return CompletableFuture with true if vault was unlocked, false otherwise
     */
    public CompletableFuture<Boolean> getVaultById(String vaultId, byte[] password) {
        log("Getting vault by ID (buffer): " + vaultId);

        // Convert password to Base64 for transmission
        String passwordBase64 = com.pears.pass.autofill.utils.SecureBufferUtils.toBase64(password);

        return listVaults()
            .thenCompose(vaults -> {
                // Find the vault with the matching ID
                Vault targetVault = null;
                for (Vault vault : vaults) {
                    if (vault.id.equals(vaultId)) {
                        targetVault = vault;
                        break;
                    }
                }

                if (targetVault == null) {
                    throw new RuntimeException("Vault not found with ID: " + vaultId);
                }

                final Vault vault = targetVault;

                // If vault has no encryption, it's not protected
                if (vault.encryption == null) {
                    log("Vault " + vault.name + " is not protected, initializing directly");
                    return activeVaultInit(vault.id, null)
                        .thenApply(result -> true);
                }

                // Check if vault has its own salt (for password-protected vaults)
                String saltToUse = vault.encryption.salt;

                // If vault doesn't have salt, it's encrypted with master password
                if (saltToUse == null || saltToUse.isEmpty()) {
                    log("Vault " + vault.name + " doesn't have its own salt, using master password");
                    return getMasterPasswordEncryption(null)
                        .thenCompose(masterPasswordEncryption -> {
                            if (masterPasswordEncryption == null || masterPasswordEncryption.hashedPassword == null) {
                                throw new RuntimeException("No master password available");
                            }
                            return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, masterPasswordEncryption.hashedPassword);
                        })
                        .thenCompose(decryptedData -> {
                            if (decryptedData == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }
                            String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                            if (encryptionKey == null) {
                                throw new RuntimeException("Failed to decrypt vault key");
                            }
                            return activeVaultInit(vault.id, encryptionKey)
                                .thenApply(result -> true);
                        });
                }

                log("Vault " + vault.name + " has its own salt, using vault password (buffer)");

                // Get decryption key using the vault's salt and password (Base64 encoded)
                Map<String, Object> decryptionParams = new HashMap<>();
                decryptionParams.put("password", passwordBase64);
                decryptionParams.put("salt", saltToUse);

                return sendRequest(API.ENCRYPTION_GET_DECRYPTION_KEY.getValue(), decryptionParams)
                    .thenCompose(decryptionResult -> {
                        String hashedPassword = extractValue(decryptionResult, "value", "key", "hashedPassword");
                        if (hashedPassword == null) {
                            throw new RuntimeException("Failed to get decryption key");
                        }
                        log("Got decryption key, attempting to decrypt vault key (buffer)");
                        return decryptVaultKey(vault.encryption.ciphertext, vault.encryption.nonce, hashedPassword)
                            .thenCompose(decryptedData -> {
                                if (decryptedData == null) {
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }
                                String encryptionKey = extractValue(decryptedData, "value", "key", "data");
                                if (encryptionKey == null) {
                                    throw new RuntimeException("Failed to decrypt vault key - incorrect password");
                                }
                                log("Successfully decrypted vault key, initializing active vault (buffer)");
                                return activeVaultInit(vault.id, encryptionKey)
                                    .thenApply(result -> {
                                        log("Active vault initialized successfully (buffer)");
                                        return true;
                                    });
                            });
                    });
            })
            .exceptionally(ex -> {
                log("Failed to get vault by ID: " + ex.getMessage());
                return false;
            });
    }

    // General Methods
    public CompletableFuture<Map<String, Object>> closeAllInstances() {
        log("Closing all vault instances and cleaning up resources");

        CompletableFuture<Map<String, Object>> future = new CompletableFuture<>();

        if (bareHelper == null || !isWorkletInitialized) {
            log("Worklet not initialized, nothing to clean up");
            Map<String, Object> successResult = new HashMap<>();
            successResult.put("success", true);
            future.complete(successResult);
            return future;
        }

        // Send CLOSE_ALL_INSTANCES command directly without queuing
        JSONObject message = new JSONObject();
        try {
            message.put("command", API.CLOSE_ALL_INSTANCES.getValue());
            message.put("source", "android-extension");
        } catch (JSONException e) {
            future.completeExceptionally(new PearPassVaultException("Failed to create close request: " + e.getMessage()));
            return future;
        }

        log("Destroying worklet immediately");

        final BareHelper helperToDestroy = bareHelper;
        bareHelper = null; // Immediately null out to prevent reuse
        isWorkletInitialized = false;
        isFullyInitialized = false;

        // Try to send CLOSE_ALL_INSTANCES command as best effort, but don't wait for response
        try {
            helperToDestroy.send(message.toString(), new BareHelper.SendCallback() {
                @Override
                public void onResponse(String reply, Throwable error) {
                    if (error != null) {
                        logError("Close all instances failed: " + error.getMessage());
                    } else {
                        log("Close all instances command acknowledged");
                    }
                }
            });
            log("CLOSE_ALL_INSTANCES command sent");
        } catch (Exception e) {
            logError("Exception sending close command (will shutdown anyway): " + e.getMessage());
        }

        // IMMEDIATELY shutdown the worklet thread without waiting for callback
        // This is critical because if the worklet is hung, the callback will never fire
        try {
            helperToDestroy.shutdown();
            log("Worklet shutdown completed");
        } catch (Exception e) {
            logError("Error shutting down worklet: " + e.getMessage());
        }

        // Complete immediately - don't wait for async callback
        Map<String, Object> successResult = new HashMap<>();
        successResult.put("success", true);
        future.complete(successResult);

        return future;
    }

    public CompletableFuture<Map<String, Object>> close() {
        return closeAllInstances();
    }

    public void destroy() {
        try {
            close().get();
        } catch (Exception e) {
            logError("Error during cleanup: " + e.getMessage());
        }
    }

    // ========================
    // File Methods
    // ========================

    /**
     * Add a file to the active vault (encrypted by vault core).
     * Files are stored at: record/{recordId}/file/{fileId}
     * Port of iOS PearPassVaultClient.activeVaultAddFile().
     */
    public CompletableFuture<Void> activeVaultAddFile(String recordId, String fileId, byte[] buffer, String name) {
        log("Adding file '" + name + "' (" + buffer.length + " bytes) to record " + recordId);

        String key = "record/" + recordId + "/file/" + fileId;

        // Write file to a temp location so the Bare worklet can read it from disk
        // (avoids IPC size limits, matching iOS approach)
        java.io.File tempFile = new java.io.File(context.getCacheDir(), "temp_upload_" + fileId);
        try {
            java.io.FileOutputStream fos = new java.io.FileOutputStream(tempFile);
            fos.write(buffer);
            fos.close();
        } catch (java.io.IOException e) {
            CompletableFuture<Void> failed = new CompletableFuture<>();
            failed.completeExceptionally(new RuntimeException("Failed to write temp file: " + e.getMessage()));
            return failed;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("key", key);
        params.put("filePath", tempFile.getAbsolutePath());
        params.put("name", name);

        return sendRequest(API.ACTIVE_VAULT_FILE_ADD.getValue(), params)
                .thenAccept(result -> {
                    log("File '" + name + "' added successfully");
                    tempFile.delete();
                })
                .whenComplete((result, error) -> {
                    if (error != null) {
                        tempFile.delete();
                    }
                });
    }

    // ========================
    // Passkey Methods
    // ========================

    /**
     * Add a record to the active vault.
     */
    public CompletableFuture<Void> activeVaultAdd(String key, Map<String, Object> data) {
        Map<String, Object> params = new HashMap<>();
        params.put("key", key);
        params.put("data", data);
        return sendRequest(API.ACTIVE_VAULT_ADD.getValue(), params)
                .thenAccept(result -> log("Added to active vault with key: " + key));
    }

    /**
     * Save a passkey credential as a new login record in the active vault.
     * Port of iOS PearPassVaultClient.savePasskey().
     */
    public CompletableFuture<String> savePasskey(String vaultId, PasskeyCredential credential,
                                                  String title, String userName,
                                                  List<String> websites, String note,
                                                  String folder, Long passkeyCreatedAt,
                                                  String recordId) {
        return savePasskey(vaultId, credential, title, userName, websites, note,
                folder, passkeyCreatedAt, recordId, new ArrayList<>());
    }

    public CompletableFuture<String> savePasskey(String vaultId, PasskeyCredential credential,
                                                  String title, String userName,
                                                  List<String> websites, String note,
                                                  String folder, Long passkeyCreatedAt,
                                                  String recordId,
                                                  List<Map<String, String>> attachmentMetadata) {
        log("Saving passkey to vault " + vaultId);

        long now = System.currentTimeMillis();

        // Format websites
        List<String> formattedWebsites = new ArrayList<>();
        if (websites != null) {
            for (String website : websites) {
                String trimmed = website.trim();
                if (!trimmed.isEmpty()) {
                    String lower = trimmed.toLowerCase();
                    if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
                        formattedWebsites.add("https://" + lower);
                    } else {
                        formattedWebsites.add(lower);
                    }
                }
            }
        }

        // Build record data
        Map<String, Object> recordData = new HashMap<>();
        recordData.put("title", title);
        recordData.put("username", userName);
        recordData.put("password", "");
        recordData.put("passwordUpdatedAt", now);
        recordData.put("passkeyCreatedAt", passkeyCreatedAt != null ? passkeyCreatedAt : now);
        recordData.put("credential", credential.toMap());
        recordData.put("note", note != null ? note : "");
        recordData.put("websites", formattedWebsites);
        recordData.put("customFields", new ArrayList<>());
        recordData.put("attachments", attachmentMetadata != null ? attachmentMetadata : new ArrayList<>());

        // Build full record
        Map<String, Object> record = new HashMap<>();
        record.put("id", recordId);
        record.put("version", 1);
        record.put("type", "login");
        record.put("vaultId", vaultId);
        record.put("data", recordData);
        record.put("isFavorite", false);
        record.put("createdAt", now);
        record.put("updatedAt", now);
        record.put("folder", folder);

        String key = "record/" + recordId;
        return activeVaultAdd(key, record)
                .thenApply(v -> {
                    log("Passkey saved with ID: " + recordId);
                    return recordId;
                });
    }

    /**
     * Update an existing record to add a passkey credential.
     * Port of iOS PearPassVaultClient.updateRecordWithPasskey().
     */
    @SuppressWarnings("unchecked")
    public CompletableFuture<String> updateRecordWithPasskey(Map<String, Object> existingRecord,
                                                              PasskeyCredential credential,
                                                              String title, String userName,
                                                              List<String> websites, String note,
                                                              String folder, long passkeyCreatedAt) {
        return updateRecordWithPasskey(existingRecord, credential, title, userName,
                websites, note, folder, passkeyCreatedAt, new ArrayList<>());
    }

    @SuppressWarnings("unchecked")
    public CompletableFuture<String> updateRecordWithPasskey(Map<String, Object> existingRecord,
                                                              PasskeyCredential credential,
                                                              String title, String userName,
                                                              List<String> websites, String note,
                                                              String folder, long passkeyCreatedAt,
                                                              List<Map<String, String>> attachmentMetadata) {
        String recordId = (String) existingRecord.get("id");
        log("Updating existing record " + recordId + " with passkey");

        long now = System.currentTimeMillis();

        // Format websites
        List<String> formattedWebsites = new ArrayList<>();
        if (websites != null) {
            for (String website : websites) {
                String trimmed = website.trim();
                if (!trimmed.isEmpty()) {
                    String lower = trimmed.toLowerCase();
                    if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
                        formattedWebsites.add("https://" + lower);
                    } else {
                        formattedWebsites.add(lower);
                    }
                }
            }
        }

        // Get existing record data
        Map<String, Object> existingData = (Map<String, Object>) existingRecord.get("data");
        if (existingData == null) existingData = new HashMap<>();

        // Merge existing attachments with new ones
        List<Object> existingAttachments = existingData.get("attachments") instanceof List ?
                (List<Object>) existingData.get("attachments") : new ArrayList<>();
        List<Object> mergedAttachments = new ArrayList<>(existingAttachments);
        if (attachmentMetadata != null) {
            for (Map<String, String> newMeta : attachmentMetadata) {
                String newId = newMeta.get("id");
                boolean alreadyExists = false;
                for (Object existing : existingAttachments) {
                    if (existing instanceof Map && newId != null && newId.equals(((Map<?, ?>) existing).get("id"))) {
                        alreadyExists = true;
                        break;
                    }
                }
                if (!alreadyExists) {
                    mergedAttachments.add(newMeta);
                }
            }
        }

        // Build updated record data (preserve existing fields)
        Map<String, Object> updatedData = new HashMap<>();
        updatedData.put("title", title);
        updatedData.put("username", userName);
        updatedData.put("password", existingData.get("password") != null ? existingData.get("password") : "");
        updatedData.put("passwordUpdatedAt", existingData.get("passwordUpdatedAt") != null ? existingData.get("passwordUpdatedAt") : now);
        updatedData.put("passkeyCreatedAt", passkeyCreatedAt);
        updatedData.put("credential", credential.toMap());
        updatedData.put("note", note != null ? note : "");
        updatedData.put("websites", formattedWebsites);
        updatedData.put("customFields", existingData.get("customFields") != null ? existingData.get("customFields") : new ArrayList<>());
        updatedData.put("attachments", mergedAttachments);

        // Build updated record
        Map<String, Object> updatedRecord = new HashMap<>();
        updatedRecord.put("id", recordId);
        updatedRecord.put("version", existingRecord.get("version") != null ? existingRecord.get("version") : 1);
        updatedRecord.put("type", "login");
        updatedRecord.put("vaultId", existingRecord.get("vaultId"));
        updatedRecord.put("data", updatedData);
        updatedRecord.put("isFavorite", existingRecord.get("isFavorite") != null ? existingRecord.get("isFavorite") : false);
        updatedRecord.put("createdAt", existingRecord.get("createdAt") != null ? existingRecord.get("createdAt") : now);
        updatedRecord.put("updatedAt", now);
        updatedRecord.put("folder", folder);

        String key = "record/" + recordId;
        return activeVaultAdd(key, updatedRecord)
                .thenApply(v -> {
                    log("Record " + recordId + " updated with passkey");
                    return recordId;
                });
    }

    /**
     * Search login records matching username.
     * Port of iOS PearPassVaultClient.searchLoginRecords().
     * Returns records where username matches OR record has no username.
     */
    @SuppressWarnings("unchecked")
    public CompletableFuture<List<Map<String, Object>>> searchLoginRecords(String rpId, String username) {
        log("Searching login records for rpId=" + rpId + ", username=" + username);

        return activeVaultList("record/").thenApply(records -> {
            List<Map<String, Object>> matches = new ArrayList<>();

            for (Map<String, Object> record : records) {
                // Only process login-type records
                String type = (String) record.get("type");
                if (!"login".equals(type)) continue;

                Map<String, Object> recordData;
                if (record.containsKey("data") && record.get("data") instanceof Map) {
                    recordData = (Map<String, Object>) record.get("data");
                } else {
                    continue;
                }

                String recordUsername = recordData.get("username") instanceof String
                        ? ((String) recordData.get("username")).trim() : "";
                String passkeyUsername = username != null ? username.trim() : "";

                boolean usernameMatches = !passkeyUsername.isEmpty() && !recordUsername.isEmpty()
                        && passkeyUsername.equalsIgnoreCase(recordUsername);
                boolean hasNoUsername = recordUsername.isEmpty();

                if (usernameMatches || hasNoUsername) {
                    matches.add(record);
                }
            }

            log("Found " + matches.size() + " matching login records");
            return matches;
        });
    }

    /**
     * List passkeys in the active vault, optionally filtered by rpId.
     * Port of iOS PearPassVaultClient.listPasskeys().
     */
    @SuppressWarnings("unchecked")
    public CompletableFuture<List<CredentialItem>> listPasskeys(String rpId) {
        log("Listing passkeys" + (rpId != null ? " for RP: " + rpId : ""));

        return activeVaultList("record/").thenApply(records -> {
            List<CredentialItem> passkeys = new ArrayList<>();

            for (Map<String, Object> record : records) {
                String id = (String) record.get("id");
                if (id == null) continue;

                Map<String, Object> recordData;
                if (record.containsKey("data") && record.get("data") instanceof Map) {
                    recordData = (Map<String, Object>) record.get("data");
                } else {
                    recordData = record;
                }

                // Only include records that have a credential field (passkeys)
                Object credentialObj = recordData.get("credential");
                if (!(credentialObj instanceof Map)) continue;

                Map<String, Object> credentialMap = (Map<String, Object>) credentialObj;
                String credentialId = (String) credentialMap.get("id");

                // Check rpId filter
                if (rpId != null) {
                    boolean matches = false;
                    Object websitesObj = recordData.get("websites");
                    if (websitesObj instanceof List) {
                        for (Object website : (List<?>) websitesObj) {
                            if (website instanceof String && normalizedDomainMatch((String) website, rpId)) {
                                matches = true;
                                break;
                            }
                        }
                    }
                    if (!matches) continue;
                }

                String title = recordData.get("title") != null ? (String) recordData.get("title") : "Unknown";
                String username = recordData.get("username") != null ? (String) recordData.get("username") : "";
                String password = recordData.get("password") != null ? (String) recordData.get("password") : "";

                List<String> websites = new ArrayList<>();
                Object websitesListObj = recordData.get("websites");
                if (websitesListObj instanceof List) {
                    for (Object w : (List<?>) websitesListObj) {
                        if (w instanceof String) websites.add((String) w);
                    }
                }

                // Parse passkey timestamp
                long passkeyCreatedAt = 0;
                Object passkeyTs = recordData.get("passkeyCreatedAt");
                if (passkeyTs instanceof Number) {
                    passkeyCreatedAt = ((Number) passkeyTs).longValue();
                }

                // Private key and userId from credential
                String privateKeyBuffer = (String) credentialMap.get("_privateKeyBuffer");
                String userId = (String) credentialMap.get("_userId");

                passkeys.add(new CredentialItem(id, title, username, password, websites,
                        true, passkeyCreatedAt, credentialMap, privateKeyBuffer, userId, credentialId));
            }

            log("Found " + passkeys.size() + " passkeys");
            return passkeys;
        });
    }

    /**
     * List unique folder names from vault records.
     * Port of iOS PearPassVaultClient.listFolders().
     */
    @SuppressWarnings("unchecked")
    public CompletableFuture<List<String>> listFolders() {
        log("Listing folders");

        return activeVaultList("record/").thenApply(records -> {
            List<String> folders = new ArrayList<>();

            for (Map<String, Object> record : records) {
                String folder = (String) record.get("folder");
                if (folder != null && !folder.isEmpty() && !folders.contains(folder)) {
                    folders.add(folder);
                }
            }

            log("Found " + folders.size() + " folders");
            return folders;
        });
    }

    /**
     * Check if two domains match (handles subdomains, protocols, www).
     * Port of iOS PearPassVaultClient.normalizedDomainMatch().
     */
    private boolean normalizedDomainMatch(String domain1, String domain2) {
        String d1 = domain1.toLowerCase()
                .replace("https://", "")
                .replace("http://", "")
                .replace("www.", "");
        int slashIdx1 = d1.indexOf('/');
        if (slashIdx1 != -1) d1 = d1.substring(0, slashIdx1);

        String d2 = domain2.toLowerCase()
                .replace("https://", "")
                .replace("http://", "")
                .replace("www.", "");
        int slashIdx2 = d2.indexOf('/');
        if (slashIdx2 != -1) d2 = d2.substring(0, slashIdx2);

        return d1.equals(d2) || d1.endsWith("." + d2) || d2.endsWith("." + d1);
    }

    // Helper Methods
    private void log(String message) {
        if (debugMode) {
            SecureLog.d(TAG, message);
        }
    }

    private void logError(String message) {
        SecureLog.e(TAG, message);
    }

    private static Map<String, Object> createMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    private static Map<String, Object> jsonObjectToMap(JSONObject jsonObject) throws JSONException {
        Map<String, Object> map = new HashMap<>();
        String[] keys = new String[jsonObject.length()];
        int i = 0;
        for (java.util.Iterator<String> it = jsonObject.keys(); it.hasNext(); i++) {
            keys[i] = it.next();
        }

        for (String key : keys) {
            Object value = jsonObject.get(key);
            if (value == null || value == JSONObject.NULL) {
                value = null;
            } else if (value instanceof JSONObject) {
                value = jsonObjectToMap((JSONObject) value);
            } else if (value instanceof JSONArray) {
                value = jsonArrayToList((JSONArray) value);
            }
            map.put(key, value);
        }
        return map;
    }

    private static List<Object> jsonArrayToList(JSONArray jsonArray) throws JSONException {
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value == null || value == JSONObject.NULL) {
                value = null;
            } else if (value instanceof JSONObject) {
                value = jsonObjectToMap((JSONObject) value);
            } else if (value instanceof JSONArray) {
                value = jsonArrayToList((JSONArray) value);
            }
            list.add(value);
        }
        return list;
    }

    // Exception class
    public static class PearPassVaultException extends RuntimeException {
        public PearPassVaultException(String message) {
            super(message);
        }
    }
}