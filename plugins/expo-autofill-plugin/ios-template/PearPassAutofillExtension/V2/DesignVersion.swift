//
//  DesignVersion.swift
//  PearPassAutoFillExtension
//
//  Runtime helper that reads PEARPASS_DESIGN_VERSION from the extension's
//  Info.plist (injected at prebuild by withIosDesignVersion plugin).
//
//  Mirrors Android's getResources().getInteger(R.integer.design_version).
//

import Foundation

enum DesignVersion {

    private static let plistKey = "PEARPASS_DESIGN_VERSION"
    private static let defaultVersion = 1

    /// Reads the build-time design version flag (1 = V1, 2 = V2).
    /// Returns the default (1) when the key is missing or malformed.
    static var current: Int {
        guard let raw = Bundle.main.object(forInfoDictionaryKey: plistKey) else {
            return defaultVersion
        }
        if let intValue = raw as? Int { return intValue }
        if let stringValue = raw as? String, let parsed = Int(stringValue) { return parsed }
        return defaultVersion
    }

    static var isV2: Bool { current == 2 }
}
