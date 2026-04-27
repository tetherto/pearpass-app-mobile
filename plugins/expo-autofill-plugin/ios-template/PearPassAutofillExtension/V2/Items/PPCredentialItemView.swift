//
//  PPCredentialItemView.swift
//  PearPassAutoFillExtension
//
//  V2 credential row. Mirrors android-template/res/layout/item_credential_v2.xml.
//  40x40 squircle avatar with initials + title (BodyEmphasized) + username (Label) + chevron.
//

import SwiftUI

struct PPCredentialItemView: View {

    let initials: String
    let title: String
    let username: String?
    var onTap: (() -> Void)? = nil

    var body: some View {
        Button(action: { onTap?() }) {
            HStack(spacing: PPSpacing.s12) {
                PPCredentialIconBackground {
                    Text(initials)
                        .font(PPTypography.labelEmphasized)
                        .foregroundColor(PPColors.primary)
                }

                VStack(alignment: .leading, spacing: PPSpacing.s2) {
                    Text(title)
                        .font(PPTypography.bodyEmphasized)
                        .foregroundColor(PPColors.textPrimary)
                        .lineLimit(1)
                        .truncationMode(.tail)

                    if let username = username, !username.isEmpty {
                        Text(username)
                            .font(PPTypography.label)
                            .foregroundColor(PPColors.textSecondary)
                            .lineLimit(1)
                            .truncationMode(.tail)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Image("Icons/ChevronRight", bundle: .main)
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 20, height: 20)
                    .foregroundColor(PPColors.textSecondary)
                    .padding(.leading, PPSpacing.s8)
            }
            .padding(.horizontal, PPSpacing.s4)
            .padding(.vertical, PPSpacing.s12)
        }
        .buttonStyle(.plain)
        .disabled(onTap == nil)
    }
}
