//
//  PPColors.swift
//  PearPassAutoFillExtension
//
//  V2 design system color tokens. Mirrors android-template/res/values/colors_v2.xml.
//

import SwiftUI

enum PPColors {

    // MARK: - Surfaces

    static let background = Color(hex: 0x080A05)
    static let surfacePrimary = Color(hex: 0x15180E)
    static let surfaceSearchField = Color(hex: 0x16181B)
    static let surfaceSecondary = Color(hex: 0xFDCA40)
    static let surfaceHover = Color(hex: 0x212814)
    static let surfaceElevatedOnInteraction = Color(hex: 0x2C3618)
    static let surfaceDisabled = Color(hex: 0x212814)
    static let surfaceDestructive = Color(hex: 0x421010)
    static let surfaceDestructiveElevated = Color(hex: 0xD13B3D)
    static let surfaceError = Color(hex: 0xD1383D)
    static let surfaceWarning = Color(hex: 0xD7D245)
    static let backgroundSnackbar = Color(hex: 0xFFFFFF)

    // MARK: - Brand

    static let primary = Color(hex: 0xB0D944)
    static let secondary = Color(hex: 0x8AE081)
    static let accentHover = Color(hex: 0xBAE061)
    static let accentActive = Color(hex: 0x98C328)

    // MARK: - Text

    static let textPrimary = Color(hex: 0xFFFFFF)
    static let onPrimary = Color(hex: 0x08090C)
    static let textSearchField = Color(hex: 0x67707E)
    static let textSecondary = Color(hex: 0xBDC3AC)
    static let textTertiary = Color(hex: 0xF6F6F6)
    static let textDisabled = Color(hex: 0x435123)

    // MARK: - Borders

    static let borderPrimary = Color(hex: 0x212814)
    static let borderSearchField = Color(hex: 0x252937)
    static let borderSecondary = Color(hex: 0x2C3618)

    // MARK: - Misc

    static let focusRing = Color(hex: 0xB0D944)
    static let linkText = Color(hex: 0xBADE5B)
}

// MARK: - Hex Helper

extension Color {
    init(hex: UInt32, alpha: Double = 1.0) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}
