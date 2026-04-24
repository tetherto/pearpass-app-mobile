import SwiftUI

struct PPPageHeader: View {
    @Environment(\.pearpassTheme) private var theme

    private let title: String
    private let subtitle: String?

    init(title: String, subtitle: String? = nil) {
        self.title = title
        self.subtitle = subtitle
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Tokens.Spacing.s8) {
            PPTitle(title)
            if let subtitle {
                PPText(subtitle, variant: .label, color: theme.colorTextSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

#Preview {
    VStack(spacing: Tokens.Spacing.s24) {
        PPPageHeader(
            title: "Add a passkey?",
            subtitle: "Save this passkey to your PearPass vault so you can sign in to example.com on this device and others."
        )
        PPPageHeader(title: "Unlock vault")
    }
    .padding()
    .background(ThemeColors.dark.colorBackground)
    .pearpassTheme()
}
