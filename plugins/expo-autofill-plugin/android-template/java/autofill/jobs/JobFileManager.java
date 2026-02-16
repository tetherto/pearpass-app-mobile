package com.pears.pass.autofill.jobs;

import android.content.Context;

import com.pears.pass.autofill.utils.SecureLog;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Manages reading, writing, and appending encrypted job files.
 *
 * File format (binary):
 * <pre>
 *   [Header 16 bytes]
 *     Magic: "PPJQ" (4 bytes ASCII)
 *     Version: uint16 LE (2 bytes) — currently 1
 *     Job Count: uint16 LE (2 bytes)
 *     Reserved: (8 bytes of zeros)
 *   [Nonce 24 bytes]
 *   [Encrypted payload (variable)]
 *     The encrypted output of crypto_secretbox which includes a 16-byte auth tag
 *     prepended to the ciphertext. When decrypted, yields a JSON array of jobs.
 * </pre>
 *
 * The base directory is {@code context.getFilesDir()/pearpass_jobs/}, which is a
 * sibling to {@code pearpass/} (the vault data directory).
 *
 * All writes use atomic operations: write to temp file, fsync, rename.
 */
public class JobFileManager {
    private static final String TAG = "JobFileManager";

    /** Magic bytes identifying a PearPass job queue file. */
    private static final byte[] MAGIC = "PPJQ".getBytes(StandardCharsets.US_ASCII);

    /** Current file format version. */
    private static final int VERSION = 1;

    /** Total header size in bytes. */
    private static final int HEADER_SIZE = 16;

    /** Job queue file name. */
    private static final String JOB_FILE_NAME = "jobs.enc";

    /** Attachments subdirectory name. */
    private static final String ATTACHMENTS_DIR_NAME = "attachments";

    private final File baseDirectory;

    /**
     * Create a JobFileManager with the standard base directory.
     *
     * @param context Android context, used to resolve getFilesDir()
     */
    public JobFileManager(Context context) {
        this.baseDirectory = new File(context.getFilesDir(), "pearpass_jobs");
    }

    /**
     * Create a JobFileManager with a custom base directory (for testing).
     *
     * @param baseDirectory The directory to store job files in
     */
    public JobFileManager(File baseDirectory) {
        this.baseDirectory = baseDirectory;
    }

    /**
     * Get the base directory path for job files.
     */
    public File getBaseDirectory() {
        return baseDirectory;
    }

    /**
     * Check whether the encrypted job file exists.
     *
     * @return true if jobs.enc exists and has content
     */
    public boolean jobFileExists() {
        File jobFile = new File(baseDirectory, JOB_FILE_NAME);
        return jobFile.exists() && jobFile.length() > 0;
    }

    /**
     * Read and decrypt the job file, returning the list of jobs.
     *
     * @param hashedPassword 32-byte encryption key
     * @return List of Job objects; empty list if file does not exist
     * @throws Exception if the file is corrupted, the header is invalid, or decryption fails
     */
    public List<Job> readJobs(byte[] hashedPassword) throws Exception {
        File jobFile = new File(baseDirectory, JOB_FILE_NAME);
        if (!jobFile.exists() || jobFile.length() == 0) {
            return new ArrayList<>();
        }

        // Read entire file
        byte[] fileData = readFileBytes(jobFile);

        // Validate minimum size: header (16) + nonce (24) + mac (16) + at least 1 byte payload
        if (fileData.length < HEADER_SIZE + JobEncryption.NONCE_BYTES + JobEncryption.MAC_BYTES + 1) {
            throw new IOException("Job file too small: " + fileData.length + " bytes");
        }

        // Parse and validate header
        validateHeader(fileData);

        // Extract nonce + encrypted payload (everything after the header)
        int encryptedLength = fileData.length - HEADER_SIZE;
        byte[] nonceAndCiphertext = new byte[encryptedLength];
        System.arraycopy(fileData, HEADER_SIZE, nonceAndCiphertext, 0, encryptedLength);

        // Decrypt
        byte[] plaintext;
        try {
            plaintext = JobEncryption.decrypt(nonceAndCiphertext, hashedPassword);
        } catch (Exception e) {
            throw new Exception("Failed to decrypt job file: " + e.getMessage(), e);
        }

        // Parse JSON array of jobs
        String jsonString = new String(plaintext, StandardCharsets.UTF_8);
        JobEncryption.secureZero(plaintext);

        try {
            JSONArray jobsArray = new JSONArray(jsonString);
            List<Job> jobs = new ArrayList<>(jobsArray.length());
            for (int i = 0; i < jobsArray.length(); i++) {
                jobs.add(Job.fromJSON(jobsArray.getJSONObject(i)));
            }
            return jobs;
        } catch (JSONException e) {
            throw new Exception("Failed to parse job file JSON: " + e.getMessage(), e);
        }
    }

    /**
     * Encrypt and write the list of jobs to the job file.
     * Uses atomic write: temp file, fsync, rename.
     *
     * @param jobs           The jobs to write
     * @param hashedPassword 32-byte encryption key
     * @throws Exception if serialization, encryption, or I/O fails
     */
    public void writeJobs(List<Job> jobs, byte[] hashedPassword) throws Exception {
        if (!baseDirectory.exists()) {
            if (!baseDirectory.mkdirs()) {
                throw new IOException("Failed to create job directory: " + baseDirectory.getAbsolutePath());
            }
        }

        // Serialize jobs to JSON
        JSONArray jobsArray = new JSONArray();
        for (Job job : jobs) {
            jobsArray.put(job.toJSON());
        }
        byte[] jsonBytes = jobsArray.toString().getBytes(StandardCharsets.UTF_8);

        // Encrypt (returns nonce + ciphertext)
        byte[] encrypted = JobEncryption.encrypt(jsonBytes, hashedPassword);
        JobEncryption.secureZero(jsonBytes);

        // Build header
        byte[] header = buildHeader(jobs.size());

        // Combine header + encrypted data (which already contains nonce + ciphertext)
        byte[] fileData = new byte[header.length + encrypted.length];
        System.arraycopy(header, 0, fileData, 0, header.length);
        System.arraycopy(encrypted, 0, fileData, header.length, encrypted.length);

        // Atomic write: temp file -> fsync -> rename
        File jobFile = new File(baseDirectory, JOB_FILE_NAME);
        File tempFile = new File(baseDirectory, JOB_FILE_NAME + ".tmp");

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(fileData);
            fos.getFD().sync();
        }

        if (!tempFile.renameTo(jobFile)) {
            // Fallback: delete target and retry
            if (jobFile.exists()) {
                jobFile.delete();
            }
            if (!tempFile.renameTo(jobFile)) {
                tempFile.delete();
                throw new IOException("Failed to atomically rename temp file to " + jobFile.getAbsolutePath());
            }
        }

        SecureLog.d(TAG, "Wrote " + jobs.size() + " jobs to " + jobFile.getAbsolutePath());
    }

    /**
     * Read existing jobs, append a new job, and write the updated list back.
     * This is the primary method used by the autofill service to enqueue a new job.
     *
     * @param job            The job to append
     * @param hashedPassword 32-byte encryption key
     * @throws Exception if reading, appending, or writing fails
     */
    public void appendJob(Job job, byte[] hashedPassword) throws Exception {
        List<Job> jobs = readJobs(hashedPassword);
        jobs.add(job);
        writeJobs(jobs, hashedPassword);
        SecureLog.d(TAG, "Appended job " + job.getId() + " (type: " + job.getType().getValue() + ")");
    }

    /**
     * Save an attachment file to the attachments/ subdirectory.
     * Uses atomic write (temp file + fsync + rename).
     * Preserves the original file extension for MIME type detection.
     *
     * @param data             The file content to save
     * @param attachmentId     UUID for the attachment (used as the base filename)
     * @param originalFilename The original filename (used to extract the extension)
     * @return The relative path within attachments/ (e.g., "abc123.txt")
     * @throws IOException if the write fails
     */
    public String saveAttachment(byte[] data, String attachmentId, String originalFilename)
            throws IOException {
        String ext = getFileExtension(originalFilename);
        String filename = ext.isEmpty() ? attachmentId : attachmentId + "." + ext;

        File attachmentsDir = new File(baseDirectory, ATTACHMENTS_DIR_NAME);
        if (!attachmentsDir.exists()) {
            if (!attachmentsDir.mkdirs()) {
                throw new IOException("Failed to create attachments directory: "
                        + attachmentsDir.getAbsolutePath());
            }
        }

        File file = new File(attachmentsDir, filename);
        File tempFile = new File(attachmentsDir, filename + ".tmp");

        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(data);
            fos.getFD().sync();
        }

        if (!tempFile.renameTo(file)) {
            if (file.exists()) {
                file.delete();
            }
            if (!tempFile.renameTo(file)) {
                tempFile.delete();
                throw new IOException("Failed to atomically rename attachment temp file");
            }
        }

        SecureLog.d(TAG, "Saved attachment: " + filename + " (" + data.length + " bytes)");
        return filename;
    }

    /**
     * Delete the encrypted job file.
     */
    public void deleteJobFile() {
        File jobFile = new File(baseDirectory, JOB_FILE_NAME);
        if (jobFile.exists()) {
            jobFile.delete();
            SecureLog.d(TAG, "Deleted job file");
        }
    }

    /**
     * Delete the entire attachments folder and its contents.
     */
    public void deleteAttachmentsFolder() {
        File attachmentsDir = new File(baseDirectory, ATTACHMENTS_DIR_NAME);
        if (attachmentsDir.exists()) {
            deleteRecursive(attachmentsDir);
            SecureLog.d(TAG, "Deleted attachments folder");
        }
    }

    // --- Private helpers ---

    /**
     * Build the 16-byte file header.
     *
     * Layout (little-endian):
     *   [0..3]   Magic: "PPJQ" (4 bytes ASCII)
     *   [4..5]   Version: uint16 LE
     *   [6..7]   Job Count: uint16 LE
     *   [8..15]  Reserved: zeros
     */
    private byte[] buildHeader(int jobCount) {
        ByteBuffer header = ByteBuffer.allocate(HEADER_SIZE);
        header.order(ByteOrder.LITTLE_ENDIAN);

        // Magic bytes
        header.put(MAGIC);

        // Version (uint16 LE)
        header.putShort((short) VERSION);

        // Job count (uint16 LE)
        header.putShort((short) jobCount);

        // Reserved (8 bytes of zeros) — already zero-initialized by ByteBuffer.allocate

        return header.array();
    }

    /**
     * Validate the file header: magic bytes, version, and basic sanity.
     *
     * @param fileData The raw file bytes
     * @throws IOException if the header is invalid
     */
    private void validateHeader(byte[] fileData) throws IOException {
        if (fileData.length < HEADER_SIZE) {
            throw new IOException("File too small for header");
        }

        // Check magic
        for (int i = 0; i < MAGIC.length; i++) {
            if (fileData[i] != MAGIC[i]) {
                throw new IOException("Invalid magic bytes — not a PearPass job file");
            }
        }

        // Check version
        ByteBuffer buf = ByteBuffer.wrap(fileData, 4, 2);
        buf.order(ByteOrder.LITTLE_ENDIAN);
        int version = buf.getShort() & 0xFFFF;
        if (version < 1 || version > VERSION) {
            throw new IOException("Unsupported job file version: " + version);
        }
    }

    /**
     * Read all bytes from a file.
     */
    private byte[] readFileBytes(File file) throws IOException {
        int length = (int) file.length();
        byte[] data = new byte[length];
        try (FileInputStream fis = new FileInputStream(file)) {
            int offset = 0;
            while (offset < length) {
                int read = fis.read(data, offset, length - offset);
                if (read == -1) break;
                offset += read;
            }
        }
        return data;
    }

    /**
     * Extract the file extension from a filename (without the dot).
     * Returns empty string if no extension is found.
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDot = filename.lastIndexOf('.');
        if (lastDot <= 0 || lastDot == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDot + 1);
    }

    /**
     * Recursively delete a directory and all its contents.
     */
    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            File[] children = fileOrDirectory.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        fileOrDirectory.delete();
    }
}
