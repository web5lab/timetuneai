package com.timetuneai.app;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(GoogleAuth.class);
    
    // Request battery optimization exemption
    requestBatteryOptimizationExemption();
    
    // Request overlay permission
    OverlayCallService.requestOverlayPermission(this);
    
    // Start background service
    startReminderBackgroundService();
    
    // Add JavaScript interface for reminder sync
    setupJavaScriptInterface();
  }
  
  private void requestBatteryOptimizationExemption() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
      String packageName = getPackageName();
      
      if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
        Log.d(TAG, "Requesting battery optimization exemption");
        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        intent.setData(Uri.parse("package:" + packageName));
        try {
          startActivity(intent);
        } catch (Exception e) {
          Log.e(TAG, "Error requesting battery optimization exemption: " + e.getMessage());
        }
      }
    }
  }
  
  private void startReminderBackgroundService() {
    Intent serviceIntent = new Intent(this, ReminderBackgroundService.class);
    
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      startForegroundService(serviceIntent);
    } else {
      startService(serviceIntent);
    }
    
    Log.d(TAG, "Started reminder background service");
  }
  
  private void setupJavaScriptInterface() {
    // Add JavaScript interface to sync reminders with native storage
    WebView webView = getBridge().getWebView();
    webView.addJavascriptInterface(new ReminderJSInterface(), "AndroidReminders");
  }
  
  public class ReminderJSInterface {
    @JavascriptInterface
    public void syncReminders(String remindersJson) {
      Log.d(TAG, "Syncing reminders to native storage");
      
      // Store reminders in SharedPreferences for background service access
      SharedPreferences prefs = getSharedPreferences("TimeTuneAI", Context.MODE_PRIVATE);
      SharedPreferences.Editor editor = prefs.edit();
      editor.putString("reminders", remindersJson);
      editor.apply();
      
      Log.d(TAG, "Reminders synced successfully");
    }
    
    @JavascriptInterface
    public String getReminders() {
      SharedPreferences prefs = getSharedPreferences("TimeTuneAI", Context.MODE_PRIVATE);
      return prefs.getString("reminders", "[]");
    }
  }
  
  @Override
  protected void onResume() {
    super.onResume();
    
    // Ensure background service is running
    startReminderBackgroundService();
  }
  }
}
