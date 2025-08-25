package com.timetuneai.app;
import android.app.Notification;
import android.graphics.Bitmap;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.view.WindowManager;
import androidx.core.app.NotificationCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class ReminderBackgroundService extends Service {
    private static final String TAG = "ReminderBgService";
    private static final String CHANNEL_ID = "reminder_background_service";
    private static final String CALL_CHANNEL_ID = "virtual_calls_bg";
    private static final int NOTIFICATION_ID = 1001;
    private static final int CHECK_INTERVAL = 30000; // 30 seconds for better battery life
    
    private Handler handler;
    private Runnable reminderChecker;
    private PowerManager.WakeLock wakeLock;
    private boolean isRunning = false;
    private Set<Integer> triggeredReminders = new HashSet<>();
    private NotificationManager notificationManager;
    
    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Background service created");
        
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        
        // Create notification channels
        createNotificationChannels();
        
        // Acquire wake lock to keep service running
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        if (powerManager != null) {
            wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "TimeTuneAI::ReminderWakeLock");
        }
        
        handler = new Handler(Looper.getMainLooper());
        setupReminderChecker();
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Background service started");
        
        // Start foreground service
        startForeground(NOTIFICATION_ID, createForegroundNotification());
        
        if (!isRunning) {
            startReminderChecking();
        }
        
        // Return START_STICKY to restart service if killed
        return START_STICKY;
    }
    
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Background service destroyed");
        
        stopReminderChecking();
        
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        
        // Restart service immediately
        scheduleServiceRestart();
    }
    
    private void scheduleServiceRestart() {
        try {
            Intent restartIntent = new Intent(this, ReminderBackgroundService.class);
            PendingIntent pendingIntent = PendingIntent.getService(
                this, 0, restartIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            
            // Schedule restart after 5 seconds
            android.app.AlarmManager alarmManager = (android.app.AlarmManager) getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                alarmManager.setExactAndAllowWhileIdle(
                    android.app.AlarmManager.ELAPSED_REALTIME_WAKEUP,
                    android.os.SystemClock.elapsedRealtime() + 5000,
                    pendingIntent
                );
            }
        } catch (Exception e) {
            Log.e(TAG, "Error scheduling service restart: " + e.getMessage());
        }
    }
    
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Background service channel
            NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Reminder Background Service",
                NotificationManager.IMPORTANCE_LOW
            );
            serviceChannel.setDescription("Keeps TimeTuneAI running to monitor reminders");
            serviceChannel.setShowBadge(false);
            serviceChannel.setSound(null, null);
            notificationManager.createNotificationChannel(serviceChannel);
            
            // Virtual calls channel
            NotificationChannel callChannel = new NotificationChannel(
                CALL_CHANNEL_ID,
                "Virtual Calls (Background)",
                NotificationManager.IMPORTANCE_HIGH
            );
            callChannel.setDescription("Full-screen virtual calls for reminders");
            callChannel.enableVibration(true);
            callChannel.setVibrationPattern(new long[]{1000, 1000, 1000, 1000});
            callChannel.enableLights(true);
            callChannel.setLightColor(0xFFF97316);
            callChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            callChannel.setBypassDnd(true);
            notificationManager.createNotificationChannel(callChannel);
        }
    }
    
    private Notification createForegroundNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("TimeTuneAI Active")
            .setContentText("Monitoring your reminders in background")
            .setSmallIcon(R.drawable.ic_stat_notification)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setVisibility(NotificationCompat.VISIBILITY_SECRET)
            .build();
    }
    
    private void setupReminderChecker() {
        reminderChecker = new Runnable() {
            @Override
            public void run() {
                if (isRunning) {
                    checkForDueReminders();
                    handler.postDelayed(this, CHECK_INTERVAL);
                }
            }
        };
    }
    
    private void startReminderChecking() {
        Log.d(TAG, "Starting reminder checking");
        isRunning = true;
        
        if (wakeLock != null && !wakeLock.isHeld()) {
            try {
                wakeLock.acquire(10 * 60 * 1000L); // 10 minutes
            } catch (Exception e) {
                Log.e(TAG, "Error acquiring wake lock: " + e.getMessage());
            }
        }
        
        handler.post(reminderChecker);
    }
    
    private void stopReminderChecking() {
        Log.d(TAG, "Stopping reminder checking");
        isRunning = false;
        
        if (handler != null && reminderChecker != null) {
            handler.removeCallbacks(reminderChecker);
        }
    }
    
    private void checkForDueReminders() {
        try {
            Log.d(TAG, "Checking for due reminders...");
            
            // Get reminders from SharedPreferences
            SharedPreferences prefs = getSharedPreferences("TimeTuneAI", Context.MODE_PRIVATE);
            String remindersJson = prefs.getString("reminders", "[]");
            
            if (remindersJson.equals("[]")) {
                Log.d(TAG, "No reminders found");
                return;
            }
            
            JSONArray reminders = new JSONArray(remindersJson);
            Date now = new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm", Locale.getDefault());
            
            String currentDate = dateFormat.format(now);
            String currentTime = timeFormat.format(now);
            
            Log.d(TAG, "Current time: " + currentDate + " " + currentTime);
            Log.d(TAG, "Found " + reminders.length() + " reminders to check");
            
            for (int i = 0; i < reminders.length(); i++) {
                JSONObject reminder = reminders.getJSONObject(i);
                
                if (reminder.getBoolean("isCompleted")) {
                    continue;
                }
                
                int reminderId = reminder.getInt("id");
                
                // Skip if already triggered
                if (triggeredReminders.contains(reminderId)) {
                    continue;
                }
                
                String reminderDate = reminder.getString("date");
                String reminderTime = reminder.getString("time");
                
                Log.d(TAG, "Checking reminder: " + reminder.getString("title") + " at " + reminderDate + " " + reminderTime);
                
                // Check if reminder is due (within 1 minute tolerance)
                if (reminderDate.equals(currentDate)) {
                    try {
                        Date reminderDateTime = timeFormat.parse(reminderTime);
                        Date currentDateTime = timeFormat.parse(currentTime);
                        
                        if (reminderDateTime != null && currentDateTime != null) {
                            long timeDiff = Math.abs(currentDateTime.getTime() - reminderDateTime.getTime());
                            
                            if (timeDiff <= 120000) { // 2 minute tolerance for better reliability
                                Log.d(TAG, "Found due reminder: " + reminder.getString("title"));
                                triggeredReminders.add(reminderId);
                                triggerVirtualCall(reminder);
                            }
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing time: " + e.getMessage());
                    }
                }
            }
            
            // Clean up old triggered reminders (older than 5 minutes)
            cleanupTriggeredReminders();
            
        } catch (Exception e) {
            Log.e(TAG, "Error checking reminders: " + e.getMessage());
        }
    }
    
    private void cleanupTriggeredReminders() {
        // Remove reminders that were triggered more than 5 minutes ago
        // This prevents the same reminder from being triggered multiple times
        // but allows it to be triggered again if rescheduled
        if (triggeredReminders.size() > 50) {
            triggeredReminders.clear();
        }
    }
    
    private void triggerVirtualCall(JSONObject reminder) {
        try {
            Log.d(TAG, "Triggering virtual call for: " + reminder.getString("title"));
            
            // Always show notification first as backup
            showVirtualCallNotification(reminder);
            
            // Try overlay first if permission is available
            if (shouldUseOverlay()) {
                startOverlayCall(reminder);
            }
            
            // Also try to start full-screen activity
            startFullScreenCall(reminder);
            
        } catch (Exception e) {
            Log.e(TAG, "Error triggering virtual call: " + e.getMessage());
        }
    }
    
    private void startOverlayCall(JSONObject reminder) {
        try {
            Intent overlayIntent = new Intent(this, OverlayCallService.class);
            overlayIntent.setAction(OverlayCallService.ACTION_SHOW_OVERLAY_CALL);
            overlayIntent.putExtra("reminderTitle", reminder.getString("title"));
            overlayIntent.putExtra("reminderDescription", reminder.optString("description", ""));
            overlayIntent.putExtra("reminderId", reminder.getInt("id"));
            overlayIntent.putExtra("reminderDate", reminder.getString("date"));
            overlayIntent.putExtra("reminderTime", reminder.getString("time"));
            
            startService(overlayIntent);
            Log.d(TAG, "Started overlay call service");
        } catch (Exception e) {
            Log.e(TAG, "Error starting overlay call: " + e.getMessage());
        }
    }
    
    private void startFullScreenCall(JSONObject reminder) {
        try {
            Intent callIntent = new Intent(this, VirtualCallActivity.class);
            callIntent.putExtra("reminderTitle", reminder.getString("title"));
            callIntent.putExtra("reminderDescription", reminder.optString("description", ""));
            callIntent.putExtra("reminderId", reminder.getInt("id"));
            callIntent.putExtra("reminderDate", reminder.getString("date"));
            callIntent.putExtra("reminderTime", reminder.getString("time"));
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | 
                              Intent.FLAG_ACTIVITY_CLEAR_TOP | 
                              Intent.FLAG_ACTIVITY_SINGLE_TOP |
                              Intent.FLAG_ACTIVITY_NO_HISTORY);
            
            startActivity(callIntent);
            Log.d(TAG, "Started virtual call activity");
        } catch (Exception e) {
            Log.e(TAG, "Error starting full screen call: " + e.getMessage());
        }
    }
    
    private boolean shouldUseOverlay() {
        // Check if overlay permission is granted
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true;
    }
    
    private void showVirtualCallNotification(JSONObject reminder) {
        try {
            // Create full-screen intent
            Intent fullScreenIntent = new Intent(this, VirtualCallActivity.class);
            fullScreenIntent.putExtra("reminderTitle", reminder.getString("title"));
            fullScreenIntent.putExtra("reminderDescription", reminder.optString("description", ""));
            fullScreenIntent.putExtra("reminderId", reminder.getInt("id"));
            fullScreenIntent.putExtra("reminderDate", reminder.getString("date"));
            fullScreenIntent.putExtra("reminderTime", reminder.getString("time"));
            fullScreenIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | 
                                    Intent.FLAG_ACTIVITY_CLEAR_TOP |
                                    Intent.FLAG_ACTIVITY_SINGLE_TOP);
            
            PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                this, reminder.getInt("id"), fullScreenIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            
            // Create answer action
            Intent answerIntent = new Intent(this, MainActivity.class);
            answerIntent.putExtra("action", "answer_call");
            answerIntent.putExtra("reminderId", reminder.getInt("id"));
            answerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            
            PendingIntent answerPendingIntent = PendingIntent.getActivity(
                this, reminder.getInt("id") + 1000, answerIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            
            // Create dismiss action
            Intent dismissIntent = new Intent(this, MainActivity.class);
            dismissIntent.putExtra("action", "dismiss_call");
            dismissIntent.putExtra("reminderId", reminder.getInt("id"));
            dismissIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            
            PendingIntent dismissPendingIntent = PendingIntent.getActivity(
                this, reminder.getInt("id") + 2000, dismissIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            
            // Build notification
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CALL_CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_notification)
                .setContentTitle("TimeTuneAI - Incoming Call")
                .setContentText(reminder.getString("title"))
                .setLargeIcon((Bitmap) null) 
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setAutoCancel(false)
                .setOngoing(true)
                .setVibrate(new long[]{1000, 1000, 1000, 1000})
                .setLights(0xFFF97316, 1000, 1000)
                .setSound(null)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setShowWhen(true)
                .setWhen(System.currentTimeMillis())
                .setTimeoutAfter(60000) // Auto-dismiss after 1 minute
                .addAction(R.drawable.ic_stat_notification, "Answer", answerPendingIntent)
                .addAction(R.drawable.ic_stat_notification, "Dismiss", dismissPendingIntent);
            
            // Set custom heads-up display
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                builder.setDefaults(Notification.DEFAULT_VIBRATE | Notification.DEFAULT_LIGHTS);
            }
            
            notificationManager.notify(reminder.getInt("id") + 10000, builder.build());
            
            Log.d(TAG, "Virtual call notification shown for: " + reminder.getString("title"));
            
        } catch (Exception e) {
            Log.e(TAG, "Error showing virtual call notification: " + e.getMessage());
        }
    }
}