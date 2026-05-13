package com.pears.pass.autofill.ui;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.pears.pass.R;

/**
 * Error boundary fragment for displaying autofill initialization errors
 * Supports different error types with customizable messages
 */
public class ErrorBoundaryFragment extends BaseAutofillFragment {
    private static final String ARG_ERROR_TYPE = "error_type";
    private static final String ARG_ERROR_ICON = "error_icon";
    private static final String ARG_ERROR_TITLE = "error_title";
    private static final String ARG_ERROR_SUBTITLE = "error_subtitle";
    private static final String ARG_ERROR_MESSAGE = "error_message";

    /**
     * Error types for different autofill failure scenarios
     */
    public enum ErrorType {
        GENERIC_ERROR,
        INITIALIZATION_FAILED,
        VAULT_CLIENT_ERROR,
        VAULT_LOCKED_ERROR,
        TIMEOUT_ERROR
    }

    /**
     * Create a new ErrorBoundaryFragment with a specific error type
     */
    public static ErrorBoundaryFragment newInstance(ErrorType errorType) {
        ErrorBoundaryFragment fragment = new ErrorBoundaryFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ERROR_TYPE, errorType.name());
        fragment.setArguments(args);
        return fragment;
    }

    /**
     * Create a new ErrorBoundaryFragment with custom error details
     */
    public static ErrorBoundaryFragment newInstance(String icon, String title, String subtitle, String message) {
        ErrorBoundaryFragment fragment = new ErrorBoundaryFragment();
        Bundle args = new Bundle();
        if (icon != null) args.putString(ARG_ERROR_ICON, icon);
        if (title != null) args.putString(ARG_ERROR_TITLE, title);
        if (subtitle != null) args.putString(ARG_ERROR_SUBTITLE, subtitle);
        if (message != null) args.putString(ARG_ERROR_MESSAGE, message);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        if (getResources().getInteger(R.integer.design_version) == 2) {
            return inflater.inflate(R.layout.fragment_error_boundary_v2, container, false);
        }
        return inflater.inflate(R.layout.fragment_error_boundary, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // v2 layout uses a static icon + different ids;
        if (getResources().getInteger(R.integer.design_version) == 2) {
            onViewCreatedV2(view);
            return;
        }

        TextView errorIcon = view.findViewById(R.id.errorIcon);
        TextView errorTitle = view.findViewById(R.id.errorTitle);
        TextView errorSubtitle = view.findViewById(R.id.errorSubtitle);
        TextView errorMessage = view.findViewById(R.id.errorMessage);
        TextView cancelButton = view.findViewById(R.id.cancelButton);
        Button goBackButton = view.findViewById(R.id.goBackButton);

        // Get error details from arguments
        Bundle args = getArguments();
        if (args != null) {
            // Check for custom error details first
            if (args.containsKey(ARG_ERROR_ICON)) {
                errorIcon.setText(args.getString(ARG_ERROR_ICON));
            }
            if (args.containsKey(ARG_ERROR_TITLE)) {
                errorTitle.setText(args.getString(ARG_ERROR_TITLE));
            }
            if (args.containsKey(ARG_ERROR_SUBTITLE)) {
                errorSubtitle.setText(args.getString(ARG_ERROR_SUBTITLE));
            }
            if (args.containsKey(ARG_ERROR_MESSAGE)) {
                String message = args.getString(ARG_ERROR_MESSAGE);
                if (message != null && !message.isEmpty()) {
                    errorMessage.setText(message);
                    errorMessage.setVisibility(View.VISIBLE);
                }
            }

            // Otherwise use predefined error type
            if (args.containsKey(ARG_ERROR_TYPE)) {
                String errorTypeStr = args.getString(ARG_ERROR_TYPE);
                ErrorType errorType = ErrorType.valueOf(errorTypeStr);
                configureErrorType(errorType, errorIcon, errorTitle, errorSubtitle, errorMessage);
            }
        }

        setupCancelButton(cancelButton);
        setupCancelButton(goBackButton);
    }

    private void onViewCreatedV2(View view) {
        TextView errorTitle = view.findViewById(R.id.errorV2Title);
        TextView errorSubtitle = view.findViewById(R.id.errorV2Subtitle);
        TextView errorMessage = view.findViewById(R.id.errorV2Message);
        Button goBackButton = view.findViewById(R.id.errorV2GoBackButton);

        View sheetHeader = view.findViewById(R.id.errorSheetHeader);
        if (sheetHeader != null) {
            View back = sheetHeader.findViewById(R.id.ppHeaderBack);
            View close = sheetHeader.findViewById(R.id.ppHeaderClose);
            TextView headerTitle = sheetHeader.findViewById(R.id.ppHeaderTitle);
            if (headerTitle != null) headerTitle.setText("");
            if (close != null) close.setVisibility(View.GONE);
            if (back != null) back.setOnClickListener(v -> {
                if (navigationListener != null) navigationListener.onCancel();
            });
        }

        Bundle args = getArguments();
        if (args != null) {
            if (args.containsKey(ARG_ERROR_TITLE)) {
                errorTitle.setText(args.getString(ARG_ERROR_TITLE));
            }
            if (args.containsKey(ARG_ERROR_SUBTITLE)) {
                errorSubtitle.setText(args.getString(ARG_ERROR_SUBTITLE));
            }
            if (args.containsKey(ARG_ERROR_MESSAGE)) {
                String message = args.getString(ARG_ERROR_MESSAGE);
                if (message != null && !message.isEmpty()) {
                    errorMessage.setText(message);
                    errorMessage.setVisibility(View.VISIBLE);
                }
            }
            if (args.containsKey(ARG_ERROR_TYPE)) {
                String errorTypeStr = args.getString(ARG_ERROR_TYPE);
                ErrorType errorType = ErrorType.valueOf(errorTypeStr);
                configureErrorTypeV2(errorType, errorTitle, errorSubtitle, errorMessage);
            }
        }

        setupCancelButton(goBackButton);
    }

    /**
     * Configure UI based on error type
     */
    private void configureErrorType(ErrorType errorType, TextView icon, TextView title,
                                   TextView subtitle, TextView message) {
        switch (errorType) {
            case INITIALIZATION_FAILED:
                icon.setText("⚠️");
                title.setText("Initialization Failed");
                subtitle.setText("Unable to start autofill service");
                message.setText("The autofill service failed to initialize. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;

            case VAULT_CLIENT_ERROR:
                icon.setText("🔒");
                title.setText("Vault Error");
                subtitle.setText("Unable to access vault");
                message.setText("There was an error accessing the vault. Please close and reopen the app.");
                message.setVisibility(View.VISIBLE);
                break;

            case VAULT_LOCKED_ERROR:
                icon.setText("🔒");
                title.setText("Vault In Use");
                subtitle.setText("PearPass is already running");
                message.setText("The vault is locked by the PearPass app. Please close PearPass and try again.");
                message.setVisibility(View.VISIBLE);
                break;

            case TIMEOUT_ERROR:
                icon.setText("⏱️");
                title.setText("Timeout");
                subtitle.setText("Autofill took too long to start");
                message.setText("The autofill service is taking longer than expected. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;

            case GENERIC_ERROR:
            default:
                icon.setText("⚠️");
                title.setText("Autofill Error");
                subtitle.setText("Unable to initialize autofill");
                message.setText("An unexpected error occurred. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;
        }
    }

    /**
     * v2 uses a static drawable icon, no TextView
     */
    private void configureErrorTypeV2(ErrorType errorType, TextView title, TextView subtitle, TextView message) {
        switch (errorType) {
            case INITIALIZATION_FAILED:
                title.setText("Initialization Failed");
                subtitle.setText("Unable to start autofill service");
                message.setText("The autofill service failed to initialize. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;
            case VAULT_CLIENT_ERROR:
                title.setText("Vault Error");
                subtitle.setText("Unable to access vault");
                message.setText("There was an error accessing the vault. Please close and reopen the app.");
                message.setVisibility(View.VISIBLE);
                break;
            case VAULT_LOCKED_ERROR:
                title.setText("Vault In Use");
                subtitle.setText("PearPass is already running");
                message.setText("The vault is locked by the PearPass app. Please close PearPass and try again.");
                message.setVisibility(View.VISIBLE);
                break;
            case TIMEOUT_ERROR:
                title.setText("Timeout");
                subtitle.setText("Autofill took too long to start");
                message.setText("The autofill service is taking longer than expected. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;
            case GENERIC_ERROR:
            default:
                title.setText("Autofill Error");
                subtitle.setText("Unable to initialize autofill");
                message.setText("An unexpected error occurred. Please try again.");
                message.setVisibility(View.VISIBLE);
                break;
        }
    }
}
