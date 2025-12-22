package com.pears.pass.autofill.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.VaultItem;

import java.util.List;

public class VaultAdapter extends BaseItemAdapter<VaultItem, VaultAdapter.VaultViewHolder> {
    private OnVaultClickListener listener;

    public interface OnVaultClickListener {
        void onVaultClick(VaultItem vault);
    }

    public VaultAdapter(List<VaultItem> vaults, OnVaultClickListener listener) {
        super(vaults);
        this.listener = listener;
    }

    @NonNull
    @Override
    public VaultViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_vault, parent, false);
        return new VaultViewHolder(view);
    }

    @Override
    protected void onBindItem(@NonNull VaultViewHolder holder, VaultItem vault) {
        holder.bind(vault);
    }

    class VaultViewHolder extends RecyclerView.ViewHolder {
        private TextView vaultName;
        private TextView vaultCreationDate;
        private ImageView lockIcon;

        VaultViewHolder(@NonNull View itemView) {
            super(itemView);
            vaultName = itemView.findViewById(R.id.vault_name);
            vaultCreationDate = itemView.findViewById(R.id.vault_creation_date);
            lockIcon = itemView.findViewById(R.id.lock_icon);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onVaultClick(getItem(position));
                }
            });
        }

        void bind(VaultItem vault) {
            vaultName.setText(vault.getName());
            vaultCreationDate.setText("Created " + vault.getCreationDate());
            // Lock icon is always visible with the circle_lock drawable
        }
    }
}