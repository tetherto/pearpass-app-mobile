//
//  LoadingV2View.swift
//  PearPassAutoFillExtension
//
//  V2 loading screen. Mirrors Android's V2 LoadingFragment branch.
//  surface_primary background, centered progress indicator tinted primary.
//

import SwiftUI

struct LoadingV2View: View {

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
