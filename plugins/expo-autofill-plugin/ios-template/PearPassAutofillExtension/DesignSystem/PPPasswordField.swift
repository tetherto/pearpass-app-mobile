import SwiftUI

struct PPPasswordField: View {
    @Environment(\.pearpassTheme) private var theme
    @State private var isVisible = false

    private let label: String
    @Binding private var value: String
    private let placeholder: String
    private let error: String?
    private let isDisabled: Bool

    init(
        label: String,
        value: Binding<String>,
        placeholder: String = "",
        error: String? = nil,
        isDisabled: Bool = false
    ) {
        self.label = label
        self._value = value
        self.placeholder = placeholder
        self.error = error
        self.isDisabled = isDisabled
    }

    var body: some View {
        PPInputField(
            label: label,
            value: $value,
            placeholder: placeholder,
            error: error,
            isDisabled: isDisabled,
            isSecure: !isVisible,
            leftSlot: { EmptyView() },
            rightSlot: {
                Button {
                    isVisible.toggle()
                } label: {
                    Image(systemName: isVisible ? "eye.slash" : "eye")
                        .foregroundColor(theme.colorTextSecondary)
                }
                .accessibilityLabel(isVisible ? "Hide password" : "Show password")
            }
        )
    }
}

#Preview {
    struct Wrapper: View {
        @State var pw = "hunter2"
        var body: some View {
            VStack(spacing: Tokens.Spacing.s16) {
                PPPasswordField(label: "Master password", value: $pw, placeholder: "Enter")
                PPPasswordField(label: "Master password", value: .constant("short"), error: "Too short")
            }
            .padding()
        }
    }
    return Wrapper()
        .background(ThemeColors.dark.colorBackground)
        .pearpassTheme()
}
