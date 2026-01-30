import SwiftUI

/// Shared constants for the PearPass Autofill Extension
enum Constants {
    
    // MARK: - Colors
    
    enum Colors {
        static let primaryBackground = Color(red: 0x23/255, green: 0x23/255, blue: 0x23/255)
        static let primaryGreen = Color(red: 0xB0/255, green: 0xD9/255, blue: 0x44/255)
        static let darkBackground = Color(red: 0x05/255, green: 0x0B/255, blue: 0x06/255)
        static let credentialBackground = Color(red: 0x2A/255, green: 0x3B/255, blue: 0x3C/255)
        static let vaultIconBackground = Color(red: 0x32/255, green: 0x39/255, blue: 0x23/255)
        static let searchBackground = Color.gray.opacity(0.2)
        static let borderGray = Color.gray.opacity(0.5)
        static let lightGray = Color(red: 0xF6/255, green: 0xF6/255, blue: 0xF6/255)
        
        // Gradient colors for fallback background
        static let gradientTop = Color(red: 0x2a/255, green: 0x2a/255, blue: 0x2a/255)
        static let gradientBottom = Color(red: 0x1a/255, green: 0x1a/255, blue: 0x1a/255)
    }
    
    // MARK: - Layout
    
    enum Layout {
        static let cornerRadius: CGFloat = 25
        static let smallCornerRadius: CGFloat = 8
        static let mediumCornerRadius: CGFloat = 15
        static let horizontalPadding: CGFloat = 24
        static let verticalPadding: CGFloat = 12
    }
}