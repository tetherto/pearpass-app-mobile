package com.pears.pass.autofill.jobs;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Job model representing a deferred write operation.
 * Created by the autofill service and processed by the main app on resume.
 *
 * Jobs are serialized to JSON, encrypted, and stored in the job file (jobs.enc).
 */
public class Job {

    /**
     * The type of write operation to perform.
     */
    public enum JobType {
        ADD_PASSKEY("ADD_PASSKEY"),
        UPDATE_PASSKEY("UPDATE_PASSKEY");

        private final String value;

        JobType(String value) {
            this.value = value;
        }

        public String getValue() { return value; }

        public static JobType fromString(String value) {
            for (JobType type : values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown JobType: " + value);
        }
    }

    /**
     * The processing status of the job.
     */
    public enum JobStatus {
        PENDING("PENDING"),
        IN_PROGRESS("IN_PROGRESS"),
        COMPLETED("COMPLETED"),
        FAILED("FAILED");

        private final String value;

        JobStatus(String value) {
            this.value = value;
        }

        public String getValue() { return value; }

        public static JobStatus fromString(String value) {
            for (JobStatus status : values()) {
                if (status.value.equals(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Unknown JobStatus: " + value);
        }
    }

    private String id;
    private JobType type;
    private JobStatus status;
    private long createdAt;
    private long updatedAt;
    private int retryCount;
    private int maxRetries;
    private String vaultId;
    private JSONObject payload;
    private String error;

    /**
     * Create a new Job with default values.
     *
     * @param id         UUID v4 identifier
     * @param type       The job type
     * @param status     Initial status (usually PENDING)
     * @param createdAt  Unix timestamp in milliseconds
     * @param retryCount Current retry count (usually 0)
     * @param maxRetries Maximum allowed retries (usually 3)
     * @param vaultId    Target vault ID
     * @param payload    Job-specific payload as JSON
     */
    public Job(String id, JobType type, JobStatus status, long createdAt,
               int retryCount, int maxRetries, String vaultId, JSONObject payload) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
        this.retryCount = retryCount;
        this.maxRetries = maxRetries;
        this.vaultId = vaultId;
        this.payload = payload;
        this.error = null;
    }

    // Getters

    public String getId() { return id; }
    public JobType getType() { return type; }
    public JobStatus getStatus() { return status; }
    public long getCreatedAt() { return createdAt; }
    public long getUpdatedAt() { return updatedAt; }
    public int getRetryCount() { return retryCount; }
    public int getMaxRetries() { return maxRetries; }
    public String getVaultId() { return vaultId; }
    public JSONObject getPayload() { return payload; }
    public String getError() { return error; }

    // Setters

    public void setStatus(JobStatus status) {
        this.status = status;
        this.updatedAt = System.currentTimeMillis();
    }

    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
        this.updatedAt = System.currentTimeMillis();
    }

    public void setError(String error) {
        this.error = error;
        this.updatedAt = System.currentTimeMillis();
    }

    /**
     * Serialize this Job to a JSON object for storage.
     */
    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("type", type.getValue());
        json.put("status", status.getValue());
        json.put("createdAt", createdAt);
        json.put("updatedAt", updatedAt);
        json.put("retryCount", retryCount);
        json.put("maxRetries", maxRetries);
        json.put("vaultId", vaultId);
        json.put("payload", payload);
        if (error != null) {
            json.put("error", error);
        }
        return json;
    }

    /**
     * Deserialize a Job from a JSON object.
     */
    public static Job fromJSON(JSONObject json) throws JSONException {
        String id = json.getString("id");
        JobType type = JobType.fromString(json.getString("type"));
        JobStatus status = JobStatus.fromString(json.getString("status"));
        long createdAt = json.getLong("createdAt");
        long updatedAt = json.optLong("updatedAt", createdAt);
        int retryCount = json.optInt("retryCount", 0);
        int maxRetries = json.optInt("maxRetries", 3);
        String vaultId = json.getString("vaultId");
        JSONObject payload = json.getJSONObject("payload");
        String error = json.optString("error", null);

        Job job = new Job(id, type, status, createdAt, retryCount, maxRetries, vaultId, payload);
        job.updatedAt = updatedAt;
        job.error = error;
        return job;
    }
}
