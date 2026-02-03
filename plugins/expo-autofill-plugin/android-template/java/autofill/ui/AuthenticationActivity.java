package com.pears.pass.autofill.ui;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.service.autofill.Dataset;
import android.service.autofill.FillResponse;
import android.service.autofill.InlinePresentation;
import android.view.autofill.AutofillId;
import android.view.autofill.AutofillManager;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;
import android.widget.inline.InlinePresentationSpec;

import androidx.annotation.Nullable;
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
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.SecureLog;
import com.pears.pass.autofill.utils.VaultInitializer;

import org.json.JSONObject;

import java.security.PrivateKey;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

public class AuthenticationActivity extends AppCompatActivity implements NavigationListener {
    private static final String TAG = "AuthenticationActivity";

    private AutofillId usernameId;
    private AutofillId passwordId;
    private String webDomain;
    private String packageName;

    // Passkey assertion mode
    private boolean isPasskeyAssertion = false;
    private String passkeyRpId;
    private byte[] passkeyChallenge;
    private byte[] passkeyClientDataHash;

    // Vault client and initialization state
    private PearPassVaultClient vaultClient;
    private final AtomicBoolean isInitializing = new AtomicBoolean(false);
    private final AtomicBoolean hasNavigated = new AtomicBoolean(false);
    private boolean hasInitializedOnce = false;
    private int initRetryCount = 0;
    private static final int MAX_INIT_RETRIES = 5;

    // User initialization state
    private boolean hasPasswordSet = false;
    private boolean isLoggedIn = false;
    private boolean isVaultOpen = false;
    private boolean isLoading = true;

    // Secure password buffer for passing between fragments
    // This avoids passing password as String through Bundle arguments
    private byte[] pendingPasswordBuffer = null;

    // State keys for savedInstanceState
    private static final String STATE_HAS_PASSWORD_SET = "hasPasswordSet";
    private static final String STATE_HAS_INITIALIZED_ONCE = "hasInitializedOnce";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_authentication);

        makeFullscreen();

        // Show loading fragment immediately - user must not interact until initialization is complete
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container, new LoadingFragment())
                .commitNow();
        }

        // Get autofill IDs and domain/package info from intent
        Intent intent = getIntent();
        usernameId = intent.getParcelableExtra("username_id");
        passwordId = intent.getParcelableExtra("password_id");
        webDomain = intent.getStringExtra("web_domain");
        packageName = intent.getStringExtra("package_name");

        // Check for passkey assertion mode
        isPasskeyAssertion = intent.getBooleanExtra("is_passkey_assertion", false);

        if (isPasskeyAssertion && Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            SecureLog.d(TAG, "Passkey assertion mode enabled");
            try {
                androidx.credentials.provider.ProviderGetCredentialRequest providerRequest =
                        androidx.credentials.provider.PendingIntentHandler.retrieveProviderGetCredentialRequest(intent);
                if (providerRequest != null) {
                    for (androidx.credentials.CredentialOption option : providerRequest.getCredentialOptions()) {
                        if (option instanceof androidx.credentials.GetPublicKeyCredentialOption) {
                            androidx.credentials.GetPublicKeyCredentialOption pkOption =
                                    (androidx.credentials.GetPublicKeyCredentialOption) option;
                            String requestJson = pkOption.getRequestJson();
                            SecureLog.d(TAG, "Passkey request JSON: " + requestJson);
                            JSONObject json = new JSONObject(requestJson);
                            passkeyRpId = json.optString("rpId", "");
                            webDomain = passkeyRpId; // Use rpId as domain for credential filtering

                            // Extract challenge for fallback clientDataJSON construction
                            String challengeB64 = json.optString("challenge", "");
                            if (!challengeB64.isEmpty()) {
                                passkeyChallenge = Base64URLUtils.decode(challengeB64);
                            }

                            passkeyClientDataHash = pkOption.getClientDataHash();
                            SecureLog.d(TAG, "Passkey rpId: " + passkeyRpId);
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                SecureLog.e(TAG, "Error parsing passkey request: " + e.getMessage());
            }
        }

        if (webDomain != null) {
            SecureLog.d(TAG, "Received web domain: " + webDomain);
        }
        if (packageName != null) {
            SecureLog.d(TAG, "Received package name: " + packageName);
        }

        // Restore critical state if activity was recreated
        if (savedInstanceState != null) {
            hasPasswordSet = savedInstanceState.getBoolean(STATE_HAS_PASSWORD_SET, false);
            hasInitializedOnce = savedInstanceState.getBoolean(STATE_HAS_INITIALIZED_ONCE, false);
            SecureLog.d(TAG, "Restored state - hasPasswordSet: " + hasPasswordSet +
                               ", hasInitializedOnce: " + hasInitializedOnce);
        }

        initialize();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putBoolean(STATE_HAS_PASSWORD_SET, hasPasswordSet);
        outState.putBoolean(STATE_HAS_INITIALIZED_ONCE, hasInitializedOnce);
        SecureLog.d(TAG, "Saved state - hasPasswordSet: " + hasPasswordSet);
    }

    private void makeFullscreen() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // Android 11+ (API 30+) - Use WindowInsetsController
                // Don't set setDecorFitsSystemWindows(false) to allow proper insets handling
                android.view.WindowInsetsController insetsController = getWindow().getInsetsController();
                if (insetsController != null) {
                    insetsController.hide(
                        android.view.WindowInsets.Type.navigationBars()
                    );
                    insetsController.setSystemBarsBehavior(
                        android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    );
                }
                // Make status bar transparent but keep it visible for proper insets
                getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
                getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);
            } else {
                // Pre-Android 11 - Use system UI visibility flags
                getWindow().getDecorView().setSystemUiVisibility(
                    android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                    android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                    android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                    android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                    android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                );
                // Make status bar transparent
                getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
                getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);
            }
        } catch (Exception e) {
            // Log the error but don't crash - fullscreen is not critical
            SecureLog.e("AuthenticationActivity", "Error setting fullscreen", e);
        }
    }

    @Override
    public void navigateToMasterPassword() {
        // Check if we're already showing MasterPasswordFragment
        Fragment currentFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
        if (currentFragment instanceof MasterPasswordFragment) {
            SecureLog.d(TAG, "Already on MasterPasswordFragment, skipping navigation");
            return;
        }

        Fragment fragment = new MasterPasswordFragment();
        replaceFragment(fragment, false);
    }

    @Override
    public void navigateToVaultSelection() {
        Fragment fragment = new VaultSelectionFragment();
        replaceFragment(fragment, true);
    }

    @Override
    public void navigateToVaultPassword(String vaultId, String vaultName) {
        Fragment fragment = VaultPasswordFragment.newInstance(vaultId, vaultName);
        replaceFragment(fragment, true);
    }

    @Override
    public void navigateToCredentialsList(String vaultId) {
        Fragment fragment = CredentialsListFragment.newInstance(vaultId, webDomain, packageName);
        replaceFragment(fragment, true);
    }

    @Override
    public void navigateToCredentialsList(String vaultId, byte[] passwordBuffer) {
        // Store password buffer securely - it will be retrieved by CredentialsListFragment
        // and cleared after vault activation
        clearPendingPasswordBuffer(); // Clear any existing buffer first
        this.pendingPasswordBuffer = passwordBuffer;
        Fragment fragment = CredentialsListFragment.newInstance(vaultId, webDomain, packageName);
        replaceFragment(fragment, true);
    }

    /**
     * Get the pending password buffer for vault activation.
     * This retrieves and clears the buffer in one operation to prevent multiple uses.
     *
     * @return The password buffer, or null if not set. Caller is responsible for clearing after use.
     */
    public byte[] consumePendingPasswordBuffer() {
        byte[] buffer = this.pendingPasswordBuffer;
        this.pendingPasswordBuffer = null; // Clear reference but don't zero - caller will use it
        return buffer;
    }

    /**
     * Clear any pending password buffer from memory.
     */
    private void clearPendingPasswordBuffer() {
        if (pendingPasswordBuffer != null) {
            com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(pendingPasswordBuffer);
            pendingPasswordBuffer = null;
        }
    }

    @Override
    public void onCredentialSelected(CredentialItem credential) {
        // Build the autofill response
        Dataset.Builder datasetBuilder = new Dataset.Builder();

        RemoteViews presentation = new RemoteViews(getPackageName(), android.R.layout.simple_list_item_1);
        presentation.setTextViewText(android.R.id.text1, credential.getTitle());

        if (usernameId != null) {
            datasetBuilder.setValue(
                usernameId,
                AutofillValue.forText(credential.getUsername()),
                presentation
            );
        }

        if (passwordId != null) {
            datasetBuilder.setValue(
                passwordId,
                AutofillValue.forText(credential.getPassword()),
                presentation
            );
        }

        Intent replyIntent = new Intent();
        replyIntent.putExtra(AutofillManager.EXTRA_AUTHENTICATION_RESULT, datasetBuilder.build());

        setResult(Activity.RESULT_OK, replyIntent);
        finish();
    }

    @Override
    public void onPasskeySelected(CredentialItem credential) {
        if (!isPasskeyAssertion) {
            SecureLog.w(TAG, "onPasskeySelected called but not in passkey assertion mode");
            return;
        }
        completePasskeyAssertion(credential);
    }

    /**
     * Complete passkey assertion by signing with the private key and returning the response.
     */
    private void completePasskeyAssertion(CredentialItem credential) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            SecureLog.e(TAG, "Passkey assertion requires API 34+");
            onCancel();
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                SecureLog.d(TAG, "Starting passkey assertion for credential: " + credential.getCredentialId());

                // Import the private key from the credential
                String privateKeyB64 = credential.getPrivateKeyBuffer();
                if (privateKeyB64 == null || privateKeyB64.isEmpty()) {
                    throw new Exception("No private key found in credential");
                }

                PrivateKey privateKey = PasskeyCrypto.importPrivateKey(privateKeyB64);

                // Build authenticator data for assertion
                String rpId = passkeyRpId != null ? passkeyRpId : webDomain;
                byte[] authData = AuthenticatorDataBuilder.buildForAssertion(rpId);

                // Get or compute client data hash and build clientDataJSON for response
                byte[] clientDataHash;
                byte[] clientDataJSON;
                if (passkeyClientDataHash != null) {
                    // System provided clientDataHash — it handles clientDataJSON construction
                    clientDataHash = passkeyClientDataHash;
                    clientDataJSON = null; // System fills this in the final response
                } else if (passkeyChallenge != null && passkeyChallenge.length > 0) {
                    // Build our own clientDataJSON from the parsed challenge
                    String origin = "android:apk-key-hash:" + getPackageName();
                    clientDataJSON = AuthenticatorDataBuilder.buildClientDataJSONForAssertion(
                            passkeyChallenge, origin);
                    clientDataHash = PasskeyCrypto.sha256(clientDataJSON);
                } else {
                    throw new Exception("No clientDataHash from system and no challenge in request");
                }

                // Sign the assertion
                String signature = PasskeyCrypto.signAssertion(privateKey, authData, clientDataHash);

                // Build response JSON
                JSONObject responseJson = new JSONObject();
                responseJson.put("id", credential.getCredentialId());
                responseJson.put("rawId", credential.getCredentialId());
                responseJson.put("type", "public-key");

                JSONObject responseBody = new JSONObject();
                responseBody.put("authenticatorData", Base64URLUtils.encode(authData));
                // Include clientDataJSON if we built it ourselves; otherwise empty (system fills it)
                responseBody.put("clientDataJSON",
                        clientDataJSON != null ? Base64URLUtils.encode(clientDataJSON) : "");
                responseBody.put("signature", signature);
                responseBody.put("userHandle", credential.getUserId() != null ? credential.getUserId() : "");
                responseJson.put("response", responseBody);

                JSONObject clientExtResults = new JSONObject();
                responseJson.put("clientExtensionResults", clientExtResults);
                responseJson.put("authenticatorAttachment", "platform");

                String jsonResponse = responseJson.toString();
                SecureLog.d(TAG, "Passkey assertion response built successfully");

                runOnUiThread(() -> {
                    try {
                        Intent resultData = new Intent();
                        androidx.credentials.PublicKeyCredential publicKeyCredential =
                                new androidx.credentials.PublicKeyCredential(jsonResponse);
                        androidx.credentials.GetCredentialResponse getCredentialResponse =
                                new androidx.credentials.GetCredentialResponse(publicKeyCredential);
                        androidx.credentials.provider.PendingIntentHandler.setGetCredentialResponse(
                                resultData, getCredentialResponse);

                        setResult(Activity.RESULT_OK, resultData);
                        finish();
                    } catch (Exception e) {
                        SecureLog.e(TAG, "Error setting passkey response: " + e.getMessage());
                        onCancel();
                    }
                });

            } catch (Exception e) {
                SecureLog.e(TAG, "Error completing passkey assertion: " + e.getMessage());
                e.printStackTrace();
                runOnUiThread(this::onCancel);
            }
        });
    }

    /**
     * Check if this activity is in passkey assertion mode.
     */
    public boolean isPasskeyAssertionMode() {
        return isPasskeyAssertion;
    }

    /**
     * Get the passkey RP ID for filtering credentials.
     */
    public String getPasskeyRpId() {
        return passkeyRpId;
    }

    @Override
    public void onCancel() {
        setResult(Activity.RESULT_CANCELED);
        finish();
    }

    private void replaceFragment(Fragment fragment, boolean addToBackStack) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.setCustomAnimations(
            R.anim.slide_in_right,
            R.anim.slide_out_left,
            R.anim.slide_in_left,
            R.anim.slide_out_right
        );
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
        SecureLog.d(TAG, "Activity paused - resetting to initial state");

        // Clean up vault client to release database
        cleanup();

        // Reset all state variables to initial values
        isInitializing.set(false);
        hasNavigated.set(false); // Reset navigation flag
        hasInitializedOnce = false;
        hasPasswordSet = false;
        isLoggedIn = false;
        isVaultOpen = false;
        isLoading = true;
        initRetryCount = 0; // Reset retry counter

        // Clear fragment back stack to reset UI state
        FragmentManager fragmentManager = getSupportFragmentManager();
        if (fragmentManager.getBackStackEntryCount() > 0) {
            fragmentManager.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
        }

        // Clear all fragments
        Fragment currentFragment = fragmentManager.findFragmentById(R.id.fragment_container);
        if (currentFragment != null) {
            fragmentManager.beginTransaction()
                .remove(currentFragment)
                .commitNow();
        }

        SecureLog.d(TAG, "Extension completely reset to initial state");
    }

    @Override
    protected void onResume() {
        super.onResume();
        SecureLog.d(TAG, "Activity resumed - starting fresh initialization");

        // Show loading fragment - user must stay in loading state until initialization completes
        getSupportFragmentManager().beginTransaction()
            .replace(R.id.fragment_container, new LoadingFragment())
            .commitNow();

        // Always re-initialize from scratch as if opening for the first time
        initialize();
    }

    /**
     * Initialize the vault client and navigate to appropriate screen
     */
    private void initialize() {
        if (vaultClient != null) {
            return; // Already initialized
        }

        vaultClient = new PearPassVaultClient(this, null, true);

        SecureLog.d(TAG, "Starting vault initialization...");
        VaultInitializer.initialize(vaultClient, new VaultInitializer.Callback() {
            @Override
            public void onSuccess(VaultInitializer.VaultInitState state) {
                runOnUiThread(() -> handleInitSuccess(state));
            }

            @Override
            public void onError(VaultInitializer.VaultInitError error, Exception exception) {
                SecureLog.e(TAG, "Initialization error: " + error + " - " + exception.getMessage());
                exception.printStackTrace();
                handleInitError(error, exception);
            }
        });
    }

    /**
     * Handle successful initialization
     */
    private void handleInitSuccess(VaultInitializer.VaultInitState state) {
        // Only navigate if we haven't already navigated
        if (!hasNavigated.compareAndSet(false, true)) {
            SecureLog.d(TAG, "Already navigated, skipping navigation");
            return;
        }

        this.hasPasswordSet = state.hasPasswordSet;
        this.isLoggedIn = state.isLoggedIn;
        this.isVaultOpen = state.isVaultOpen;
        this.isLoading = false;

        SecureLog.d(TAG, "User initialization complete");
        SecureLog.d(TAG, "  - hasPasswordSet: " + state.hasPasswordSet);
        SecureLog.d(TAG, "  - isLoggedIn: " + state.isLoggedIn);
        SecureLog.d(TAG, "  - isVaultOpen: " + state.isVaultOpen);

        // Set the appropriate flow based on password configuration
        if (!state.hasPasswordSet) {
            SecureLog.d(TAG, "Setting flow to missingConfiguration (passwordSet=false)");
            navigateToMissingConfiguration();
        } else if (!state.isLoggedIn) {
            SecureLog.d(TAG, "Setting flow to masterPassword (passwordSet=true, loggedIn=false)");
            navigateToMasterPassword();
        } else {
            SecureLog.d(TAG, "User is logged in, navigating to vault selection");
            navigateToVaultSelection();
        }

        // Reset initialization state after flow is set
        isInitializing.set(false);
        initRetryCount = 0; // Reset retry counter on success
        hasInitializedOnce = true;
    }

    /**
     * Handle initialization error with retry logic for lock errors
     */
    private void handleInitError(VaultInitializer.VaultInitError error, Exception exception) {
        boolean isLockError = error == VaultInitializer.VaultInitError.VAULT_LOCKED;

        if (isLockError && initRetryCount < MAX_INIT_RETRIES) {
            // Database lock error - retry after a delay
            initRetryCount++;
            int delayMs = initRetryCount * 300; // 300ms, 600ms, 900ms, etc.

            SecureLog.w(TAG, "Database lock detected, retrying in " + delayMs + "ms (attempt " + initRetryCount + "/" + MAX_INIT_RETRIES + ")");

            runOnUiThread(() -> {
                isInitializing.set(false);
                // Keep loading state - don't set isLoading = false
            });

            // Retry after delay
            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                SecureLog.d(TAG, "Retrying initialization after database lock");
                retryInitializeUser();
            }, delayMs);

            return;
        }

        // Not a lock error or max retries reached - handle normally
        if (isLockError) {
            SecureLog.e(TAG, "Max retries reached for database lock, showing error");
        }

        // Try to at least check if password is set
        boolean passwordSet = VaultInitializer.tryCheckPasswordSet(vaultClient);
        boolean couldCheckPassword = passwordSet || vaultClient != null;

        final boolean finalPasswordSet = passwordSet;
        final boolean finalCouldCheck = couldCheckPassword;
        final boolean finalIsLockError = isLockError;

        runOnUiThread(() -> {
            // Only navigate if we haven't already navigated
            if (!hasNavigated.compareAndSet(false, true)) {
                SecureLog.d(TAG, "Already navigated, skipping error navigation");
                return;
            }

            // Only update hasPasswordSet if we could actually check it
            // Otherwise keep the saved state or assume password is set (safer default)
            if (finalCouldCheck) {
                this.hasPasswordSet = finalPasswordSet;
            } else if (!hasInitializedOnce) {
                // No saved state and couldn't check - assume password is set
                // This is safer than assuming it's not set and showing onboarding
                this.hasPasswordSet = true;
                SecureLog.d(TAG, "Error handler - Could not verify password status, assuming set to avoid onboarding");
            }
            this.isLoggedIn = false;
            this.isVaultOpen = false;
            this.isLoading = false;

            // Only show missing configuration if we're CERTAIN password is not set
            if (!this.hasPasswordSet && finalCouldCheck) {
                SecureLog.d(TAG, "Error handler - Setting flow to missingConfiguration (passwordSet=false, confirmed)");
                navigateToMissingConfiguration();
            } else if (this.hasPasswordSet && finalCouldCheck) {
                // Password is set and we confirmed it - show master password screen
                SecureLog.d(TAG, "Error handler - Setting flow to masterPassword (passwordSet=true, confirmed)");
                navigateToMasterPassword();
            } else if (finalIsLockError) {
                // Lock error and couldn't determine state - show vault locked error
                SecureLog.d(TAG, "Error handler - Vault locked by another instance, showing lock error");
                navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.VAULT_LOCKED_ERROR);
            } else {
                // Could not determine state reliably - show error boundary
                SecureLog.d(TAG, "Error handler - Could not reliably determine user state, showing error boundary");
                navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType.VAULT_CLIENT_ERROR);
            }

            // Reset initialization state after flow is set
            isInitializing.set(false);
            initRetryCount = 0; // Reset retry counter
            hasInitializedOnce = true;
        });
    }

    /**
     * Retry user initialization (used for lock error retries)
     */
    private void retryInitializeUser() {
        if (vaultClient == null) {
            SecureLog.e(TAG, "Cannot retry initialization - vault client is null");
            return;
        }

        VaultInitializer.initializeUser(vaultClient)
            .whenComplete((state, error) -> {
                if (error != null) {
                    Exception ex = error instanceof Exception ?
                            (Exception) error : new Exception(error);
                    VaultInitializer.VaultInitError errorType = VaultInitializer.classifyError(ex);
                    handleInitError(errorType, ex);
                } else {
                    runOnUiThread(() -> handleInitSuccess(state));
                }
            });
    }

    /**
     * Navigate to missing configuration screen
     */
    public void navigateToMissingConfiguration() {
        // Check if we're already showing MissingConfigurationFragment
        Fragment currentFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
        if (currentFragment instanceof MissingConfigurationFragment) {
            SecureLog.d(TAG, "Already on MissingConfigurationFragment, skipping navigation");
            return;
        }

        Fragment fragment = new MissingConfigurationFragment();
        replaceFragment(fragment, false);
    }

    /**
     * Navigate to error boundary screen with a specific error type
     */
    public void navigateToErrorBoundary(ErrorBoundaryFragment.ErrorType errorType) {
        Fragment fragment = ErrorBoundaryFragment.newInstance(errorType);
        replaceFragment(fragment, false);
    }

    /**
     * Navigate to error boundary screen with custom error details
     */
    public void navigateToErrorBoundary(String icon, String title, String subtitle, String message) {
        Fragment fragment = ErrorBoundaryFragment.newInstance(icon, title, subtitle, message);
        replaceFragment(fragment, false);
    }

    /**
     * Get the vault client instance for fragments to use
     */
    public PearPassVaultClient getVaultClient() {
        return vaultClient;
    }

    /**
     * Cleanup when the activity is destroyed
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Only cleanup if the activity is actually finishing
        // Don't cleanup if user just backgrounds the app - they might resume
        if (isFinishing()) {
            SecureLog.d(TAG, "Activity is finishing, performing cleanup");
            cleanup();
        } else {
            SecureLog.d(TAG, "Activity destroyed but not finishing (might resume) - keeping vault client");
        }
    }

    /**
     * Cleanup the vault client resources
     */
    private void cleanup() {
        // Clear any pending password buffer
        clearPendingPasswordBuffer();

        if (vaultClient == null) {
            return;
        }

        SecureLog.d(TAG, "Cleaning up vault client...");

        final PearPassVaultClient clientToClose = vaultClient;
        vaultClient = null; // Clear reference immediately to prevent reuse

        try {
            // Wait synchronously for cleanup to complete
            // We MUST wait to ensure the database is released before onResume creates a new worklet
            // Shutdown is now synchronous so it should complete quickly (< 500ms)
            clientToClose.closeAllInstances().get(500, java.util.concurrent.TimeUnit.MILLISECONDS);
            SecureLog.d(TAG, "Cleanup completed successfully");
        } catch (java.util.concurrent.TimeoutException e) {
            SecureLog.w(TAG, "Cleanup timed out after 500ms, continuing anyway");
        } catch (Exception e) {
            SecureLog.w(TAG, "Error during cleanup: " + e.getMessage());
        }
    }
}