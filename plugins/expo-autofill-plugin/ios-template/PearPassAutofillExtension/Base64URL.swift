//
//  Base64URL.swift
//  PearPassAutoFillExtension
//
//  Base64URL encoding/decoding utilities for WebAuthn compatibility
//  RFC 4648 Section 5: Base 64 Encoding with URL and Filename Safe Alphabet
//

import Foundation

extension Data {
    /// Encode data to Base64URL string (RFC 4648 §5)
    /// This format is required for WebAuthn credential data
    func base64URLEncodedString() -> String {
        base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .trimmingCharacters(in: CharacterSet(charactersIn: "="))
    }

    /// Initialize from Base64URL string
    /// - Parameter string: Base64URL encoded string
    init?(base64URLEncoded string: String) {
        var base64 = string
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")

        // Add padding if needed
        let paddingLength = (4 - base64.count % 4) % 4
        base64 += String(repeating: "=", count: paddingLength)

        self.init(base64Encoded: base64)
    }
}

extension String {
    /// Decode Base64URL string to Data
    var base64URLDecodedData: Data? {
        Data(base64URLEncoded: self)
    }

    /// Encode UTF-8 string to Base64URL
    var base64URLEncodedString: String {
        Data(utf8).base64URLEncodedString()
    }
}
