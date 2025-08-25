package com.timetuneai.app;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.Nullable;

public class OverlayCallService extends Service {
    private static final String TAG = "OverlayCallService";
    private WindowManager windowManager;
    private View overlayView;
    private boolean isOverlayShowing = false;
    private WebView webView;
    
    public static final String ACTION_SHOW_OVERLAY_CALL = "SHOW_OVERLAY_CALL";
    public static final String ACTION_HIDE_OVERLAY_CALL = "HIDE_OVERLAY_CALL";
    
    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        Log.d(TAG, "OverlayCallService created");
    }
    
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            String action = intent.getAction();
            Log.d(TAG, "OverlayCallService action: " + action);
            
            if (ACTION_SHOW_OVERLAY_CALL.equals(action)) {
                String reminderTitle = intent.getStringExtra("reminderTitle");
                String reminderDescription = intent.getStringExtra("reminderDescription");
                int reminderId = intent.getIntExtra("reminderId", 0);
                String reminderDate = intent.getStringExtra("reminderDate");
                String reminderTime = intent.getStringExtra("reminderTime");
                
                showOverlayCall(reminderTitle, reminderDescription, reminderId, reminderDate, reminderTime);
            } else if (ACTION_HIDE_OVERLAY_CALL.equals(action)) {
                hideOverlayCall();
            }
        }
        
        return START_REDELIVER_INTENT;
    }
    
    private void showOverlayCall(String title, String description, int reminderId, String date, String time) {
        if (!canDrawOverlays()) {
            Log.e(TAG, "Cannot draw overlays - permission not granted");
            // Fallback to full-screen activity
            startFullScreenActivity(title, description, reminderId, date, time);
            return;
        }
        
        if (isOverlayShowing) {
            hideOverlayCall();
        }
        
        try {
            Log.d(TAG, "Showing overlay call for: " + title);
            
            // Create overlay layout
            overlayView = createOverlayView(title, description, reminderId, date, time);
            
            // Set up window parameters
            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.O 
                    ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                    : WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                PixelFormat.TRANSLUCENT
            );
            
            params.gravity = Gravity.TOP | Gravity.LEFT;
            params.x = 0;
            params.y = 0;
            
            // Add overlay to window manager
            windowManager.addView(overlayView, params);
            isOverlayShowing = true;
            
            Log.d(TAG, "Overlay call displayed successfully");
            
        } catch (Exception e) {
            Log.e(TAG, "Error showing overlay call: " + e.getMessage());
            // Fallback to full-screen activity
            startFullScreenActivity(title, description, reminderId, date, time);
        }
    }
    
    private void startFullScreenActivity(String title, String description, int reminderId, String date, String time) {
        try {
            Intent callIntent = new Intent(this, VirtualCallActivity.class);
            callIntent.putExtra("reminderTitle", title);
            callIntent.putExtra("reminderDescription", description);
            callIntent.putExtra("reminderId", reminderId);
            callIntent.putExtra("reminderDate", date);
            callIntent.putExtra("reminderTime", time);
            callIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | 
                              Intent.FLAG_ACTIVITY_CLEAR_TOP | 
                              Intent.FLAG_ACTIVITY_SINGLE_TOP);
            
            startActivity(callIntent);
            Log.d(TAG, "Started fallback full-screen activity");
        } catch (Exception e) {
            Log.e(TAG, "Error starting fallback activity: " + e.getMessage());
        }
    }
    
    private View createOverlayView(String title, String description, int reminderId, String date, String time) {
        // Create main container
        LinearLayout container = new LinearLayout(this);
        container.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ));
        container.setOrientation(LinearLayout.VERTICAL);
        container.setBackgroundColor(0xFF000000); // Black background
        container.setPadding(40, 100, 40, 100);
        
        // Create simple native UI instead of WebView for better reliability
        LinearLayout callInterface = createNativeCallInterface(title, description, reminderId, date, time);
        container.addView(callInterface);
        
        return container;
    }
    
    private LinearLayout createNativeCallInterface(String title, String description, int reminderId, String date, String time) {
        LinearLayout callInterface = new LinearLayout(this);
        callInterface.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        ));
        callInterface.setOrientation(LinearLayout.VERTICAL);
        callInterface.setGravity(android.view.Gravity.CENTER);
        
        // Title
        TextView titleView = new TextView(this);
        titleView.setText("TimeTuneAI Reminder");
        titleView.setTextColor(0xFFFFFFFF);
        titleView.setTextSize(24);
        titleView.setGravity(android.view.Gravity.CENTER);
        titleView.setPadding(20, 20, 20, 10);
        callInterface.addView(titleView);
        
        // Reminder title
        TextView reminderTitle = new TextView(this);
        reminderTitle.setText(title);
        reminderTitle.setTextColor(0xFFFFFFFF);
        reminderTitle.setTextSize(20);
        reminderTitle.setGravity(android.view.Gravity.CENTER);
        reminderTitle.setPadding(20, 10, 20, 10);
        callInterface.addView(reminderTitle);
        
        // Description
        if (description != null && !description.isEmpty()) {
            TextView descView = new TextView(this);
            descView.setText(description);
            descView.setTextColor(0xFFCCCCCC);
            descView.setTextSize(16);
            descView.setGravity(android.view.Gravity.CENTER);
            descView.setPadding(20, 10, 20, 20);
            callInterface.addView(descView);
        }
        
        // Time info
        TextView timeView = new TextView(this);
        timeView.setText(time + " • " + date);
        timeView.setTextColor(0xFFCCCCCC);
        timeView.setTextSize(14);
        timeView.setGravity(android.view.Gravity.CENTER);
        timeView.setPadding(20, 10, 20, 40);
        callInterface.addView(timeView);
        
        // Buttons container
        LinearLayout buttonsContainer = new LinearLayout(this);
        buttonsContainer.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        buttonsContainer.setOrientation(LinearLayout.HORIZONTAL);
        buttonsContainer.setGravity(android.view.Gravity.CENTER);
        
        // Answer button
        Button answerButton = new Button(this);
        answerButton.setText("Answer");
        answerButton.setBackgroundColor(0xFF4CAF50);
        answerButton.setTextColor(0xFFFFFFFF);
        answerButton.setPadding(40, 20, 40, 20);
        LinearLayout.LayoutParams answerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        answerParams.setMargins(20, 0, 20, 0);
        answerButton.setLayoutParams(answerParams);
        answerButton.setOnClickListener(v -> {
            handleAnswerCall(reminderId);
        });
        
        // Dismiss button
        Button dismissButton = new Button(this);
        dismissButton.setText("Dismiss");
        dismissButton.setBackgroundColor(0xFFF44336);
        dismissButton.setTextColor(0xFFFFFFFF);
        dismissButton.setPadding(40, 20, 40, 20);
        LinearLayout.LayoutParams dismissParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        dismissParams.setMargins(20, 0, 20, 0);
        dismissButton.setLayoutParams(dismissParams);
        dismissButton.setOnClickListener(v -> {
            handleDismissCall(reminderId);
        });
        
        buttonsContainer.addView(answerButton);
        buttonsContainer.addView(dismissButton);
        callInterface.addView(buttonsContainer);
        
        return callInterface;
    }
    
    private void handleAnswerCall(int reminderId) {
        Log.d(TAG, "Call answered for reminder: " + reminderId);
        
        // Open main app
        Intent mainIntent = new Intent(this, MainActivity.class);
        mainIntent.putExtra("action", "answer_call");
        mainIntent.putExtra("reminderId", reminderId);
        mainIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(mainIntent);
        
        hideOverlayCall();
    }
    
    private void handleDismissCall(int reminderId) {
        Log.d(TAG, "Call dismissed for reminder: " + reminderId);
        hideOverlayCall();
    }
    
    private View createWebViewInterface(String title, String description, int reminderId, String date, String time) {
        // Create WebView for full call interface
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        
        LinearLayout.LayoutParams webViewParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.MATCH_PARENT
        );
        webView.setLayoutParams(webViewParams);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                
                Log.d(TAG, "WebView loaded, triggering overlay call");
                
                // Inject JavaScript to show virtual call overlay
                String js = String.format(
                    "setTimeout(() => {" +
                    "  if (window.triggerVirtualCall) {" +
                    "    window.triggerVirtualCall({" +
                    "      id: %d, " +
                    "      title: '%s', " +
                    "      description: '%s', " +
                    "      date: '%s', " +
                    "      time: '%s', " +
                    "      category: 'personal', " +
                    "      priority: 'medium', " +
                    "      isCompleted: false" +
                    "    });" +
                    "  } else {" +
                    "    console.log('triggerVirtualCall not available yet');" +
                    "  }" +
                    "}, 1000);",
                    reminderId,
                    title != null ? title.replace("'", "\\'") : "",
                    description != null ? description.replace("'", "\\'") : "",
                    date != null ? date : "",
                    time != null ? time : ""
                );
                
                webView.evaluateJavascript(js, null);
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "WebView error: " + description);
                // Fallback to native interface
                hideOverlayCall();
            }
        });
        
        // Load the main app
        String appUrl = "file:///android_asset/public/index.html";
        webView.loadUrl(appUrl);
        
        return webView;
    }
    
    private void hideOverlayCall() {
        if (overlayView != null && isOverlayShowing) {
            try {
                if (webView != null) {
                    webView.destroy();
                    webView = null;
                }
                windowManager.removeView(overlayView);
                overlayView = null;
                isOverlayShowing = false;
                Log.d(TAG, "Overlay call hidden");
            } catch (Exception e) {
                Log.e(TAG, "Error hiding overlay call: " + e.getMessage());
            }
        }
        
        // Stop the service
        stopSelf();
    }
    
    private boolean canDrawOverlays() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true;
    }
    
    public static void requestOverlayPermission(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(context)) {
                Log.d(TAG, "Requesting overlay permission");
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                intent.setData(Uri.parse("package:" + context.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try {
                    context.startActivity(intent);
                } catch (Exception e) {
                    Log.e(TAG, "Error requesting overlay permission: " + e.getMessage());
                }
            }
        }
    }
    
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        hideOverlayCall();
        Log.d(TAG, "OverlayCallService destroyed");
    }
}