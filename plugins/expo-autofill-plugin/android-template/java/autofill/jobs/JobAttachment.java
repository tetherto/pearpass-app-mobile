package com.pears.pass.autofill.jobs;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Reference to a file attachment saved alongside a job.
 * Attachments are stored in pearpass_jobs/attachments/ and referenced by relative path.
 */
public class JobAttachment {
    private final String id;
    private final String name;
    private final String relativePath;

    public JobAttachment(String id, String name, String relativePath) {
        this.id = id;
        this.name = name;
        this.relativePath = relativePath;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getRelativePath() { return relativePath; }

    /**
     * Serialize to JSON for storage in the encrypted job file.
     */
    public JSONObject toJSON() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("id", id);
        json.put("name", name);
        json.put("relativePath", relativePath);
        return json;
    }

    /**
     * Deserialize from JSON when reading the encrypted job file.
     */
    public static JobAttachment fromJSON(JSONObject json) throws JSONException {
        return new JobAttachment(
                json.getString("id"),
                json.getString("name"),
                json.getString("relativePath")
        );
    }
}
