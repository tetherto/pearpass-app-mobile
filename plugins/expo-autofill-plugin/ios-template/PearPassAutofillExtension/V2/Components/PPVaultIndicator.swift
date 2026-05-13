//
//  PPVaultIndicator.swift
//  PearPassAutoFillExtension
//
//  V2 vault selection indicator. Mirrors drawables pp_v2_vault_indicator_{selected,unselected}.xml.
//  Outer ring 1.5dp primary green; selected adds inner dot (4dp inset).
//

import SwiftUI

struct PPVaultIndicator: View {

    let isSelected: Bool

    var body: some View {
        ZStack {
            Circle()
                .strokeBorder(PPColors.primary, lineWidth: 1.5)
            if isSelected {
                Circle()
                    .fill(PPColors.primary)
                    .padding(4)
            }
        }
        .frame(width: 20, height: 20)
    }
}
