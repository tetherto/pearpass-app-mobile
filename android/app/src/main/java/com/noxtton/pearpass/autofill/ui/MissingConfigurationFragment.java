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
        return inflater.inflate(R.layout.fragment_missing_configuration, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView cancelButton = view.findViewById(R.id.cancelButton);
        Button goBackButton = view.findViewById(R.id.goBackButton);

        setupCancelButton(cancelButton);
        setupCancelButton(goBackButton);
    }
}