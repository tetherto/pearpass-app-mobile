package com.pears.pass.autofill.ui;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.CredentialItem;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.SecureLog;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class CredentialsListFragment extends BaseAutofillFragment {
    private static final String TAG = "CredentialsListFragment";
    private static final String ARG_VAULT_ID = "vault_id";
    private static final String ARG_WEB_DOMAIN = "web_domain";
    private static final String ARG_PACKAGE_NAME = "package_name";

    private RecyclerView credentialsList;
    private CredentialAdapter adapter;
    private EditText searchInput;
    private TextView cancelButton;
    private TextView resultsCount;
    private View loadingIndicator;
    private String vaultId;
    private String webDomain;
    private String packageName;
    private List<CredentialItem> allCredentials = new ArrayList<>();
    private boolean isLoading = false;
    private boolean hasUserSearched = false;

    public static CredentialsListFragment newInstance(String vaultId, String webDomain, String packageName) {
        CredentialsListFragment fragment = new CredentialsListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_VAULT_ID, vaultId);
        args.putString(ARG_WEB_DOMAIN, webDomain);
        args.putString(ARG_PACKAGE_NAME, packageName);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            vaultId = getArguments().getString(ARG_VAULT_ID);
            webDomain = getArguments().getString(ARG_WEB_DOMAIN);
            packageName = getArguments().getString(ARG_PACKAGE_NAME);

            if (webDomain != null) {
                SecureLog.d(TAG, "Received web domain for filtering: " + webDomain);
            }
            if (packageName != null) {
                SecureLog.d(TAG, "Received package name for filtering: " + packageName);
            }
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_credentials_list, container, false);

        credentialsList = view.findViewById(R.id.credentialsList);
        searchInput = view.findViewById(R.id.searchInput);
        cancelButton = view.findViewById(R.id.cancelButton);
        resultsCount = view.findViewById(R.id.resultsCount);
        loadingIndicator = view.findViewById(R.id.loadingIndicator);

        // Setup RecyclerView
        credentialsList.setLayoutManager(new LinearLayoutManager(getContext()));

        // Determine if we're in passkey assertion mode
        boolean passkeyMode = false;
        if (getActivity() instanceof AuthenticationActivity) {
            passkeyMode = ((AuthenticationActivity) getActivity()).isPasskeyAssertionMode();
        }
        final boolean isPasskeyMode = passkeyMode;

        adapter = new CredentialAdapter(new ArrayList<>(), credential -> {
            if (navigationListener != null) {
                if (isPasskeyMode && credential.hasPasskey()) {
                    navigationListener.onPasskeySelected(credential);
                } else {
                    navigationListener.onCredentialSelected(credential);
                }
            }
        });
        credentialsList.setAdapter(adapter);
        updateResultsCount(0);

        // Load real credentials from active vault
        loadCredentialsFromActiveVault();

        // Setup search
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String query = s.toString();

                // Mark that user has searched, disable domain filtering permanently
                if (!query.isEmpty() && !hasUserSearched) {
                    hasUserSearched = true;
                    SecureLog.d(TAG, "User started searching, domain filtering disabled permanently for this session");
                }

                filterCredentials(query);
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });

        setupCancelButton(cancelButton);

        return view;
    }

    private void filterCredentials(String query) {
        List<CredentialItem> filtered = getFilteredCredentials(query);
        adapter.updateList(filtered);
        updateResultsCount(filtered.size());
    }

    /**
     * Get filtered credentials based on search query and domain matching
     */
    private List<CredentialItem> getFilteredCredentials(String query) {
        List<CredentialItem> filtered = new ArrayList<>(allCredentials);

        // If user is searching, show all credentials that match the search
        if (!query.isEmpty()) {
            filtered = new ArrayList<>();
            for (CredentialItem credential : allCredentials) {
                if (credential.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                    credential.getUsername().toLowerCase().contains(query.toLowerCase())) {
                    filtered.add(credential);
                }
            }
        } else if (!hasUserSearched && (webDomain != null || packageName != null)) {
            // Only apply domain filtering if user hasn't searched yet and we have a domain/package
            List<CredentialItem> matchingCredentials = new ArrayList<>();
            for (CredentialItem credential : allCredentials) {
                if (matchesDomainOrPackage(credential)) {
                    matchingCredentials.add(credential);
                }
            }

            // If we have matching credentials, show only those; otherwise show all
            if (!matchingCredentials.isEmpty()) {
                filtered = matchingCredentials;
                SecureLog.d(TAG, "Filtered to " + matchingCredentials.size() + " credentials matching domain/package");
            } else {
                SecureLog.d(TAG, "No matching credentials found, showing all " + allCredentials.size() + " credentials");
            }
        }
        // If hasUserSearched is true and query is empty, show all credentials (no filtering)

        return filtered;
    }

    private void updateResultsCount(int count) {
        if (resultsCount != null) {
            resultsCount.setText(String.valueOf(count));
        }
    }

    /**
     * Load credentials from the active vault
     */
    private void loadCredentialsFromActiveVault() {
        SecureLog.d(TAG, "Loading credentials for vault " + vaultId);

        if (getActivity() == null) {
            SecureLog.e(TAG, "Activity is null, cannot load credentials");
            return;
        }

        // Use vaultClient from BaseAutofillFragment (resolved in onAttach for both
        // AuthenticationActivity and PasskeyRegistrationActivity)
        if (vaultClient == null) {
            SecureLog.e(TAG, "No vault client available, cannot load credentials");
            return;
        }

        // Retrieve password buffer from activity (will be cleared after use)
        byte[] passwordBuffer = null;
        if (getActivity() instanceof AuthenticationActivity) {
            passwordBuffer = ((AuthenticationActivity) getActivity()).consumePendingPasswordBuffer();
        }
        final byte[] finalPasswordBuffer = passwordBuffer;

        isLoading = true;

        // Show loading indicator
        if (loadingIndicator != null) {
            loadingIndicator.setVisibility(View.VISIBLE);
        }
        if (credentialsList != null) {
            credentialsList.setVisibility(View.GONE);
        }

        CompletableFuture.runAsync(() -> {
            try {
                SecureLog.d(TAG, "Closing any active vault before activating vault " + vaultId);

                // IMPORTANT: Close any currently active vault first to release the database lock
                // This prevents "lock hold by current process" errors
                try {
                    vaultClient.activeVaultClose().get();
                    SecureLog.d(TAG, "Closed previous active vault");
                } catch (Exception e) {
                    SecureLog.d(TAG, "No active vault to close or already closed: " + e.getMessage());
                }

                SecureLog.d(TAG, "Activating vault " + vaultId);

                // Now activate the vault by ID with password buffer if available
                boolean success;
                if (finalPasswordBuffer != null) {
                    success = vaultClient.getVaultById(vaultId, finalPasswordBuffer).get();
                } else {
                    // No password - use null (vault may already be unlocked)
                    success = vaultClient.getVaultById(vaultId, (String) null).get();
                }
                if (!success) {
                    throw new RuntimeException("Failed to activate vault " + vaultId);
                }

                SecureLog.d(TAG, "Successfully activated vault " + vaultId);

                // Now fetch records from the newly active vault
                List<Map<String, Object>> records = vaultClient.activeVaultList("record/").get();
                SecureLog.d(TAG, "Received " + records.size() + " records from vault " + vaultId);

                List<CredentialItem> parsedCredentials = parseCredentials(records);

                // Update UI on main thread
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        this.allCredentials = parsedCredentials;
                        this.isLoading = false;
                        SecureLog.d(TAG, "Loaded " + parsedCredentials.size() + " credentials from activated vault");

                        // Hide loading indicator
                        if (loadingIndicator != null) {
                            loadingIndicator.setVisibility(View.GONE);
                        }
                        if (credentialsList != null) {
                            credentialsList.setVisibility(View.VISIBLE);
                        }

                        // Apply filtering and update display
                        List<CredentialItem> filtered = getFilteredCredentials(searchInput.getText().toString());
                        adapter.updateList(filtered);
                        updateResultsCount(filtered.size());
                    });
                }

            } catch (Exception e) {
                SecureLog.e(TAG, "Error loading from vault: " + e.getMessage());
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        this.isLoading = false;

                        // Hide loading indicator
                        if (loadingIndicator != null) {
                            loadingIndicator.setVisibility(View.GONE);
                        }
                        if (credentialsList != null) {
                            credentialsList.setVisibility(View.VISIBLE);
                        }

                        // Show error or empty state
                        adapter.updateList(new ArrayList<>());
                        updateResultsCount(0);
                    });
                }
            } finally {
                // Securely clear the password buffer after vault activation
                if (finalPasswordBuffer != null) {
                    com.pears.pass.autofill.utils.SecureBufferUtils.clearBuffer(finalPasswordBuffer);
                    SecureLog.d(TAG, "Password buffer cleared from memory");
                }
            }
        });
    }

    /**
     * Parse credentials from vault records
     */
    @SuppressWarnings("unchecked")
    private List<CredentialItem> parseCredentials(List<Map<String, Object>> records) {
        List<CredentialItem> credentials = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String id = (String) record.get("id");
            if (id == null) {
                continue;
            }

            // Check if there's a data field (like in RN logs)
            Map<String, Object> recordData;
            if (record.containsKey("data") && record.get("data") instanceof Map) {
                recordData = (Map<String, Object>) record.get("data");
            } else {
                recordData = record;
            }

            String name = (String) recordData.get("title");
            if (name == null) {
                name = (String) recordData.get("name");
            }
            if (name == null) {
                name = "Unknown";
            }

            String username = (String) recordData.get("username");
            if (username == null) {
                username = (String) recordData.get("email");
            }
            if (username == null) {
                username = "";
            }

            String password = (String) recordData.get("password");
            if (password == null) {
                password = "";
            }

            List<String> websites = new ArrayList<>();
            Object websitesObj = recordData.get("websites");
            if (websitesObj instanceof List) {
                List<?> websitesList = (List<?>) websitesObj;
                for (Object website : websitesList) {
                    if (website instanceof String) {
                        websites.add((String) website);
                    }
                }
            }

            // Parse passkey data
            boolean hasPasskey = false;
            long passkeyCreatedAt = 0;
            Map<String, Object> credentialMap = null;
            String privateKeyBuffer = null;
            String userId = null;
            String credentialId = null;

            Object credentialObj = recordData.get("credential");
            if (credentialObj instanceof Map) {
                hasPasskey = true;
                credentialMap = (Map<String, Object>) credentialObj;
                credentialId = (String) credentialMap.get("id");
                privateKeyBuffer = (String) credentialMap.get("_privateKeyBuffer");
                userId = (String) credentialMap.get("_userId");

                Object passkeyTs = recordData.get("passkeyCreatedAt");
                if (passkeyTs instanceof Number) {
                    passkeyCreatedAt = ((Number) passkeyTs).longValue();
                }
            }

            credentials.add(new CredentialItem(id, name, username, password, websites,
                    hasPasskey, passkeyCreatedAt, credentialMap, privateKeyBuffer, userId, credentialId));
        }

        return credentials;
    }

    /**
     * Check if a credential matches the current domain or package name
     */
    private boolean matchesDomainOrPackage(CredentialItem credential) {
        if (credential.getWebsites() == null || credential.getWebsites().isEmpty()) {
            return false;
        }

        // Extract the domain to match against (web domain takes priority)
        String targetDomain = webDomain != null ? extractDomain(webDomain) : null;

        // If we have a package name, convert it to domain format
        // e.g., com.facebook.katana -> facebook.com
        String packageAsDomain = null;
        if (packageName != null) {
            packageAsDomain = convertPackageToDomain(packageName);
            SecureLog.d(TAG, "Converted package '" + packageName + "' to domain format '" + packageAsDomain + "'");
        }

        for (String website : credential.getWebsites()) {
            String websiteDomain = extractDomain(website);

            // Check web domain match
            if (targetDomain != null && domainsMatch(targetDomain, websiteDomain)) {
                SecureLog.d(TAG, "Domain match found! Credential '" + credential.getTitle() +
                        "' website '" + websiteDomain + "' matches target '" + targetDomain + "'");
                return true;
            }

            // Check package name match (converted to domain format)
            if (packageAsDomain != null && domainsMatch(packageAsDomain, websiteDomain)) {
                SecureLog.d(TAG, "Package match found! Credential '" + credential.getTitle() +
                        "' website '" + websiteDomain + "' matches package as domain '" + packageAsDomain + "'");
                return true;
            }
        }

        return false;
    }

    /**
     * Convert Android package name to domain format
     * e.g., com.facebook.katana -> facebook.com
     * Takes the first two parts (reversed) of the package name
     */
    private String convertPackageToDomain(String packageName) {
        if (packageName == null || packageName.isEmpty()) {
            return null;
        }

        String[] parts = packageName.split("\\.");

        // We need at least 2 parts to create a domain (e.g., com.facebook)
        if (parts.length < 2) {
            return packageName; // Return as-is if not enough parts
        }

        // Take first two parts and reverse them
        // com.facebook.katana -> facebook.com
        // com.google.android.apps.youtube -> google.com
        String reversedDomain = parts[1] + "." + parts[0];

        return reversedDomain;
    }

    /**
     * Extract domain from a URL or web domain string
     * Mirrors the iOS implementation
     */
    private String extractDomain(String urlString) {
        if (urlString == null || urlString.isEmpty()) {
            return "";
        }

        String domain = urlString.toLowerCase();

        // Remove protocol if present
        if (domain.startsWith("https://")) {
            domain = domain.substring(8);
        } else if (domain.startsWith("http://")) {
            domain = domain.substring(7);
        }

        // Remove path and query parameters
        int slashIndex = domain.indexOf('/');
        if (slashIndex != -1) {
            domain = domain.substring(0, slashIndex);
        }

        // Remove port if present
        int colonIndex = domain.indexOf(':');
        if (colonIndex != -1) {
            domain = domain.substring(0, colonIndex);
        }

        // Remove www. prefix
        if (domain.startsWith("www.")) {
            domain = domain.substring(4);
        }

        return domain;
    }

    /**
     * Check if two domains match (exact match or subdomain match)
     * Mirrors the iOS implementation
     */
    private boolean domainsMatch(String domain1, String domain2) {
        if (domain1 == null || domain2 == null) {
            return false;
        }

        // Exact match
        if (domain1.equals(domain2)) {
            return true;
        }

        // Check if one is a subdomain of the other
        if (domain1.endsWith("." + domain2) || domain2.endsWith("." + domain1)) {
            return true;
        }

        // Special case for common domains (e.g., google.com matches accounts.google.com)
        String[] domain1Parts = domain1.split("\\.");
        String[] domain2Parts = domain2.split("\\.");

        if (domain1Parts.length >= 2 && domain2Parts.length >= 2) {
            // Get the main domain (last two parts, e.g., "google.com")
            String mainDomain1 = domain1Parts[domain1Parts.length - 2] + "." + domain1Parts[domain1Parts.length - 1];
            String mainDomain2 = domain2Parts[domain2Parts.length - 2] + "." + domain2Parts[domain2Parts.length - 1];

            if (mainDomain1.equals(mainDomain2)) {
                return true;
            }
        }

        return false;
    }
}