//
//  PPPasswordField.swift
//  PearPassAutoFillExtension
//
//  V2 password field. Mirrors android-template/res/layout/include_pp_password_field_v2.xml.
//  Label uses Caption (12sp), value uses 14sp.
//

import SwiftUI

struct PPPasswordField: View {

    let label: String
    @Binding var text: String
    var placeholder: String = ""
    var textContentType: UITextContentType? = .password

    @State private var isVisible: Bool = false
    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: .center, spacing: PPSpacing.s4) {
            VStack(alignment: .leading, spacing: PPSpacing.s4) {
                Text(label)
                    .font(PPTypography.caption)
                    .foregroundColor(PPColors.textPrimary)

                Group {
                    if isVisible {
                        TextField("", text: $text, prompt: Text(placeholder).foregroundColor(PPColors.textSecondary))
                            .textContentType(textContentType)
                    } else {
                        SecureField("", text: $text, prompt: Text(placeholder).foregroundColor(PPColors.textSecondary))
                            .textContentType(textContentType)
                    }
                }
                .font(Font.custom(PPFontFamily.inter, size: PPFontSizes.s14))
                .foregroundColor(PPColors.textPrimary)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled(true)
                .focused($isFocused)
            }

            Button(action: { isVisible.toggle() }) {
                Image("Icons/Eye", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(PPColors.textPrimary)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(NSLocalizedString("Toggle password visibility", comment: "V2 password field eye button"))
        }
        .padding(PPSpacing.s12)
        .background(background)
    }

    @ViewBuilder
    private var background: some View {
        ZStack {
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .fill(PPColors.surfacePrimary)
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .strokeBorder(isFocused ? PPColors.focusRing : PPColors.borderPrimary, lineWidth: 1)
        }
    }
}
