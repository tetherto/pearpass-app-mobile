package com.pears.pass.autofill.ui;

import android.content.res.ColorStateList;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.pears.pass.R;

public class LoadingFragment extends Fragment {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // v2 uses design system colors
        if (getResources().getInteger(R.integer.design_version) == 2) {
            return onCreateViewV2();
        }

        // Create a simple loading view programmatically
        FrameLayout layout = new FrameLayout(requireContext());
        layout.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        layout.setBackgroundColor(0xFF232323); // Dark background

        // Create progress bar
        ProgressBar progressBar = new ProgressBar(requireContext());
        progressBar.setIndeterminate(true);

        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        );
        progressParams.gravity = Gravity.CENTER;
        progressBar.setLayoutParams(progressParams);

        layout.addView(progressBar);

        return layout;
    }

    private View onCreateViewV2() {
        FrameLayout layout = new FrameLayout(requireContext());
        layout.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        layout.setBackgroundColor(
            ContextCompat.getColor(requireContext(), R.color.pp_v2_surface_primary));

        ProgressBar progressBar = new ProgressBar(requireContext());
        progressBar.setIndeterminate(true);
        progressBar.setIndeterminateTintList(
            ColorStateList.valueOf(
                ContextCompat.getColor(requireContext(), R.color.pp_v2_primary)));

        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        );
        progressParams.gravity = Gravity.CENTER;
        progressBar.setLayoutParams(progressParams);

        layout.addView(progressBar);

        return layout;
    }
}
