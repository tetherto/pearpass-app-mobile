import SwiftUI

private struct PearPassThemeKey: EnvironmentKey {
    static let defaultValue: ThemeColors = .dark
}

extension EnvironmentValues {
    var pearpassTheme: ThemeColors {
        get { self[PearPassThemeKey.self] }
        set { self[PearPassThemeKey.self] = newValue }
    }
}

extension View {
    /// Attaches the V2 PearPass theme to the view hierarchy.
    /// Defaults to the dark palette (light palette is not yet defined upstream).
    func pearpassTheme(_ colors: ThemeColors = .dark) -> some View {
        environment(\.pearpassTheme, colors)
    }
}

extension Font {
    /// Falls back to the system font if `Inter` isn't bundled in the extension.
    static func pearpass(size: CGFloat, weight: Font.Weight = Tokens.FontWeight.regular) -> Font {
        .custom(Tokens.FontFamily.primary, size: size).weight(weight)
    }

    static func pearpassDisplay(size: CGFloat, weight: Font.Weight = Tokens.FontWeight.medium) -> Font {
        .custom(Tokens.FontFamily.display, size: size).weight(weight)
    }
}
