//
//  PPTypography.swift
//  PearPassAutoFillExtension
//
//  V2 design system typography. Mirrors android-template/res/values/text_appearances_v2.xml.
//
//  Body / Label / Caption use Inter (regular + medium weights).
//  Title uses Humble Nostalgia.
//
//  Fonts are registered via the extension's Info.plist (UIAppFonts) and
//  bundled from V2/Resources/Fonts/.
//

import SwiftUI

enum PPFontFamily {
    /// Inter Regular — exact PostScript name from Inter.ttf
    static let inter = "Inter-Regular"
    /// Humble Nostalgia Regular — exact PostScript name from HumbleNostalgia.otf
    static let humbleNostalgia = "HumbleNostalgia-Regular"
}

enum PPTypography {

    // MARK: - Inter scale

    static let caption = Font.custom(PPFontFamily.inter, size: PPFontSizes.s12)

    static let label = Font.custom(PPFontFamily.inter, size: PPFontSizes.s14)

    static let labelEmphasized = Font.custom(PPFontFamily.inter, size: PPFontSizes.s14)
        .weight(.medium)

    static let body = Font.custom(PPFontFamily.inter, size: PPFontSizes.s16)

    static let bodyEmphasized = Font.custom(PPFontFamily.inter, size: PPFontSizes.s16)
        .weight(.medium)

    // MARK: - Title

    static let title = Font.custom(PPFontFamily.humbleNostalgia, size: PPFontSizes.s28)
}
