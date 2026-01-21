package com.pears.pass.autofill.data;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import to.holepunch.bare.kit.IPC;
import to.holepunch.bare.kit.Worklet;

public class BareHelper {
    private static final String TAG = "BareHelper";

    private final Context context;
    private final String bundleName;
    private final String bundleType;
    private final int memoryLimit;
    private Worklet worklet;
    private IPC ipc;
    private boolean isRunning = false;

    public interface WriteCallback {
        void onComplete(Throwable error);
    }

    public interface ReadCallback {
        void onData(byte[] data, Throwable error);
    }

    public interface SendCallback {
        void onResponse(String reply, Throwable error);
    }

    public BareHelper(Context context, String bundleName, String bundleType, int memoryLimitInMB) {
        this.context = context;
        this.bundleName = bundleName;
        this.bundleType = bundleType;
        this.memoryLimit = memoryLimitInMB * 1024 * 1024; // Convert MB to bytes
        Log.d(TAG, "Initialized with bundle " + bundleName + "." + bundleType + " and memory limit: " + memoryLimit + " bytes");
    }

    public boolean startWorklet() {
        if (isRunning) {
            Log.d(TAG, "Worklet is already running");
            return false;
        }

        Log.d(TAG, "Starting worklet with bundle: " + bundleName + "." + bundleType);

        try {
            // Create worklet configuration
            Worklet.Options config = new Worklet.Options();
            config.memoryLimit = memoryLimit;

            // Create worklet
            worklet = new Worklet(config);

            Log.d(TAG, "Worklet created successfully");

            // Start worklet with bundle
            // The bundle file is located in the assets directory
            String bundleFileName = bundleName + "." + bundleType;
            InputStream bundleStream = context.getAssets().open(bundleFileName);
            worklet.start("/" + bundleFileName, bundleStream, null);

            Log.d(TAG, "Worklet started successfully with bundle");

            // Initialize IPC
            ipc = new IPC(worklet);

            Log.d(TAG, "IPC created successfully - IPC: " + ipc + ", Worklet: " + worklet);

            isRunning = true;

            return true;
        } catch (Exception e) {
            Log.e(TAG, "Failed to start worklet", e);
            if (worklet != null) {
                worklet.terminate();
                worklet = null;
            }
            return false;
        }
    }

    public void write(byte[] data, WriteCallback callback) {
        if (!isRunning || ipc == null) {
            Log.e(TAG, "Cannot write - worklet not running or IPC not available");
            if (callback != null) {
                callback.onComplete(new Exception("Worklet not running"));
            }
            return;
        }

        Log.d(TAG, "Writing " + data.length + " bytes");

        try {
            ByteBuffer buffer = ByteBuffer.allocateDirect(data.length);
            buffer.put(data);
            buffer.flip();

            ipc.write(buffer, (error) -> {
                if (callback != null) {
                    callback.onComplete(error);
                }

                Log.d(TAG, "Writing done!");
            });
        } catch (Exception e) {
            Log.e(TAG, "Error during write operation", e);
            if (callback != null) {
                callback.onComplete(e);
            }
        }
    }

    public void read(ReadCallback callback) {
        if (!isRunning || ipc == null) {
            Log.e(TAG, "Cannot read - worklet not running or IPC not available");
            if (callback != null) {
                callback.onData(null, new Exception("Worklet not running"));
            }
            return;
        }

        if (worklet == null) {
            Log.e(TAG, "Cannot read - worklet is null");
            if (callback != null) {
                callback.onData(null, new Exception("Worklet is null"));
            }
            return;
        }

        Log.d(TAG, "Reading data - IPC: " + ipc + ", Worklet: " + worklet);

        try {
            // The crash happens here - let's check if the IPC might have an issue with its internal state
            // The SIGSEGV at 0x18 suggests accessing a field at offset 0x18 of a null object

            // Let's try to validate the IPC state before calling read
            Log.d(TAG, "About to call ipc.read() - validating state");

            ipc.read((data, error) -> {
                Log.d(TAG, "IPC read callback invoked");
                try {
                    if (error != null) {
                        Log.e(TAG, "IPC read error: " + error.getMessage());
                        if (callback != null) {
                            callback.onData(null, error);
                        }
                    } else if (data != null && data.remaining() > 0) {
                        byte[] bytes = new byte[data.remaining()];
                        data.get(bytes);
                        Log.d(TAG, "Read " + bytes.length + " bytes");
                        if (callback != null) {
                            callback.onData(bytes, null);
                        }
                    } else {
                        Log.w(TAG, "No data available to read");
                        if (callback != null) {
                            callback.onData(null, new Exception("No data received"));
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error processing read data", e);
                    if (callback != null) {
                        callback.onData(null, e);
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error initiating read: " + e.getMessage(), e);
            if (callback != null) {
                callback.onData(null, e);
            }
        }
    }

    public void send(String message, SendCallback callback) {
        if (!isRunning || ipc == null) {
            Log.e(TAG, "Cannot send - worklet not running or IPC not available");
            if (callback != null) {
                callback.onResponse(null, new Exception("Worklet not running"));
            }
            return;
        }

        // Convert string to bytes
        byte[] messageData;
        try {
            messageData = message.getBytes(StandardCharsets.UTF_8);
        } catch (Exception e) {
            Log.e(TAG, "Failed to encode message", e);
            if (callback != null) {
                callback.onResponse(null, e);
            }
            return;
        }

        Log.d(TAG, "Sending message: " + message);

        try {
            ByteBuffer writeBuffer = ByteBuffer.wrap(messageData);
            
            ipc.write(writeBuffer, (writeException) -> {
                if (writeException != null) {
                    Log.e(TAG, "Write failed", writeException);
                    if (callback != null) {
                        callback.onResponse(null, writeException);
                    }
                    return;
                }

                Log.d(TAG, "Message written successfully, now reading response");

                // Read inside the write callback, exactly like the example
                ipc.read((replyData, readException) -> {
                    if (readException != null) {
                        Log.e(TAG, "Read failed", readException);
                        if (callback != null) {
                            callback.onResponse(null, readException);
                        }
                        return;
                    }

                    if (replyData == null || replyData.remaining() == 0) {
                        Log.w(TAG, "No reply data received");
                        if (callback != null) {
                            callback.onResponse(null, new Exception("No reply data received"));
                        }
                        return;
                    }

                    try {
                        String reply = StandardCharsets.UTF_8.decode(replyData).toString();
                        Log.d(TAG, "Received reply: " + reply);
                        if (callback != null) {
                            callback.onResponse(reply, null);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Failed to decode reply", e);
                        if (callback != null) {
                            callback.onResponse(null, e);
                        }
                    }
                });
            });

        } catch (Exception e) {
            Log.e(TAG, "Error in send operation", e);
            if (callback != null) {
                callback.onResponse(null, e);
            }
        }
    }



    public void shutdown() {
        Log.d(TAG, "Shutting down");

        if (ipc != null) {
            ipc.close();
            ipc = null;
        }

        if (worklet != null) {
            worklet.terminate();
            worklet = null;
        }

        isRunning = false;
        Log.d(TAG, "Shutdown complete");
    }

    public boolean isRunning() {
        return isRunning;
    }

    @Override
    protected void finalize() throws Throwable {
        shutdown();
        Log.d(TAG, "Finalized");
        super.finalize();
    }
}