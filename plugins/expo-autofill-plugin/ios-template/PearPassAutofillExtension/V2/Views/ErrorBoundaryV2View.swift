//
//  ErrorBoundaryV2View.swift
//  PearPassAutoFillExtension
//
//  V2 error boundary screen. Mirrors android-template/res/layout/fragment_error_boundary_v2.xml.
//  Sheet header back-only (no title, no close) + error icon + title/subtitle/message + Go Back.
//

import SwiftUI

struct ErrorBoundaryV2View: View {

    let title: String
    let subtitle: String
    var message: String? = nil

    var onBack: () -> Void = {}

    var body: some View {
        VStack(spacing: 0) {
            PPSheetHeaderBack(
                title: "",
                showBack: true,
                showClose: false,
                onBack: onBack
            )

            PPContentCard {
                VStack(spacing: 0) {
                    Image("Icons/ErrorIcon", bundle: .main)
                        .resizable()
                        .frame(width: 75, height: 75)
                        .padding(.top, 56)
                        .padding(.bottom, PPSpacing.s16)

                    Text(title)
                        .font(PPTypography.title)
                        .foregroundColor(PPColors.textPrimary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)

                    Text(subtitle)
                        .font(PPTypography.label)
                        .foregroundColor(PPColors.textSecondary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.top, PPSpacing.s8)

                    if let message = message {
                        Text(message)
                            .font(PPTypography.label)
                            .foregroundColor(PPColors.textSecondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: .infinity)
                            .padding(.top, PPSpacing.s8)
                    }

                    Spacer()

                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)
                        .padding(.horizontal, -PPSpacing.s16)

                    PPButton(title: NSLocalizedString("Go Back", comment: "V2 go back button"), variant: .primary, action: onBack)
                        .padding(.top, PPSpacing.s16)
                        .padding(.bottom, PPSpacing.s12)
                }
                .padding(.horizontal, PPSpacing.s16)
            }
        }
        .background(PPColors.surfacePrimary)
    }
}
