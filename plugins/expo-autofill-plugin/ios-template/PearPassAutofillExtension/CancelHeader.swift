import SwiftUI

struct CancelHeader: View {
    let onCancel: () -> Void
    
    var body: some View {
        HStack {
            Spacer()
            
            Button(action: onCancel) {
                Text("Cancel")
                    .font(.system(size: 16))
                    .foregroundColor(Constants.Colors.primaryGreen)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }
}