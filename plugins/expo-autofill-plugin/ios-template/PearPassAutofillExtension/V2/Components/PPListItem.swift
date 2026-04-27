//
//  PPListItem.swift
//  PearPassAutoFillExtension
//
//  V2 list item. Mirrors android-template/res/layout/include_pp_list_item_v2.xml +
//  drawable pp_v2_list_item_bg.xml.
//

import SwiftUI

struct PPListItem: View {

    let title: String
    var subtitle: String? = nil
    var leadingIcon: Image? = nil
    var trailingIcon: Image? = Image("Icons/ChevronDown", bundle: .main)
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button(action: { onTap?() }) {
            HStack(spacing: PPSpacing.s8) {
                if let leadingIcon = leadingIcon {
                    leadingIcon
                        .renderingMode(.template)
                        .resizable()
                        .frame(width: 16, height: 16)
                        .foregroundColor(PPColors.textPrimary)
                }

                VStack(alignment: .leading, spacing: 0) {
                    Text(title)
                        .font(PPTypography.labelEmphasized)
                        .foregroundColor(PPColors.textPrimary)
                        .lineLimit(1)
                        .truncationMode(.tail)

                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(PPTypography.label)
                            .foregroundColor(PPColors.textSecondary)
                            .lineLimit(1)
                            .truncationMode(.tail)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                if let trailingIcon = trailingIcon {
                    trailingIcon
                        .renderingMode(.template)
                        .resizable()
                        .frame(width: 16, height: 16)
                        .foregroundColor(PPColors.textPrimary)
                }
            }
            .padding(PPSpacing.s12)
            .background(background)
        }
        .buttonStyle(.plain)
        .disabled(onTap == nil)
    }

    @ViewBuilder
    private var background: some View {
        ZStack {
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .fill(Color.clear)
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .strokeBorder(PPColors.borderPrimary, lineWidth: 1)
        }
    }
}
