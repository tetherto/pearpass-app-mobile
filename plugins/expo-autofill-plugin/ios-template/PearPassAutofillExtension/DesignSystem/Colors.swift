import SwiftUI

/// V2 semantic color palette mirroring `pearpass-lib-ui-react-native-components`.
/// Source: `src/theme/themes/dark.ts` (light theme is intentionally empty upstream).
struct ThemeColors {
    let colorBackground: Color
    let colorSurfacePrimary: Color
    let colorSurfaceSearchField: Color
    let colorSurfaceSecondary: Color

    let colorPrimary: Color
    let colorSecondary: Color
    let colorAccentHover: Color
    let colorAccentActive: Color

    let colorTextPrimary: Color
    let colorOnPrimary: Color
    let colorTextSearchField: Color
    let colorTextSecondary: Color
    let colorTextTertiary: Color
    let colorTextDisabled: Color

    let colorBorderPrimary: Color
    let colorBorderSearchField: Color
    let colorBorderSecondary: Color

    let colorSurfaceHover: Color
    let colorSurfaceElevatedOnInteraction: Color
    let colorSurfaceDisabled: Color
    let colorSurfaceDestructiveElevated: Color
    let colorSurfaceDestructive: Color
    let colorSurfaceError: Color
    let colorSurfaceWarning: Color

    let colorFocusRing: Color
    let colorLinkText: Color
    let backgroundSnackbar: Color
}

extension ThemeColors {
    static let dark = ThemeColors(
        colorBackground:                   Color(hex: 0x080A05),
        colorSurfacePrimary:               Color(hex: 0x15180E),
        colorSurfaceSearchField:           Color(hex: 0x16181B),
        colorSurfaceSecondary:             Color(hex: 0xFDCA40),
        colorPrimary:                      Color(hex: 0xB0D944),
        colorSecondary:                    Color(hex: 0x8AE081),
        colorAccentHover:                  Color(hex: 0xBAE061),
        colorAccentActive:                 Color(hex: 0x98C328),
        colorTextPrimary:                  Color(hex: 0xFFFFFF),
        colorOnPrimary:                    Color(hex: 0x08090C),
        colorTextSearchField:              Color(hex: 0x67707E),
        colorTextSecondary:                Color(hex: 0xBDC3AC),
        colorTextTertiary:                 Color(hex: 0xF6F6F6),
        colorTextDisabled:                 Color(hex: 0x435123),
        colorBorderPrimary:                Color(hex: 0x212814),
        colorBorderSearchField:            Color(hex: 0x252937),
        colorBorderSecondary:              Color(hex: 0x2C3618),
        colorSurfaceHover:                 Color(hex: 0x212814),
        colorSurfaceElevatedOnInteraction: Color(hex: 0x2C3618),
        colorSurfaceDisabled:              Color(hex: 0x212814),
        colorSurfaceDestructiveElevated:   Color(hex: 0xD13B3D),
        colorSurfaceDestructive:           Color(hex: 0x421010),
        colorSurfaceError:                 Color(hex: 0xD1383D),
        colorSurfaceWarning:               Color(hex: 0xD7D245),
        colorFocusRing:                    Color(hex: 0xB0D944),
        colorLinkText:                     Color(hex: 0xBADE5B),
        backgroundSnackbar:                Color(hex: 0xFFFFFF)
    )
}

private extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8)  & 0xFF) / 255.0
        let b = Double( hex        & 0xFF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}
