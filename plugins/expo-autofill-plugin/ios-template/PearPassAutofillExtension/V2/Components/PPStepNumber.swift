//
//  PPStepNumber.swift
//  PearPassAutoFillExtension
//
//  V2 numbered step badge. Mirrors drawable pp_v2_step_number_bg.xml.
//  14dp circle, text_secondary fill, 10sp inter on surface_primary text.
//

import SwiftUI

struct PPStepNumber: View {

    let number: Int

    var body: some View {
        Text("\(number)")
            .font(Font.custom(PPFontFamily.inter, size: 10))
            .foregroundColor(PPColors.surfacePrimary)
            .frame(width: 14, height: 14)
            .background(Circle().fill(PPColors.textSecondary))
    }
}
