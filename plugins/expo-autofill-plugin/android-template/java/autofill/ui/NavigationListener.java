package com.pears.pass.autofill.ui;

import com.pears.pass.autofill.data.CredentialItem;

public interface NavigationListener {
    void navigateToMissingConfiguration();
    void navigateToMasterPassword();
    void navigateToVaultSelection();
    void navigateToVaultPassword(String vaultId, String vaultName);
    void navigateToCredentialsList(String vaultId);
    /**
     * Navigate to credentials list with password as secure byte array.
     * The byte array will be cleared after the vault is activated.
     *
     * @param vaultId The vault ID to navigate to
     * @param passwordBuffer The password as a byte array (will be cleared after use)
     */
    void navigateToCredentialsList(String vaultId, byte[] passwordBuffer);
    void onCredentialSelected(CredentialItem credential);
    void onPasskeySelected(CredentialItem credential);
    void onCancel();
}
