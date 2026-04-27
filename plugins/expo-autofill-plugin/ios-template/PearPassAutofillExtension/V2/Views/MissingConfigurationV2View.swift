//
//  MissingConfigurationV2View.swift
//  PearPassAutoFillExtension
//
//  V2 missing configuration screen. Mirrors android-template/res/layout/fragment_missing_configuration_v2.xml.
//  Error icon + "Finish setting up PearPass" + 3 numbered steps + Go Back.
//

import SwiftUI

struct MissingConfigurationV2View: View {

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

                    Text("Finish setting up PearPass")
                        .font(PPTypography.title)
                        .foregroundColor(PPColors.textPrimary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)

                    Text("To use the autofill extension, you'll need to complete a few quick steps in the main app:")
                        .font(PPTypography.label)
                        .foregroundColor(PPColors.textSecondary)
                        .multilineTextAlignment(.center)
                        .frame(maxWidth: .infinity)
                        .padding(.top, PPSpacing.s8)

                    VStack(alignment: .leading, spacing: PPSpacing.s8) {
                        stepRow(number: 1, text: "Open the PearPass app")
                        stepRow(number: 2, text: "Set your Master Password")
                        stepRow(number: 3, text: "Create or import a vault")
                    }
                    .padding(.top, PPSpacing.s24)
                    .frame(maxWidth: .infinity, alignment: .center)

                    Spacer()

                    Rectangle()
                        .fill(PPColors.borderPrimary)
                        .frame(height: 1)
                        .padding(.horizontal, -PPSpacing.s16)

                    PPButton(title: "Go Back", variant: .primary, action: onBack)
                        .padding(.top, PPSpacing.s16)
                        .padding(.bottom, PPSpacing.s12)
                }
                .padding(.horizontal, PPSpacing.s16)
            }
        }
        .background(PPColors.surfacePrimary)
    }

    private func stepRow(number: Int, text: String) -> some View {
        HStack(spacing: 10) {
            PPStepNumber(number: number)
            Text(text)
                .font(PPTypography.label)
                .foregroundColor(PPColors.textSecondary)
        }
    }
}
