package com.timetuneai.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class VirtualCallActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Set up full-screen call activity
        setupFullScreenCall();
        
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
                
                // Get reminder data from intent
                Intent intent = getIntent();
                String reminderTitle = intent.getStringExtra("reminderTitle");
                String reminderDescription = intent.getStringExtra("reminderDescription");
                int reminderId = intent.getIntExtra("reminderId", 0);
                
                // Inject JavaScript to trigger virtual call
                String js = String.format(
                    "window.triggerVirtualCall && window.triggerVirtualCall({" +
                    "id: %d, " +
                    "title: '%s', " +
                    "description: '%s'" +
                    "});",
                    reminderId,
                    reminderTitle != null ? reminderTitle.replace("'", "\\'") : "",
                    reminderDescription != null ? reminderDescription.replace("'", "\\'") : ""
                );
                
                webView.evaluateJavascript(js, null);
            }
        });
        
        // Load the main app
        webView.loadUrl("file:///android_asset/public/index.html");
        setContentView(webView);
    }
    
    private void setupFullScreenCall() {
        // Show when locked and turn screen on
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            );
        }
        
        // Full screen flags
        getWindow().addFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN |
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
        );
        
        // Hide system UI for immersive experience
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().getDecorView().setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                android.view.View.SYSTEM_UI_FLAG_FULLSCREEN |
                android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }
    
    @Override
    public void onBackPressed() {
        // Prevent back button from closing the call
        // User must use call controls to dismiss
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            webView.destroy();
        }
    }
}