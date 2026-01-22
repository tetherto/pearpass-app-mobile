import Foundation

// Import Vault model from Models.swift - we'll need to ensure this is accessible

@objc class PearPassVaultClient: NSObject {
    
    // MARK: - API Commands
    
    private enum API: Int {
        case STORAGE_PATH_SET = 1
        case MASTER_VAULT_INIT = 2
        case MASTER_VAULT_GET_STATUS = 3
        case MASTER_VAULT_GET = 4
        case MASTER_VAULT_CLOSE = 5
        case MASTER_VAULT_ADD = 6
        case MASTER_VAULT_LIST = 7
        case ACTIVE_VAULT_FILE_ADD = 8
        case ACTIVE_VAULT_FILE_REMOVE = 9
        case ACTIVE_VAULT_FILE_GET = 10
        case ACTIVE_VAULT_INIT = 11
        case ACTIVE_VAULT_GET_STATUS = 12
        case ACTIVE_VAULT_CLOSE = 13
        case ACTIVE_VAULT_ADD = 14
        case ACTIVE_VAULT_REMOVE = 15
        case ACTIVE_VAULT_LIST = 16
        case ACTIVE_VAULT_GET = 17
        case ACTIVE_VAULT_CREATE_INVITE = 18
        case ACTIVE_VAULT_DELETE_INVITE = 19
        case PAIR_ACTIVE_VAULT = 20
        case INIT_LISTENER = 21
        case ON_UPDATE = 22
        case ENCRYPTION_INIT = 23
        case ENCRYPTION_GET_STATUS = 24
        case ENCRYPTION_GET = 25
        case ENCRYPTION_ADD = 26
        case ENCRYPTION_CLOSE = 27
        case ENCRYPTION_HASH_PASSWORD = 28
        case ENCRYPTION_ENCRYPT_VAULT_KEY_WITH_HASHED_PASSWORD = 29
        case ENCRYPTION_ENCRYPT_VAULT_WITH_KEY = 30
        case ENCRYPTION_DECRYPT_VAULT_KEY = 31
        case ENCRYPTION_GET_DECRYPTION_KEY = 32
        case CLOSE = 33
        case CANCEL_PAIR_ACTIVE_VAULT = 34
        case MASTER_PASSWORD_CREATE = 43
        case MASTER_PASSWORD_INIT_WITH_PASSWORD = 44
        case MASTER_PASSWORD_UPDATE = 45
        case MASTER_PASSWORD_INIT_WITH_CREDENTIALS = 46
    }
    
    // MARK: - Properties
    
    private var debugMode: Bool = false
    private var storagePath: String?
    private var bareHelper: BareHelper?
    private var isWorkletInitialized: Bool = false
    private var initializationTask: Task<Void, Error>?
    
    // MARK: - Types
    
    struct VaultStatus {
        let isInitialized: Bool
        let isLocked: Bool
        let id: String?
    }
    
    
    
    struct EncryptionStatus {
        let status: Bool
        let hasKey: Bool
    }
    
    struct DecryptionKeyResult {
        let key: String
        let salt: String
    }
    
    struct MasterPasswordEncryption {
        let ciphertext: String
        let nonce: String
        let salt: String
        let hashedPassword: String?
    }
    
    // MARK: - Initialization
    
    init(storagePath: String? = nil, debugMode: Bool = false) {
        self.debugMode = debugMode
        self.storagePath = storagePath
        super.init()
        
        // Get the storage path using the utility function
        guard let pathToUse = Utils.getVaultStoragePath(customPath: storagePath) else {
            logError("Failed to determine storage path")
            return
        }
        
        // Store the initialization task so we can await it later
        self.initializationTask = Task {
            do {
                // First initialize the worklet
                try await initializeWorklet()
                
                // Then set the storage path
                try await setStoragePath(pathToUse)
                
                log("Vault client fully initialized")
            } catch {
                logError("Failed to initialize: \(error.localizedDescription)")
                throw error
            }
        }
    }
    
    /// Ensures the vault client is fully initialized before use
    func waitForInitialization() async throws {
        guard let task = initializationTask else {
            throw PearPassVaultError.notInitialized
        }
        try await task.value
    }
    
    private func initializeWorklet() async throws {
        guard bareHelper == nil else { 
            log("Worklet already initialized")
            return 
        }
        
        log("Starting BareKit initialization with BareHelper")
        
        // Create BareHelper with bundle name, type, and 64MB memory limit
        let helper = BareHelper(bundleName: "extension", bundleType: "bundle", memoryLimit: 64)
        self.bareHelper = helper
        log("BareHelper created successfully")
        
        // Start the worklet
        log("Starting worklet...")
        
        let success = helper.startWorklet()
        
        if success {
            log("Worklet started successfully with BareHelper")
            isWorkletInitialized = true
        } else {
            logError("Failed to start worklet with BareHelper")
            isWorkletInitialized = false
            throw PearPassVaultError.notInitialized
        }
        
        log("BareKit initialization completed")
    }
    
    // MARK: - Request Handling
    
    private func sendRequest(command: Int, data: [String: Any]? = nil) async throws -> [String: Any]? {
        // Ensure worklet is initialized before sending any command
        guard let helper = bareHelper, isWorkletInitialized else {
            throw PearPassVaultError.notInitialized
        }
        
        let message: [String: Any] = data != nil ? ["command": command, "data": data!, "source": "ios-extension"] : ["command": command, "source": "ios-extension"]
        
        let jsonData = try JSONSerialization.data(withJSONObject: message, options: [])
        guard let jsonString = String(data: jsonData, encoding: .utf8) else {
            throw PearPassVaultError.unknown("Failed to create JSON string")
        }
        
        log("Sending request with command: \(command), data: \(data ?? [:])")
        
        return try await withCheckedThrowingContinuation { continuation in
            helper.send(jsonString) { reply, error in
                if let error = error {
                    continuation.resume(throwing: PearPassVaultError.unknown(error.localizedDescription))
                } else if let reply = reply,
                          let replyData = reply.data(using: .utf8),
                          let json = try? JSONSerialization.jsonObject(with: replyData) as? [String: Any] {
                    
                    // Check for errors in response
                    if let errorMsg = json["error"] as? String {
                        if errorMsg.contains("ELOCKED") {
                            continuation.resume(throwing: PearPassVaultError.locked)
                        } else {
                            continuation.resume(throwing: PearPassVaultError.unknown(errorMsg))
                        }
                    } else {
                        // The data field can be either a dictionary, string, or array
                        let data = json["data"]
                        if let dictData = data as? [String: Any] {
                            continuation.resume(returning: dictData)
                        } else if let stringData = data as? String {
                            // If it's a string, wrap it in a dictionary or return as-is
                            continuation.resume(returning: ["value": stringData] as [String: Any])
                        } else if let arrayData = data as? [[String: Any]] {
                            // If it's an array, wrap it for consistency
                            continuation.resume(returning: ["array": arrayData] as [String: Any])
                        } else {
                            continuation.resume(returning: data as? [String: Any])
                        }
                    }
                } else {
                    continuation.resume(returning: nil)
                }
            }
        }
    }
    
    // MARK: - Storage Methods
    
    /// Sets the storage path for the vault
    func setStoragePath(_ path: String) async throws {
        self.storagePath = path
        _ = try await sendRequest(command: API.STORAGE_PATH_SET.rawValue, data: ["path": path])
        log("Storage path set to: \(path)")
    }
    
    // MARK: - Master Vault Methods

    /// Initializes the vault with an encryption key and hashed password
    func vaultsInit(encryptionKey: String, hashedPassword: String) async throws {
        _ = try await sendRequest(command: API.MASTER_VAULT_INIT.rawValue, data: [
            "encryptionKey": encryptionKey,
            "hashedPassword": hashedPassword
        ])
        log("Initialized vaults with encryption key and hashed password")
    }

    /// Initializes vaults using the provided master password
    /// - Parameter password: The master password as Data
    func initWithPassword(password: Data) async throws {
        let passwordBase64 = password.base64EncodedString()
        let result = try await sendRequest(
            command: API.MASTER_PASSWORD_INIT_WITH_PASSWORD.rawValue,
            data: ["password": passwordBase64]
        )

        if let error = result?["error"] as? String {
            throw PearPassVaultError.unknown(error)
        }

        log("Initialized vaults with password")
    }

    /// Initializes vaults using provided encryption credentials (biometric auth)
    func initWithCredentials(ciphertext: String, nonce: String, hashedPassword: String) async throws {
        let result = try await sendRequest(
            command: API.MASTER_PASSWORD_INIT_WITH_CREDENTIALS.rawValue,
            data: [
                "ciphertext": ciphertext,
                "nonce": nonce,
                "hashedPassword": hashedPassword
            ]
        )

        if let error = result?["error"] as? String {
            throw PearPassVaultError.unknown(error)
        }

        log("Initialized vaults with credentials")
    }

    /// Gets the status of the vault
    func vaultsGetStatus() async throws -> VaultStatus {
        let result = try await sendRequest(command: API.MASTER_VAULT_GET_STATUS.rawValue)
        let isInitialized = result?["status"] as? Bool ?? false
        let isLocked = !(result?["status"] as? Bool ?? false) // If status is true, vault is unlocked
        let id = result?["id"] as? String
        return VaultStatus(isInitialized: isInitialized, isLocked: isLocked, id: id)
    }
    
    /// Gets a vault by its key
    func vaultsGet(key: String) async throws -> [String: Any] {
        let result = try await sendRequest(command: API.MASTER_VAULT_GET.rawValue, data: ["key": key])
        // sendRequest already extracts the "data" field, so we can return result directly
        return result ?? [:]
    }
    
    /// Closes the master vault
    func vaultsClose() async throws {
        _ = try await sendRequest(command: API.MASTER_VAULT_CLOSE.rawValue)
        log("Closed master vault")
    }
    
    /// Adds a vault
    func vaultsAdd(key: String, data: [String: Any]) async throws {
        _ = try await sendRequest(command: API.MASTER_VAULT_ADD.rawValue, data: ["key": key, "data": data])
        log("Added vault with key: \(key)")
    }
    
    /// Lists all vaults
    /// - Parameter filterKey: The key to filter vaults by
    /// - Returns: The raw result array from the API
    func vaultsList(filterKey: String) async throws -> [[String: Any]] {
        let result = try await sendRequest(
            command: API.MASTER_VAULT_LIST.rawValue, 
            data: ["filterKey": filterKey]
        )
        
        log("vaultsList raw result: \(result ?? [:])")
        
        // Check if result contains an array in a wrapped format
        if let vaultsDict = result, let arrayWrapper = vaultsDict["array"] as? [[String: Any]] {
            // Result was wrapped by sendRequest
            log("Found vaults in array wrapper: \(arrayWrapper.count) items")
            return arrayWrapper
        } else if let vaultsDict = result, let vaults = vaultsDict["vaults"] as? [[String: Any]] {
            // Standard vaults response
            log("Found vaults in vaults key: \(vaults.count) items")
            return vaults
        } else if let vaultsDict = result, let data = vaultsDict["data"] as? [[String: Any]] {
            // Vaults response under 'data' key
            log("Found vaults in data key: \(data.count) items")
            return data
        } else if let directArray = result as? [[String: Any]] {
            // Direct array response (shouldn't happen with current sendRequest)
            log("Found direct array response: \(directArray.count) items")
            return directArray
        }
        
        log("No vaults found in response")
        return []
    }
    
    /// Helper method to list vaults with the default filter
    func listVaults() async throws -> [Vault] {
        let vaults = try await vaultsList(filterKey: "vault/")
        
        log("Raw vaults response: \(vaults)")
        log("Number of vaults received: \(vaults.count)")
        
        // Convert the raw vault data to Vault structs
        let vaultList: [Vault] = vaults.compactMap { vaultDict -> Vault? in
            guard let id = vaultDict["id"] as? String,
                  let name = vaultDict["name"] as? String else {
                log("Skipping vault with missing id or name: \(vaultDict)")
                return nil
            }
            
            // Extract all fields from vault data
            let version = vaultDict["version"] as? Int ?? 1
            let records = vaultDict["records"] as? [[String: Any]] ?? []
            let devices = vaultDict["devices"] as? [[String: Any]] ?? []
            
            // Log detailed vault parsing info
            log("Vault \(name) parsing details:")
            log("  - Records count: \(records.count)")
            log("  - Devices count: \(devices.count)")
            log("  - Version: \(version)")
            if !records.isEmpty {
                log("  - Sample records: \(records.prefix(2))")
            }
            
            // Parse timestamps (they come as milliseconds, need to convert to seconds)
            let createdAt: Date
            if let timestamp = vaultDict["createdAt"] as? TimeInterval {
                createdAt = Date(timeIntervalSince1970: timestamp / 1000.0) // Convert from milliseconds
            } else if let timestamp = vaultDict["createdAt"] as? Int {
                createdAt = Date(timeIntervalSince1970: TimeInterval(timestamp) / 1000.0)
            } else {
                log("Warning - createdAt field not found for vault \(id)")
                createdAt = Date()
            }
            
            let updatedAt: Date
            if let timestamp = vaultDict["updatedAt"] as? TimeInterval {
                updatedAt = Date(timeIntervalSince1970: timestamp / 1000.0) // Convert from milliseconds
            } else if let timestamp = vaultDict["updatedAt"] as? Int {
                updatedAt = Date(timeIntervalSince1970: TimeInterval(timestamp) / 1000.0)
            } else {
                updatedAt = createdAt // Default to createdAt if updatedAt is missing
            }
            
            // Parse encryption data if present
            let encryption: Vault.VaultEncryption?
            if let encryptionData = vaultDict["encryption"] as? [String: Any],
               let ciphertext = encryptionData["ciphertext"] as? String,
               let nonce = encryptionData["nonce"] as? String {
                let hashedPassword = encryptionData["hashedPassword"] as? String
                let salt = encryptionData["salt"] as? String
                encryption = Vault.VaultEncryption(
                    ciphertext: ciphertext, 
                    nonce: nonce,
                    hashedPassword: hashedPassword,
                    salt: salt
                )
            } else {
                encryption = nil
            }
            
            log("Vault \(name) parsed successfully")
            return Vault(
                id: id,
                name: name,
                version: version,
                records: records,
                devices: devices,
                createdAt: createdAt,
                updatedAt: updatedAt,
                encryption: encryption
            )
        }
        
        log("Successfully parsed \(vaultList.count) vaults")
        return vaultList
    }
    
    /// Check if the vault is protected with encryption
    /// - Parameter vaultId: The ID of the vault to check
    /// - Parameter savedVaults: Optional list of already loaded vaults to avoid re-fetching
    /// - Returns: Boolean indicating if the vault has proper encryption
    func checkVaultIsProtected(vaultId: String, savedVaults: [Vault]? = nil) async throws -> Bool {
        let vaults: [Vault]
        
        // Use saved vaults if provided, otherwise fetch them
        if let savedVaults = savedVaults, !savedVaults.isEmpty {
            vaults = savedVaults
            log("Using saved vaults list (\(savedVaults.count) vaults)")
        } else {
            vaults = try await listVaults()
            log("Fetched vaults list (\(vaults.count) vaults)")
        }
        
        // Find the vault by ID
        guard let vault = vaults.first(where: { $0.id == vaultId }) else {
            throw PearPassVaultError.unknown("Vault not found")
        }
        
        // Check if vault has encryption data
        guard let encryption = vault.encryption else {
            log("Vault \(vaultId) has no encryption data")
            return false
        }
        
        // Check if all required fields are present and non-empty (matching JavaScript version)
        let isProtected = !encryption.ciphertext.isEmpty && 
                         !encryption.nonce.isEmpty &&
                         !(encryption.hashedPassword?.isEmpty ?? true) &&
                         !(encryption.salt?.isEmpty ?? true)
        
        log("Vault \(vaultId) protection status: \(isProtected)")
        return isProtected
    }
    
    /// Get the decrypted encryption key for a vault
    /// This follows the RN app pattern: get master encryption → decrypt vault key
    private func getVaultEncryptionKey(vault: Vault) async throws -> String {
        log("Getting encryption key for vault: \(vault.name)")
        
        // Get the master encryption data directly from vault storage (not masterPassword encryption)
        let masterEncryptionData = try await vaultsGet(key: "masterEncryption")
        
        log("Master encryption data: \(masterEncryptionData)")
        log("Available keys: \(Array(masterEncryptionData.keys))")
        
        guard let hashedPassword = masterEncryptionData["hashedPassword"] as? String else {
            log("Failed to find hashedPassword in master encryption data")
            throw PearPassVaultError.unknown("No hashed password available in master encryption")
        }
        
        guard let vaultEncryption = vault.encryption else {
            throw PearPassVaultError.unknown("Vault has no encryption data")
        }
        
        log("Using hashed password from master encryption to decrypt vault key")
        
        let decryptedKeyResult = try await decryptVaultKey(
            ciphertext: vaultEncryption.ciphertext,
            nonce: vaultEncryption.nonce,
            hashedPassword: hashedPassword
        )
        
        // Extract the decrypted key from the result
        guard let decryptedKey = decryptedKeyResult?["value"] as? String ?? 
                                decryptedKeyResult?["key"] as? String ?? 
                                decryptedKeyResult?["data"] as? String else {
            throw PearPassVaultError.decryptionFailed
        }
        
        log("Successfully decrypted vault encryption key")
        return decryptedKey
    }
    
    // MARK: - Active Vault Methods
    
    /// Initializes the active vault
    func activeVaultInit(id: String, encryptionKey: String) async throws -> [String: Any] {
        log("Initializing active vault with id: \(id)")
        let result = try await sendRequest(
            command: API.ACTIVE_VAULT_INIT.rawValue,
            data: ["id": id, "encryptionKey": encryptionKey]
        )
        return result ?? ["success": true]
    }
    
    /// Gets the status of the active vault
    func activeVaultGetStatus() async throws -> VaultStatus {
        log("Getting active vault status")
        let result = try await sendRequest(command: API.ACTIVE_VAULT_GET_STATUS.rawValue)
        
        // Parse the response similar to vaultsGetStatus
        let isInitialized = result?["status"] as? Bool ?? false
        let isLocked = !(result?["status"] as? Bool ?? false) // If status is true, vault is unlocked
        let id = result?["id"] as? String
        
        log("Active vault status: initialized=\(isInitialized), locked=\(isLocked), id=\(id ?? "none")")
        return VaultStatus(isInitialized: isInitialized, isLocked: isLocked, id: id)
    }
    
    /// Closes the active vault
    func activeVaultClose() async throws -> [String: Any] {
        log("Closing active vault")
        let result = try await sendRequest(command: API.ACTIVE_VAULT_CLOSE.rawValue)
        return result ?? ["success": true]
    }
    
    
    /// Lists all records in the active vault
    func activeVaultList(filterKey: String? = nil) async throws -> [[String: Any]] {
        let filter = filterKey ?? "record/"
        log("Listing active vault records with filter: \(filter)")
        
        let result = try await sendRequest(
            command: API.ACTIVE_VAULT_LIST.rawValue,
            data: ["filterKey": filter]
        )
        
        // Parse the response similar to vaultsList
        if let resultDict = result, let arrayWrapper = resultDict["array"] as? [[String: Any]] {
            log("Found \(arrayWrapper.count) records in active vault")
            return arrayWrapper
        } else if let resultDict = result, let data = resultDict["data"] as? [[String: Any]] {
            log("Found \(data.count) records in active vault")
            return data
        } else if let directArray = result as? [[String: Any]] {
            log("Found \(directArray.count) records in active vault")
            return directArray
        }
        
        log("No records found in active vault")
        return []
    }
    
    /// Initialize active vault and fetch records for a specific vault
    /// This follows the RN app pattern for getting vault records
    func initializeVaultAndFetchRecords(vault: Vault) async throws -> [[String: Any]] {
        log("Initializing vault \(vault.name) and fetching records")
        
        // Step 1: Get the vault's encryption key
        let encryptionKey = try await getVaultEncryptionKey(vault: vault)
        
        // Step 2: Initialize the active vault
        _ = try await activeVaultInit(id: vault.id, encryptionKey: encryptionKey)
        
        // Step 3: Fetch records from the active vault
        let records = try await activeVaultList(filterKey: "record/")
        
        log("Successfully fetched \(records.count) records from vault \(vault.name)")
        return records
    }
    
    /// Gets a vault by ID with optional password for protected vaults
    /// This follows the JavaScript getVaultById implementation
    func getVaultById(vaultId: String, password: String? = nil, ciphertext: String? = nil, nonce: String? = nil, hashedPassword: String? = nil) async throws -> [String: Any] {
        log("Getting vault by ID: \(vaultId)")
        
        // Check if vault exists in the list
        let vaults = try await listVaults()
        guard vaults.first(where: { $0.id == vaultId }) != nil else {
            throw PearPassVaultError.unknown("Vault not found")
        }
        
        // Check if active vault is already open and matches the requested vault
        let activeStatus = try await activeVaultGetStatus()
        if activeStatus.isInitialized && !activeStatus.isLocked {
            let currentVault = try await activeVaultGet(key: "vault")
            if let currentVaultId = currentVault["id"] as? String, currentVaultId == vaultId {
                log("Vault \(vaultId) is already active, returning current vault")
                return currentVault
            } else {
                // Close active vault if it's a different one
                log("Closing active vault to switch to \(vaultId)")
                _ = try await activeVaultClose()
            }
        }
        
        var encryptionKey: String
        
        // Get vault encryption info
        let vaultEncryption = try await getVaultEncryption(vaultId: vaultId)
        
        if let ciphertext = ciphertext, let nonce = nonce, let hashedPassword = hashedPassword {
            // Use provided encryption parameters
            log("Using provided encryption parameters to decrypt vault key")
            let decryptionResult = try await decryptVaultKey(
                ciphertext: ciphertext,
                nonce: nonce,
                hashedPassword: hashedPassword
            )
            
            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key
            
        } else if let password = password, !password.isEmpty {
            // Use provided password to decrypt
            log("Using provided password to decrypt vault key")
            guard let salt = vaultEncryption["salt"] as? String else {
                throw PearPassVaultError.unknown("Vault encryption missing salt for password decryption")
            }
            
            let decryptionKeyResult = try await getDecryptionKey(salt: salt, password: password)
            let decryptionResult = try await decryptVaultKey(
                ciphertext: vaultEncryption["ciphertext"] as? String ?? "",
                nonce: vaultEncryption["nonce"] as? String ?? "",
                hashedPassword: decryptionKeyResult.key
            )
            
            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key
            
        } else {
            // Use master encryption to decrypt
            log("Using master encryption to decrypt vault key")
            let masterEncryptionData = try await vaultsGet(key: "masterEncryption")
            guard let masterHashedPassword = masterEncryptionData["hashedPassword"] as? String else {
                throw PearPassVaultError.unknown("No hashed password available in master encryption")
            }
            
            let decryptionResult = try await decryptVaultKey(
                ciphertext: vaultEncryption["ciphertext"] as? String ?? "",
                nonce: vaultEncryption["nonce"] as? String ?? "",
                hashedPassword: masterHashedPassword
            )
            
            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key
        }
        
        // Initialize active vault with the decrypted key
        log("Initializing active vault \(vaultId) with decrypted key")
        _ = try await activeVaultInit(id: vaultId, encryptionKey: encryptionKey)

        // Just return a success indicator since activeVaultGet has command mapping issues
        log("Successfully initialized active vault \(vaultId)")
        return ["success": true, "id": vaultId]
    }

    /// Gets a vault by ID with optional password as Data buffer for protected vaults
    /// This follows the JavaScript getVaultById implementation with secure buffer handling
    func getVaultById(vaultId: String, password: Data, ciphertext: String? = nil, nonce: String? = nil, hashedPassword: String? = nil) async throws -> [String: Any] {
        log("Getting vault by ID: \(vaultId) (buffer)")

        // Check if vault exists in the list
        let vaults = try await listVaults()
        guard vaults.first(where: { $0.id == vaultId }) != nil else {
            throw PearPassVaultError.unknown("Vault not found")
        }

        // Check if active vault is already open and matches the requested vault
        let activeStatus = try await activeVaultGetStatus()
        if activeStatus.isInitialized && !activeStatus.isLocked {
            let currentVault = try await activeVaultGet(key: "vault")
            if let currentVaultId = currentVault["id"] as? String, currentVaultId == vaultId {
                log("Vault \(vaultId) is already active, returning current vault")
                return currentVault
            } else {
                // Close active vault if it's a different one
                log("Closing active vault to switch to \(vaultId)")
                _ = try await activeVaultClose()
            }
        }

        var encryptionKey: String

        // Get vault encryption info
        let vaultEncryption = try await getVaultEncryption(vaultId: vaultId)

        if let ciphertext = ciphertext, let nonce = nonce, let hashedPassword = hashedPassword {
            // Use provided encryption parameters
            log("Using provided encryption parameters to decrypt vault key")
            let decryptionResult = try await decryptVaultKey(
                ciphertext: ciphertext,
                nonce: nonce,
                hashedPassword: hashedPassword
            )

            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key

        } else if !password.isEmpty {
            // Use provided password Data buffer to decrypt
            log("Using provided password (buffer) to decrypt vault key")
            guard let salt = vaultEncryption["salt"] as? String else {
                throw PearPassVaultError.unknown("Vault encryption missing salt for password decryption")
            }

            // Use Data-based getDecryptionKey
            let decryptionKeyResult = try await getDecryptionKey(salt: salt, password: password)
            let decryptionResult = try await decryptVaultKey(
                ciphertext: vaultEncryption["ciphertext"] as? String ?? "",
                nonce: vaultEncryption["nonce"] as? String ?? "",
                hashedPassword: decryptionKeyResult.key
            )

            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key

        } else {
            // Use master encryption to decrypt
            log("Using master encryption to decrypt vault key")
            let masterEncryptionData = try await vaultsGet(key: "masterEncryption")
            guard let masterHashedPassword = masterEncryptionData["hashedPassword"] as? String else {
                throw PearPassVaultError.unknown("No hashed password available in master encryption")
            }

            let decryptionResult = try await decryptVaultKey(
                ciphertext: vaultEncryption["ciphertext"] as? String ?? "",
                nonce: vaultEncryption["nonce"] as? String ?? "",
                hashedPassword: masterHashedPassword
            )

            guard let key = decryptionResult?["value"] as? String ??
                           decryptionResult?["key"] as? String ??
                           decryptionResult?["data"] as? String else {
                throw PearPassVaultError.decryptionFailed
            }
            encryptionKey = key
        }

        // Initialize active vault with the decrypted key
        log("Initializing active vault \(vaultId) with decrypted key (buffer)")
        _ = try await activeVaultInit(id: vaultId, encryptionKey: encryptionKey)

        // Just return a success indicator since activeVaultGet has command mapping issues
        log("Successfully initialized active vault \(vaultId)")
        return ["success": true, "id": vaultId]
    }

    /// Helper method to get vault encryption data by vault ID
    private func getVaultEncryption(vaultId: String) async throws -> [String: Any] {
        log("Getting vault encryption for vault ID: \(vaultId)")
        
        let vaults = try await listVaults()
        guard let vault = vaults.first(where: { $0.id == vaultId }) else {
            throw PearPassVaultError.unknown("Vault not found")
        }
        
        guard let encryption = vault.encryption else {
            throw PearPassVaultError.unknown("Vault has no encryption data")
        }
        
        var encryptionData: [String: Any] = [
            "ciphertext": encryption.ciphertext,
            "nonce": encryption.nonce
        ]
        
        if let hashedPassword = encryption.hashedPassword {
            encryptionData["hashedPassword"] = hashedPassword
        }
        
        if let salt = encryption.salt {
            encryptionData["salt"] = salt
        }
        
        return encryptionData
    }
    
    /// Gets a record from the active vault
    func activeVaultGet(key: String) async throws -> [String: Any] {
        log("Getting from active vault with key: \(key)")
        let result = try await sendRequest(command: 13, data: ["key": key])
        log("Active vault get result for key '\(key)': \(result ?? [:])")

        return result ?? [:]
        }
    // MARK: - File Methods
    
    
    // MARK: - Invite Methods
    
    
    // MARK: - Pairing Methods
    
    
    // MARK: - Listener Methods
    
    
    // MARK: - Encryption Methods
    
    /// Initializes the encryption for the active vault
    func encryptionInit() async throws -> [String: Any]? {
        let result = try await sendRequest(command: API.ENCRYPTION_INIT.rawValue)
        log("Encryption init result: \(String(describing: result))")
        return result
    }
    
    /// Gets the status of the encryption
    func encryptionGetStatus() async throws -> EncryptionStatus {
        let result = try await sendRequest(command: API.ENCRYPTION_GET_STATUS.rawValue)
        // The response contains a 'status' field that indicates if encryption is initialized
        let status = result?["status"] as? Bool ?? false
        let hasKey = result?["hasKey"] as? Bool ?? false
        return EncryptionStatus(status: status, hasKey: hasKey)
    }
    
    /// Gets the encryption data for a specific key
    func encryptionGet(key: String) async throws -> [String: Any]? {
        let result = try await sendRequest(command: API.ENCRYPTION_GET.rawValue, data: ["key": key])
        return result
    }
    
    /// Gets the master password encryption, initializing if necessary
    /// Pass vaultStatus if already retrieved to avoid duplicate calls
    func getMasterPasswordEncryption(vaultStatus: VaultStatus? = nil) async throws -> MasterPasswordEncryption? {
        // First, try to get existing master encryption (pass vault status if we have it)
        if let masterEncryption = try? await getMasterEncryption(vaultStatus: vaultStatus) {
            return masterEncryption
        }
        
        // Check encryption status
        let statusRes = try await encryptionGetStatus()
        
        // Initialize encryption if not initialized (status field indicates initialization state)
        if !statusRes.status {
            _ = try await encryptionInit()
        }
        
        // Get and return the master password encryption directly
        guard let encryptionData = try await encryptionGet(key: "masterPassword") else {
            return nil
        }
        
        // Parse the response into MasterPasswordEncryption struct if we have the required fields
        guard let ciphertext = encryptionData["ciphertext"] as? String,
              let nonce = encryptionData["nonce"] as? String,
              let salt = encryptionData["salt"] as? String else {
            return nil
        }
        
        let hashedPassword = encryptionData["hashedPassword"] as? String
        
        return MasterPasswordEncryption(
            ciphertext: ciphertext,
            nonce: nonce,
            salt: salt,
            hashedPassword: hashedPassword
        )
    }
    
    /// Helper function to get master encryption if it exists
    private func getMasterEncryption(vaultStatus: VaultStatus? = nil) async throws -> MasterPasswordEncryption? {
        // Use provided vault status or fetch it
        let res: VaultStatus
        if let vaultStatus = vaultStatus {
            res = vaultStatus
        } else {
            res = try await vaultsGetStatus()
        }
        
        // If vault is initialized and not locked, get the master encryption
        if res.isInitialized && !res.isLocked {
            let data = try await vaultsGet(key: "masterEncryption")
            
            // Extract encryption data from the vault data
            if let ciphertext = data["ciphertext"] as? String,
               let nonce = data["nonce"] as? String,
               let salt = data["salt"] as? String {
                
                let hashedPassword = data["hashedPassword"] as? String
                
                return MasterPasswordEncryption(
                    ciphertext: ciphertext,
                    nonce: nonce,
                    salt: salt,
                    hashedPassword: hashedPassword
                )
            }
        }
        
        return nil
    }
    
    
    /// Hashes a password (String version - deprecated, use Data version)
    /// - Parameter password: The password to hash
    /// - Returns: The hashed password
    func hashPassword(_ password: String) async throws -> String {
        let result = try await sendRequest(
            command: API.ENCRYPTION_HASH_PASSWORD.rawValue,
            data: ["password": password]
        )

        // Extract the hashed password from the result
        guard let hashedPassword = result?["hashedPassword"] as? String else {
            throw PearPassVaultError.encryptionFailed
        }

        log("Successfully hashed password")
        return hashedPassword
    }

    /// Hashes a password using secure Data buffer
    /// - Parameter password: The password as Data buffer (will be converted to Base64 for transmission)
    /// - Returns: The hashed password
    func hashPassword(_ password: Data) async throws -> String {
        // Convert password Data to Base64 for transmission (matching JS pattern)
        let passwordBase64 = password.base64EncodedString()

        let result = try await sendRequest(
            command: API.ENCRYPTION_HASH_PASSWORD.rawValue,
            data: ["password": passwordBase64]
        )

        // Extract the hashed password from the result
        guard let hashedPassword = result?["hashedPassword"] as? String else {
            throw PearPassVaultError.encryptionFailed
        }

        log("Successfully hashed password (buffer)")
        return hashedPassword
    }
    
    
    /// Gets the decryption key (String version - deprecated, use Data version)
    /// - Parameters:
    ///   - salt: The salt to use for key derivation
    ///   - password: The password to use for key derivation
    /// - Returns: The decryption key result containing the derived key and salt
    func getDecryptionKey(salt: String, password: String) async throws -> DecryptionKeyResult {
        let result = try await sendRequest(
            command: API.ENCRYPTION_GET_DECRYPTION_KEY.rawValue,
            data: [
                "salt": salt,
                "password": password
            ]
        )

        // The API returns the key directly as a string in the data field
        // Since sendRequest wraps strings in a "value" key, check for that first
        var key: String?

        if let resultDict = result {
            // Check for wrapped string value
            if let wrappedValue = resultDict["value"] as? String {
                key = wrappedValue
            } else if let directKey = resultDict["key"] as? String {
                key = directKey
            } else if let hashedPassword = resultDict["hashedPassword"] as? String {
                key = hashedPassword
            }
        }

        guard let derivedKey = key else {
            logError("Failed to extract key from getDecryptionKey response: \(String(describing: result))")
            throw PearPassVaultError.decryptionFailed
        }

        log("Successfully generated decryption key")
        return DecryptionKeyResult(key: derivedKey, salt: salt)
    }

    /// Gets the decryption key using secure Data buffer for password
    /// - Parameters:
    ///   - salt: The salt to use for key derivation
    ///   - password: The password as Data buffer (will be converted to Base64 for transmission)
    /// - Returns: The decryption key result containing the derived key and salt
    func getDecryptionKey(salt: String, password: Data) async throws -> DecryptionKeyResult {
        // Convert password Data to Base64 for transmission (matching JS pattern)
        let passwordBase64 = password.base64EncodedString()

        let result = try await sendRequest(
            command: API.ENCRYPTION_GET_DECRYPTION_KEY.rawValue,
            data: [
                "salt": salt,
                "password": passwordBase64
            ]
        )

        // The API returns the key directly as a string in the data field
        // Since sendRequest wraps strings in a "value" key, check for that first
        var key: String?

        if let resultDict = result {
            // Check for wrapped string value
            if let wrappedValue = resultDict["value"] as? String {
                key = wrappedValue
            } else if let directKey = resultDict["key"] as? String {
                key = directKey
            } else if let hashedPassword = resultDict["hashedPassword"] as? String {
                key = hashedPassword
            }
        }

        guard let derivedKey = key else {
            logError("Failed to extract key from getDecryptionKey response: \(String(describing: result))")
            throw PearPassVaultError.decryptionFailed
        }

        log("Successfully generated decryption key (buffer)")
        return DecryptionKeyResult(key: derivedKey, salt: salt)
    }
    
    /// Decrypts the vault key
    /// - Parameters:
    ///   - ciphertext: The ciphertext to decrypt
    ///   - nonce: The nonce to use for decryption
    ///   - hashedPassword: The hashed password to use for decryption
    /// - Returns: The result dictionary from the decryption operation
    func decryptVaultKey(ciphertext: String, nonce: String, hashedPassword: String) async throws -> [String: Any]? {
        let result = try await sendRequest(
            command: API.ENCRYPTION_DECRYPT_VAULT_KEY.rawValue,
            data: [
                "ciphertext": ciphertext,
                "nonce": nonce,
                "hashedPassword": hashedPassword
            ]
        )
        
        log("Decrypted vault key")
        return result
    }
    
    /// Closes the encryption
    func encryptionClose() async throws -> [String: Any] {
        log("Closing encryption")
        let result = try await sendRequest(command: API.ENCRYPTION_CLOSE.rawValue)
        return result ?? ["success": true]
    }
    
    // MARK: - General Methods
    
    /// Closes the vault client and cleans up resources
    /// Similar to Android's closeAllInstances() method
    func close() async throws -> [String: Any] {
        log("Closing vault client and cleaning up resources")

        // If worklet is not initialized, nothing to clean up
        guard bareHelper != nil, isWorkletInitialized else {
            log("Worklet not initialized, nothing to clean up")
            return ["success": true]
        }

        // Store reference to helper before clearing it
        let helperToShutdown = bareHelper
        bareHelper = nil  // Immediately clear reference to prevent reuse
        isWorkletInitialized = false

        // Close active vault if open (best effort)
        do {
            _ = try await activeVaultClose()
        } catch {
            logError("Failed to close active vault: \(error.localizedDescription)")
        }

        // Close master vault if open (best effort)
        do {
            _ = try await vaultsClose()
        } catch {
            logError("Failed to close master vault: \(error.localizedDescription)")
        }

        // Close encryption if initialized (best effort)
        do {
            _ = try await encryptionClose()
        } catch {
            logError("Failed to close encryption: \(error.localizedDescription)")
        }

        // Try to send close command as best effort
        do {
            guard let helper = helperToShutdown else {
                log("Helper reference is nil, skipping close command")
                return ["success": true]
            }

            // Send close command to worklet
            _ = try await sendRequestToHelper(helper: helper, command: API.CLOSE.rawValue)
            log("Close command sent successfully")
        } catch {
            logError("Failed to send close command (will shutdown anyway): \(error.localizedDescription)")
        }

        // IMMEDIATELY shutdown the worklet (like Android does)
        // This is critical - if the worklet is hung, we still need to clean up
        if let helper = helperToShutdown {
            helper.shutdown()
            log("Worklet shutdown completed")
        }

        log("Vault client cleanup completed")
        return ["success": true]
    }

    /// Helper method to send request to a specific BareHelper instance
    /// Used during cleanup when bareHelper property is already nil
    private func sendRequestToHelper(helper: BareHelper, command: Int, data: [String: Any]? = nil) async throws -> [String: Any]? {
        let requestId = UUID().uuidString
        let timestamp = Date().timeIntervalSince1970

        var message: [String: Any] = [
            "id": requestId,
            "command": command,
            "timestamp": timestamp
        ]

        if let data = data {
            message["data"] = data
        }

        return try await withCheckedThrowingContinuation { continuation in
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: message)
                guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                    throw PearPassVaultError.unknown("Failed to serialize message")
                }

                helper.send(jsonString) { responseString, error in
                    if let error = error {
                        continuation.resume(throwing: error)
                        return
                    }

                    guard let responseString = responseString,
                          let responseData = responseString.data(using: .utf8),
                          let response = try? JSONSerialization.jsonObject(with: responseData) as? [String: Any] else {
                        continuation.resume(throwing: PearPassVaultError.unknown("Invalid response"))
                        return
                    }

                    continuation.resume(returning: response)
                }
            } catch {
                continuation.resume(throwing: error)
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func log(_ message: String) {
        if debugMode {
            print("[PearPassVaultClient] \(message)")
        }
    }
    
    private func logError(_ message: String) {
        print("[PearPassVaultClient ERROR] \(message)")
    }
}

// MARK: - Error Types

enum PearPassVaultError: LocalizedError {
    case locked
    case notInitialized
    case invalidKey
    case encryptionFailed
    case decryptionFailed
    case unknown(String)
    
    var errorDescription: String? {
        switch self {
        case .locked:
            return "Vault is locked"
        case .notInitialized:
            return "Vault is not initialized"
        case .invalidKey:
            return "Invalid key provided"
        case .encryptionFailed:
            return "Encryption operation failed"
        case .decryptionFailed:
            return "Decryption operation failed"
        case .unknown(let message):
            return message
        }
    }
}
