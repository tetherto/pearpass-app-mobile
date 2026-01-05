package com.noxtton.pearpass.autofill.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.noxtton.pearpass.R;
import com.noxtton.pearpass.autofill.data.CredentialItem;

import java.util.List;

public class CredentialAdapter extends BaseItemAdapter<CredentialItem, CredentialAdapter.CredentialViewHolder> {
    private OnCredentialClickListener listener;

    public interface OnCredentialClickListener {
        void onCredentialClick(CredentialItem credential);
    }

    public CredentialAdapter(List<CredentialItem> credentials, OnCredentialClickListener listener) {
        super(credentials);
        this.listener = listener;
    }

    @NonNull
    @Override
    public CredentialViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_credential, parent, false);
        return new CredentialViewHolder(view);
    }

    @Override
    protected void onBindItem(@NonNull CredentialViewHolder holder, CredentialItem credential) {
        holder.bind(credential);
    }

    class CredentialViewHolder extends RecyclerView.ViewHolder {
        private TextView titleText;
        private TextView usernameText;
        private TextView initialsText;

        CredentialViewHolder(@NonNull View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.credential_title);
            usernameText = itemView.findViewById(R.id.credential_username);
            initialsText = itemView.findViewById(R.id.initials_text);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION && listener != null) {
                    listener.onCredentialClick(getItem(position));
                }
            });
        }

        void bind(CredentialItem credential) {
            titleText.setText(credential.getTitle());
            usernameText.setText(credential.getUsername());

            // Generate initials from title
            String initials = getInitials(credential.getTitle());
            initialsText.setText(initials);
        }

        private String getInitials(String title) {
            if (title == null || title.isEmpty()) {
                return "?";
            }

            String[] words = title.trim().split("\\s+");
            StringBuilder initials = new StringBuilder();

            // Take first letter of first two words
            for (int i = 0; i < Math.min(2, words.length); i++) {
                if (!words[i].isEmpty()) {
                    initials.append(Character.toUpperCase(words[i].charAt(0)));
                }
            }

            // If only one word, take first two letters
            if (initials.length() == 1 && title.length() > 1) {
                initials.append(Character.toUpperCase(title.charAt(1)));
            }

            return initials.toString();
        }
    }
}