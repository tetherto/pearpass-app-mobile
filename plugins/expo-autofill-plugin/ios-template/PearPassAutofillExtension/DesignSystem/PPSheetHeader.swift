import SwiftUI

struct PPSheetHeader: View {
    @Environment(\.pearpassTheme) private var theme

    private let title: String
    private let onCancel: () -> Void
    private let onBack: (() -> Void)?

    init(title: String, onBack: (() -> Void)? = nil, onCancel: @escaping () -> Void) {
        self.title = title
        self.onBack = onBack
        self.onCancel = onCancel
    }

    var body: some View {
        ZStack {
            PPText(title, variant: .bodyEmphasized)
                .frame(maxWidth: .infinity, alignment: .center)

            HStack {
                if let onBack {
                    Button(action: onBack) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: Tokens.FontSize.s16, weight: .semibold))
                            .foregroundColor(theme.colorTextPrimary)
                    }
                    .accessibilityLabel("Back")
                } else {
                    Image(systemName: "lock.fill")
                        .font(.system(size: Tokens.FontSize.s16))
                        .foregroundColor(theme.colorPrimary)
                }
                Spacer()
                Button(action: onCancel) {
                    Image(systemName: "xmark")
                        .font(.system(size: Tokens.FontSize.s16, weight: .semibold))
                        .foregroundColor(theme.colorTextPrimary)
                }
                .accessibilityLabel("Cancel")
            }
        }
        .padding(.horizontal, Tokens.Spacing.s16)
        .padding(.vertical, Tokens.Spacing.s12)
        .background(theme.colorSurfacePrimary)
    }
}

#Preview {
    VStack(spacing: 0) {
        PPSheetHeader(title: "Add a passkey", onCancel: {})
        PPSheetHeader(title: "Create Passkey", onBack: {}, onCancel: {})
        Spacer()
    }
    .background(ThemeColors.dark.colorBackground)
    .pearpassTheme()
}
