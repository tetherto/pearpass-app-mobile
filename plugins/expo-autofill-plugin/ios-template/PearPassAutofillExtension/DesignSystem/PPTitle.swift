import SwiftUI

struct PPTitle: View {
    @Environment(\.pearpassTheme) private var theme

    private let content: String
    private let color: Color?

    init(_ content: String, color: Color? = nil) {
        self.content = content
        self.color = color
    }

    var body: some View {
        Text(content)
            .font(.pearpassDisplay(size: Tokens.FontSize.s28))
            .foregroundColor(color ?? theme.colorTextPrimary)
    }
}

#Preview {
    VStack(alignment: .leading, spacing: Tokens.Spacing.s16) {
        PPTitle("Add a passkey?")
        PPTitle("Master password")
    }
    .padding()
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(ThemeColors.dark.colorBackground)
    .pearpassTheme()
}
