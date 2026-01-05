import SwiftUI

struct MissingConfigurationView: View {
    let onCancel: () -> Void
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                SharedBackgroundView()
                
                VStack(spacing: 0) {
                    CancelHeader {
                        onCancel()
                    }
                    
                    Spacer()
                    
                    VStack(spacing: 32) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.system(size: 64))
                            .foregroundColor(.yellow)
                        
                        VStack(spacing: 16) {
                            Text(NSLocalizedString("Setup Required", comment: "Setup required title"))
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text(NSLocalizedString("PearPass is not configured", comment: "Not configured message"))
                                .font(.system(size: 18))
                                .foregroundColor(Color.white.opacity(0.8))
                                .multilineTextAlignment(.center)
                        }
                        
                        VStack(spacing: 12) {
                            Text(NSLocalizedString("To use the autofill extension, please:", comment: "Instructions header"))
                                .font(.system(size: 16))
                                .foregroundColor(Color.white.opacity(0.7))
                                .multilineTextAlignment(.center)
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Label(NSLocalizedString("Open the PearPass app", comment: "Step 1"), systemImage: "1.circle.fill")
                                    .font(.system(size: 15))
                                    .foregroundColor(Color.white.opacity(0.7))
                                
                                Label(NSLocalizedString("Set up your master password", comment: "Step 2"), systemImage: "2.circle.fill")
                                    .font(.system(size: 15))
                                    .foregroundColor(Color.white.opacity(0.7))
                                
                                Label(NSLocalizedString("Create or import a vault", comment: "Step 3"), systemImage: "3.circle.fill")
                                    .font(.system(size: 15))
                                    .foregroundColor(Color.white.opacity(0.7))
                                
                             
                            }
                            .padding(.horizontal, 40)
                        }
                        
                        Button(action: {
                            onCancel()
                        }) {
                            Text(NSLocalizedString("Go Back", comment: "Go back button"))
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(
                                    RoundedRectangle(cornerRadius: Constants.Layout.cornerRadius)
                                        .fill(Constants.Colors.primaryGreen)
                                )
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.horizontal, 20)
                    
                    Spacer()
                    Spacer()
                }
            }
        }
    }
}

#if DEBUG
struct MissingConfigurationView_Previews: PreviewProvider {
    static var previews: some View {
        MissingConfigurationView(onCancel: {})
    }
}
#endif
