package com.noxtton.pearpass.autofill.ui;

import com.noxtton.pearpass.autofill.data.CredentialItem;

public interface NavigationListener {
    void navigateToMissingConfiguration();
    void navigateToMasterPassword();
    void navigateToVaultSelection();
    void navigateToVaultPassword(String vaultId, String vaultName);
    void navigateToCredentialsList(String vaultId);
    void navigateToCredentialsList(String vaultId, String password);
    void onCredentialSelected(CredentialItem credential);
    void onCancel();
}