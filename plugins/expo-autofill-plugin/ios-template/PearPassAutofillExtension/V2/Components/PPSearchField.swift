//
//  PPSearchField.swift
//  PearPassAutoFillExtension
//
//  V2 search field. Mirrors android-template/res/layout/include_pp_search_field_v2.xml.
//  40dp height; surface_search_field bg; border_search_field stroke; r8 radius.
//

import SwiftUI

struct PPSearchField: View {

    @Binding var text: String
    var placeholder: String = NSLocalizedString("Search", comment: "V2 search field default placeholder")

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: PPSpacing.s8) {
            Image("Icons/Search", bundle: .main)
                .renderingMode(.template)
                .resizable()
                .frame(width: 16, height: 16)
                .foregroundColor(PPColors.textSearchField)

            TextField("", text: $text, prompt: Text(placeholder).foregroundColor(PPColors.textSearchField))
                .font(Font.custom(PPFontFamily.inter, size: PPFontSizes.s14))
                .foregroundColor(PPColors.textPrimary)
                .submitLabel(.search)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled(true)
                .focused($isFocused)
        }
        .padding(.horizontal, PPSpacing.s12)
        .frame(height: 40)
        .background(background)
    }

    @ViewBuilder
    private var background: some View {
        ZStack {
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .fill(PPColors.surfaceSearchField)
            // Keep the border color constant on focus — the green focus ring
            // is reserved for inputs that need explicit confirmation feedback
            // (master password, vault password). Search shouldn't pulse
            // accent on every tap.
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .strokeBorder(PPColors.borderSearchField, lineWidth: 1)
        }
    }
}
