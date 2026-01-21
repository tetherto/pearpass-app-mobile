package com.pears.pass.autofill.data;

import android.content.Context;
import android.os.Environment;

import java.io.File;

public class Utils {

    /**
     * Gets the vault storage path based on the custom path or default directory
     *
     * @param context The Android context
     * @param customPath Optional custom storage path
     * @return The storage path for vault data as a file:// URL, or null if unable to determine
     */
    public static String getVaultStoragePath(Context context, String customPath) {
        if (customPath != null && !customPath.isEmpty()) {
            // Use custom path if provided
            File customDir = new File(customPath);
            if (customDir.exists() || customDir.mkdirs()) {
                // Return as file:// URL
                return "file://" + customPath;
            }
        }

        // Use app's internal storage directory as default
        File internalDir = context.getFilesDir();

        // Create a dedicated vault directory within the app's internal storage
        // Use lowercase "pearpass" to match the expected format
        File vaultDir = new File(internalDir, "pearpass");

        if (!vaultDir.exists()) {
            if (!vaultDir.mkdirs()) {
                return null; // Failed to create directory
            }
        }

        // Return as file:// URL format
        return "file://" + vaultDir.getAbsolutePath();
    }

    /**
     * Gets the shared storage path for vault data that can be accessed by both
     * the main app and the autofill service
     *
     * @param context The Android context
     * @return The shared storage path as a file:// URL
     */
    public static String getSharedVaultStoragePath(Context context) {
        // Use the app's external files directory which is accessible by both
        // the main app and the autofill service (within the same app)
        File externalDir = context.getExternalFilesDir(null);

        if (externalDir != null) {
            // Use lowercase "pearpass" to match the expected format
            File vaultDir = new File(externalDir, "pearpass");
            if (!vaultDir.exists()) {
                vaultDir.mkdirs();
            }
            // Return as file:// URL format
            return "file://" + vaultDir.getAbsolutePath();
        }

        // Fallback to internal storage
        return getVaultStoragePath(context, null);
    }

    /**
     * Checks if the storage is available and writable
     *
     * @return true if external storage is available and writable
     */
    public static boolean isStorageWritable() {
        String state = Environment.getExternalStorageState();
        return Environment.MEDIA_MOUNTED.equals(state);
    }

    /**
     * Checks if the storage is available for reading
     *
     * @return true if external storage is available for reading
     */
    public static boolean isStorageReadable() {
        String state = Environment.getExternalStorageState();
        return Environment.MEDIA_MOUNTED.equals(state) ||
                Environment.MEDIA_MOUNTED_READ_ONLY.equals(state);
    }
}