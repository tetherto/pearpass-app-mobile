import SwiftUI

/// V2 design system tokens mirroring `pearpass-lib-ui-react-native-components`.
/// Source: `src/theme/tokens.raw.ts` in that package.
/// V1 lives in `Constants.swift` and remains the default behind the v2 feature flag.
enum Tokens {

    enum Spacing {
        static let s2: CGFloat = 2
        static let s4: CGFloat = 4
        static let s6: CGFloat = 6
        static let s8: CGFloat = 8
        static let s10: CGFloat = 10
        static let s12: CGFloat = 12
        static let s16: CGFloat = 16
        static let s20: CGFloat = 20
        static let s24: CGFloat = 24
        static let s32: CGFloat = 32
        static let s40: CGFloat = 40
        static let s48: CGFloat = 48
    }

    enum Radius {
        static let r8: CGFloat = 8
        static let r16: CGFloat = 16
        static let r20: CGFloat = 20
        static let r26: CGFloat = 26
    }

    enum FontFamily {
        static let primary = "Inter"
        static let display = "Humble Nostalgia"
    }

    enum FontSize {
        static let s12: CGFloat = 12
        static let s14: CGFloat = 14
        static let s16: CGFloat = 16
        static let s24: CGFloat = 24
        static let s28: CGFloat = 28
    }

    enum FontWeight {
        static let regular: Font.Weight = .regular
        static let medium: Font.Weight = .medium
    }
}
