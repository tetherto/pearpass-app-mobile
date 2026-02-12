package com.pears.pass.autofill.ui;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.SecureLog;

/**
 * Base fragment for all autofill UI fragments.
 * Consolidates common functionality like navigation listener attachment,
 * vault client retrieval, and cancel button handling.
 */
public abstract class BaseAutofillFragment extends Fragment {
    protected NavigationListener navigationListener;
    protected PearPassVaultClient vaultClient;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof NavigationListener) {
            navigationListener = (NavigationListener) context;
        }
        if (context instanceof AuthenticationActivity) {
            vaultClient = ((AuthenticationActivity) context).getVaultClient();
        } else if (context instanceof PasskeyRegistrationActivity) {
            vaultClient = ((PasskeyRegistrationActivity) context).getVaultClient();
        }
    }

    /**
     * Set up a cancel button with the standard cancel listener.
     * @param cancelButton The cancel button view
     */
    protected void setupCancelButton(View cancelButton) {
        if (cancelButton != null) {
            cancelButton.setOnClickListener(v -> {
                if (navigationListener != null) {
                    navigationListener.onCancel();
                }
            });
        }
    }

    /**
     * Handle async errors consistently across fragments.
     * @param tag Log tag for error logging
     * @param message Error message
     * @param fallbackAction Action to run on UI thread if needed
     */
    protected void handleAsyncError(String tag, String message, Runnable fallbackAction) {
        SecureLog.e(tag, message);
        if (getActivity() != null && fallbackAction != null) {
            getActivity().runOnUiThread(fallbackAction);
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        navigationListener = null;
    }
}