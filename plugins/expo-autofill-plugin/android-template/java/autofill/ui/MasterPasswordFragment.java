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
import androidx.fragment.app.FragmentActivity;

import com.pears.pass.R;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.BiometricAuthHelper;
import com.pears.pass.autofill.utils.RateLimitManager;
import com.pears.pass.autofill.utils.SecureLog;

import java.util.concurrent.CompletableFuture;

public class MasterPasswordFragment extends BaseAutofillFragment {
    private BiometricAuthHelper biometricHelper;
    private RateLimitManager rateLimit;
    private EditText passwordInput;
    private Button unlockButton;
    private TextView biometricButton;
    private TextView errorText;
    private ImageView togglePasswordVisibility;
    private boolean isAuthenticatingBiometric = false;
    private boolean isPasswordVisible = false;
    private android.os.CountDownTimer lockoutTimer;
    // Spinner overlay shown over Continue while auth is in flight.
    private android.widget.ProgressBar continueProgress;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        biometricHelper = BiometricAuthHelper.getInstance(context);
        rateLimit = new RateLimitManager(context);
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
        View view = inflater.inflate(R.layout.fragment_master_password, container, false);

        passwordInput = view.findViewById(R.id.ppPasswordEdit);
        unlockButton = view.findViewById(R.id.masterPwdContinue);
        togglePasswordVisibility = view.findViewById(R.id.ppPasswordToggle);
        biometricButton = view.findViewById(R.id.masterPwdBiometricButton);
        errorText = view.findViewById(R.id.masterPwdError);
        continueProgress = view.findViewById(R.id.masterPwdContinueProgress);

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
        if (sheetTitle != null) {
            // Sign in for assertion, Add a passkey for registration.
            String title = (getActivity() instanceof AuthenticationActivity) ? "Sign in" : "Add a passkey";
            sheetTitle.setText(title);
        }

        unlockButton.setOnClickListener(v -> {
            String password = passwordInput.getText().toString();
            if (password.isEmpty()) {
                Toast.makeText(getContext(), "Please enter your master password", Toast.LENGTH_SHORT).show();
                return;
            }
            authenticateWithMasterPassword(password);
        });

        passwordInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(android.text.Editable s) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (errorText != null && errorText.getVisibility() == View.VISIBLE
                        && unlockButton.isEnabled()) {
                    errorText.setVisibility(View.GONE);
                }
            }
        });

        setupPasswordVisibilityToggle();
        setupBiometricButton();
        refreshRateLimitStatus();

        return view;
    }

    @Override
    public void onDestroyView() {
        if (lockoutTimer != null) {
            lockoutTimer.cancel();
            lockoutTimer = null;
        }
        super.onDestroyView();
    }

    private void refreshRateLimitStatus() {
        if (rateLimit == null) return;
        applyRateLimitStatus(rateLimit.getStatus());
    }

    private void applyRateLimitStatus(RateLimitManager.Status status) {
        if (errorText == null || unlockButton == null || passwordInput == null) return;

        if (status.isLocked && status.lockoutRemainingMs > 0) {
            startLockoutCountdown(status.lockoutRemainingMs);
            return;
        }

        if (lockoutTimer != null) {
            lockoutTimer.cancel();
            lockoutTimer = null;
        }
        unlockButton.setEnabled(true);
        passwordInput.setEnabled(true);
    }

    private void startLockoutCountdown(long remainingMs) {
        if (errorText == null || unlockButton == null || passwordInput == null) return;

        unlockButton.setEnabled(false);
        passwordInput.setEnabled(false);
        passwordInput.setText("");
        errorText.setVisibility(View.VISIBLE);
        errorText.setText(formatLockoutMessage(remainingMs));

        if (lockoutTimer != null) lockoutTimer.cancel();
        lockoutTimer = new android.os.CountDownTimer(remainingMs, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                errorText.setText(formatLockoutMessage(millisUntilFinished));
            }
            @Override
            public void onFinish() {
                lockoutTimer = null;
                refreshRateLimitStatus();
            }
        }.start();
    }

    private String formatLockoutMessage(long remainingMs) {
        long totalSeconds = Math.max(1, (remainingMs + 999) / 1000);
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        String when;
        if (minutes > 0 && seconds > 0) {
            when = minutes + "m " + seconds + "s";
        } else if (minutes > 0) {
            when = minutes + "m";
        } else {
            when = seconds + "s";
        }
        return "Too many attempts. Try again in " + when + ".";
    }

    /**
     * Authenticate with the master password using the vault client
     */
    private void authenticateWithMasterPassword(String password) {
        if (vaultClient == null) {
            Toast.makeText(getContext(), "Vault client not initialized", Toast.LENGTH_SHORT).show();
            return;
        }

        unlockButton.setEnabled(false);
        unlockButton.setText("");
        if (continueProgress != null) continueProgress.setVisibility(View.VISIBLE);

        // Convert password to byte array for secure handling
        byte[] passwordBuffer = com.pears.pass.autofill.utils.SecureBufferUtils.stringToBuffer(password);

        CompletableFuture.runAsync(() -> {
            try {
                vaultClient.initWithPassword(passwordBuffer).get();

                PearPassVaultClient.VaultStatus vaultStatus = vaultClient.vaultsGetStatus().get();
                if (vaultStatus.isLocked) {
                    throw new Exception("Invalid master password - vault remains locked");
                }

                if (rateLimit != null) rateLimit.reset();

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

                getActivity().runOnUiThread(() -> {
                    if (navigationListener != null) {
                        navigationListener.navigateToVaultSelection();
                    }
                });

            } catch (Exception e) {
                SecureLog.e("MasterPasswordFragment", "Authentication failed: " + e.getMessage());

                if (rateLimit != null) rateLimit.recordFailure();
                final RateLimitManager.Status status = rateLimit != null ? rateLimit.getStatus() : null;

                getActivity().runOnUiThread(() -> {
                    unlockButton.setEnabled(true);
                    unlockButton.setText("Continue");
                    if (continueProgress != null) continueProgress.setVisibility(View.GONE);
                    passwordInput.setText("");

                    if (status != null && status.isLocked && status.lockoutRemainingMs > 0) {
                        startLockoutCountdown(status.lockoutRemainingMs);
                    } else if (status != null) {
                        errorText.setVisibility(View.VISIBLE);
                        String attemptWord = status.remainingAttempts == 1 ? "attempt" : "attempts";
                        errorText.setText("Incorrect password. You have "
                                + status.remainingAttempts + " " + attemptWord
                                + " before the app will be temporarily locked.");
                    } else {
                        Toast.makeText(getContext(), "Invalid master password", Toast.LENGTH_SHORT).show();
                    }
                });
            } finally {
                com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(passwordBuffer);
            }
        });
    }

    /**
     * Re-applies inter font on each toggle since Android switches to monospace
     * when the input type flips to visible password.
     */
    private void setupPasswordVisibilityToggle() {
        if (togglePasswordVisibility == null || passwordInput == null) return;

        final android.graphics.Typeface interFont =
                androidx.core.content.res.ResourcesCompat.getFont(requireContext(), R.font.pp_inter);

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
                biometricButton.setVisibility(View.VISIBLE);

                boolean hasFingerprint = getContext() != null
                        && getContext().getPackageManager().hasSystemFeature(
                                android.content.pm.PackageManager.FEATURE_FINGERPRINT);
                biometricButton.setText(hasFingerprint
                        ? "Try again with Fingerprint"
                        : "Try again with Biometrics");

                biometricButton.setOnClickListener(v -> {
                    if (!isAuthenticatingBiometric) {
                        handleBiometricLogin();
                    }
                });
            } else {
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
                if (encryptionData.hashedPassword == null || encryptionData.hashedPassword.isEmpty()) {
                    throw new Exception("Invalid credentials - no hashed password available");
                }

                vaultClient.initWithCredentials(
                    encryptionData.ciphertext,
                    encryptionData.nonce,
                    encryptionData.hashedPassword
                ).get();

                PearPassVaultClient.VaultStatus vaultStatus = vaultClient.vaultsGetStatus().get();
                if (vaultStatus.isLocked) {
                    throw new Exception("Invalid credentials - vault remains locked");
                }

                if (rateLimit != null) rateLimit.reset();

                if (getActivity() instanceof PasskeyRegistrationActivity) {
                    ((PasskeyRegistrationActivity) getActivity()).onCredentialsObtained(
                        encryptionData.ciphertext,
                        encryptionData.nonce,
                        encryptionData.hashedPassword
                    );
                }

                getActivity().runOnUiThread(() -> {
                    isAuthenticatingBiometric = false;
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
