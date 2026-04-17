import SwiftUI

enum PPTextVariant {
    case label
    case labelEmphasized
    case body
    case bodyEmphasized
    case caption

    var fontSize: CGFloat {
        switch self {
        case .caption: return Tokens.FontSize.s12
        case .label, .labelEmphasized: return Tokens.FontSize.s14
        case .body, .bodyEmphasized: return Tokens.FontSize.s16
        }
    }

    var fontWeight: Font.Weight {
        switch self {
        case .labelEmphasized, .bodyEmphasized: return Tokens.FontWeight.medium
        default: return Tokens.FontWeight.regular
        }
    }
}

struct PPText: View {
    @Environment(\.pearpassTheme) private var theme

    private let content: String
    private let variant: PPTextVariant
    private let color: Color?
    private let lineLimit: Int?

    init(
        _ content: String,
        variant: PPTextVariant = .body,
        color: Color? = nil,
        lineLimit: Int? = nil
    ) {
        self.content = content
        self.variant = variant
        self.color = color
        self.lineLimit = lineLimit
    }

    var body: some View {
        Text(content)
            .font(.pearpass(size: variant.fontSize, weight: variant.fontWeight))
            .foregroundColor(color ?? theme.colorTextPrimary)
            .lineLimit(lineLimit)
    }
}

#Preview {
    VStack(alignment: .leading, spacing: 8) {
        PPText("caption — 12 regular", variant: .caption)
        PPText("label — 14 regular", variant: .label)
        PPText("labelEmphasized — 14 medium", variant: .labelEmphasized)
        PPText("body — 16 regular", variant: .body)
        PPText("bodyEmphasized — 16 medium", variant: .bodyEmphasized)
    }
    .padding()
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(ThemeColors.dark.colorBackground)
    .pearpassTheme()
}
