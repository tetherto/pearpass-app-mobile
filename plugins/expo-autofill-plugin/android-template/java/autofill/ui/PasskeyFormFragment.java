package com.pears.pass.autofill.ui;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.appcompat.app.AlertDialog;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.pears.pass.R;
import com.pears.pass.autofill.data.PasskeyFormData;
import com.pears.pass.autofill.utils.SecureLog;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Form fragment for passkey registration.
 * Captures title, username, website, comment, and file attachments for the passkey credential.
 */
public class PasskeyFormFragment extends Fragment {
    private static final String TAG = "PasskeyFormFragment";
    private static final long MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; // 6 MB

    private EditText titleInput;
    private EditText usernameInput;
    private EditText commentInput;
    private TextView titleError;
    private TextView websiteError;
    private TextView saveError;
    private TextView fileSizeError;
    private TextView passkeyDateText;
    private TextView cancelButton;
    private TextView folderSelector;
    private Button saveButton;
    private Button uploadFileButton;
    private LinearLayout attachmentsContainer;

    // Multi-website rows.
    private LinearLayout websitesRowContainer;
    private View addWebsiteButton;
    private final List<EditText> websiteInputs = new ArrayList<>();

    // Spinner overlay shown over Save while the passkey is being written.
    private android.widget.ProgressBar saveProgress;

    private static final String STATE_SELECTED_FOLDER = "selected_folder";
    private static final String STATE_PASSKEY_CREATED_AT = "passkey_created_at";
    private static final String STATE_IS_SAVING = "is_saving";

    private String selectedFolder = null;
    private long passkeyCreatedAt;
    private boolean isSaving = false;

    // File attachments (matching iOS AttachmentFile)
    private final List<PasskeyFormData.AttachmentFile> attachments = new ArrayList<>();

    // Existing attachments from the record (id + name, for keepAttachmentIds)
    private final List<ExistingAttachment> existingAttachments = new ArrayList<>();

    // File picker launcher
    private ActivityResultLauncher<Intent> filePickerLauncher;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (savedInstanceState != null) {
            selectedFolder = savedInstanceState.getString(STATE_SELECTED_FOLDER);
            passkeyCreatedAt = savedInstanceState.getLong(STATE_PASSKEY_CREATED_AT, 0);
            isSaving = savedInstanceState.getBoolean(STATE_IS_SAVING, false);
        }

        filePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == android.app.Activity.RESULT_OK && result.getData() != null) {
                        Uri uri = result.getData().getData();
                        if (uri != null) {
                            handleFileSelected(uri);
                        }
                    }
                }
        );
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString(STATE_SELECTED_FOLDER, selectedFolder);
        outState.putLong(STATE_PASSKEY_CREATED_AT, passkeyCreatedAt);
        outState.putBoolean(STATE_IS_SAVING, isSaving);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_passkey_form, container, false);
        bindViews(view);
        initializeForm();
        setupListeners();
        refreshAttachmentsDisplay();
        return view;
    }

    /**
     * Binds the includes-based layout, resolving the shared ppInputEdit id inside each field.
     */
    private void bindViews(View view) {
        View titleField = view.findViewById(R.id.formTitleField);
        titleInput = titleField.findViewById(R.id.ppInputEdit);
        setInputFieldLabel(titleField, "Title*");
        titleInput.setHint("Insert title");
        titleInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT);
        titleError = view.findViewById(R.id.formTitleError);

        View usernameField = view.findViewById(R.id.formUsernameField);
        usernameInput = usernameField.findViewById(R.id.ppInputEdit);
        setInputFieldLabel(usernameField, "Email or username");
        usernameInput.setHint("Email or username");
        usernameInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT
                | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);

        View passkeyField = view.findViewById(R.id.formPasskeyField);
        passkeyDateText = passkeyField.findViewById(R.id.ppInputEdit);
        setInputFieldLabel(passkeyField, "Passkey");
        passkeyDateText.setFocusable(false);
        passkeyDateText.setClickable(false);
        passkeyDateText.setCursorVisible(false);
        passkeyDateText.setKeyListener(null);

        // Unified websites card; rows added via addWebsiteRow.
        websitesRowContainer = view.findViewById(R.id.formWebsitesRowContainer);
        addWebsiteButton = view.findViewById(R.id.formAddWebsiteButton);
        websiteError = view.findViewById(R.id.formWebsiteError);

        View commentField = view.findViewById(R.id.formCommentField);
        commentInput = commentField.findViewById(R.id.ppInputEdit);
        setInputFieldLabel(commentField, "Comment");
        commentInput.setHint("Add comment");
        commentInput.setInputType(android.text.InputType.TYPE_CLASS_TEXT
                | android.text.InputType.TYPE_TEXT_FLAG_MULTI_LINE);

        View folderRow = view.findViewById(R.id.formFolderSelector);
        folderSelector = folderRow.findViewById(R.id.ppListItemTitle);
        View folderLeading = folderRow.findViewById(R.id.ppListItemLeading);
        if (folderLeading != null) folderLeading.setVisibility(View.GONE);
        folderRow.setOnClickListener(v -> showFolderPicker());

        attachmentsContainer = view.findViewById(R.id.formAttachmentsContainer);
        uploadFileButton = view.findViewById(R.id.formUploadFileButton);

        saveError = view.findViewById(R.id.formSaveError);
        fileSizeError = view.findViewById(R.id.formFileSizeError);
        saveButton = view.findViewById(R.id.formSaveButton);
        saveProgress = view.findViewById(R.id.formSaveProgress);

        View discard = view.findViewById(R.id.formDiscardButton);
        cancelButton = null;
        if (discard != null) discard.setOnClickListener(v -> triggerCancel());
        View sheetHeader = view.findViewById(R.id.formSheetHeader);
        if (sheetHeader != null) {
            TextView headerTitle = sheetHeader.findViewById(R.id.ppHeaderTitle);
            if (headerTitle != null) headerTitle.setText("Create Passkey");
            View back = sheetHeader.findViewById(R.id.ppHeaderBack);
            View close = sheetHeader.findViewById(R.id.ppHeaderClose);
            if (back != null) back.setOnClickListener(v -> {
                if (!getParentFragmentManager().popBackStackImmediate()) triggerCancel();
            });
            if (close != null) close.setOnClickListener(v -> triggerCancel());
        }
    }

    private void setInputFieldLabel(View inputField, String labelText) {
        TextView label = inputField.findViewById(R.id.ppInputLabel);
        if (label != null) label.setText(labelText);
    }

    private void triggerCancel() {
        if (getActivity() instanceof PasskeyRegistrationActivity) {
            ((PasskeyRegistrationActivity) getActivity()).onCancel();
        }
    }

    @SuppressWarnings("unchecked")
    private void initializeForm() {
        if (!(getActivity() instanceof PasskeyRegistrationActivity)) return;

        PasskeyRegistrationActivity activity = (PasskeyRegistrationActivity) getActivity();
        Map<String, Object> existingRecord = activity.getSelectedExistingRecord();

        // Always use current time since this is a new passkey being created
        passkeyCreatedAt = System.currentTimeMillis();

        List<String> initialWebsites = new ArrayList<>();

        if (existingRecord != null) {
            Map<String, Object> data = null;
            if (existingRecord.containsKey("data") && existingRecord.get("data") instanceof Map) {
                data = (Map<String, Object>) existingRecord.get("data");
            }

            if (data != null) {
                titleInput.setText(data.get("title") != null ? (String) data.get("title") : "");
                usernameInput.setText(data.get("username") != null ? (String) data.get("username") : "");

                Object websitesObj = data.get("websites");
                if (websitesObj instanceof List) {
                    for (Object item : (List<?>) websitesObj) {
                        if (item instanceof String) initialWebsites.add((String) item);
                    }
                }

                commentInput.setText(data.get("note") != null ? (String) data.get("note") : "");

                Object attachmentsObj = data.get("attachments");
                if (attachmentsObj instanceof List) {
                    for (Object item : (List<?>) attachmentsObj) {
                        if (item instanceof Map) {
                            Map<String, Object> attachmentMap = (Map<String, Object>) item;
                            String id = attachmentMap.get("id") != null ? (String) attachmentMap.get("id") :
                                    (attachmentMap.get("name") != null ? (String) attachmentMap.get("name") : "");
                            String name = attachmentMap.get("name") != null ? (String) attachmentMap.get("name") : "file";
                            existingAttachments.add(new ExistingAttachment(id, name));
                        }
                    }
                }
            }

            selectedFolder = (String) existingRecord.get("folder");
        } else {
            titleInput.setText(activity.getRpName());
            usernameInput.setText(activity.getUserName());
            initialWebsites.add("https://" + activity.getRpId());
        }

        if (initialWebsites.isEmpty()) {
            addWebsiteRow("");
        } else {
            for (String w : initialWebsites) addWebsiteRow(w);
        }

        folderSelector.setText(selectedFolder != null ? selectedFolder : "No folder");

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        String dateStr = "Created on " + dateFormat.format(new Date(passkeyCreatedAt));
        passkeyDateText.setText(dateStr);
    }

    private void setupListeners() {
        titleInput.addTextChangedListener(new SimpleTextWatcher(() -> {
            if (titleError != null) titleError.setVisibility(View.GONE);
        }));

        if (addWebsiteButton != null) {
            addWebsiteButton.setOnClickListener(v -> {
                if (isSaving) return;
                addWebsiteRow("");
            });
        }

        saveButton.setOnClickListener(v -> handleSave());

        if (uploadFileButton != null) {
            uploadFileButton.setOnClickListener(v -> openFilePicker());
        }
    }

    /** Appends a website row + divider (between-rows) to the unified card. */
    private void addWebsiteRow(String initialText) {
        if (websitesRowContainer == null || getContext() == null) return;

        LayoutInflater inflater = LayoutInflater.from(getContext());

        // Divider between rows (skip before first).
        if (!websiteInputs.isEmpty()) {
            View divider = new View(getContext());
            divider.setLayoutParams(new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    Math.max(1, (int) getResources().getDisplayMetrics().density)));
            divider.setBackgroundColor(0x14FFFFFF);
            websitesRowContainer.addView(divider);
        }

        View row = inflater.inflate(R.layout.include_pp_website_row, websitesRowContainer, false);
        EditText edit = row.findViewById(R.id.ppWebsiteRowEdit);
        if (initialText != null) edit.setText(initialText);
        edit.addTextChangedListener(new SimpleTextWatcher(() -> {
            if (websiteError != null) websiteError.setVisibility(View.GONE);
        }));

        websitesRowContainer.addView(row);
        websiteInputs.add(edit);
    }

    private void showFolderPicker() {
        SecureLog.d(TAG, "showFolderPicker called");
        if (!(getActivity() instanceof PasskeyRegistrationActivity)) {
            SecureLog.e(TAG, "Activity is not PasskeyRegistrationActivity: " + getActivity());
            return;
        }

        PasskeyRegistrationActivity activity = (PasskeyRegistrationActivity) getActivity();
        List<String> folders = activity.getPreloadedFolders();
        SecureLog.d(TAG, "Got folders: " + folders.size() + " folders");

        List<String> options = new ArrayList<>();
        options.add("No folder");
        options.addAll(folders);

        String[] items = options.toArray(new String[0]);

        int checkedItem = 0;
        if (selectedFolder != null) {
            int idx = folders.indexOf(selectedFolder);
            if (idx >= 0) {
                checkedItem = idx + 1;
            }
        }

        SecureLog.d(TAG, "Showing folder picker dialog with " + items.length + " options");
        new AlertDialog.Builder(requireContext())
                .setTitle("Select Folder")
                .setSingleChoiceItems(items, checkedItem, (dialog, which) -> {
                    SecureLog.d(TAG, "Folder selected: " + which);
                    if (which == 0) {
                        selectedFolder = null;
                        folderSelector.setText("No folder");
                    } else {
                        selectedFolder = folders.get(which - 1);
                        folderSelector.setText(selectedFolder);
                    }
                    dialog.dismiss();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void openFilePicker() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        filePickerLauncher.launch(intent);
    }

    private void handleFileSelected(Uri uri) {
        Context context = getContext();
        if (context == null) return;

        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri);
            if (inputStream == null) return;

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] chunk = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(chunk)) != -1) {
                buffer.write(chunk, 0, bytesRead);
            }
            inputStream.close();

            byte[] fileData = buffer.toByteArray();

            if (fileData.length > MAX_FILE_SIZE_BYTES) {
                fileSizeError.setText("Your file is too large. Please upload one that's 6 MB or smaller.");
                fileSizeError.setVisibility(View.VISIBLE);
                return;
            }

            fileSizeError.setVisibility(View.GONE);

            String fileName = getFileName(context, uri);

            PasskeyFormData.AttachmentFile attachment = new PasskeyFormData.AttachmentFile(
                    UUID.randomUUID().toString(), fileName, fileData
            );
            attachments.add(attachment);

            refreshAttachmentsDisplay();

        } catch (Exception e) {
            SecureLog.e(TAG, "Error reading file: " + e.getMessage());
        }
    }

    private String getFileName(Context context, Uri uri) {
        String name = "file";
        try (Cursor cursor = context.getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (nameIndex >= 0) {
                    name = cursor.getString(nameIndex);
                }
            }
        }
        return name;
    }

    private void refreshAttachmentsDisplay() {
        if (attachmentsContainer == null) return;
        attachmentsContainer.removeAllViews();

        if (existingAttachments.isEmpty() && attachments.isEmpty()) {
            attachmentsContainer.setVisibility(View.GONE);
            return;
        }

        attachmentsContainer.setVisibility(View.VISIBLE);

        for (ExistingAttachment existing : existingAttachments) {
            attachmentsContainer.addView(createExistingAttachmentRow(existing));
        }

        for (PasskeyFormData.AttachmentFile attachment : attachments) {
            attachmentsContainer.addView(createAttachmentRow(attachment));
        }
    }

    private View createAttachmentRow(PasskeyFormData.AttachmentFile attachment) {
        Context context = requireContext();
        float density = context.getResources().getDisplayMetrics().density;

        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        int padding = (int) (12 * density);
        row.setPadding(padding, padding, padding, padding);

        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(8 * density);
        bg.setColor(Color.parseColor("#0DFFFFFF"));
        bg.setStroke((int) (1 * density), Color.parseColor("#1AFFFFFF"));
        row.setBackground(bg);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        rowParams.bottomMargin = (int) (4 * density);
        row.setLayoutParams(rowParams);

        TextView nameText = new TextView(context);
        nameText.setText(attachment.getName());
        nameText.setTextColor(Color.WHITE);
        nameText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        nameText.setMaxLines(1);
        nameText.setEllipsize(android.text.TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f);
        nameText.setLayoutParams(nameParams);
        row.addView(nameText);

        TextView deleteBtn = new TextView(context);
        deleteBtn.setText("✕");
        deleteBtn.setTextColor(Color.parseColor("#B3FF4444"));
        deleteBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        int deletePadding = (int) (8 * density);
        deleteBtn.setPadding(deletePadding, 0, 0, 0);
        deleteBtn.setOnClickListener(v -> {
            attachments.removeIf(a -> a.getId().equals(attachment.getId()));
            refreshAttachmentsDisplay();
        });
        row.addView(deleteBtn);

        return row;
    }

    private boolean validate() {
        boolean isValid = true;

        String title = titleInput.getText().toString().trim();
        if (title.isEmpty()) {
            titleError.setText("Title is required");
            titleError.setVisibility(View.VISIBLE);
            isValid = false;
        }

        for (EditText e : websiteInputs) {
            String entry = e.getText().toString().trim();
            if (entry.isEmpty()) continue;
            String urlString = addHttps(entry);
            if (!urlString.contains(".")) {
                if (websiteError != null) {
                    websiteError.setText("Wrong format of website");
                    websiteError.setVisibility(View.VISIBLE);
                }
                isValid = false;
                break;
            }
        }

        return isValid;
    }

    private void handleSave() {
        if (isSaving) return;
        if (!validate()) return;

        isSaving = true;
        saveButton.setEnabled(false);
        if (saveProgress != null) {
            saveButton.setText("");
            saveProgress.setVisibility(View.VISIBLE);
        }
        if (uploadFileButton != null) uploadFileButton.setEnabled(false);

        String title = titleInput.getText().toString().trim();
        String username = usernameInput.getText().toString();
        String comment = commentInput.getText().toString();

        List<String> websites = new ArrayList<>();
        for (EditText e : websiteInputs) {
            String w = e.getText().toString().trim();
            if (!w.isEmpty()) websites.add(addHttps(w));
        }

        String existingRecordId = null;
        if (getActivity() instanceof PasskeyRegistrationActivity) {
            Map<String, Object> existing = ((PasskeyRegistrationActivity) getActivity()).getSelectedExistingRecord();
            if (existing != null) {
                existingRecordId = (String) existing.get("id");
            }
        }

        List<String> keepAttachmentIds = new ArrayList<>();
        for (ExistingAttachment existing : existingAttachments) {
            keepAttachmentIds.add(existing.id);
        }

        PasskeyFormData formData = new PasskeyFormData(
                title, username, websites, comment,
                selectedFolder, existingRecordId, passkeyCreatedAt,
                attachments, keepAttachmentIds
        );

        if (getActivity() instanceof PasskeyRegistrationActivity) {
            ((PasskeyRegistrationActivity) getActivity()).onFormSave(formData);
        }
    }

    private String addHttps(String urlString) {
        String lower = urlString.toLowerCase();
        if (lower.startsWith("http://") || lower.startsWith("https://")) {
            return lower;
        }
        return "https://" + lower;
    }

    /**
     * Represents an existing attachment from the record (read-only metadata).
     */
    private static class ExistingAttachment {
        final String id;
        final String name;

        ExistingAttachment(String id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    private View createExistingAttachmentRow(ExistingAttachment attachment) {
        Context context = requireContext();
        float density = context.getResources().getDisplayMetrics().density;

        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        int padding = (int) (12 * density);
        row.setPadding(padding, padding, padding, padding);

        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(8 * density);
        bg.setColor(Color.parseColor("#0DFFFFFF"));
        bg.setStroke((int) (1 * density), Color.parseColor("#1AFFFFFF"));
        row.setBackground(bg);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        rowParams.bottomMargin = (int) (4 * density);
        row.setLayoutParams(rowParams);

        TextView nameText = new TextView(context);
        nameText.setText(attachment.name);
        nameText.setTextColor(Color.WHITE);
        nameText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        nameText.setMaxLines(1);
        nameText.setEllipsize(android.text.TextUtils.TruncateAt.END);
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f);
        nameText.setLayoutParams(nameParams);
        row.addView(nameText);

        TextView deleteBtn = new TextView(context);
        deleteBtn.setText("✕");
        deleteBtn.setTextColor(Color.parseColor("#B3FF4444"));
        deleteBtn.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        int deletePadding = (int) (8 * density);
        deleteBtn.setPadding(deletePadding, 0, 0, 0);
        deleteBtn.setOnClickListener(v -> {
            existingAttachments.removeIf(a -> a.id.equals(attachment.id));
            refreshAttachmentsDisplay();
        });
        row.addView(deleteBtn);

        return row;
    }

    /**
     * Simple TextWatcher that calls a callback on text change.
     */
    private static class SimpleTextWatcher implements android.text.TextWatcher {
        private final Runnable onChanged;

        SimpleTextWatcher(Runnable onChanged) {
            this.onChanged = onChanged;
        }

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            onChanged.run();
        }

        @Override
        public void afterTextChanged(android.text.Editable s) {}
    }
}
