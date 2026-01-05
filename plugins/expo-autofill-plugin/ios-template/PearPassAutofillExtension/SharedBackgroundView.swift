import SwiftUI

/// Shared background view component used across multiple screens
struct SharedBackgroundView: View {
    var body: some View {
        ZStack {
            // Dark background
            Constants.Colors.primaryBackground
                .ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                // BackgroundImage covering all available space, moved up slightly
                Image("BackgroundImage")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .clipped()
            }
            .padding(.bottom, 0) // Move up by reducing bottom padding
            .ignoresSafeArea()
        }
    }
}

/// Simplified background view for screens that don't need the full background image
struct SimpleBackgroundView: View {
    var body: some View {
        Constants.Colors.primaryBackground
            .ignoresSafeArea()
    }
}