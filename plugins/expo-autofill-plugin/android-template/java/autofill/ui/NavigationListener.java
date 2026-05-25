package com.pears.pass.autofill.ui;

import com.pears.pass.autofill.data.CredentialItem;

public interface NavigationListener {
    void navigateToMissingConfiguration();
    void navigateToMasterPassword();
    void navigateToVaultSelection();
    void onCredentialSelected(CredentialItem credential);
    void onPasskeySelected(CredentialItem credential);
    void onCancel();
}
