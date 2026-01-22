import SwiftUI

struct PasswordInput: View {
    @Binding var password: String
    @FocusState private var isPasswordFocused: Bool
    @State private var isPasswordVisible: Bool = false
    
    var body: some View {
        HStack {
            Image("CircleLock")
                .resizable()
                .frame(width: 20, height: 20)
            
            if isPasswordVisible {
                TextField("", text: $password)
                    .textFieldStyle(PlainTextFieldStyle())
                    .foregroundColor(.white)
                    .autocapitalization(.none)
                    .focused($isPasswordFocused)
            } else {
                SecureField("", text: $password)
                    .textFieldStyle(PlainTextFieldStyle())
                    .foregroundColor(.white)
                    .focused($isPasswordFocused)
            }
            
            Button(action: {
                isPasswordVisible.toggle()
            }) {
                ZStack {
                    RoundedRectangle(cornerRadius: Constants.Layout.mediumCornerRadius)
                        .fill(Constants.Colors.darkBackground)
                        .frame(width: 30, height: 30)
                    
                    Image(isPasswordVisible ? "EyeClosed" : "Eye")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 24, height: 24)
                }
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: Constants.Layout.smallCornerRadius)
                .stroke(Constants.Colors.borderGray, lineWidth: 1)
        )
    }
}
