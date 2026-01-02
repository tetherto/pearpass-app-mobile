package com.noxtton.pearpass.autofill.service;

import android.app.PendingIntent;
import android.app.assist.AssistStructure;
import android.content.Intent;
import android.content.IntentSender;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.CancellationSignal;
import android.service.autofill.AutofillService;
import android.service.autofill.Dataset;
import android.service.autofill.FillCallback;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.service.autofill.InlinePresentation;
import android.service.autofill.SaveCallback;
import android.service.autofill.SaveRequest;
import android.util.Log;
import android.view.autofill.AutofillId;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;
import android.widget.inline.InlinePresentationSpec;

// AndroidX Autofill imports
import androidx.autofill.inline.UiVersions;
import androidx.autofill.inline.v1.InlineSuggestionUi;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.noxtton.pearpass.R;
import com.noxtton.pearpass.autofill.ui.AuthenticationActivity;
import com.noxtton.pearpass.autofill.utils.AutofillHelper;
import com.noxtton.pearpass.autofill.utils.AutofillConstants;

import java.util.ArrayList;
import java.util.List;

@RequiresApi(api = Build.VERSION_CODES.O)
public class PearPassAutofillService extends AutofillService {
    private static final String TAG = "PearPassAutofill";

    @Override
    public void onFillRequest(@NonNull FillRequest request, @NonNull CancellationSignal cancellationSignal, @NonNull FillCallback callback) {
        List<FillContext> fillContexts = request.getFillContexts();
        if (fillContexts.isEmpty()) {
            callback.onSuccess(null);
            return;
        }

        AssistStructure structure = fillContexts.get(fillContexts.size() - 1).getStructure();
        AutofillHelper.ParsedFields parsedFields = AutofillHelper.parseStructure(structure);

        if (parsedFields == null || (!parsedFields.hasUsernameField() && !parsedFields.hasPasswordField())) {
            callback.onSuccess(null);
            return;
        }

        // Check if inline suggestions are available (Android 11+)
        boolean hasInlineSuggestions = false;
        List<InlinePresentationSpec> specs = null;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && request.getInlineSuggestionsRequest() != null) {
            int maxSuggestionCount = request.getInlineSuggestionsRequest().getMaxSuggestionCount();
            if (maxSuggestionCount > 0) {
                specs = request.getInlineSuggestionsRequest().getInlinePresentationSpecs();
                if (!specs.isEmpty()) {
                    hasInlineSuggestions = true;
                }
            }
        }

        // Create authentication intent
        Intent authIntent = new Intent(this, AuthenticationActivity.class);
        authIntent.putExtra("username_id", parsedFields.getUsernameId());
        authIntent.putExtra("password_id", parsedFields.getPasswordId());

        // Pass domain/package information for credential filtering
        String webDomain = parsedFields.getWebDomain();
        String packageName = parsedFields.getPackageName();

        if (webDomain != null && !webDomain.isEmpty()) {
            authIntent.putExtra("web_domain", webDomain);
        }
        if (packageName != null && !packageName.isEmpty()) {
            authIntent.putExtra("package_name", packageName);
        }

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_MUTABLE;
        }

        IntentSender sender = PendingIntent.getActivity(this, 1001, authIntent, flags).getIntentSender();

        // Create RemoteViews for dropdown presentation (always needed)
        RemoteViews presentation = new RemoteViews(getPackageName(), android.R.layout.simple_list_item_1);
        presentation.setTextViewText(android.R.id.text1, "🔐 PearPass - Tap to unlock");

        // Create inline presentation if available
        InlinePresentation inlinePresentation = null;
        if (hasInlineSuggestions) {
            InlinePresentationSpec spec = specs.get(0);

            // Check if inline suggestions are compatible
            boolean isInlineCompatible = UiVersions.getVersions(spec.getStyle()).contains(UiVersions.INLINE_UI_VERSION_1);

            if (isInlineCompatible) {
                // Create PendingIntent for authentication
                PendingIntent pendingIntent = PendingIntent.getActivity(this, 1002, authIntent, flags);

                // Create icon
                Icon icon = Icon.createWithResource(this, android.R.drawable.ic_dialog_info);

                // Create InlineSuggestionUi slice
                android.app.slice.Slice slice = InlineSuggestionUi.newContentBuilder(pendingIntent)
                    .setTitle("🔐 PearPass")
                    .setSubtitle("Tap to unlock")
                    .setStartIcon(icon)
                    .setContentDescription("PearPass autofill suggestion")
                    .build()
                    .getSlice();

                inlinePresentation = new InlinePresentation(slice, spec, false);
            }
        }

        FillResponse.Builder responseBuilder = new FillResponse.Builder();

        // Create a single dataset with BOTH fields so they fill together
        Dataset.Builder datasetBuilder = new Dataset.Builder();

        if (parsedFields.hasUsernameField() && parsedFields.hasPasswordField()) {
            // Both fields present - add both to the same dataset
            if (inlinePresentation != null) {
                datasetBuilder.setValue(
                    parsedFields.getUsernameId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation,
                    inlinePresentation
                );
                datasetBuilder.setValue(
                    parsedFields.getPasswordId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation,
                    inlinePresentation
                );
            } else {
                datasetBuilder.setValue(
                    parsedFields.getUsernameId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation
                );
                datasetBuilder.setValue(
                    parsedFields.getPasswordId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation
                );
            }

            datasetBuilder.setAuthentication(sender);
            responseBuilder.addDataset(datasetBuilder.build());
        } else if (parsedFields.hasUsernameField()) {
            // Only username field
            if (inlinePresentation != null) {
                datasetBuilder.setValue(
                    parsedFields.getUsernameId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation,
                    inlinePresentation
                );
            } else {
                datasetBuilder.setValue(
                    parsedFields.getUsernameId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation
                );
            }

            datasetBuilder.setAuthentication(sender);
            responseBuilder.addDataset(datasetBuilder.build());
        } else if (parsedFields.hasPasswordField()) {
            // Only password field
            if (inlinePresentation != null) {
                datasetBuilder.setValue(
                    parsedFields.getPasswordId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation,
                    inlinePresentation
                );
            } else {
                datasetBuilder.setValue(
                    parsedFields.getPasswordId(),
                    AutofillValue.forText(AutofillConstants.PLACEHOLDER_PASSWORD),
                    presentation
                );
            }

            datasetBuilder.setAuthentication(sender);
            responseBuilder.addDataset(datasetBuilder.build());
        }

        FillResponse response = responseBuilder.build();
        callback.onSuccess(response);
    }

    @Override
    public void onSaveRequest(@NonNull SaveRequest request, @NonNull SaveCallback callback) {
        // For now, we won't handle save requests
        callback.onSuccess();
    }

    @Override
    public void onConnected() {
        super.onConnected();
    }

    @Override
    public void onDisconnected() {
        super.onDisconnected();
    }
}