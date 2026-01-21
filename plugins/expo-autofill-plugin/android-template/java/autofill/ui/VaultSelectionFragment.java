package com.pears.pass.autofill.ui;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.VaultItem;
import com.pears.pass.autofill.data.PearPassVaultClient;
import com.pears.pass.autofill.utils.AutofillConstants;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class VaultSelectionFragment extends BaseAutofillFragment {
    private RecyclerView vaultsList;
    private VaultAdapter adapter;
    private TextView cancelButton;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_vault_selection, container, false);

        vaultsList = view.findViewById(R.id.vaultsList);
        cancelButton = view.findViewById(R.id.cancelButton);

        // Setup RecyclerView
        vaultsList.setLayoutManager(new LinearLayoutManager(getContext()));

        // Load vaults from vault client
        loadVaults();

        setupCancelButton(cancelButton);

        return view;
    }

    /**
     * Load vaults from the vault client
     */
    private void loadVaults() {
        if (vaultClient == null) {
            // Show empty state if vault client is not available
            adapter = new VaultAdapter(getEmptyVaultList(), createVaultClickListener());
            vaultsList.setAdapter(adapter);
            return;
        }

        // Show loading state
        // TODO: Add progress indicator

        CompletableFuture.runAsync(() -> {
            try {
                // Fetch vaults from vault client
                List<PearPassVaultClient.Vault> vaults = vaultClient.listVaults().get();

                // Convert to VaultItem list
                List<VaultItem> vaultItems = new ArrayList<>();
                for (PearPassVaultClient.Vault vault : vaults) {
                    // Check if vault is protected
                    boolean isProtected = vaultClient.checkVaultIsProtected(vault.id, vaults).get();

                    // Format date
                    String formattedDate = new java.text.SimpleDateFormat(AutofillConstants.DATE_FORMAT_PATTERN)
                        .format(vault.updatedAt);

                    vaultItems.add(new VaultItem(
                        vault.id,
                        vault.name,
                        isProtected,
                        formattedDate
                    ));
                }

                // Update UI on main thread
                getActivity().runOnUiThread(() -> {
                    adapter = new VaultAdapter(vaultItems, createVaultClickListener());
                    vaultsList.setAdapter(adapter);
                });

            } catch (Exception e) {
                handleAsyncError("VaultSelectionFragment", "Failed to load vaults: " + e.getMessage(), () -> {
                    adapter = new VaultAdapter(getEmptyVaultList(), createVaultClickListener());
                    vaultsList.setAdapter(adapter);
                });
            }
        });
    }

    /**
     * Creates the click listener for vault selection.
     * Consolidates the vault navigation logic.
     */
    private VaultAdapter.OnVaultClickListener createVaultClickListener() {
        return vault -> {
            if (navigationListener != null) {
                // Navigate based on vault protection status
                if (vault.isLocked()) {
                    // Vault is protected, show password screen
                    navigationListener.navigateToVaultPassword(vault.getId(), vault.getName());
                } else {
                    // Vault is not protected, go directly to credentials list
                    navigationListener.navigateToCredentialsList(vault.getId());
                }
            }
        };
    }

    private List<VaultItem> getEmptyVaultList() {
        return new ArrayList<>();
    }
}