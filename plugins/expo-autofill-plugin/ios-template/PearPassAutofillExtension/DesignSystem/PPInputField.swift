import SwiftUI

struct PPInputField<LeftSlot: View, RightSlot: View>: View {
    @Environment(\.pearpassTheme) private var theme
    @FocusState private var isFocused: Bool

    private let label: String
    @Binding private var value: String
    private let placeholder: String
    private let error: String?
    private let isDisabled: Bool
    private let isSecure: Bool
    private let leftSlot: LeftSlot
    private let rightSlot: RightSlot

    init(
        label: String,
        value: Binding<String>,
        placeholder: String = "",
        error: String? = nil,
        isDisabled: Bool = false,
        isSecure: Bool = false,
        @ViewBuilder leftSlot: () -> LeftSlot = { EmptyView() },
        @ViewBuilder rightSlot: () -> RightSlot = { EmptyView() }
    ) {
        self.label = label
        self._value = value
        self.placeholder = placeholder
        self.error = error
        self.isDisabled = isDisabled
        self.isSecure = isSecure
        self.leftSlot = leftSlot()
        self.rightSlot = rightSlot()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.s6) {
            PPText(label, variant: .label, color: theme.colorTextSecondary)

            HStack(spacing: Tokens.Spacing.s8) {
                leftSlot
                Group {
                    if isSecure {
                        SecureField(placeholder, text: $value)
                    } else {
                        TextField(placeholder, text: $value)
                    }
                }
                .focused($isFocused)
                .font(.pearpass(size: Tokens.FontSize.s16))
                .foregroundColor(theme.colorTextPrimary)
                .tint(theme.colorPrimary)
                .disabled(isDisabled)
                rightSlot
            }
            .padding(.horizontal, Tokens.Spacing.s16)
            .frame(height: 48)
            .background(
                RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                    .fill(theme.colorSurfacePrimary)
            )
            .overlay(
                RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                    .stroke(borderColor, lineWidth: 1)
            )
            .opacity(isDisabled ? 0.5 : 1)

            if let error {
                PPText(error, variant: .caption, color: theme.colorSurfaceError)
            }
        }
    }

    private var borderColor: Color {
        if error != nil { return theme.colorSurfaceError }
        if isFocused { return theme.colorFocusRing }
        return theme.colorBorderPrimary
    }
}

#Preview {
    struct Wrapper: View {
        @State var email = ""
        @State var broken = "wrong@"
        var body: some View {
            VStack(spacing: Tokens.Spacing.s16) {
                PPInputField(label: "Email", value: $email, placeholder: "you@domain.com")
                PPInputField(label: "Email", value: $broken, placeholder: "you@domain.com", error: "Invalid address")
                PPInputField(label: "Disabled", value: .constant("locked"), isDisabled: true)
            }
            .padding()
        }
    }
    return Wrapper()
        .background(ThemeColors.dark.colorBackground)
        .pearpassTheme()
}
