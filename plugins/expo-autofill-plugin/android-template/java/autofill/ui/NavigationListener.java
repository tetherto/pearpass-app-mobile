package com.pears.pass.autofill.ui;

import com.pears.pass.autofill.data.CredentialItem;

public interface NavigationListener {
    void navigateToMissingConfiguration();
    void navigateToMasterPassword();
    void navigateToVaultSelection();
    void navigateToVaultPassword(String vaultId, String vaultName);
    void navigateToCredentialsList(String vaultId);
    void navigateToCredentialsList(String vaultId, String password);
    void onCredentialSelected(CredentialItem credential);
    void onPasskeySelected(CredentialItem credential);
    void onCancel();
}
