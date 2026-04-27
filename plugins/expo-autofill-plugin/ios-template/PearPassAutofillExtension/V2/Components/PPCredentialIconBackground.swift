//
//  PPCredentialIconBackground.swift
//  PearPassAutoFillExtension
//
//  V2 credential row icon background. Mirrors drawable pp_v2_credential_icon_bg.xml.
//  40x40 squircle (r8), surface_primary fill, border_primary stroke.
//

import SwiftUI

struct PPCredentialIconBackground<Content: View>: View {

    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .fill(PPColors.surfacePrimary)
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
            content
        }
        .frame(width: 40, height: 40)
    }
}
