package com.pears.pass.autofill.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.CredentialItem;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Fragment for selecting an existing credential to add a passkey to,
 * or creating a new credential.
 */
public class ExistingCredentialSelectionFragment extends Fragment {
    private static final String TAG = "ExistingCredSelection";
    private static final String ARG_MATCHING_RECORDS = "matching_records";
    private static final String ARG_RP_ID = "rp_id";
    private static final String ARG_USER_NAME = "user_name";

    private RecyclerView credentialsList;
    private EditText searchInput;
    private TextView cancelButton;
    private TextView descriptionText;
    private TextView emptyStateText;
    private Button createNewButton;

    private List<Map<String, Object>> matchingRecords = new ArrayList<>();
    private List<CredentialItem> allItems = new ArrayList<>();
    private String rpId;
    private String userName;

    /**
     * Create a new instance with matching records.
     */
    @SuppressWarnings("unchecked")
    public static ExistingCredentialSelectionFragment newInstance(
            List<Map<String, Object>> matchingRecords, String rpId, String userName) {
        ExistingCredentialSelectionFragment fragment = new ExistingCredentialSelectionFragment();
        Bundle args = new Bundle();
        // Convert to ArrayList<HashMap> for Serializable support
        ArrayList<HashMap<String, Object>> serializableRecords = new ArrayList<>();
        if (matchingRecords != null) {
            for (Map<String, Object> record : matchingRecords) {
                serializableRecords.add(new HashMap<>(record));
            }
        }
        args.putSerializable(ARG_MATCHING_RECORDS, serializableRecords);
        args.putString(ARG_RP_ID, rpId);
        args.putString(ARG_USER_NAME, userName);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            Serializable records = getArguments().getSerializable(ARG_MATCHING_RECORDS);
            if (records instanceof ArrayList) {
                matchingRecords = (List<Map<String, Object>>) (List<?>) (ArrayList<?>) records;
            }
            rpId = getArguments().getString(ARG_RP_ID);
            userName = getArguments().getString(ARG_USER_NAME);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_existing_credential_selection, container, false);

        credentialsList = view.findViewById(R.id.credentialsList);
        searchInput = view.findViewById(R.id.searchInput);
        cancelButton = view.findViewById(R.id.cancelButton);
        descriptionText = view.findViewById(R.id.descriptionText);
        emptyStateText = view.findViewById(R.id.emptyStateText);
        createNewButton = view.findViewById(R.id.createNewButton);

        // Parse records into CredentialItems
        parseRecords();

        // Setup RecyclerView
        credentialsList.setLayoutManager(new LinearLayoutManager(getContext()));
        CredentialAdapter adapter = new CredentialAdapter(allItems, credential -> {
            onCredentialSelected(credential);
        });
        credentialsList.setAdapter(adapter);

        // Update description based on whether we have matches
        if (matchingRecords.isEmpty()) {
            descriptionText.setText("We didn't find an existing login for this website. Create a new one or search an item to save your passkey.");
        }

        // Setup search
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String query = s.toString().trim().toLowerCase();
                filterCredentials(query, adapter);
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });

        // Cancel button
        cancelButton.setOnClickListener(v -> {
            if (getActivity() instanceof PasskeyRegistrationActivity) {
                ((PasskeyRegistrationActivity) getActivity()).onCancel();
            }
        });

        // Create new button
        createNewButton.setOnClickListener(v -> {
            if (getActivity() instanceof PasskeyRegistrationActivity) {
                ((PasskeyRegistrationActivity) getActivity()).onCreateNewRecord();
            }
        });

        return view;
    }

    @SuppressWarnings("unchecked")
    private void parseRecords() {
        allItems.clear();
        for (Map<String, Object> record : matchingRecords) {
            String id = (String) record.get("id");
            if (id == null) continue;

            Map<String, Object> data = null;
            if (record.containsKey("data") && record.get("data") instanceof Map) {
                data = (Map<String, Object>) record.get("data");
            } else {
                data = record;
            }

            String title = data != null ? (String) data.get("title") : "Untitled";
            if (title == null) title = "Untitled";
            String username = data != null ? (String) data.get("username") : "";
            if (username == null) username = "";

            // Check if record already has a passkey
            boolean hasPasskey = data != null && data.get("credential") instanceof Map;

            CredentialItem item = new CredentialItem(id, title, username, "", null);
            item.setHasPasskey(hasPasskey);
            allItems.add(item);
        }
    }

    private void filterCredentials(String query, CredentialAdapter adapter) {
        if (query.isEmpty()) {
            adapter.updateList(allItems);
            emptyStateText.setVisibility(allItems.isEmpty() ? View.VISIBLE : View.GONE);
            credentialsList.setVisibility(allItems.isEmpty() ? View.GONE : View.VISIBLE);
            return;
        }

        List<CredentialItem> filtered = new ArrayList<>();
        for (CredentialItem item : allItems) {
            if (item.getTitle().toLowerCase().contains(query) ||
                item.getUsername().toLowerCase().contains(query)) {
                filtered.add(item);
            }
        }

        adapter.updateList(filtered);
        emptyStateText.setVisibility(filtered.isEmpty() ? View.VISIBLE : View.GONE);
        credentialsList.setVisibility(filtered.isEmpty() ? View.GONE : View.VISIBLE);
    }

    private void onCredentialSelected(CredentialItem credential) {
        if (!(getActivity() instanceof PasskeyRegistrationActivity)) return;

        PasskeyRegistrationActivity activity = (PasskeyRegistrationActivity) getActivity();

        // Find the matching record
        Map<String, Object> selectedRecord = null;
        for (Map<String, Object> record : matchingRecords) {
            String id = (String) record.get("id");
            if (credential.getId().equals(id)) {
                selectedRecord = record;
                break;
            }
        }

        if (selectedRecord == null) return;

        // Check if the record already has a passkey
        if (credential.hasPasskey()) {
            // Show replace confirmation dialog
            final Map<String, Object> finalRecord = selectedRecord;
            new AlertDialog.Builder(requireContext())
                    .setTitle("Replace Passkey")
                    .setMessage("This login already has a passkey. Do you want to replace it?")
                    .setPositiveButton("Replace", (dialog, which) -> {
                        activity.onExistingRecordSelected(finalRecord);
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
        } else {
            activity.onExistingRecordSelected(selectedRecord);
        }
    }
}
