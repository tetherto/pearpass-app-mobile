//
//  PPVaultInlineItemView.swift
//  PearPassAutoFillExtension
//
//  V2 vault row inside inline dropdown. Mirrors android-template/res/layout/item_vault_inline_v2.xml.
//  Lock icon + vault name + selected indicator dot.
//

import SwiftUI

struct PPVaultInlineItemView: View {

    let name: String
    let isSelected: Bool
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button(action: { onTap?() }) {
            HStack(spacing: PPSpacing.s8) {
                Image("Icons/Lock", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 16, height: 16)
                    .foregroundColor(PPColors.textPrimary)

                Text(name)
                    .font(PPTypography.labelEmphasized)
                    .foregroundColor(PPColors.textPrimary)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .frame(maxWidth: .infinity, alignment: .leading)

                PPVaultIndicator(isSelected: isSelected)
                    .padding(.leading, PPSpacing.s8)
            }
            .padding(.horizontal, PPSpacing.s12)
            .padding(.vertical, PPSpacing.s12)
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: PPRadii.r8)
                        .fill(Color.clear)
                    RoundedRectangle(cornerRadius: PPRadii.r8)
                        .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
                }
            )
            // Make the gap between lock + name + indicator hit-testable.
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(onTap == nil)
    }
}
