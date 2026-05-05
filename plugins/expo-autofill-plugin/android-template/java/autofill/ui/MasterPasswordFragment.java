package com.pears.pass.autofill.ui;

import android.content.Context;
import android.os.Bundle;
import android.text.InputType;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.biometric.BiometricManager;
import androidx.fragment.app.FragmentActivity;

import com.pears.pass.R;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.BiometricAuthHelper;
import com.pears.pass.autofill.utils.SecureLog;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class MasterPasswordFragment extends BaseAutofillFragment {
    private BiometricAuthHelper biometricHelper;
    private EditText passwordInput;
    private Button unlockButton;
    private TextView biometricButton;
    private ImageView togglePasswordVisibility;
    private boolean isAuthenticatingBiometric = false;
    private boolean isPasswordVisible = false;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        // Initialize BiometricAuthHelper
        biometricHelper = BiometricAuthHelper.getInstance(context);
    }

    @Override
    public void onResume() {
        super.onResume();
        // Close any open vaults when returning to this screen in assertion mode.
        // This ensures we can authenticate again without lock conflicts.
        // Skip in registration mode (PasskeyRegistrationActivity) since vault lifecycle
        // is managed by the registration activity itself.
        if (vaultClient != null && getActivity() instanceof AuthenticationActivity) {
            CompletableFuture.runAsync(() -> {
                try {
                    vaultClient.vaultsClose().get();
                    SecureLog.d("MasterPasswordFragment", "Closed vaults on resume");
                } catch (Exception e) {
                    SecureLog.d("MasterPasswordFragment", "No vaults to close or error closing: " + e.getMessage());
                }
            });
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // v2 uses the new sheet layout + inter font
        if (getResources().getInteger(R.integer.design_version) == 2) {
            return onCreateViewV2(inflater, container);
        }

        View view = inflater.inflate(R.layout.fragment_master_password, container, false);

        passwordInput = view.findViewById(R.id.passwordInput);
        unlockButton = view.findViewById(R.id.continueButton);
        TextView cancelButton = view.findViewById(R.id.cancelButton);
        biometricButton = view.findViewById(R.id.biometricButton);
        togglePasswordVisibility = view.findViewById(R.id.togglePasswordVisibility);

        unlockButton.setOnClickListener(v -> {
            String password = passwordInput.getText().toString();
            if (password.isEmpty()) {
                Toast.makeText(getContext(), "Please enter your master password", Toast.LENGTH_SHORT).show();
                return;
            }

            authenticateWithMasterPassword(password);
        });

        setupCancelButton(cancelButton);

        // Setup password visibility toggle
        setupPasswordVisibilityToggle();

        // Setup biometric button if available
        setupBiometricButton();

        return view;
    }

    /**
     * v2 sheet layout: header close button replaces the cancel row, no biometric button
     */
    private View onCreateViewV2(LayoutInflater inflater, ViewGroup container) {
        View view = inflater.inflate(R.layout.fragment_master_password_v2, container, false);

        passwordInput = view.findViewById(R.id.ppPasswordEdit);
        unlockButton = view.findViewById(R.id.masterPwdContinue);
        togglePasswordVisibility = view.findViewById(R.id.ppPasswordToggle);
        biometricButton = null;

        TextView passwordLabel = view.findViewById(R.id.ppPasswordLabel);
        if (passwordLabel != null) passwordLabel.setText("Password");
        if (passwordInput != null) passwordInput.setHint("Enter Master Password");

        View cancelView = view.findViewById(R.id.ppHeaderClose);
        if (cancelView != null) {
            cancelView.setOnClickListener(v -> {
                if (navigationListener != null) navigationListener.onCancel();
            });
        }

        TextView sheetTitle = view.findViewById(R.id.ppHeaderTitle);
        if (sheetTitle != null) sheetTitle.setText("Add a passkey");

        unlockButton.setOnClickListener(v -> {
            String password = passwordInput.getText().toString();
            if (password.isEmpty()) {
                Toast.makeText(getContext(), "Please enter your master password", Toast.LENGTH_SHORT).show();
                return;
            }
            authenticateWithMasterPassword(password);
        });

        setupPasswordVisibilityToggle();

        return view;
    }

    /**
     * Authenticate with the master password using the vault client
     */
    private void authenticateWithMasterPassword(String password) {
        if (vaultClient == null) {
            Toast.makeText(getContext(), "Vault client not initialized", Toast.LENGTH_SHORT).show();
            return;
        }

        // Disable the unlock button while authenticating
        unlockButton.setEnabled(false);
        unlockButton.setText("Unlocking...");

        // Convert password to byte array for secure handling
        byte[] passwordBuffer = com.pears.pass.autofill.utils.SecureBufferUtils.stringToBuffer(password);

        CompletableFuture.runAsync(() -> {
            try {
                // Use the simplified initWithPassword API which handles everything internally
                vaultClient.initWithPassword(passwordBuffer).get();

                // Verify that the vault was actually unlocked by checking status
                PearPassVaultClient.VaultStatus vaultStatus = vaultClient.vaultsGetStatus().get();
                if (vaultStatus.isLocked) {
                    throw new Exception("Invalid master password - vault remains locked");
                }

                // Get and store the master password encryption for resume reinitialization
                try {
                    PearPassVaultClient.MasterPasswordEncryption masterEnc =
                        vaultClient.getMasterPasswordEncryption(vaultStatus).get();
                    if (masterEnc != null && getActivity() instanceof PasskeyRegistrationActivity) {
                        ((PasskeyRegistrationActivity) getActivity()).onCredentialsObtained(
                            masterEnc.ciphertext,
                            masterEnc.nonce,
                            masterEnc.hashedPassword
                        );
                    }
                } catch (Exception e) {
                    SecureLog.w("MasterPasswordFragment", "Could not get master encryption for resume: " + e.getMessage());
                }

                // Authentication successful
                getActivity().runOnUiThread(() -> {
                    Toast.makeText(getContext(), "Authentication successful", Toast.LENGTH_SHORT).show();
                    if (navigationListener != null) {
                        navigationListener.navigateToVaultSelection();
                    }
                });

            } catch (Exception e) {
                SecureLog.e("MasterPasswordFragment", "Authentication failed: " + e.getMessage());

                getActivity().runOnUiThread(() -> {
                    Toast.makeText(getContext(), "Invalid master password", Toast.LENGTH_SHORT).show();
                    unlockButton.setEnabled(true);
                    unlockButton.setText("Unlock");
                    passwordInput.setText("");
                });
            } finally {
                // Securely clear the password buffer
                com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(passwordBuffer);
            }
        });
    }

    /**
     * Setup password visibility toggle
     */
    private void setupPasswordVisibilityToggle() {
        if (togglePasswordVisibility == null || passwordInput == null) return;

        if (getResources().getInteger(R.integer.design_version) == 2) {
            setupPasswordVisibilityToggleV2();
            return;
        }

        togglePasswordVisibility.setOnClickListener(v -> {
            isPasswordVisible = !isPasswordVisible;

            if (isPasswordVisible) {
                // Show password
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
                togglePasswordVisibility.setImageResource(R.drawable.eye_closed);
            } else {
                // Hide password
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                togglePasswordVisibility.setImageResource(R.drawable.eye);
            }

            // Move cursor to end of text
            passwordInput.setSelection(passwordInput.getText().length());
        });
    }

    /**
     * Re-applies inter font on each toggle since Android switches to monospace
     * when the input type flips to visible password
     */
    private void setupPasswordVisibilityToggleV2() {
        final android.graphics.Typeface interFont =
                androidx.core.content.res.ResourcesCompat.getFont(requireContext(), R.font.pp_v2_inter);

        togglePasswordVisibility.setOnClickListener(v -> {
            isPasswordVisible = !isPasswordVisible;
            if (isPasswordVisible) {
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
            } else {
                passwordInput.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
            if (interFont != null) passwordInput.setTypeface(interFont);
            passwordInput.setSelection(passwordInput.getText().length());
        });
    }

    /**
     * Setup biometric authentication button
     */
    private void setupBiometricButton() {
        if (biometricButton != null && biometricHelper != null) {
            boolean isSupported = biometricHelper.isBiometricSupported();
            boolean isEnabled = biometricHelper.isBiometricsEnabled();
            boolean canUse = biometricHelper.canUseBiometrics();

            SecureLog.d("MasterPasswordFragment",
                "Biometric status - supported: " + isSupported +
                ", enabled: " + isEnabled +
                ", canUse: " + canUse);

            if (isSupported && isEnabled && canUse) {
                // Show biometric button
                biometricButton.setVisibility(View.VISIBLE);

                biometricButton.setText("Use Biometric");

                // Set click listener for biometric authentication
                biometricButton.setOnClickListener(v -> {
                    if (!isAuthenticatingBiometric) {
                        handleBiometricLogin();
                    }
                });
            } else {
                // Hide biometric button if not available
                biometricButton.setVisibility(View.GONE);
            }
        }
    }

    /**
     * Handle biometric authentication
     */
    private void handleBiometricLogin() {
        if (vaultClient == null) {
            Toast.makeText(getContext(), "Vault client not initialized", Toast.LENGTH_SHORT).show();
            return;
        }

        if (isAuthenticatingBiometric) {
            return;
        }

        isAuthenticatingBiometric = true;

        // Get encryption data with biometric authentication
        FragmentActivity activity = getActivity();
        if (activity == null) {
            isAuthenticatingBiometric = false;
            return;
        }

        biometricHelper.authenticateWithBiometric(
            activity,
            "Authenticate to PearPass",
            "Use your biometric to unlock"
        ).whenComplete((encryptionData, throwable) -> {
            if (throwable != null) {
                // Authentication failed or was cancelled
                getActivity().runOnUiThread(() -> {
                    isAuthenticatingBiometric = false;
                    String errorMessage = throwable.getMessage();
                    if (errorMessage != null && errorMessage.contains("canceled")) {
                        // User cancelled, no need to show error
                    } else {
                        Toast.makeText(getContext(), "Biometric authentication failed", Toast.LENGTH_SHORT).show();
                    }
                });
            } else if (encryptionData != null) {
                // Authentication successful, use encryption data to unlock vault
                authenticateWithEncryptionData(encryptionData);
            } else {
                getActivity().runOnUiThread(() -> {
                    isAuthenticatingBiometric = false;
                    Toast.makeText(getContext(), "No stored credentials found", Toast.LENGTH_SHORT).show();
                });
            }
        });
    }

    /**
     * Authenticate using stored encryption data (from biometric auth)
     */
    private void authenticateWithEncryptionData(BiometricAuthHelper.EncryptionData encryptionData) {
        if (vaultClient == null || encryptionData == null) {
            getActivity().runOnUiThread(() -> {
                isAuthenticatingBiometric = false;
                Toast.makeText(getContext(), "Authentication data not available", Toast.LENGTH_SHORT).show();
            });
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                // Verify we have the stored hashed password
                if (encryptionData.hashedPassword == null || encryptionData.hashedPassword.isEmpty()) {
                    throw new Exception("Invalid credentials - no hashed password available");
                }

                // Use the simplified initWithCredentials API which handles everything internally
                vaultClient.initWithCredentials(
                    encryptionData.ciphertext,
                    encryptionData.nonce,
                    encryptionData.hashedPassword
                ).get();

                // Verify that the vault was actually unlocked by checking status
                PearPassVaultClient.VaultStatus vaultStatus = vaultClient.vaultsGetStatus().get();
                if (vaultStatus.isLocked) {
                    throw new Exception("Invalid credentials - vault remains locked");
                }

                // Authentication successful - store credentials for resume reinitialization
                if (getActivity() instanceof PasskeyRegistrationActivity) {
                    ((PasskeyRegistrationActivity) getActivity()).onCredentialsObtained(
                        encryptionData.ciphertext,
                        encryptionData.nonce,
                        encryptionData.hashedPassword
                    );
                }

                getActivity().runOnUiThread(() -> {
                    isAuthenticatingBiometric = false;
                    Toast.makeText(getContext(), "Authentication successful", Toast.LENGTH_SHORT).show();
                    if (navigationListener != null) {
                        navigationListener.navigateToVaultSelection();
                    }
                });

            } catch (Exception e) {
                SecureLog.e("MasterPasswordFragment", "Biometric authentication failed: " + e.getMessage());

                getActivity().runOnUiThread(() -> {
                    isAuthenticatingBiometric = false;
                    String errorMessage = e.getMessage();
                    if (errorMessage != null && errorMessage.contains("vault remains locked")) {
                        Toast.makeText(getContext(), "Invalid credentials", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(getContext(), "Authentication failed", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
    }
}
