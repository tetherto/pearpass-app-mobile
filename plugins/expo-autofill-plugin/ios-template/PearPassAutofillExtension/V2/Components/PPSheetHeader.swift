//
//  PPSheetHeader.swift
//  PearPassAutoFillExtension
//
//  V2 sheet header (logo variant). Mirrors android-template/res/layout/include_pp_sheet_header_v2.xml.
//  Layout: logo (40x40) leading, title centered, close (40x40) trailing.
//

import SwiftUI

struct PPSheetHeader: View {

    let title: String
    var showLogo: Bool = true
    var showClose: Bool = true
    var onClose: (() -> Void)? = nil

    var body: some View {
        ZStack {
            // Centered title
            Text(title)
                .font(PPTypography.labelEmphasized)
                .foregroundColor(PPColors.textPrimary)
                .lineLimit(1)
                .truncationMode(.tail)

            // Leading + trailing
            HStack {
                if showLogo {
                    Image("Icons/AppLogo", bundle: .main)
                        .resizable()
                        .frame(width: 40, height: 40)
                } else {
                    Color.clear.frame(width: 40, height: 40)
                }

                Spacer()

                if showClose, let onClose = onClose {
                    Button(action: onClose) {
                        Image("Icons/Close", bundle: .main)
                            .renderingMode(.template)
                            .resizable()
                            .frame(width: 40, height: 40)
                            .foregroundColor(PPColors.textPrimary)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(NSLocalizedString("Close", comment: "V2 sheet header close button"))
                } else {
                    Color.clear.frame(width: 40, height: 40)
                }
            }
        }
        .padding(.horizontal, PPSpacing.s12)
        .padding(.vertical, PPSpacing.s8)
        .frame(maxWidth: .infinity)
        .background(PPColors.background)
    }
}
