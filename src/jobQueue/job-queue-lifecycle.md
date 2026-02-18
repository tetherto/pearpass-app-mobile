## Lifecycle Diagram

```mermaid
sequenceDiagram
    participant User as User
    participant Ext as Autofill Extension
    participant WkE as Extension Worklet
    participant FS as Shared Filesystem
    participant WkM as Main App Worklet
    participant App as Main App

    Note over User,App: PHASE 1 — Key Creation (one-time)

    User->>App: Set master password
    App->>WkM: hashPassword(password)
    Note over WkM: Argon2id → hashedPassword (32 bytes)
    WkM->>WkM: vaultsAdd("masterEncryption", {hashedPassword, salt, ...})
    WkM->>FS: Persist to Autobase → RocksDB

    Note over User,App: PHASE 2 — Extension encrypts a job

    User->>Ext: Create passkey in browser
    Ext->>WkE: Authenticate (password or biometric)
    Note over WkE: masterVaultInit → unlocks vault
    Ext->>WkE: vaultsGet("masterEncryption")
    WkE->>FS: Read from Autobase (read-only)
    FS-->>WkE: {hashedPassword: "abcd1234..."}
    WkE-->>Ext: hashedPassword hex string
    Note over Ext: hex → 32 bytes
    Note over Ext: crypto_secretbox_easy(job_json, nonce, key)
    Ext->>FS: Write pearpass_jobs/jobs.enc

    Note over User,App: PHASE 3 — Main app decrypts the job

    User->>App: Open app (foreground)
    App->>WkM: readJobQueue()
    WkM->>WkM: getHashedPassword()
    WkM->>FS: Read "masterEncryption" from Autobase
    FS-->>WkM: hashedPassword hex string
    Note over WkM: hex → 32 bytes (secure malloc)
    WkM->>FS: Read pearpass_jobs/jobs.enc
    Note over WkM: crypto_secretbox_open_easy(ct, nonce, key)
    WkM-->>App: Decrypted Job[] array
    Note over App: Process jobs → createRecord / updateRecord
```

---

## Architecture overview

We use a **deferred-write job queue** to bridge the autofill extension and the main app. The autofill extension connects to the vault client in **read-only mode** (`readOnly: true`) — it can read vault data but cannot write. All vault writes go through the job queue:

```mermaid
flowchart
    subgraph ext["Autofill Extension"]
        direction TB
        E1["1. User creates passkey"] --> E2["2. Generate P256 key pair"]
        E2 --> E3["3. Build WebAuthn data"]
        E3 --> E4["4. Encrypt job + write to shared storage"]
    end

    subgraph storage["📁 Shared Storage"]
        direction TB
        SF[("/pearpass_jobs/ <br/> jobs.enc & attachments")]
    end

    subgraph main["Main App"]
        direction TB
        M1["useJobQueueProcessor (triggered on start/resume)"]
        M2["processJobQueue() -> Read & decrypt jobs, execute handlers, Cleanup on success"]
        M3["createRecord() / updateRecord()"]
        M1 --> M2 --> M3
    end

    E4 --> SF
    SF --> M2

    classDef extStyle fill:#FFE4B5,stroke:#333,stroke-width:2px,color:black
    classDef storageStyle fill:#E6E6FA,stroke:#333,stroke-width:2px,color:darkblue
    classDef mainStyle fill:#90EE90,stroke:#333,stroke-width:2px,color:darkgreen
```

**Shared storage** is the iOS App Group container (`group.com.noxtton.pearpass`) or Android's app files directory. Both the extension and the main app can read/write to `pearpass_jobs/`.

---

## Encryption sharing

The shared entropy is the vault's **`hashedPassword`** — a 32-byte key derived from the user's master password via Argon2id. It is not a password hash in the traditional sense (used for verification); it is a **key derivation** output sized for use as a `crypto_secretbox` key (XSalsa20-Poly1305). When the user first creates their master password, the worklet derives the key. After derivation, the hashedPassword is stored in the master vault's metadata.
The hashedPassword is only readable when the vault is unlocked. The extension enforces this by requiring authentication before any vault operations.

```mermaid
flowchart TD
    A["Master Password"] --> B["Argon2id"]
    B --> C["hashedPassword — hex encoded"]
    C --> D["Stored in master vault under key 'masterEncryption'"]
    D --> E["Extension reads via vaultsGet()"]
    D --> F["Main App reads via getHashedPassword()"]
    E --> G["Encrypt jobs.enc <br/> (XSalsa20-Poly1305)"]
    F --> H["Decrypt jobs.enc <br/> (XSalsa20-Poly1305)"]

    class A key
    class B,C process
    class D storage
    class E,F consumer
    class G,H crypto
```

Both sides use the identical 32-byte key with the same algorithm. There is no key exchange protocol; the key already exists in the vault, and both processes access it through the same worklet.
The key never leaves the device. It is pre-derived, and both sides use the identical algorithm (XSalsa20-Poly1305) with the same key.