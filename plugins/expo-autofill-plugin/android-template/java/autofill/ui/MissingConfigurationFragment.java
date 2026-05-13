package com.pears.pass.autofill.ui;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.pears.pass.R;

public class MissingConfigurationFragment extends BaseAutofillFragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // v2 uses the numbered-steps layout
        if (getResources().getInteger(R.integer.design_version) == 2) {
            return inflater.inflate(R.layout.fragment_missing_configuration_v2, container, false);
        }
        return inflater.inflate(R.layout.fragment_missing_configuration, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // v2 uses the sheet header with back arrow
        if (getResources().getInteger(R.integer.design_version) == 2) {
            onViewCreatedV2(view);
            return;
        }

        TextView cancelButton = view.findViewById(R.id.cancelButton);
        Button goBackButton = view.findViewById(R.id.goBackButton);

        setupCancelButton(cancelButton);
        setupCancelButton(goBackButton);
    }

    private void onViewCreatedV2(View view) {
        View sheetHeader = view.findViewById(R.id.missingSheetHeader);
        if (sheetHeader != null) {
            View back = sheetHeader.findViewById(R.id.ppHeaderBack);
            View close = sheetHeader.findViewById(R.id.ppHeaderClose);
            TextView headerTitle = sheetHeader.findViewById(R.id.ppHeaderTitle);
            if (headerTitle != null) headerTitle.setText("");
            if (close != null) close.setVisibility(View.GONE);
            if (back != null) back.setOnClickListener(v -> {
                if (navigationListener != null) navigationListener.onCancel();
            });
        }
        Button goBackButton = view.findViewById(R.id.missingV2GoBackButton);
        setupCancelButton(goBackButton);
    }
}
