package com.pears.pass.autofill.ui;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.pears.pass.R;
import com.pears.pass.autofill.crypto.AuthenticatorDataBuilder;
import com.pears.pass.autofill.crypto.Base64URLUtils;
import com.pears.pass.autofill.crypto.PasskeyCrypto;
import com.pears.pass.autofill.data.CredentialItem;
import com.pears.pass.autofill.data.PasskeyCredential;
import com.pears.pass.autofill.data.PasskeyFormData;
import com.pears.pass.autofill.data.PasskeyResponse;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.VaultInitializer;

import org.json.JSONObject;

import java.security.KeyPair;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Activity for passkey registration (creation) flow.
 * Launched by PearPassCredentialProviderService when a website requests passkey creation.
 * Flow: Loading -> MasterPassword -> VaultSelection -> VaultPassword -> SearchExisting -> Form -> Save -> Return
 *
 * Uses readOnly=false for the vault client since we need to write to the vault.
 */
@RequiresApi(api = Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
public class PasskeyRegistrationActivity extends AppCompatActivity implements NavigationListener {
    private static final String TAG = "PasskeyRegistration";

    // Passkey request data
    private String rpId = "";
    private String rpName = "";
    private byte[] userId = new byte[0];
    private String userName = "";
    private String userDisplayName = "";
    private byte[] challenge = new byte[0];
    private byte[] clientDataHash = new byte[0];

    // Vault client
    private PearPassVaultClient vaultClient;
    private final AtomicBoolean isInitializing = new AtomicBoolean(false);
    private final AtomicBoolean hasNavigated = new AtomicBoolean(false);
    private volatile CompletableFuture<Boolean> vaultReadyFuture;

    // Authentication credentials for reinitialization on resume
    private String storedCiphertext;
    private String storedNonce;
    private String storedHashedPassword;

    // Registration state
    private String selectedVaultId;
    private String selectedVaultName;
    private String selectedVaultPassword;
    private Map<String, Object> selectedExistingRecord;
    private List<String> preloadedFolders = new ArrayList<>();
    private PasskeyCredential generatedCredential;
    private byte[] generatedAttestationObject;
    private byte[] generatedCredentialId;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_authentication);
        makeFullscreen();

        // Show loading
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new LoadingFragment())
                    .commitNow();
        }

        // Parse the passkey creation request
        parsePasskeyRequest();

        // Initialize vault client with readOnly=false
        initialize();
    }

    private void parsePasskeyRequest() {
        Intent intent = getIntent();
        try {
            androidx.credentials.provider.ProviderCreateCredentialRequest providerRequest =
                    androidx.credentials.provider.PendingIntentHandler.retrieveProviderCreateCredentialRequest(intent);

            if (providerRequest != null &&
                providerRequest.getCallingRequest() instanceof androidx.credentials.CreatePublicKeyCredentialRequest) {

                androidx.credentials.CreatePublicKeyCredentialRequest pkRequest =
                        (androidx.credentials.CreatePublicKeyCredentialRequest) providerRequest.getCallingRequest();

                String requestJson = pkRequest.getRequestJson();
                Log.d(TAG, "Passkey creation request JSON: " + requestJson);

                JSONObject json = new JSONObject(requestJson);

                // Parse RP info
                JSONObject rpObj = json.optJSONObject("rp");
                if (rpObj != null) {
                    rpId = rpObj.optString("id", rpObj.optString("name", ""));
                    rpName = rpObj.optString("name", rpId);
                }

                // Parse user info
                JSONObject userObj = json.optJSONObject("user");
                if (userObj != null) {
                    String userIdB64 = userObj.optString("id", "");
                    if (!userIdB64.isEmpty()) {
                        userId = Base64URLUtils.decode(userIdB64);
                    }
                    userName = userObj.optString("name", "");
                    userDisplayName = userObj.optString("displayName", userName);
                }

                // Parse challenge
                String challengeB64 = json.optString("challenge", "");
                if (!challengeB64.isEmpty()) {
                    challenge = Base64URLUtils.decode(challengeB64);
                }

                // Get clientDataHash from request
                byte[] hash = pkRequest.getClientDataHash();
                clientDataHash = hash != null ? hash : new byte[0];

                Log.d(TAG, "Parsed passkey request - rpId: " + rpId + ", userName: " + userName);
            } else {
                Log.e(TAG, "No valid passkey creation request found");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error parsing passkey request: " + e.getMessage());
        }
    }

    private void makeFullscreen() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.view.WindowInsetsController insetsController = getWindow().getInsetsController();
                if (insetsController != null) {
                    insetsController.hide(android.view.WindowInsets.Type.navigationBars());
                    insetsController.setSystemBarsBehavior(
                            android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                }
                getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
                getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error setting fullscreen", e);
        }
    }

    private void initialize() {
        if (vaultClient != null) return;

        // readOnly=false for registration (need to write passkey to vault)
        vaultClient = new PearPassVaultClient(this, null, true, false);

        VaultInitializer.initialize(vaultClient, new VaultInitializer.Callback() {
            @Override
            public void onSuccess(VaultInitializer.VaultInitState state) {
                runOnUiThread(() -> {
                    if (!hasNavigated.compareAndSet(false, true)) return;

                    if (!state.hasPasswordSet) {
                        navigateToMissingConfiguration();
                    } else if (!state.isLoggedIn) {
                        navigateToMasterPassword();
                    } else {
                        navigateToVaultSelection();
                    }
                });
            }

            @Override
            public void onError(VaultInitializer.VaultInitError error, Exception exception) {
                Log.e(TAG, "Initialization error: " + error + " - " + exception.getMessage());
                runOnUiThread(() -> {
                    if (!hasNavigated.compareAndSet(false, true)) return;

                    switch (error) {
                        case TIMEOUT:
                            navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.TIMEOUT_ERROR);
                            break;
                        case VAULT_LOCKED:
                            navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.VAULT_LOCKED_ERROR);
                            break;
                        case INITIALIZATION_FAILED:
                            navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.INITIALIZATION_FAILED);
                            break;
                        default:
                            navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.VAULT_CLIENT_ERROR);
                            break;
                    }
                });
            }
        });
    }

    // NavigationListener implementation

    @Override
    public void navigateToMissingConfiguration() {
        replaceFragment(new MissingConfigurationFragment(), false);
    }

    @Override
    public void navigateToMasterPassword() {
        Fragment current = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
        if (current instanceof MasterPasswordFragment) return;
        replaceFragment(new MasterPasswordFragment(), false);
    }

    @Override
    public void navigateToVaultSelection() {
        replaceFragment(new VaultSelectionFragment(), true);
    }

    @Override
    public void navigateToVaultPassword(String vaultId, String vaultName) {
        this.selectedVaultId = vaultId;
        this.selectedVaultName = vaultName;
        replaceFragment(VaultPasswordFragment.newInstance(vaultId, vaultName), true);
    }

    @Override
    public void navigateToCredentialsList(String vaultId) {
        this.selectedVaultId = vaultId;
        // In registration mode, search for existing credentials instead of showing credentials list
        searchForExistingCredentials(vaultId, null);
    }

    @Override
    public void navigateToCredentialsList(String vaultId, String password) {
        this.selectedVaultId = vaultId;
        searchForExistingCredentials(vaultId, password);
    }

    @Override
    public void onCredentialSelected(CredentialItem credential) {
        // Not used in registration flow
    }

    @Override
    public void onPasskeySelected(CredentialItem credential) {
        // Not used in registration flow
    }

    @Override
    public void onCancel() {
        setResult(Activity.RESULT_CANCELED);
        finish();
    }

    /**
     * Called by ExistingCredentialSelectionFragment when user selects an existing record.
     */
    public void onExistingRecordSelected(Map<String, Object> record) {
        this.selectedExistingRecord = record;
        navigateToPasskeyForm();
    }

    /**
     * Called by ExistingCredentialSelectionFragment when user wants to create new.
     */
    public void onCreateNewRecord() {
        this.selectedExistingRecord = null;
        navigateToPasskeyForm();
    }

    /**
     * Called by PasskeyFormFragment on save.
     */
    public void onFormSave(PasskeyFormData formData) {
        handleFormSave(formData);
    }

    /**
     * Get vault client for fragments.
     */
    public PearPassVaultClient getVaultClient() {
        return vaultClient;
    }

    public String getRpId() { return rpId; }
    public String getRpName() { return rpName; }
    public String getUserName() { return userName; }
    public String getUserDisplayName() { return userDisplayName; }
    public Map<String, Object> getSelectedExistingRecord() { return selectedExistingRecord; }
    public List<String> getPreloadedFolders() { return preloadedFolders; }

    /**
     * Called by MasterPasswordFragment after successful authentication.
     * Stores the credentials so they can be reused to reinitialize on resume.
     */
    public void onCredentialsObtained(String ciphertext, String nonce, String hashedPassword) {
        this.storedCiphertext = ciphertext;
        this.storedNonce = nonce;
        this.storedHashedPassword = hashedPassword;
        Log.d(TAG, "Credentials stored for resume reinitialization");
    }

    // Private methods

    private void searchForExistingCredentials(String vaultId, String password) {
        // Show loading
        replaceFragment(new LoadingFragment(), true);

        // Store the password for re-opening vault on resume
        this.selectedVaultPassword = password;

        CompletableFuture.runAsync(() -> {
            try {
                // Close any active vault first
                try {
                    vaultClient.activeVaultClose().get();
                } catch (Exception e) {
                    Log.d(TAG, "No active vault to close: " + e.getMessage());
                }

                // Activate the vault
                boolean success = vaultClient.getVaultById(vaultId, password).get();
                if (!success) {
                    throw new RuntimeException("Failed to activate vault");
                }

                // Mark vault as ready
                vaultReadyFuture = CompletableFuture.completedFuture(true);

                // Search for matching records
                List<Map<String, Object>> matches = vaultClient.searchLoginRecords(rpId, userName).get();

                // Preload folders
                List<String> folders = vaultClient.listFolders().get();

                runOnUiThread(() -> {
                    preloadedFolders = folders;

                    if (matches.isEmpty()) {
                        // No matches, go directly to form
                        selectedExistingRecord = null;
                        navigateToPasskeyForm();
                    } else {
                        // Show existing credential selection
                        navigateToExistingCredentialSelection(matches);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Error searching credentials: " + e.getMessage());
                runOnUiThread(() -> {
                    selectedExistingRecord = null;
                    navigateToPasskeyForm();
                });
            }
        });
    }

    private void navigateToExistingCredentialSelection(List<Map<String, Object>> matchingRecords) {
        Fragment fragment = ExistingCredentialSelectionFragment.newInstance(matchingRecords, rpId, userName);
        replaceFragment(fragment, true);
    }

    private void navigateToPasskeyForm() {
        Fragment fragment = new PasskeyFormFragment();
        replaceFragment(fragment, true);
    }

    private void handleFormSave(PasskeyFormData formData) {
        // Show saving indicator (add to back stack so we can pop back to form on error)
        replaceFragment(new LoadingFragment(), true);

        CompletableFuture.runAsync(() -> {
            try {
                // Wait for vault to be ready (important after onResume reinitializes the vault)
                if (vaultReadyFuture != null) {
                    Log.d(TAG, "Waiting for vault to be ready...");
                    Boolean ready = vaultReadyFuture.get(30, java.util.concurrent.TimeUnit.SECONDS);
                    if (ready == null || !ready) {
                        throw new RuntimeException("Vault is not ready for saving");
                    }
                    Log.d(TAG, "Vault is ready for saving");
                }

                // 1. Generate passkey
                KeyPair keyPair = PasskeyCrypto.generateKeyPair();
                byte[] credentialIdBytes = PasskeyCrypto.generateCredentialId();
                String credentialIdB64 = Base64URLUtils.encode(credentialIdBytes);

                // Build authenticator data
                byte[] authData = AuthenticatorDataBuilder.buildForRegistration(
                        rpId, credentialIdBytes, keyPair.getPublic());

                // Build attestation object
                byte[] attestationObject = AuthenticatorDataBuilder.encodeAttestationObject(authData);

                // Build client data JSON
                byte[] clientDataJSON = AuthenticatorDataBuilder.buildClientDataJSONForRegistration(
                        challenge, "https://" + rpId);

                // Create response
                PasskeyResponse response = new PasskeyResponse(
                        Base64URLUtils.encode(clientDataJSON),
                        Base64URLUtils.encode(attestationObject),
                        Base64URLUtils.encode(authData),
                        PasskeyCrypto.exportPublicKeySPKI(keyPair.getPublic()),
                        -7,
                        Arrays.asList("internal")
                );

                // Create credential with private key buffer
                byte[] privateKeyBuffer = keyPair.getPrivate().getEncoded();
                PasskeyCredential credential = PasskeyCredential.create(
                        credentialIdB64, response, privateKeyBuffer,
                        Base64URLUtils.encode(userId)
                );

                // 2. Determine record ID
                String recordId;
                if (formData.getExistingRecordId() != null) {
                    recordId = formData.getExistingRecordId();
                } else {
                    recordId = UUID.randomUUID().toString();
                }

                // 3. Save file attachments first (matching iOS order)
                List<Map<String, String>> attachmentMetadata = new ArrayList<>();
                for (PasskeyFormData.AttachmentFile attachment : formData.getAttachments()) {
                    String fileId = attachment.getId();
                    vaultClient.activeVaultAddFile(
                            recordId, fileId, attachment.getData(), attachment.getName()
                    ).get();

                    Map<String, String> meta = new java.util.HashMap<>();
                    meta.put("id", fileId);
                    meta.put("name", attachment.getName());
                    attachmentMetadata.add(meta);
                }

                // 4. Save or update record
                if (selectedExistingRecord != null && formData.getExistingRecordId() != null) {
                    // Update existing record
                    vaultClient.updateRecordWithPasskey(
                            selectedExistingRecord, credential,
                            formData.getTitle(), formData.getUsername(),
                            formData.getWebsites(), formData.getNote(),
                            formData.getFolder(), formData.getPasskeyCreatedAt(),
                            attachmentMetadata
                    ).get();
                } else {
                    // Create new record
                    vaultClient.savePasskey(
                            selectedVaultId, credential,
                            formData.getTitle(), formData.getUsername(),
                            formData.getWebsites(), formData.getNote(),
                            formData.getFolder(), formData.getPasskeyCreatedAt(),
                            recordId, attachmentMetadata
                    ).get();
                }

                // 5. Build response and return
                this.generatedCredential = credential;
                this.generatedAttestationObject = attestationObject;
                this.generatedCredentialId = credentialIdBytes;

                runOnUiThread(this::completeRegistration);

            } catch (Exception e) {
                Log.e(TAG, "Error saving passkey: " + e.getMessage());
                e.printStackTrace();
                runOnUiThread(() -> {
                    // Pop back to the form fragment (preserved on back stack)
                    if (getSupportFragmentManager().getBackStackEntryCount() > 0) {
                        getSupportFragmentManager().popBackStack();
                    } else {
                        navigateToPasskeyForm();
                    }
                    android.widget.Toast.makeText(PasskeyRegistrationActivity.this,
                            "Failed to save passkey. Please try again.", android.widget.Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    private void completeRegistration() {
        try {
            // Build the registration response JSON
            JSONObject responseJson = new JSONObject();
            responseJson.put("id", generatedCredential.getId());
            responseJson.put("rawId", generatedCredential.getRawId());
            responseJson.put("type", "public-key");

            JSONObject responseBody = new JSONObject();
            responseBody.put("clientDataJSON", generatedCredential.getResponse().getClientDataJSON());
            responseBody.put("attestationObject", generatedCredential.getResponse().getAttestationObject());
            responseBody.put("authenticatorData", generatedCredential.getResponse().getAuthenticatorData());

            // Transports array
            org.json.JSONArray transportsArray = new org.json.JSONArray();
            transportsArray.put("internal");
            responseBody.put("transports", transportsArray);

            // Public key info
            responseBody.put("publicKey", generatedCredential.getResponse().getPublicKey());
            responseBody.put("publicKeyAlgorithm", generatedCredential.getResponse().getPublicKeyAlgorithm());

            responseJson.put("response", responseBody);
            responseJson.put("authenticatorAttachment", "platform");

            JSONObject clientExtResults = new JSONObject();
            JSONObject credProps = new JSONObject();
            credProps.put("rk", true);
            clientExtResults.put("credProps", credProps);
            responseJson.put("clientExtensionResults", clientExtResults);

            String jsonResponse = responseJson.toString();
            Log.d(TAG, "Registration response built successfully");

            Intent resultData = new Intent();
            androidx.credentials.CreateCredentialResponse createCredentialResponse =
                    new androidx.credentials.CreatePublicKeyCredentialResponse(jsonResponse);
            androidx.credentials.provider.PendingIntentHandler.setCreateCredentialResponse(
                    resultData, createCredentialResponse);

            setResult(Activity.RESULT_OK, resultData);
            finish();
        } catch (Exception e) {
            Log.e(TAG, "Error completing registration: " + e.getMessage());
            onCancel();
        }
    }

    private void navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType errorType) {
        Fragment fragment = ErrorBoundaryFragment.newInstance(errorType);
        replaceFragment(fragment, false);
    }

    private void replaceFragment(Fragment fragment, boolean addToBackStack) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.setCustomAnimations(
                R.anim.slide_in_right, R.anim.slide_out_left,
                R.anim.slide_in_left, R.anim.slide_out_right);
        transaction.replace(R.id.fragment_container, fragment);
        if (addToBackStack) {
            transaction.addToBackStack(null);
        }
        transaction.commit();
    }

    @Override
    public void onBackPressed() {
        if (getSupportFragmentManager().getBackStackEntryCount() > 0) {
            getSupportFragmentManager().popBackStack();
        } else {
            onCancel();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Cleanup vault client for security, but preserve UI state (fragments)
        // so form data is not lost on brief interruptions
        cleanup();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Reinitialize vault client if it was cleaned up
        if (vaultClient == null) {
            // Check if we're past the authentication stage (already have a vault selected)
            Fragment current = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
            if (current instanceof PasskeyFormFragment || current instanceof ExistingCredentialSelectionFragment) {
                // User was on a form - reinitialize vault silently, keep current fragment
                Log.d(TAG, "Resuming with form visible, reinitializing vault client silently");
                vaultClient = new PearPassVaultClient(this, null, true, false);

                // Create a future that will be completed when the vault is ready
                final CompletableFuture<Boolean> readyFuture = new CompletableFuture<>();
                vaultReadyFuture = readyFuture;

                CompletableFuture.runAsync(() -> {
                    try {
                        vaultClient.waitForInitialization().get(30, java.util.concurrent.TimeUnit.SECONDS);
                        Log.d(TAG, "Vault client reinitialized on resume");

                        // Reinitialize vaults with stored credentials
                        if (storedCiphertext != null && storedNonce != null && storedHashedPassword != null) {
                            Log.d(TAG, "Reinitializing vaults with stored credentials");
                            vaultClient.initWithCredentials(storedCiphertext, storedNonce, storedHashedPassword).get();
                            Log.d(TAG, "Vaults reinitialized with credentials");
                        } else {
                            Log.e(TAG, "No stored credentials available for reinitialization");
                            readyFuture.complete(false);
                            return;
                        }

                        // Re-open the active vault if we have the vault ID
                        if (selectedVaultId != null) {
                            Log.d(TAG, "Re-opening active vault: " + selectedVaultId);
                            boolean success = vaultClient.getVaultById(selectedVaultId, selectedVaultPassword).get();
                            if (success) {
                                Log.d(TAG, "Active vault re-opened successfully");
                                readyFuture.complete(true);
                            } else {
                                Log.e(TAG, "Failed to re-open active vault");
                                readyFuture.complete(false);
                            }
                        } else {
                            readyFuture.complete(false);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Failed to reinitialize vault client on resume: " + e.getMessage());
                        readyFuture.completeExceptionally(e);
                    }
                });
            } else {
                // Not on a form - do full restart
                isInitializing.set(false);
                hasNavigated.set(false);
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, new LoadingFragment())
                        .commitNow();
                initialize();
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (isFinishing()) {
            cleanup();
            clearSensitiveData();
        }
    }

    private void cleanup() {
        vaultReadyFuture = null;
        if (vaultClient == null) return;
        final PearPassVaultClient client = vaultClient;
        vaultClient = null;
        try {
            client.closeAllInstances().get(500, java.util.concurrent.TimeUnit.MILLISECONDS);
        } catch (Exception e) {
            Log.w(TAG, "Error during cleanup: " + e.getMessage());
        }
    }

    /**
     * Clear sensitive data when activity is finishing.
     */
    private void clearSensitiveData() {
        storedCiphertext = null;
        storedNonce = null;
        storedHashedPassword = null;
        selectedVaultPassword = null;
    }
}
