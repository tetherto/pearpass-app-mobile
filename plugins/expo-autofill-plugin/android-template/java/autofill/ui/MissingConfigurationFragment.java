package com.pears.pass.autofill.ui;

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
        return inflater.inflate(R.layout.fragment_missing_configuration, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

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
