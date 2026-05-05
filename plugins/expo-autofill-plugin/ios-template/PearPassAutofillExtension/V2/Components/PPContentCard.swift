//
//  PPContentCard.swift
//  PearPassAutoFillExtension
//
//  V2 content card. Mirrors android-template/res/drawable/pp_v2_content_card_bg.xml.
//  Top corners rounded (r16), bottom flat. surface_primary fill + border_primary stroke.
//

import SwiftUI

struct PPContentCard<Content: View>: View {

    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                ZStack {
                    PPContentCardShape()
                        .fill(PPColors.surfacePrimary)
                    PPContentCardStroke()
                        .stroke(PPColors.borderPrimary, lineWidth: 1)
                }
            )
    }
}

/// Filled shape — top-rounded card body with a flat bottom that runs into the
/// safe area.
private struct PPContentCardShape: Shape {

    func path(in rect: CGRect) -> Path {
        let r: CGFloat = PPRadii.r16
        var path = Path()
        path.move(to: CGPoint(x: 0, y: r))
        path.addArc(center: CGPoint(x: r, y: r),
                    radius: r,
                    startAngle: .degrees(180),
                    endAngle: .degrees(270),
                    clockwise: false)
        path.addLine(to: CGPoint(x: rect.width - r, y: 0))
        path.addArc(center: CGPoint(x: rect.width - r, y: r),
                    radius: r,
                    startAngle: .degrees(270),
                    endAngle: .degrees(0),
                    clockwise: false)
        path.addLine(to: CGPoint(x: rect.width, y: rect.height))
        path.addLine(to: CGPoint(x: 0, y: rect.height))
        path.closeSubpath()
        return path
    }
}

/// Stroke path — only the top edge + side edges. Bottom is intentionally open
/// so the card's bottom blends into the screen edge with no visible border line.
private struct PPContentCardStroke: Shape {

    func path(in rect: CGRect) -> Path {
        let r: CGFloat = PPRadii.r16
        var path = Path()
        // Start at left edge, bottom of view.
        path.move(to: CGPoint(x: 0, y: rect.height))
        // Up the left edge to the top-left corner.
        path.addLine(to: CGPoint(x: 0, y: r))
        // Top-left arc.
        path.addArc(center: CGPoint(x: r, y: r),
                    radius: r,
                    startAngle: .degrees(180),
                    endAngle: .degrees(270),
                    clockwise: false)
        // Top edge.
        path.addLine(to: CGPoint(x: rect.width - r, y: 0))
        // Top-right arc.
        path.addArc(center: CGPoint(x: rect.width - r, y: r),
                    radius: r,
                    startAngle: .degrees(270),
                    endAngle: .degrees(0),
                    clockwise: false)
        // Down the right edge to the bottom of the view.
        path.addLine(to: CGPoint(x: rect.width, y: rect.height))
        return path
    }
}
