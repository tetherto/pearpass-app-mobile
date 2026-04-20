import SwiftUI

struct MissingConfigurationViewV2: View {
    @Environment(\.pearpassTheme) private var theme
    let onCancel: () -> Void

    var body: some View {
        ZStack {
            theme.colorBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                PPSheetHeader(title: NSLocalizedString("Create Passkey", comment: "Passkey sheet header"), onCancel: onCancel)

                Spacer()

                VStack(spacing: Tokens.Spacing.s24) {
                    ZStack {
                        RoundedRectangle(cornerRadius: Tokens.Radius.r16)
                            .fill(theme.colorSurfaceHover)
                            .frame(width: 72, height: 72)
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.system(size: 32))
                            .foregroundColor(theme.colorTextPrimary)
                    }

                    VStack(spacing: Tokens.Spacing.s8) {
                        PPTitle(NSLocalizedString("Finish setting up PearPass", comment: "Setup required title"))
                            .multilineTextAlignment(.center)

                        PPText(
                            NSLocalizedString(
                                "To use the autofill extension, you'll need to complete a few quick steps in the main app:",
                                comment: "Setup required description"
                            ),
                            variant: .body,
                            color: theme.colorTextSecondary
                        )
                        .multilineTextAlignment(.center)
                    }

                    VStack(alignment: .leading, spacing: Tokens.Spacing.s8) {
                        setupStep(number: "1", text: NSLocalizedString("Open the PearPass app", comment: "Setup step 1"))
                        setupStep(number: "2", text: NSLocalizedString("Set your Master Password", comment: "Setup step 2"))
                        setupStep(number: "3", text: NSLocalizedString("Create or import a vault", comment: "Setup step 3"))
                    }
                }
                .padding(.horizontal, Tokens.Spacing.s24)

                Spacer()

                PPButton(
                    NSLocalizedString("Go Back", comment: "Go back button"),
                    variant: .primary,
                    fullWidth: true,
                    action: onCancel
                )
                .padding(.horizontal, Tokens.Spacing.s16)
                .padding(.bottom, Tokens.Spacing.s24)
            }
        }
    }

    private func setupStep(number: String, text: String) -> some View {
        HStack(spacing: Tokens.Spacing.s12) {
            ZStack {
                Circle()
                    .fill(theme.colorSurfaceHover)
                    .frame(width: 20, height: 20)
                PPText(number, variant: .caption, color: theme.colorTextPrimary)
            }
            PPText(text, variant: .body, color: theme.colorTextSecondary)
        }
    }
}

#if DEBUG
struct MissingConfigurationViewV2_Previews: PreviewProvider {
    static var previews: some View {
        MissingConfigurationViewV2(onCancel: {})
            .pearpassTheme()
    }
}
#endif
