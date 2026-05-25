//
//  LoadingView.swift
//  PearPassAutoFillExtension
//
//  loading screen. Mirrors Android's LoadingFragment.
//  surface_primary background, centered progress indicator tinted primary.
//

import SwiftUI

struct LoadingView: View {

    var body: some View {
        ZStack {
            PPColors.surfacePrimary
                .ignoresSafeArea()

            ProgressView()
                .progressViewStyle(.circular)
                .tint(PPColors.primary)
                .scaleEffect(1.4)
        }
    }
}
