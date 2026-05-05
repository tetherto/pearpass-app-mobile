package com.pears.pass.autofill.ui;

import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.UnderlineSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.CredentialItem;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.data.VaultItem;
import com.pears.pass.autofill.utils.AutofillConstants;
import com.pears.pass.autofill.utils.SecureBufferUtils;
import com.pears.pass.autofill.utils.SecureLog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * V2 combined items screen — replaces V1 VaultSelection → VaultPassword → CredentialsList
 * flow with a single sheet that holds search, vault selector, and credentials list.
 *
 * Supports both modes via MODE arg:
 *  - MODE_ASSERTION: click → navigationListener.onCredentialSelected / onPasskeySelected
 *  - MODE_REGISTRATION: click → PasskeyRegistrationActivity.onExistingRecordSelected(raw record)
 */
public class CombinedItemsFragment extends BaseAutofillFragment {
    private static final String TAG = "CombinedItemsFragment";

    public static final String MODE_ASSERTION = "assertion";
    public static final String MODE_REGISTRATION = "registration";

    private static final String ARG_MODE = "mode";
    private static final String ARG_WEB_DOMAIN = "web_domain";
    private static final String ARG_PACKAGE_NAME = "package_name";
    private static final String ARG_RP_ID = "rp_id";
    private static final String ARG_USER_NAME = "user_name";

    private String mode;
    private String webDomain;
    private String packageName;
    private String rpId;
    private String userName;

    // Views
    private TextView sheetTitle;
    private ImageView sheetClose;
    private EditText searchInput;
    private View vaultSelectorRow;
    private TextView vaultSelectorTitle;
    private ImageView vaultSelectorChevron;
    private LinearLayout vaultDropdown;
    private View vaultDropdownDivider;
    private RecyclerView credentialsRecycler;
    private TextView emptyState;
    private View loadingIndicator;
    private View vaultPasswordGroup;
    private TextView vaultPasswordSubtitle;
    private EditText vaultPasswordInput;
    private Button vaultPasswordContinue;
    private View addNewButton;

    // State
    private CredentialAdapterV2 credentialsAdapter;
    private final List<VaultItem> vaults = new ArrayList<>();
    private VaultItem selectedVault;
    private final List<CredentialItem> allCredentials = new ArrayList<>();
    private final Map<String, Map<String, Object>> rawRecordsById = new HashMap<>();
    private boolean hasUserSearched = false;
    private boolean dropdownExpanded = false;

    public static CombinedItemsFragment newInstance(String mode,
                                                    String webDomain,
                                                    String packageName,
                                                    String rpId,
                                                    String userName) {
        CombinedItemsFragment f = new CombinedItemsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_MODE, mode);
        args.putString(ARG_WEB_DOMAIN, webDomain);
        args.putString(ARG_PACKAGE_NAME, packageName);
        args.putString(ARG_RP_ID, rpId);
        args.putString(ARG_USER_NAME, userName);
        f.setArguments(args);
        return f;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mode = getArguments().getString(ARG_MODE, MODE_ASSERTION);
            webDomain = getArguments().getString(ARG_WEB_DOMAIN);
            packageName = getArguments().getString(ARG_PACKAGE_NAME);
            rpId = getArguments().getString(ARG_RP_ID);
            userName = getArguments().getString(ARG_USER_NAME);
        }
        if (mode == null) mode = MODE_ASSERTION;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_combined_items_v2, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        bindViews(view);
        setupHeader();
        setupSearch();
        setupVaultSelector();
        setupCredentialsList();
        setupVaultPasswordPrompt();
        setupAddNewButton();

        loadVaults();
    }

    private void bindViews(View root) {
        View header = root.findViewById(R.id.combinedSheetHeader);
        sheetTitle = header.findViewById(R.id.ppHeaderTitle);
        sheetClose = header.findViewById(R.id.ppHeaderClose);

        View search = root.findViewById(R.id.combinedSearchField);
        searchInput = search.findViewById(R.id.ppSearchInput);

        vaultSelectorRow = root.findViewById(R.id.combinedVaultSelector);
        vaultSelectorTitle = root.findViewById(R.id.combinedVaultSelectorTitle);
        vaultSelectorChevron = root.findViewById(R.id.combinedVaultSelectorChevron);
        vaultDropdown = root.findViewById(R.id.combinedVaultDropdown);
        vaultDropdownDivider = root.findViewById(R.id.combinedVaultDropdownDivider);

        credentialsRecycler = root.findViewById(R.id.combinedCredentialsList);
        emptyState = root.findViewById(R.id.combinedEmptyState);
        loadingIndicator = root.findViewById(R.id.combinedLoading);
        vaultPasswordGroup = root.findViewById(R.id.combinedVaultPasswordGroup);
        vaultPasswordSubtitle = root.findViewById(R.id.combinedVaultPasswordSubtitle);

        View passwordField = root.findViewById(R.id.combinedVaultPasswordField);
        vaultPasswordInput = passwordField.findViewById(R.id.ppPasswordEdit);
        TextView passwordLabel = passwordField.findViewById(R.id.ppPasswordLabel);
        if (passwordLabel != null) passwordLabel.setText("Vault password");
        if (vaultPasswordInput != null) vaultPasswordInput.setHint("Enter vault password");

        vaultPasswordContinue = root.findViewById(R.id.combinedVaultPasswordContinue);
        addNewButton = root.findViewById(R.id.combinedAddNewButton);
    }

    private void setupAddNewButton() {
        if (MODE_REGISTRATION.equals(mode)) {
            addNewButton.setVisibility(View.VISIBLE);
            addNewButton.setOnClickListener(v -> {
                if (getActivity() instanceof PasskeyRegistrationActivity) {
                    ((PasskeyRegistrationActivity) getActivity()).onCreateNewRecord();
                }
            });
        } else {
            // Autofill assertion mode has no "add new login" action; hide the button.
            addNewButton.setVisibility(View.GONE);
        }
    }

    private void setupHeader() {
        sheetTitle.setText(MODE_REGISTRATION.equals(mode) ? "Create Passkey" : "Select Login");
        sheetClose.setOnClickListener(v -> {
            if (navigationListener != null) navigationListener.onCancel();
        });
        searchInput.setHint("Search in All Items");
    }

    private void setupSearch() {
        searchInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(Editable s) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                String q = s.toString();
                if (!q.isEmpty() && !hasUserSearched) hasUserSearched = true;
                applyFilter(q);
            }
        });
    }

    private void setupVaultSelector() {
        vaultSelectorChevron.setImageResource(R.drawable.pp_v2_ic_chevron_down);
        vaultSelectorRow.setOnClickListener(v -> {
            if (vaults.isEmpty()) return;
            toggleDropdown();
        });
    }

    private void toggleDropdown() {
        dropdownExpanded = !dropdownExpanded;
        vaultSelectorChevron.animate()
                .rotation(dropdownExpanded ? 180f : 0f)
                .setDuration(200)
                .start();
        int vis = dropdownExpanded ? View.VISIBLE : View.GONE;
        if (dropdownExpanded) rebuildDropdown();
        vaultDropdown.setVisibility(vis);
        vaultDropdownDivider.setVisibility(vis);
    }

    private void rebuildDropdown() {
        vaultDropdown.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(requireContext());
        int gapPx = (int) (getResources().getDimension(R.dimen.pp_v2_spacing_s8));
        for (int i = 0; i < vaults.size(); i++) {
            VaultItem vault = vaults.get(i);
            View row = inflater.inflate(R.layout.item_vault_inline_v2, vaultDropdown, false);
            TextView name = row.findViewById(R.id.vaultInlineName);
            View dot = row.findViewById(R.id.vaultInlineSelectedDot);
            name.setText(vault.getName());
            boolean isSelected = selectedVault != null && vault.getId().equals(selectedVault.getId());
            dot.setBackgroundResource(isSelected
                    ? R.drawable.pp_v2_vault_indicator_selected
                    : R.drawable.pp_v2_vault_indicator_unselected);

            if (i > 0) {
                ViewGroup.MarginLayoutParams lp = (ViewGroup.MarginLayoutParams) row.getLayoutParams();
                if (lp != null) {
                    lp.topMargin = gapPx;
                    row.setLayoutParams(lp);
                }
            }

            row.setOnClickListener(v -> {
                // Close dropdown first, then switch vault if different.
                toggleDropdown();
                if (selectedVault == null || !vault.getId().equals(selectedVault.getId())) {
                    selectVault(vault);
                }
            });

            vaultDropdown.addView(row);
        }
    }

    private void setupCredentialsList() {
        credentialsRecycler.setLayoutManager(new LinearLayoutManager(requireContext()));
        credentialsAdapter = new CredentialAdapterV2(new ArrayList<>(), this::handleCredentialClick);
        credentialsRecycler.setAdapter(credentialsAdapter);
    }

    private void setupVaultPasswordPrompt() {
        vaultPasswordContinue.setOnClickListener(v -> {
            if (selectedVault == null) return;
            String pwd = vaultPasswordInput.getText().toString();
            if (pwd.isEmpty()) {
                Toast.makeText(requireContext(), "Please enter the vault password", Toast.LENGTH_SHORT).show();
                return;
            }
            byte[] buf = SecureBufferUtils.stringToBuffer(pwd);
            vaultPasswordInput.setText("");
            unlockAndLoad(selectedVault, buf);
        });
    }

    // --- Vault loading ---

    private void loadVaults() {
        if (vaultClient == null) {
            SecureLog.e(TAG, "vaultClient null on loadVaults");
            return;
        }
        showLoading();
        CompletableFuture.runAsync(() -> {
            try {
                List<PearPassVaultClient.Vault> raw = vaultClient.listVaults().get();
                List<VaultItem> items = new ArrayList<>();
                for (PearPassVaultClient.Vault v : raw) {
                    boolean locked = vaultClient.checkVaultIsProtected(v.id, raw).get();
                    String date = new java.text.SimpleDateFormat(AutofillConstants.DATE_FORMAT_PATTERN).format(v.updatedAt);
                    items.add(new VaultItem(v.id, v.name, locked, date));
                }
                if (getActivity() == null) return;
                getActivity().runOnUiThread(() -> {
                    vaults.clear();
                    vaults.addAll(items);
                    if (vaults.isEmpty()) {
                        showEmpty();
                        vaultSelectorTitle.setText("No vaults");
                    } else {
                        selectVault(vaults.get(0));
                    }
                });
            } catch (Exception e) {
                handleAsyncError(TAG, "loadVaults failed: " + e.getMessage(), this::showEmpty);
            }
        });
    }

    private void selectVault(VaultItem vault) {
        this.selectedVault = vault;
        vaultSelectorTitle.setText(vault.getName());
        if (vault.isLocked()) {
            showPasswordPrompt();
        } else {
            unlockAndLoad(vault, null);
        }
    }

    private void unlockAndLoad(VaultItem vault, @Nullable byte[] passwordBuffer) {
        showLoading();
        CompletableFuture.runAsync(() -> {
            try {
                try { vaultClient.activeVaultClose().get(); }
                catch (Exception ignored) {}

                boolean ok;
                if (passwordBuffer != null) {
                    ok = vaultClient.getVaultById(vault.getId(), passwordBuffer).get();
                } else {
                    ok = vaultClient.getVaultById(vault.getId(), (String) null).get();
                }
                if (!ok) throw new RuntimeException("Failed to activate vault");

                // Registration: inform activity so vaultReadyFuture + selectedVaultId get set.
                if (MODE_REGISTRATION.equals(mode) && getActivity() instanceof PasskeyRegistrationActivity) {
                    byte[] copy = null;
                    if (passwordBuffer != null) {
                        copy = new byte[passwordBuffer.length];
                        System.arraycopy(passwordBuffer, 0, copy, 0, passwordBuffer.length);
                    }
                    ((PasskeyRegistrationActivity) getActivity()).onV2VaultReady(vault.getId(), copy);
                }

                // V1 parity: registration mode pulls the rpId/userName matches +
                // pending passkey jobs (mirroring searchForExistingCredentials).
                // Assertion mode keeps loading the full vault for domain filtering.
                List<Map<String, Object>> records;
                if (MODE_REGISTRATION.equals(mode) && getActivity() instanceof PasskeyRegistrationActivity) {
                    records = ((PasskeyRegistrationActivity) getActivity())
                            .loadV2RegistrationMatches().get();
                } else {
                    records = vaultClient.activeVaultList("record/").get();
                }
                List<CredentialItem> parsed = parseCredentials(records);

                if (getActivity() == null) return;
                getActivity().runOnUiThread(() -> {
                    allCredentials.clear();
                    allCredentials.addAll(parsed);
                    hasUserSearched = false;
                    hidePasswordPrompt();
                    applyFilter(searchInput.getText().toString());
                });
            } catch (Exception e) {
                handleAsyncError(TAG, "unlockAndLoad failed: " + e.getMessage(), () -> {
                    if (vault.isLocked()) {
                        showPasswordPrompt();
                        Toast.makeText(requireContext(), "Invalid vault password", Toast.LENGTH_SHORT).show();
                    } else {
                        showEmpty();
                    }
                });
            } finally {
                if (passwordBuffer != null) SecureBufferUtils.clearBuffer(passwordBuffer);
            }
        });
    }

    // --- Filtering / display ---

    private void applyFilter(String query) {
        List<CredentialItem> out;
        if (!query.isEmpty()) {
            out = new ArrayList<>();
            String q = query.toLowerCase(Locale.ROOT);
            for (CredentialItem c : allCredentials) {
                if (c.getTitle().toLowerCase(Locale.ROOT).contains(q) ||
                    (c.getUsername() != null && c.getUsername().toLowerCase(Locale.ROOT).contains(q))) {
                    out.add(c);
                }
            }
        } else if (!hasUserSearched) {
            out = filterInitial(allCredentials);
        } else {
            out = new ArrayList<>(allCredentials);
        }

        if (out.isEmpty() && !allCredentials.isEmpty()) {
            // Search with no matches — still show empty state.
            credentialsAdapter.updateList(out);
            showEmpty();
        } else if (out.isEmpty()) {
            credentialsAdapter.updateList(out);
            showEmpty();
        } else {
            credentialsAdapter.updateList(out);
            showList();
        }
    }

    private List<CredentialItem> filterInitial(List<CredentialItem> all) {
        // In registration mode, prefer records matching rpId/userName; else fall through.
        if (MODE_REGISTRATION.equals(mode) && rpId != null && !rpId.isEmpty()) {
            List<CredentialItem> matches = new ArrayList<>();
            String rp = rpId.toLowerCase(Locale.ROOT);
            String un = userName != null ? userName.toLowerCase(Locale.ROOT) : "";
            for (CredentialItem c : all) {
                if (c.getWebsites() != null) {
                    for (String w : c.getWebsites()) {
                        if (w != null && w.toLowerCase(Locale.ROOT).contains(rp)) {
                            matches.add(c);
                            break;
                        }
                    }
                }
            }
            return matches.isEmpty() ? new ArrayList<>(all) : matches;
        }
        // Autofill: domain/package filter
        if (webDomain != null || packageName != null) {
            List<CredentialItem> matches = new ArrayList<>();
            String target = webDomain != null ? extractDomain(webDomain) : null;
            String pkgDomain = packageName != null ? convertPackageToDomain(packageName) : null;
            for (CredentialItem c : all) {
                if (c.getWebsites() == null) continue;
                for (String w : c.getWebsites()) {
                    String d = extractDomain(w);
                    if ((target != null && domainsMatch(target, d)) ||
                        (pkgDomain != null && domainsMatch(pkgDomain, d))) {
                        matches.add(c);
                        break;
                    }
                }
            }
            return matches.isEmpty() ? new ArrayList<>(all) : matches;
        }
        return new ArrayList<>(all);
    }

    private void handleCredentialClick(CredentialItem c) {
        if (MODE_REGISTRATION.equals(mode)) {
            Map<String, Object> raw = rawRecordsById.get(c.getId());
            if (raw == null || !(getActivity() instanceof PasskeyRegistrationActivity)) return;
            PasskeyRegistrationActivity activity = (PasskeyRegistrationActivity) getActivity();
            // V1 parity: if the chosen record already has a passkey, ask before
            // replacing it. Mirrors ExistingCredentialSelectionFragment.onCredentialSelected.
            if (c.hasPasskey()) {
                Map<String, Object> finalRaw = raw;
                new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                        .setTitle("Replace Passkey")
                        .setMessage("This login already has a passkey. Do you want to replace it?")
                        .setPositiveButton("Replace", (d, w) -> activity.onExistingRecordSelected(finalRaw))
                        .setNegativeButton("Cancel", null)
                        .show();
            } else {
                activity.onExistingRecordSelected(raw);
            }
            return;
        }
        // Assertion
        if (navigationListener == null) return;
        boolean passkeyMode = false;
        if (getActivity() instanceof AuthenticationActivity) {
            passkeyMode = ((AuthenticationActivity) getActivity()).isPasskeyAssertionMode();
        }
        if (passkeyMode && c.hasPasskey()) navigationListener.onPasskeySelected(c);
        else navigationListener.onCredentialSelected(c);
    }

    // --- Visibility states ---

    private void showLoading() {
        credentialsRecycler.setVisibility(View.GONE);
        emptyState.setVisibility(View.GONE);
        vaultPasswordGroup.setVisibility(View.GONE);
        loadingIndicator.setVisibility(View.VISIBLE);
    }

    private void showList() {
        loadingIndicator.setVisibility(View.GONE);
        emptyState.setVisibility(View.GONE);
        vaultPasswordGroup.setVisibility(View.GONE);
        credentialsRecycler.setVisibility(View.VISIBLE);
    }

    private void showEmpty() {
        loadingIndicator.setVisibility(View.GONE);
        credentialsRecycler.setVisibility(View.GONE);
        vaultPasswordGroup.setVisibility(View.GONE);
        applyEmptyStateText();
        emptyState.setVisibility(View.VISIBLE);
    }

    /**
     * Fill the empty-state TextView. In registration mode we show the
     * "couldn't find a matching item ... save it as a new item ... or look in
     * another vault" message with the action phrase rendered as an underlined,
     * accent-colored clickable span. Assertion mode gets a plain fallback.
     */
    private void applyEmptyStateText() {
        if (MODE_REGISTRATION.equals(mode)) {
            String full = "We couldn't find a matching item in this vault. Would you like to save it as a new item or look in another vault?";
            String link = "save it as a new item";
            int start = full.indexOf(link);
            int end = start + link.length();

            SpannableString span = new SpannableString(full);
            int accent = ContextCompat.getColor(requireContext(), R.color.pp_v2_primary);
            span.setSpan(new ForegroundColorSpan(accent), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            span.setSpan(new UnderlineSpan(), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            span.setSpan(new ClickableSpan() {
                @Override
                public void onClick(@NonNull View widget) {
                    if (getActivity() instanceof PasskeyRegistrationActivity) {
                        ((PasskeyRegistrationActivity) getActivity()).onCreateNewRecord();
                    }
                }

                @Override
                public void updateDrawState(@NonNull TextPaint ds) {
                    // Skip the default link blue; our ForegroundColorSpan owns the color.
                    ds.setUnderlineText(true);
                }
            }, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

            emptyState.setText(span);
            emptyState.setMovementMethod(LinkMovementMethod.getInstance());
        } else {
            emptyState.setText("No matching items in this vault");
            emptyState.setMovementMethod(null);
        }
    }

    private void showPasswordPrompt() {
        loadingIndicator.setVisibility(View.GONE);
        credentialsRecycler.setVisibility(View.GONE);
        emptyState.setVisibility(View.GONE);
        vaultPasswordSubtitle.setText("Enter password for \"" + selectedVault.getName() + "\"");
        vaultPasswordGroup.setVisibility(View.VISIBLE);
    }

    private void hidePasswordPrompt() {
        vaultPasswordGroup.setVisibility(View.GONE);
    }

    // --- Records parsing (mirror of V1 CredentialsListFragment.parseCredentials) ---

    @SuppressWarnings("unchecked")
    private List<CredentialItem> parseCredentials(List<Map<String, Object>> records) {
        List<CredentialItem> credentials = new ArrayList<>();
        rawRecordsById.clear();

        for (Map<String, Object> record : records) {
            String id = (String) record.get("id");
            if (id == null) continue;

            Map<String, Object> data;
            if (record.containsKey("data") && record.get("data") instanceof Map) {
                data = (Map<String, Object>) record.get("data");
            } else {
                data = record;
            }

            if (data.containsKey("folder") && !data.containsKey("title") && !data.containsKey("type")) {
                continue;
            }

            String name = (String) data.get("title");
            if (name == null) name = (String) data.get("name");
            if (name == null || name.isEmpty()) continue;

            String uname = (String) data.get("username");
            if (uname == null) uname = (String) data.get("email");
            if (uname == null) uname = "";

            String pwd = (String) data.get("password");
            if (pwd == null) pwd = "";

            List<String> websites = new ArrayList<>();
            Object websitesObj = data.get("websites");
            if (websitesObj instanceof List) {
                for (Object w : (List<?>) websitesObj) {
                    if (w instanceof String) websites.add((String) w);
                }
            }

            boolean hasPasskey = false;
            long passkeyCreatedAt = 0;
            Map<String, Object> credentialMap = null;
            String privateKeyBuffer = null;
            String userIdStr = null;
            String credentialId = null;

            Object credentialObj = data.get("credential");
            if (credentialObj instanceof Map) {
                hasPasskey = true;
                credentialMap = (Map<String, Object>) credentialObj;
                credentialId = (String) credentialMap.get("id");
                privateKeyBuffer = (String) credentialMap.get("_privateKeyBuffer");
                userIdStr = (String) credentialMap.get("_userId");
                Object ts = data.get("passkeyCreatedAt");
                if (ts instanceof Number) passkeyCreatedAt = ((Number) ts).longValue();
            }

            credentials.add(new CredentialItem(id, name, uname, pwd, websites,
                    hasPasskey, passkeyCreatedAt, credentialMap, privateKeyBuffer, userIdStr, credentialId));

            rawRecordsById.put(id, record);
        }
        return credentials;
    }

    // --- Domain helpers (mirror of V1) ---

    private String extractDomain(String url) {
        if (url == null || url.isEmpty()) return "";
        String d = url.toLowerCase(Locale.ROOT);
        if (d.startsWith("https://")) d = d.substring(8);
        else if (d.startsWith("http://")) d = d.substring(7);
        int slash = d.indexOf('/');
        if (slash != -1) d = d.substring(0, slash);
        int colon = d.indexOf(':');
        if (colon != -1) d = d.substring(0, colon);
        if (d.startsWith("www.")) d = d.substring(4);
        return d;
    }

    private String convertPackageToDomain(String pkg) {
        if (pkg == null || pkg.isEmpty()) return null;
        String[] parts = pkg.split("\\.");
        if (parts.length < 2) return pkg;
        return parts[1] + "." + parts[0];
    }

    private boolean domainsMatch(String a, String b) {
        if (a == null || b == null) return false;
        if (a.equals(b)) return true;
        if (a.endsWith("." + b) || b.endsWith("." + a)) return true;
        String[] ap = a.split("\\.");
        String[] bp = b.split("\\.");
        if (ap.length >= 2 && bp.length >= 2) {
            String am = ap[ap.length - 2] + "." + ap[ap.length - 1];
            String bm = bp[bp.length - 2] + "." + bp[bp.length - 1];
            return am.equals(bm);
        }
        return false;
    }
}
