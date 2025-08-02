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
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import androidx.annotation.Nullable;

public class OverlayCallService extends Service {
    private static final String TAG = "OverlayCallService";
    private WindowManager windowManager;
    private View overlayView;
    private boolean isOverlayShowing = false;
    
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
        
        return START_NOT_STICKY;
    }
    
    private void showOverlayCall(String title, String description, int reminderId, String date, String time) {
        if (!canDrawOverlays()) {
            Log.e(TAG, "Cannot draw overlays - permission not granted");
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
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
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
        
        // Create WebView for full call interface
        WebView webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        
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
        });
        
        // Load the main app
        String appUrl = "file:///android_asset/public/index.html";
        webView.loadUrl(appUrl);
        
        container.addView(webView);
        
        // Add close button overlay
        Button closeButton = new Button(this);
        closeButton.setText("×");
        closeButton.setTextSize(24);
        closeButton.setBackgroundColor(0x80FF0000);
        closeButton.setTextColor(0xFFFFFFFF);
        closeButton.setPadding(20, 10, 20, 10);
        
        LinearLayout.LayoutParams closeParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        closeParams.gravity = Gravity.TOP | Gravity.RIGHT;
        closeParams.setMargins(0, -80, 20, 0);
        closeButton.setLayoutParams(closeParams);
        
        closeButton.setOnClickListener(v -> {
            Log.d(TAG, "Close button clicked");
            hideOverlayCall();
        });
        
        container.addView(closeButton);
        
        return container;
    }
    
    private void hideOverlayCall() {
        if (overlayView != null && isOverlayShowing) {
            try {
                windowManager.removeView(overlayView);
                overlayView = null;
                isOverlayShowing = false;
                Log.d(TAG, "Overlay call hidden");
            } catch (Exception e) {
                Log.e(TAG, "Error hiding overlay call: " + e.getMessage());
            }
        }
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
                context.startActivity(intent);
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