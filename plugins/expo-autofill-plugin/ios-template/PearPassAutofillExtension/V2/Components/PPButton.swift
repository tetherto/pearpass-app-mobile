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
    /// Renders a circular spinner before the title (and hides leadingIcon)
    /// while an async action is in flight. Mirrors V1 MasterPasswordView's
    /// `if isLoading { ProgressView + Text }` button content. The caller is
    /// responsible for setting `isEnabled` to false alongside `isLoading`
    /// so the user can't tap during the in-flight state.
    var isLoading: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: PPSpacing.s8) {
                if isLoading {
                    // Spinner-only — title is hidden during in-flight async
                    // actions (per design). The button stays sized via the
                    // outer frame so the surrounding layout doesn't jump.
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(textColor)
                        .scaleEffect(0.9)
                } else {
                    if let leadingIcon = leadingIcon {
                        leadingIcon
                            .renderingMode(.template)
                    }
                    Text(title)
                        .font(PPTypography.labelEmphasized)
                }
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
