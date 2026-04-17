import SwiftUI

enum PPListItemVariant {
    case `default`, destructive
}

enum PPListItemSubtitle {
    case none
    case single(String)
    case split(primary: String, secondary: String)
}

struct PPListItem<Leading: View, Trailing: View>: View {
    @Environment(\.pearpassTheme) private var theme

    private let title: String
    private let subtitle: PPListItemSubtitle
    private let variant: PPListItemVariant
    private let showDivider: Bool
    private let action: (() -> Void)?
    private let leading: Leading
    private let trailing: Trailing

    init(
        title: String,
        subtitle: PPListItemSubtitle = .none,
        variant: PPListItemVariant = .default,
        showDivider: Bool = false,
        action: (() -> Void)? = nil,
        @ViewBuilder leading: () -> Leading = { EmptyView() },
        @ViewBuilder trailing: () -> Trailing = { EmptyView() }
    ) {
        self.title = title
        self.subtitle = subtitle
        self.variant = variant
        self.showDivider = showDivider
        self.action = action
        self.leading = leading()
        self.trailing = trailing()
    }

    var body: some View {
        let row = HStack(spacing: Tokens.Spacing.s12) {
            leading
            VStack(alignment: .leading, spacing: Tokens.Spacing.s2) {
                PPText(title, variant: .bodyEmphasized, color: titleColor)
                subtitleView
            }
            Spacer(minLength: Tokens.Spacing.s8)
            trailing
        }
        .padding(.vertical, Tokens.Spacing.s12)
        .padding(.horizontal, Tokens.Spacing.s16)
        .contentShape(Rectangle())

        VStack(spacing: 0) {
            if let action {
                Button(action: action) { row }
                    .buttonStyle(PPListItemButtonStyle(hoverColor: theme.colorSurfaceHover))
            } else {
                row
            }
            if showDivider {
                Rectangle()
                    .fill(theme.colorBorderSecondary)
                    .frame(height: 1)
                    .padding(.leading, Tokens.Spacing.s16)
            }
        }
    }

    @ViewBuilder private var subtitleView: some View {
        switch subtitle {
        case .none:
            EmptyView()
        case .single(let text):
            PPText(text, variant: .label, color: theme.colorTextSecondary, lineLimit: 1)
        case .split(let primary, let secondary):
            HStack(spacing: Tokens.Spacing.s4) {
                PPText(primary, variant: .label, color: theme.colorTextSecondary, lineLimit: 1)
                PPText("·", variant: .label, color: theme.colorTextSecondary)
                PPText(secondary, variant: .label, color: theme.colorTextTertiary, lineLimit: 1)
            }
        }
    }

    private var titleColor: Color {
        variant == .destructive ? theme.colorSurfaceDestructiveElevated : theme.colorTextPrimary
    }
}

private struct PPListItemButtonStyle: ButtonStyle {
    let hoverColor: Color
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background(configuration.isPressed ? hoverColor : .clear)
    }
}

#Preview {
    VStack(spacing: 0) {
        PPListItem(
            title: "example.com",
            subtitle: .single("alvaro@example.com"),
            showDivider: true,
            action: {},
            leading: {
                Circle()
                    .fill(ThemeColors.dark.colorSurfaceHover)
                    .frame(width: 36, height: 36)
                    .overlay(PPText("E", variant: .bodyEmphasized, color: ThemeColors.dark.colorPrimary))
            }
        )
        PPListItem(
            title: "bank.com",
            subtitle: .split(primary: "personal", secondary: "passkey"),
            showDivider: true,
            action: {}
        )
        PPListItem(
            title: "Delete vault",
            variant: .destructive,
            action: {}
        )
    }
    .background(ThemeColors.dark.colorSurfacePrimary)
    .pearpassTheme()
}
