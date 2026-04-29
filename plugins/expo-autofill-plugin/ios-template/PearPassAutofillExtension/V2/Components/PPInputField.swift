//
//  PPInputField.swift
//  PearPassAutoFillExtension
//
//  V2 input field. Mirrors android-template/res/layout/include_pp_input_field_v2.xml +
//  drawables pp_v2_input_bg_{default,focused}.xml.
//

import SwiftUI

struct PPInputField: View {

    let label: String
    @Binding var text: String
    var placeholder: String = ""
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType? = nil
    var autocapitalization: TextInputAutocapitalization = .never
    var trailing: AnyView? = nil
    var isEditable: Bool = true

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(alignment: .center, spacing: PPSpacing.s4) {
            VStack(alignment: .leading, spacing: PPSpacing.s4) {
                Text(label)
                    .font(PPTypography.caption)
                    .foregroundColor(PPColors.textPrimary)

                TextField("", text: $text, prompt: Text(placeholder).foregroundColor(PPColors.textSecondary))
                    .font(PPTypography.labelEmphasized)
                    .foregroundColor(PPColors.textPrimary)
                    .keyboardType(keyboardType)
                    .textContentType(textContentType)
                    .textInputAutocapitalization(autocapitalization)
                    .autocorrectionDisabled(true)
                    .focused($isFocused)
                    .disabled(!isEditable)
            }

            if let trailing = trailing {
                trailing
                    .frame(width: 24, height: 24)
            }
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
