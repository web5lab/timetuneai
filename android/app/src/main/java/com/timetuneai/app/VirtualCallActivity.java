package com.timetuneai.app;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class VirtualCallActivity extends Activity {
    private static final String TAG = "VirtualCallActivity";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "VirtualCallActivity created");
        
        // Set up full-screen call activity
        setupFullScreenCall();
        
        // Unlock screen if locked
        unlockScreen();
        
        // Create WebView for the call interface
        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(true);
        
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
        });
        
        // Load the main app
        String appUrl = "file:///android_asset/public/index.html";
        Log.d(TAG, "Loading WebView with URL: " + appUrl);
        webView.loadUrl(appUrl);
        setContentView(webView);
    }
    
    private void setupFullScreenCall() {
        Log.d(TAG, "Setting up full-screen call");
        
        // Request window features before setContentView
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        // Show when locked and turn screen on
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
            Log.d(TAG, "Set show when locked and turn screen on (API 27+)");
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
            Log.d(TAG, "Set show when locked and turn screen on (API < 27)");
        }
        
        // Full screen flags
        getWindow().addFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN |
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        );
        
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
    }
    
    private void unlockScreen() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            KeyguardManager keyguardManager = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
            keyguardManager.requestDismissKeyguard(this, null);
            Log.d(TAG, "Requested dismiss keyguard (API 27+)");
        }
    }
    
    @Override
    public void onBackPressed() {
        // Prevent back button from closing the call
        // User must use call controls to dismiss
        Log.d(TAG, "Back button pressed - ignoring");
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "VirtualCallActivity resumed");
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "VirtualCallActivity paused");
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "VirtualCallActivity destroyed");
        if (webView != null) {
            webView.destroy();
        }
    }
}