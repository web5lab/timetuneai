package com.timetuneai.app;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;

public class VirtualCallActivity extends Activity {
    private static final String TAG = "VirtualCallActivity";
    private WebView webView;
    private Handler timeoutHandler;
    private Runnable timeoutRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "VirtualCallActivity created");
        
        // Set up full-screen call activity
        setupFullScreenCall();
        
        // Unlock screen if locked
        unlockScreen();
        
        // Set up auto-dismiss timeout
        setupAutoTimeout();
        
        // Create WebView for the call interface
        webView = new WebView(this);
        setupWebView();
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                
                Log.d(TAG, "WebView page finished loading");
                
                // Get reminder data from intent
                Intent intent = getIntent();
                String reminderTitle = intent.getStringExtra("reminderTitle");
                String reminderDescription = intent.getStringExtra("reminderDescription");
                int reminderId = intent.getIntExtra("reminderId", 0);
                String reminderDate = intent.getStringExtra("reminderDate");
                String reminderTime = intent.getStringExtra("reminderTime");
                
                Log.d(TAG, "Triggering virtual call for: " + reminderTitle);
                
                // Inject JavaScript to trigger virtual call
                String js = String.format(
                    "window.triggerVirtualCall && window.triggerVirtualCall({" +
                    "id: %d, " +
                    "title: '%s', " +
                    "description: '%s', " +
                    "date: '%s', " +
                    "time: '%s', " +
                    "category: 'personal', " +
                    "priority: 'medium', " +
                    "isCompleted: false" +
                    "});",
                    reminderId,
                    reminderTitle != null ? reminderTitle.replace("'", "\\'") : "",
                    reminderDescription != null ? reminderDescription.replace("'", "\\'") : "",
                    reminderDate != null ? reminderDate : "",
                    reminderTime != null ? reminderTime : ""
                );
                
                Log.d(TAG, "Executing JavaScript: " + js);
                webView.evaluateJavascript(js, null);
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "WebView error: " + description);
                // Close activity on error
                finish();
            }
        });
        
        // Load the main app
        String appUrl = "file:///android_asset/public/index.html";
        Log.d(TAG, "Loading WebView with URL: " + appUrl);
        webView.loadUrl(appUrl);
        setContentView(webView);
    }
    
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        
        // Enable debugging in debug builds
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
    }
    
    private void setupAutoTimeout() {
        timeoutHandler = new Handler();
        timeoutRunnable = new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "Auto-dismissing call activity after timeout");
                finish();
            }
        };
        
        // Auto-dismiss after 60 seconds
        timeoutHandler.postDelayed(timeoutRunnable, 60000);
    }
    
    private void cancelTimeout() {
        if (timeoutHandler != null && timeoutRunnable != null) {
            timeoutHandler.removeCallbacks(timeoutRunnable);
        }
    }
    
    private void setupFullScreenCall() {
        Log.d(TAG, "Setting up full-screen call");
        
        // Request window features before setContentView
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        // Show when locked and turn screen on
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            
            // Request to dismiss keyguard
            KeyguardManager keyguardManager = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
            if (keyguardManager != null) {
                keyguardManager.requestDismissKeyguard(this, null);
            }
            Log.d(TAG, "Set show when locked and turn screen on (API 27+)");
        } else {
            // For older Android versions
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
                WindowManager.LayoutParams.FLAG_ACQUIRE_CAUSES_WAKEUP
            );
            Log.d(TAG, "Set show when locked and turn screen on (API < 27)");
        }
        
        // Full screen flags
        getWindow().addFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN |
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );
        
        // Set window attributes for better visibility
        WindowManager.LayoutParams attrs = getWindow().getAttributes();
        attrs.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_FULL;
        getWindow().setAttributes(attrs);
        
        // Hide system UI for immersive experience
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
            Log.d(TAG, "Set immersive system UI flags");
        }
        
        // Ensure activity stays on top
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            setTaskDescription(new android.app.ActivityManager.TaskDescription(
                "TimeTuneAI Call", null, 0xFFF97316
            ));
        }
    }
    
    private void unlockScreen() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            KeyguardManager keyguardManager = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
            if (keyguardManager != null) {
                keyguardManager.requestDismissKeyguard(this, null);
            }
            Log.d(TAG, "Requested dismiss keyguard (API 27+)");
        }
    }
    
    @Override
    public void onBackPressed() {
        // Prevent back button from closing the call
        Log.d(TAG, "Back button pressed - closing call");
        finish();
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "VirtualCallActivity resumed");
        
        // Keep screen on while activity is visible
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "VirtualCallActivity paused");
        
        // Remove keep screen on flag
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "VirtualCallActivity destroyed");
        
        cancelTimeout();
        
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d(TAG, "VirtualCallActivity received new intent");
        setIntent(intent);
        
        // Reset timeout
        cancelTimeout();
        setupAutoTimeout();
    }
}