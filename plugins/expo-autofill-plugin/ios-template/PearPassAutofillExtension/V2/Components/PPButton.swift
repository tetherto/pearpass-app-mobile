//
//  PPButton.swift
//  PearPassAutoFillExtension
//
//  V2 button. Mirrors android-template/res/values/button_styles_v2.xml +
//  drawables pp_v2_btn_{primary,secondary,tertiary,destructive}.xml.
//

import SwiftUI

enum PPButtonVariant {
    case primary
    case secondary
    case tertiary
    case destructive
}

struct PPButton: View {

    let title: String
    let variant: PPButtonVariant
    var leadingIcon: Image? = nil
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: PPSpacing.s4) {
                if let leadingIcon = leadingIcon {
                    leadingIcon
                        .renderingMode(.template)
                }
                Text(title)
                    .font(PPTypography.labelEmphasized)
            }
            .frame(maxWidth: .infinity)
            .padding(PPSpacing.s12)
            .foregroundColor(textColor)
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: PPRadii.r8))
        }
        .buttonStyle(.plain)
        .disabled(!isEnabled)
    }

    // MARK: - Styling

    private var textColor: Color {
        switch variant {
        case .primary: return PPColors.onPrimary
        case .secondary: return PPColors.textPrimary
        case .tertiary: return PPColors.primary
        case .destructive: return PPColors.textPrimary
        }
    }

    private var fillColor: Color {
        switch variant {
        case .primary: return PPColors.primary
        case .secondary: return PPColors.surfacePrimary
        case .tertiary: return .clear
        case .destructive: return PPColors.surfaceDestructiveElevated
        }
    }

    private var strokeColor: Color? {
        switch variant {
        case .secondary: return PPColors.borderSecondary
        default: return nil
        }
    }

    @ViewBuilder
    private var background: some View {
        ZStack {
            RoundedRectangle(cornerRadius: PPRadii.r8)
                .fill(fillColor)
            if let strokeColor = strokeColor {
                RoundedRectangle(cornerRadius: PPRadii.r8)
                    .strokeBorder(strokeColor, lineWidth: 1)
            }
        }
    }
}
