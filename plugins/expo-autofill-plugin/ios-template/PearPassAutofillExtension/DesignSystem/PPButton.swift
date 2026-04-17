import SwiftUI

enum PPButtonVariant {
    case primary, secondary, tertiary, destructive
}

enum PPButtonSize {
    case small, medium

    var height: CGFloat {
        switch self {
        case .small: return 36
        case .medium: return 48
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .small: return Tokens.Spacing.s12
        case .medium: return Tokens.Spacing.s16
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .small: return Tokens.FontSize.s14
        case .medium: return Tokens.FontSize.s16
        }
    }

    var cornerRadius: CGFloat {
        switch self {
        case .small: return Tokens.Radius.r8
        case .medium: return Tokens.Radius.r16
        }
    }
}

struct PPButton: View {
    @Environment(\.pearpassTheme) private var theme

    private let label: String
    private let variant: PPButtonVariant
    private let size: PPButtonSize
    private let iconBefore: Image?
    private let iconAfter: Image?
    private let fullWidth: Bool
    private let isLoading: Bool
    private let isDisabled: Bool
    private let action: () -> Void

    init(
        _ label: String,
        variant: PPButtonVariant = .primary,
        size: PPButtonSize = .medium,
        iconBefore: Image? = nil,
        iconAfter: Image? = nil,
        fullWidth: Bool = false,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.iconBefore = iconBefore
        self.iconAfter = iconAfter
        self.fullWidth = fullWidth
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Tokens.Spacing.s8) {
                if isLoading {
                    ProgressView()
                        .tint(foreground)
                } else {
                    if let iconBefore { iconBefore }
                    Text(label)
                        .font(.pearpass(size: size.fontSize, weight: Tokens.FontWeight.medium))
                    if let iconAfter { iconAfter }
                }
            }
            .foregroundColor(foreground)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: size.height)
            .padding(.horizontal, size.horizontalPadding)
            .background(
                RoundedRectangle(cornerRadius: size.cornerRadius)
                    .fill(background)
            )
            .overlay(
                RoundedRectangle(cornerRadius: size.cornerRadius)
                    .stroke(border, lineWidth: variant == .secondary ? 1 : 0)
            )
            .opacity(isDisabled ? 0.5 : 1)
        }
        .disabled(isDisabled || isLoading)
    }

    private var background: Color {
        switch variant {
        case .primary:     return theme.colorPrimary
        case .secondary:   return theme.colorSurfacePrimary
        case .tertiary:    return .clear
        case .destructive: return theme.colorSurfaceDestructiveElevated
        }
    }

    private var foreground: Color {
        switch variant {
        case .primary:     return theme.colorOnPrimary
        case .secondary:   return theme.colorTextPrimary
        case .tertiary:    return theme.colorPrimary
        case .destructive: return theme.colorTextPrimary
        }
    }

    private var border: Color {
        variant == .secondary ? theme.colorBorderPrimary : .clear
    }
}

#Preview {
    VStack(spacing: Tokens.Spacing.s12) {
        PPButton("Primary", variant: .primary, fullWidth: true) {}
        PPButton("Secondary", variant: .secondary, fullWidth: true) {}
        PPButton("Tertiary", variant: .tertiary, fullWidth: true) {}
        PPButton("Destructive", variant: .destructive, fullWidth: true) {}
        PPButton("Loading", variant: .primary, fullWidth: true, isLoading: true) {}
        PPButton("Disabled", variant: .primary, fullWidth: true, isDisabled: true) {}
        HStack {
            PPButton("Small", size: .small) {}
            PPButton("Medium", size: .medium) {}
        }
    }
    .padding()
    .background(ThemeColors.dark.colorBackground)
    .pearpassTheme()
}
