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
import android.widget.ImageView;
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
import java.util.Arrays;
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
    private EditText websiteInput;
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

    private static final String STATE_SELECTED_FOLDER = "selected_folder";
    private static final String STATE_PASSKEY_CREATED_AT = "passkey_created_at";
    private static final String STATE_IS_SAVING = "is_saving";

    private String selectedFolder = null;
    private long passkeyCreatedAt;
    private boolean isSaving = false;

    // File attachments (matching iOS AttachmentFile)
    private final List<PasskeyFormData.AttachmentFile> attachments = new ArrayList<>();

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

        // Register file picker result handler
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

        titleInput = view.findViewById(R.id.titleInput);
        usernameInput = view.findViewById(R.id.usernameInput);
        websiteInput = view.findViewById(R.id.websiteInput);
        commentInput = view.findViewById(R.id.commentInput);
        titleError = view.findViewById(R.id.titleError);
        websiteError = view.findViewById(R.id.websiteError);
        saveError = view.findViewById(R.id.saveError);
        fileSizeError = view.findViewById(R.id.fileSizeError);
        passkeyDateText = view.findViewById(R.id.passkeyDateText);
        cancelButton = view.findViewById(R.id.cancelButton);
        folderSelector = view.findViewById(R.id.folderSelector);
        saveButton = view.findViewById(R.id.saveButton);
        uploadFileButton = view.findViewById(R.id.uploadFileButton);
        attachmentsContainer = view.findViewById(R.id.attachmentsContainer);

        initializeForm();
        setupListeners();

        return view;
    }

    @SuppressWarnings("unchecked")
    private void initializeForm() {
        if (!(getActivity() instanceof PasskeyRegistrationActivity)) return;

        PasskeyRegistrationActivity activity = (PasskeyRegistrationActivity) getActivity();
        Map<String, Object> existingRecord = activity.getSelectedExistingRecord();

        // Always use current time since this is a new passkey being created
        passkeyCreatedAt = System.currentTimeMillis();

        if (existingRecord != null) {
            // Pre-populate from existing record
            Map<String, Object> data = null;
            if (existingRecord.containsKey("data") && existingRecord.get("data") instanceof Map) {
                data = (Map<String, Object>) existingRecord.get("data");
            }

            if (data != null) {
                titleInput.setText(data.get("title") != null ? (String) data.get("title") : "");
                usernameInput.setText(data.get("username") != null ? (String) data.get("username") : "");

                Object websitesObj = data.get("websites");
                if (websitesObj instanceof List && !((List<?>) websitesObj).isEmpty()) {
                    websiteInput.setText((String) ((List<?>) websitesObj).get(0));
                }

                commentInput.setText(data.get("note") != null ? (String) data.get("note") : "");
            }

            selectedFolder = (String) existingRecord.get("folder");
        } else {
            // Pre-populate from passkey request
            titleInput.setText(activity.getRpName());
            usernameInput.setText(activity.getUserName());
            websiteInput.setText("https://" + activity.getRpId());
        }

        // Update folder display
        folderSelector.setText(selectedFolder != null ? selectedFolder : "No folder");

        // Update passkey date display
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        String dateStr = "Created on " + dateFormat.format(new Date(passkeyCreatedAt));
        passkeyDateText.setText(dateStr);
    }

    private void setupListeners() {
        cancelButton.setOnClickListener(v -> {
            if (getActivity() instanceof PasskeyRegistrationActivity) {
                ((PasskeyRegistrationActivity) getActivity()).onCancel();
            }
        });

        folderSelector.setClickable(true);
        folderSelector.setFocusable(true);
        folderSelector.setOnClickListener(v -> {
            SecureLog.d(TAG, "Folder selector clicked!");
            showFolderPicker();
        });

        // Clear errors on input
        titleInput.addTextChangedListener(new SimpleTextWatcher(() -> {
            if (titleError != null) titleError.setVisibility(View.GONE);
        }));

        websiteInput.addTextChangedListener(new SimpleTextWatcher(() -> {
            if (websiteError != null) websiteError.setVisibility(View.GONE);
        }));

        saveButton.setOnClickListener(v -> handleSave());

        uploadFileButton.setOnClickListener(v -> openFilePicker());
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

        // Build list with "No folder" option at the top
        List<String> options = new ArrayList<>();
        options.add("No folder");
        options.addAll(folders);

        String[] items = options.toArray(new String[0]);

        // Find current selection index
        int checkedItem = 0;
        if (selectedFolder != null) {
            int idx = folders.indexOf(selectedFolder);
            if (idx >= 0) {
                checkedItem = idx + 1; // +1 because "No folder" is at index 0
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
            // Read file data
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

            // Validate file size: max 6 MB (matching iOS)
            if (fileData.length > MAX_FILE_SIZE_BYTES) {
                fileSizeError.setText("Your file is too large. Please upload one that's 6 MB or smaller.");
                fileSizeError.setVisibility(View.VISIBLE);
                return;
            }

            fileSizeError.setVisibility(View.GONE);

            // Get file name
            String fileName = getFileName(context, uri);

            // Create attachment
            PasskeyFormData.AttachmentFile attachment = new PasskeyFormData.AttachmentFile(
                    UUID.randomUUID().toString(), fileName, fileData
            );
            attachments.add(attachment);

            // Update UI
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
        attachmentsContainer.removeAllViews();

        if (attachments.isEmpty()) {
            attachmentsContainer.setVisibility(View.GONE);
            return;
        }

        attachmentsContainer.setVisibility(View.VISIBLE);

        for (PasskeyFormData.AttachmentFile attachment : attachments) {
            attachmentsContainer.addView(createAttachmentRow(attachment));
        }
    }

    private View createAttachmentRow(PasskeyFormData.AttachmentFile attachment) {
        Context context = requireContext();
        float density = context.getResources().getDisplayMetrics().density;

        // Container
        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        int padding = (int) (12 * density);
        row.setPadding(padding, padding, padding, padding);

        // Background matching iOS style (search_input_background equivalent)
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(8 * density);
        bg.setColor(Color.parseColor("#0DFFFFFF")); // white 5% opacity
        bg.setStroke((int) (1 * density), Color.parseColor("#1AFFFFFF")); // white 10% opacity
        row.setBackground(bg);

        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        rowParams.bottomMargin = (int) (4 * density);
        row.setLayoutParams(rowParams);

        // File name
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

        // Delete button
        TextView deleteBtn = new TextView(context);
        deleteBtn.setText("\u2715"); // ✕ character
        deleteBtn.setTextColor(Color.parseColor("#B3FF4444")); // red 70% opacity
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

        // Title required
        String title = titleInput.getText().toString().trim();
        if (title.isEmpty()) {
            titleError.setText("Title is required");
            titleError.setVisibility(View.VISIBLE);
            isValid = false;
        }

        // Website optional but must be valid if provided
        String website = websiteInput.getText().toString().trim();
        if (!website.isEmpty()) {
            String urlString = addHttps(website);
            if (!urlString.contains(".")) {
                websiteError.setText("Wrong format of website");
                websiteError.setVisibility(View.VISIBLE);
                isValid = false;
            }
        }

        return isValid;
    }

    private void handleSave() {
        if (isSaving) return;
        if (!validate()) return;

        isSaving = true;
        saveButton.setEnabled(false);
        uploadFileButton.setEnabled(false);

        String title = titleInput.getText().toString().trim();
        String username = usernameInput.getText().toString();
        String website = websiteInput.getText().toString().trim();
        String comment = commentInput.getText().toString();

        List<String> websites = new ArrayList<>();
        if (!website.isEmpty()) {
            websites.add(addHttps(website));
        }

        String existingRecordId = null;
        if (getActivity() instanceof PasskeyRegistrationActivity) {
            Map<String, Object> existing = ((PasskeyRegistrationActivity) getActivity()).getSelectedExistingRecord();
            if (existing != null) {
                existingRecordId = (String) existing.get("id");
            }
        }

        PasskeyFormData formData = new PasskeyFormData(
                title, username, websites, comment,
                selectedFolder, existingRecordId, passkeyCreatedAt,
                attachments
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

    private static final List<String> IMAGE_EXTENSIONS = Arrays.asList(
            "png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"
    );

    private static boolean isImageFile(String name) {
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex < 0) return false;
        String ext = name.substring(dotIndex + 1).toLowerCase();
        return IMAGE_EXTENSIONS.contains(ext);
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
