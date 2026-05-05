package com.pears.pass.autofill.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.pears.pass.R;
import com.pears.pass.autofill.data.CredentialItem;

import java.util.List;

// V2 credential row adapter, used by CombinedItemsFragment.
// V1 adapters stay untouched since they still render the old list layouts.
public class CredentialAdapterV2 extends BaseItemAdapter<CredentialItem, CredentialAdapterV2.ViewHolder> {
    private final OnCredentialClickListener listener;

    public interface OnCredentialClickListener {
        void onCredentialClick(CredentialItem credential);
    }

    public CredentialAdapterV2(List<CredentialItem> credentials, OnCredentialClickListener listener) {
        super(credentials);
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_credential_v2, parent, false);
        return new ViewHolder(view);
    }

    @Override
    protected void onBindItem(@NonNull ViewHolder holder, CredentialItem item) {
        holder.bind(item);
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        private final TextView title;
        private final TextView username;
        private final TextView initials;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.credentialTitle);
            username = itemView.findViewById(R.id.credentialUsername);
            initials = itemView.findViewById(R.id.credentialInitials);

            itemView.setOnClickListener(v -> {
                int pos = getAdapterPosition();
                if (pos != RecyclerView.NO_POSITION && listener != null) {
                    listener.onCredentialClick(getItem(pos));
                }
            });
        }

        void bind(CredentialItem c) {
            title.setText(c.getTitle());
            String uname = c.getUsername();
            if (uname == null || uname.isEmpty()) {
                username.setVisibility(View.GONE);
            } else {
                username.setVisibility(View.VISIBLE);
                username.setText(uname);
            }
            initials.setText(computeInitials(c.getTitle()));
        }

        private String computeInitials(String t) {
            if (t == null || t.isEmpty()) return "?";
            String[] words = t.trim().split("\\s+");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(2, words.length); i++) {
                if (!words[i].isEmpty()) sb.append(Character.toUpperCase(words[i].charAt(0)));
            }
            if (sb.length() == 1 && t.length() > 1) sb.append(Character.toUpperCase(t.charAt(1)));
            return sb.toString();
        }
    }
}
