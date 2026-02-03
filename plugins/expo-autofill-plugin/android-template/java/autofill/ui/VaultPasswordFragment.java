package com.pears.pass.autofill.ui;

import android.content.Context;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.pears.pass.R;
import com.pears.pass.autofill.data.PearPassVaultClient;

import java.util.concurrent.CompletableFuture;

public class VaultPasswordFragment extends BaseAutofillFragment {
    private static final String ARG_VAULT_ID = "vault_id";
    private static final String ARG_VAULT_NAME = "vault_name";

    private EditText passwordInput;
    private Button unlockButton;
    private TextView cancelButton;
    private TextView vaultNameText;
    private TextView errorText;

    private String vaultId;
    private String vaultName;
    private boolean isUnlocking = false;

    public static VaultPasswordFragment newInstance(String vaultId, String vaultName) {
        VaultPasswordFragment fragment = new VaultPasswordFragment();
        Bundle args = new Bundle();
        args.putString(ARG_VAULT_ID, vaultId);
        args.putString(ARG_VAULT_NAME, vaultName);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            vaultId = getArguments().getString(ARG_VAULT_ID);
            vaultName = getArguments().getString(ARG_VAULT_NAME);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_vault_password, container, false);

        passwordInput = view.findViewById(R.id.passwordInput);
        unlockButton = view.findViewById(R.id.unlockButton);
        cancelButton = view.findViewById(R.id.cancelButton);
        vaultNameText = view.findViewById(R.id.vaultNameText);
        errorText = view.findViewById(R.id.errorText);

        // Set vault name
        if (vaultNameText != null && vaultName != null) {
            vaultNameText.setText(vaultName);
        }

        // Add text watcher to password input
        passwordInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // Clear error when user types
                if (errorText != null) {
                    errorText.setVisibility(View.GONE);
                }
                // Enable/disable unlock button based on input
                unlockButton.setEnabled(s.length() > 0 && !isUnlocking);
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        // Initially disable unlock button
        unlockButton.setEnabled(false);

        unlockButton.setOnClickListener(v -> {
            if (!isUnlocking) {
                unlockVault();
            }
        });

        setupCancelButton(cancelButton);

        return view;
    }

    private void unlockVault() {
        // Extract password directly to char[] to avoid creating an immutable String
        Editable editable = passwordInput.getText();
        if (editable.length() == 0 || vaultClient == null || vaultId == null) {
            return;
        }

        // Extract to char array - avoids creating String which cannot be cleared
        char[] passwordChars = new char[editable.length()];
        editable.getChars(0, editable.length(), passwordChars, 0);

        // Clear password from EditText immediately for security
        passwordInput.setText("");

        isUnlocking = true;
        unlockButton.setEnabled(false);

        // Hide error text
        if (errorText != null) {
            errorText.setVisibility(View.GONE);
        }

        // Convert char[] to byte[] for secure handling (avoids intermediate String)
        byte[] passwordBuffer = com.pears.pass.autofill.utils.SecureBufferUtils.charsToBuffer(passwordChars);

        // Clear char array immediately after conversion
        com.pears.pass.autofill.utils.SecureBufferUtils.clearChars(passwordChars);

        CompletableFuture.runAsync(() -> {
            // Create a copy for navigation since we'll clear the original in finally
            // This copy will be cleared by CredentialsListFragment after vault activation
            byte[] navigationBuffer = null;
            try {
                // Use byte[] version of validateVaultPassword
                boolean success = vaultClient.validateVaultPassword(vaultId, passwordBuffer).get();

                if (getActivity() == null) {
                    return;
                }

                if (success) {
                    // Create a copy for navigation - the original will be cleared in finally
                    navigationBuffer = new byte[passwordBuffer.length];
                    System.arraycopy(passwordBuffer, 0, navigationBuffer, 0, passwordBuffer.length);
                }

                final byte[] finalNavigationBuffer = navigationBuffer;
                getActivity().runOnUiThread(() -> {
                    isUnlocking = false;

                    if (finalNavigationBuffer != null) {
                        // Password validated, navigate to credentials list with password buffer
                        // CredentialsListFragment will use password to activate vault and then clear it
                        if (navigationListener != null) {
                            navigationListener.navigateToCredentialsList(vaultId, finalNavigationBuffer);
                        }
                    } else {
                        // Failed to validate - wrong password
                        Toast.makeText(getContext(), "Incorrect password", Toast.LENGTH_SHORT).show();
                        showError("Incorrect password");
                        unlockButton.setEnabled(true);
                        passwordInput.requestFocus();
                    }
                });

            } catch (Exception e) {
                android.util.Log.e("VaultPasswordFragment", "Failed to validate password: " + e.getMessage());

                // Clear navigation buffer if created but not used
                if (navigationBuffer != null) {
                    com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(navigationBuffer);
                }

                if (getActivity() == null) {
                    return;
                }

                getActivity().runOnUiThread(() -> {
                    isUnlocking = false;
                    Toast.makeText(getContext(), "Failed to unlock vault", Toast.LENGTH_SHORT).show();
                    showError("Failed to unlock vault");
                    unlockButton.setEnabled(true);
                });
            } finally {
                // Securely clear the password buffer used for validation
                com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(passwordBuffer);
            }
        });
    }

    private void showError(String message) {
        android.util.Log.d("VaultPasswordFragment", "showError called with message: " + message);
        if (errorText != null) {
            errorText.setText(message);
            errorText.setVisibility(View.VISIBLE);
            android.util.Log.d("VaultPasswordFragment", "Error text set and made visible");
        } else {
            android.util.Log.e("VaultPasswordFragment", "errorText is null!");
        }
    }
}