import SwiftUI

enum PPSearchFieldSize {
    case small, medium

    var height: CGFloat {
        switch self {
        case .small: return 36
        case .medium: return 44
        }
    }
}

struct PPSearchField: View {
    @Environment(\.pearpassTheme) private var theme
    @FocusState private var isFocused: Bool

    @Binding private var value: String
    private let placeholder: String
    private let size: PPSearchFieldSize

    init(
        value: Binding<String>,
        placeholder: String = "Search",
        size: PPSearchFieldSize = .medium
    ) {
        self._value = value
        self.placeholder = placeholder
        self.size = size
    }

    var body: some View {
        HStack(spacing: Tokens.Spacing.s8) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(theme.colorTextSearchField)

            TextField(placeholder, text: $value)
                .focused($isFocused)
                .font(.pearpass(size: Tokens.FontSize.s14))
                .foregroundColor(theme.colorTextPrimary)
                .tint(theme.colorPrimary)

            if !value.isEmpty {
                Button {
                    value = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(theme.colorTextSearchField)
                }
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, Tokens.Spacing.s12)
        .frame(height: size.height)
        .background(
            RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                .fill(theme.colorSurfaceSearchField)
        )
        .overlay(
            RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                .stroke(isFocused ? theme.colorFocusRing : theme.colorBorderSearchField, lineWidth: 1)
        )
    }
}

#Preview {
    struct Wrapper: View {
        @State var q = ""
        @State var typed = "example.com"
        var body: some View {
            VStack(spacing: Tokens.Spacing.s16) {
                PPSearchField(value: $q)
                PPSearchField(value: $typed, size: .small)
            }
            .padding()
        }
    }
    return Wrapper()
        .background(ThemeColors.dark.colorBackground)
        .pearpassTheme()
}
