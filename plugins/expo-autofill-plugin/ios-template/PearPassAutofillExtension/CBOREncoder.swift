//
//  CBOREncoder.swift
//  PearPassAutoFillExtension
//
//  Minimal CBOR encoder for WebAuthn authenticator data
//  Implements only the subset needed for passkey operations
//  Compatible with browser extension's CBOR encoding
//

import Foundation

/// Minimal CBOR encoder for WebAuthn authenticator data
struct CBOREncoder {

    // MARK: - CBOR Major Types
    // Major type 0: Unsigned integer (0x00-0x1B)
    // Major type 1: Negative integer (0x20-0x3B)
    // Major type 2: Byte string (0x40-0x5B)
    // Major type 3: Text string (0x60-0x7B)
    // Major type 4: Array (0x80-0x9B)
    // Major type 5: Map (0xA0-0xBB)

    // MARK: - Map Encoding

    /// Start a CBOR map with given number of items
    /// - Parameter count: Number of key-value pairs in the map
    /// - Returns: CBOR bytes for map header
    static func startMap(count: Int) -> Data {
        if count <= 23 {
            return Data([0xA0 | UInt8(count)])
        } else if count <= 255 {
            return Data([0xB8, UInt8(count)])
        } else {
            var data = Data([0xB9])
            data.append(contentsOf: withUnsafeBytes(of: UInt16(count).bigEndian) { Array($0) })
            return data
        }
    }

    // MARK: - Integer Encoding

    /// Encode an integer (positive or negative)
    /// - Parameter value: Integer value to encode
    /// - Returns: CBOR encoded bytes
    static func encodeInt(_ value: Int) -> Data {
        if value < 0 {
            return encodeNegInt(-1 - value)
        }
        return encodeUInt(value)
    }

    /// Encode unsigned integer (CBOR major type 0)
    /// - Parameter value: Non-negative integer value
    /// - Returns: CBOR encoded bytes
    static func encodeUInt(_ value: Int) -> Data {
        precondition(value >= 0, "Use encodeNegInt for negative values")

        if value <= 23 {
            return Data([UInt8(value)])
        } else if value <= 255 {
            return Data([0x18, UInt8(value)])
        } else if value <= 65535 {
            var data = Data([0x19])
            data.append(contentsOf: withUnsafeBytes(of: UInt16(value).bigEndian) { Array($0) })
            return data
        } else {
            var data = Data([0x1A])
            data.append(contentsOf: withUnsafeBytes(of: UInt32(value).bigEndian) { Array($0) })
            return data
        }
    }

    /// Encode negative integer (CBOR major type 1)
    /// The value parameter is the absolute value minus one: -1 -> 0, -2 -> 1, etc.
    /// - Parameter value: The encoded negative value (-1 - n)
    /// - Returns: CBOR encoded bytes
    static func encodeNegInt(_ value: Int) -> Data {
        precondition(value >= 0, "Value should be -1 - n, so pass a non-negative number")

        if value <= 23 {
            return Data([0x20 | UInt8(value)])
        } else if value <= 255 {
            return Data([0x38, UInt8(value)])
        } else if value <= 65535 {
            var data = Data([0x39])
            data.append(contentsOf: withUnsafeBytes(of: UInt16(value).bigEndian) { Array($0) })
            return data
        } else {
            var data = Data([0x3A])
            data.append(contentsOf: withUnsafeBytes(of: UInt32(value).bigEndian) { Array($0) })
            return data
        }
    }

    // MARK: - Byte String Encoding

    /// Encode byte string (CBOR major type 2)
    /// - Parameter data: Bytes to encode
    /// - Returns: CBOR encoded bytes with length prefix
    static func encodeBytes(_ data: Data) -> Data {
        var result: Data
        let count = data.count

        if count <= 23 {
            result = Data([0x40 | UInt8(count)])
        } else if count <= 255 {
            result = Data([0x58, UInt8(count)])
        } else if count <= 65535 {
            result = Data([0x59])
            result.append(contentsOf: withUnsafeBytes(of: UInt16(count).bigEndian) { Array($0) })
        } else {
            result = Data([0x5A])
            result.append(contentsOf: withUnsafeBytes(of: UInt32(count).bigEndian) { Array($0) })
        }

        result.append(data)
        return result
    }

    // MARK: - Text String Encoding

    /// Encode text string (CBOR major type 3)
    /// - Parameter string: UTF-8 string to encode
    /// - Returns: CBOR encoded bytes with length prefix
    static func encodeText(_ string: String) -> Data {
        let utf8Data = Data(string.utf8)
        var result: Data
        let count = utf8Data.count

        if count <= 23 {
            result = Data([0x60 | UInt8(count)])
        } else if count <= 255 {
            result = Data([0x78, UInt8(count)])
        } else if count <= 65535 {
            result = Data([0x79])
            result.append(contentsOf: withUnsafeBytes(of: UInt16(count).bigEndian) { Array($0) })
        } else {
            result = Data([0x7A])
            result.append(contentsOf: withUnsafeBytes(of: UInt32(count).bigEndian) { Array($0) })
        }

        result.append(utf8Data)
        return result
    }

    // MARK: - Array Encoding

    /// Start a CBOR array with given number of items
    /// - Parameter count: Number of items in the array
    /// - Returns: CBOR bytes for array header
    static func startArray(count: Int) -> Data {
        if count <= 23 {
            return Data([0x80 | UInt8(count)])
        } else if count <= 255 {
            return Data([0x98, UInt8(count)])
        } else {
            var data = Data([0x99])
            data.append(contentsOf: withUnsafeBytes(of: UInt16(count).bigEndian) { Array($0) })
            return data
        }
    }
}
