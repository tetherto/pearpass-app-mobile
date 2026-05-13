//
//  PPSheetHeaderBack.swift
//  PearPassAutoFillExtension
//
//  V2 sheet header (back variant). Mirrors android-template/res/layout/include_pp_sheet_header_back_v2.xml.
//  Layout: back (40x40) leading, title centered, close (40x40) trailing.
//

import SwiftUI

struct PPSheetHeaderBack: View {

    let title: String
    var showBack: Bool = true
    var showClose: Bool = true
    var onBack: (() -> Void)? = nil
    var onClose: (() -> Void)? = nil

    var body: some View {
        ZStack {
            Text(title)
                .font(PPTypography.labelEmphasized)
                .foregroundColor(PPColors.textPrimary)
                .lineLimit(1)
                .truncationMode(.tail)

            HStack {
                if showBack, let onBack = onBack {
                    Button(action: onBack) {
                        Image("Icons/ArrowBack", bundle: .main)
                            .renderingMode(.template)
                            .resizable()
                            .frame(width: 24, height: 24)
                            .padding(8)
                            .foregroundColor(PPColors.textPrimary)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(NSLocalizedString("Back", comment: "V2 sheet header back button"))
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
