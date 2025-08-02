package com.timetuneai.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "BootReceiver";
    
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Log.d(TAG, "Received broadcast: " + action);
        
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) ||
            Intent.ACTION_MY_PACKAGE_REPLACED.equals(action) ||
            Intent.ACTION_PACKAGE_REPLACED.equals(action)) {
            
            Log.d(TAG, "Starting reminder background service after boot/update with delay");
            
            // Start the background service with a slight delay to ensure system is ready
            Intent serviceIntent = new Intent(context, ReminderBackgroundService.class);
            
            // Use a handler to delay the service start
            new android.os.Handler().postDelayed(() -> {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        context.startForegroundService(serviceIntent);
                    } else {
                        context.startService(serviceIntent);
                    }
                    Log.d(TAG, "Background service started successfully");
                } catch (Exception e) {
                    Log.e(TAG, "Error starting background service: " + e.getMessage());
                }
            }, 5000); // 5 second delay
        }
    }
}