package com.pears.pass.autofill.jobs;

import com.pears.pass.autofill.crypto.Base64URLUtils;
import com.pears.pass.autofill.data.PasskeyCredential;
import com.pears.pass.autofill.data.PasskeyFormData;
import com.pears.pass.autofill.utils.SecureLog;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Creates ADD_PASSKEY and UPDATE_PASSKEY jobs for the job queue.
 *
 * This is the primary entry point for the autofill service to enqueue passkey
 * write operations. Instead of writing directly to the vault (which would fail
 * due to file locking), the autofill service creates a job that the main app
 * will process on resume.
 *
 * Usage from PasskeyRegistrationActivity:
 * <pre>
 *   PasskeyJobCreator creator = new PasskeyJobCreator(new JobFileManager(context));
 *   String jobId = creator.createAddPasskeyJob(
 *       vaultId, credential, formData,
 *       rpId, rpName, userId, userName, userDisplayName,
 *       hashedPassword
 *   );
 * </pre>
 */
public class PasskeyJobCreator {
    private static final String TAG = "PasskeyJobCreator";

    private final JobFileManager jobFileManager;

    public PasskeyJobCreator(JobFileManager jobFileManager) {
        this.jobFileManager = jobFileManager;
    }

    /**
     * Create an ADD_PASSKEY job: saves attachments, builds the payload, and appends
     * an encrypted job to the queue file.
     *
     * @param vaultId          Target vault ID
     * @param credential       The generated PasskeyCredential (contains credentialId, publicKey, privateKey, userId, response)
     * @param formData         User-entered form data (title, username, websites, note, folder, attachments)
     * @param rpId             Relying party ID (e.g., "github.com")
     * @param rpName           Relying party display name
     * @param userId           User handle as base64URL
     * @param userName         User name
     * @param userDisplayName  User display name
     * @param hashedPassword   32-byte encryption key from vault masterEncryption
     * @return The job ID (UUID string)
     * @throws Exception if attachment saving, encryption, or file I/O fails
     */
    public String createAddPasskeyJob(
            String vaultId,
            PasskeyCredential credential,
            PasskeyFormData formData,
            String rpId, String rpName,
            String userId, String userName, String userDisplayName,
            byte[] hashedPassword) throws Exception {

        SecureLog.d(TAG, "Creating ADD_PASSKEY job for rpId: " + rpId);

        // 1. Save attachment files to pearpass_jobs/attachments/
        List<JobAttachment> attachments = new ArrayList<>();
        if (formData.getAttachments() != null) {
            for (PasskeyFormData.AttachmentFile attachment : formData.getAttachments()) {
                String attachmentId = UUID.randomUUID().toString();
                String relativePath = jobFileManager.saveAttachment(
                        attachment.getData(), attachmentId, attachment.getName());
                attachments.add(new JobAttachment(attachmentId, attachment.getName(), relativePath));
            }
        }

        // 2. Build the payload
        String recordId = UUID.randomUUID().toString();
        long createdAt = System.currentTimeMillis();

        AddPasskeyPayload payload = new AddPasskeyPayload(
                rpId, rpName,
                userId, userName, userDisplayName,
                credential.getId(),
                credential.getResponse().getPublicKey(),
                Base64URLUtils.encode(credential.getPrivateKeyBuffer()),
                credential.getResponse().getClientDataJSON(),
                credential.getResponse().getAttestationObject(),
                credential.getResponse().getAuthenticatorData(),
                credential.getResponse().getPublicKeyAlgorithm(),
                createdAt,
                credential.getResponse().getTransports(),
                recordId,
                formData.getTitle(),
                formData.getNote(),
                formData.getFolder(),
                formData.getWebsites(),
                attachments
        );

        // 3. Create the job and append to the encrypted queue
        Job job = new Job(
                UUID.randomUUID().toString(),
                Job.JobType.ADD_PASSKEY,
                Job.JobStatus.PENDING,
                createdAt,
                0,   // retryCount
                3,   // maxRetries
                vaultId,
                payload.toJSON()
        );

        jobFileManager.appendJob(job, hashedPassword);

        SecureLog.d(TAG, "Created ADD_PASSKEY job " + job.getId()
                + " with " + attachments.size() + " attachment(s)");
        return job.getId();
    }

    /**
     * Create an UPDATE_PASSKEY job: builds the payload and appends an encrypted job
     * to the queue file. No attachments are saved for update jobs.
     *
     * @param vaultId          Target vault ID
     * @param existingRecordId ID of the existing login record to merge the passkey into
     * @param credential       The generated PasskeyCredential
     * @param rpId             Relying party ID
     * @param rpName           Relying party display name
     * @param userId           User handle as base64URL
     * @param userName         User name
     * @param userDisplayName  User display name
     * @param hashedPassword   32-byte encryption key from vault masterEncryption
     * @return The job ID (UUID string)
     * @throws Exception if encryption or file I/O fails
     */
    public String createUpdatePasskeyJob(
            String vaultId,
            String existingRecordId,
            PasskeyCredential credential,
            String rpId, String rpName,
            String userId, String userName, String userDisplayName,
            byte[] hashedPassword) throws Exception {

        SecureLog.d(TAG, "Creating UPDATE_PASSKEY job for record: " + existingRecordId);

        long createdAt = System.currentTimeMillis();

        // Build the payload
        UpdatePasskeyPayload payload = new UpdatePasskeyPayload(
                existingRecordId,
                rpId, rpName,
                userId, userName, userDisplayName,
                credential.getId(),
                credential.getResponse().getPublicKey(),
                Base64URLUtils.encode(credential.getPrivateKeyBuffer()),
                credential.getResponse().getClientDataJSON(),
                credential.getResponse().getAttestationObject(),
                credential.getResponse().getAuthenticatorData(),
                credential.getResponse().getPublicKeyAlgorithm(),
                createdAt,
                credential.getResponse().getTransports(),
                vaultId
        );

        // Create the job and append to the encrypted queue
        Job job = new Job(
                UUID.randomUUID().toString(),
                Job.JobType.UPDATE_PASSKEY,
                Job.JobStatus.PENDING,
                createdAt,
                0,   // retryCount
                3,   // maxRetries
                vaultId,
                payload.toJSON()
        );

        jobFileManager.appendJob(job, hashedPassword);

        SecureLog.d(TAG, "Created UPDATE_PASSKEY job " + job.getId()
                + " for existing record " + existingRecordId);
        return job.getId();
    }
}
