import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

export class AndroidCallService {
  static instance;
  isInitialized = false;
  backgroundCheckInterval = null;
  foregroundServiceActive = false;
  callCallbacks = [];

  static getInstance() {
    if (!AndroidCallService.instance) {
      AndroidCallService.instance = new AndroidCallService();
    }
    return AndroidCallService.instance;
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      if (!Capacitor.isNativePlatform()) {
        console.log('Android call service not available on web platform');
        return false;
      }

      // Initialize local notifications for background processing
      await LocalNotifications.requestPermissions();
      
      // Set up app state listeners
      App.addListener('appStateChange', (state) => {
        console.log('App state changed:', state);
        if (state.isActive) {
          this.handleAppForeground();
        } else {
          this.handleAppBackground();
        }
      });

      // Set up notification action listeners
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        this.handleNotificationAction(notification);
      });

      this.isInitialized = true;
      console.log('Android call service initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Android call service:', error);
      return false;
    }
  }

  // Register callback for virtual calls
  onVirtualCall(callback) {
    this.callCallbacks.push(callback);
  }

  // Remove callback
  removeVirtualCallCallback(callback) {
    this.callCallbacks = this.callCallbacks.filter(cb => cb !== callback);
  }

  // Trigger virtual call
  triggerVirtualCall(reminder) {
    console.log('Triggering virtual call for reminder:', reminder.title);
    
    // If app is in foreground, trigger call overlay directly
    if (document.visibilityState === 'visible') {
      this.callCallbacks.forEach(callback => {
        try {
          callback(reminder);
        } catch (error) {
          console.error('Error triggering virtual call callback:', error);
        }
      });
    } else {
      // If app is in background, show full-screen notification
      this.showFullScreenNotification(reminder);
    }
  }

  // Show full-screen notification for background calls
  async showFullScreenNotification(reminder) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'TimeTuneAI - Incoming Reminder Call',
            body: reminder.title,
            id: reminder.id + 10000, // Different ID for call notifications
            schedule: { at: new Date(Date.now() + 1000) }, // 1 second delay
            sound: 'default',
            attachments: undefined,
            actionTypeId: 'VIRTUAL_CALL_ACTION',
            extra: {
              reminderId: reminder.id,
              reminderData: reminder,
              isVirtualCall: true,
            },
            smallIcon: 'ic_stat_notification',
            iconColor: '#FF6B35',
            ongoing: true, // Make it persistent
            autoCancel: false, // Don't auto-cancel
            largeIcon: undefined,
            largeBody: `Incoming call from TimeTuneAI Assistant about: ${reminder.title}`,
            summaryText: 'Tap to answer • Swipe to dismiss',
            group: 'virtual_calls',
            groupSummary: false,
            channelId: 'virtual_calls',
            // Android-specific full-screen intent
            fullScreenIntent: true,
            priority: 5, // Maximum priority
            category: 'call',
          },
        ],
      });

      console.log('Full-screen notification scheduled for virtual call');
    } catch (error) {
      console.error('Error showing full-screen notification:', error);
    }
  }

  // Handle notification actions
  handleNotificationAction(notification) {
    console.log('Handling virtual call notification action:', notification);
    
    const { extra } = notification.notification;
    if (extra?.isVirtualCall && extra?.reminderData) {
      // Bring app to foreground and trigger call
      this.bringAppToForeground();
      
      // Delay to ensure app is ready
      setTimeout(() => {
        this.triggerVirtualCall(extra.reminderData);
      }, 500);
    }
  }

  // Bring app to foreground
  async bringAppToForeground() {
    try {
      // This will bring the app to foreground on Android
      if (Capacitor.isNativePlatform()) {
        // The notification tap should automatically bring app to foreground
        console.log('Bringing app to foreground for virtual call');
      }
    } catch (error) {
      console.error('Error bringing app to foreground:', error);
    }
  }

  // Handle app going to background
  handleAppBackground() {
    console.log('App went to background, starting background reminder checks');
    this.startBackgroundChecks();
  }

  // Handle app coming to foreground
  handleAppForeground() {
    console.log('App came to foreground, stopping background checks');
    this.stopBackgroundChecks();
  }

  // Start background reminder checks
  startBackgroundChecks() {
    if (this.backgroundCheckInterval) return;

    // Check for due reminders every 30 seconds in background
    this.backgroundCheckInterval = setInterval(() => {
      this.checkForDueReminders();
    }, 30000);
  }

  // Stop background reminder checks
  stopBackgroundChecks() {
    if (this.backgroundCheckInterval) {
      clearInterval(this.backgroundCheckInterval);
      this.backgroundCheckInterval = null;
    }
  }

  // Check for due reminders (called from background)
  checkForDueReminders() {
    try {
      // Get reminders from localStorage
      const savedReminders = localStorage.getItem('reminders');
      if (!savedReminders) return;

      const reminders = JSON.parse(savedReminders);
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const currentDate = now.toISOString().split('T')[0];

      const dueReminders = reminders.filter(reminder => {
        if (reminder.isCompleted) return false;
        
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        const timeDiff = Math.abs(now.getTime() - reminderDateTime.getTime());
        
        // Trigger if within 1 minute
        return timeDiff <= 60000;
      });

      // Trigger virtual calls for due reminders
      dueReminders.forEach(reminder => {
        this.triggerVirtualCall(reminder);
      });

    } catch (error) {
      console.error('Error checking for due reminders in background:', error);
    }
  }

  // Create notification channel for virtual calls
  async createVirtualCallChannel() {
    try {
      if (!Capacitor.isNativePlatform()) return;

      await LocalNotifications.createChannel({
        id: 'virtual_calls',
        name: 'Virtual Calls',
        description: 'Full-screen virtual calls for reminders',
        sound: 'default',
        importance: 5, // Maximum importance
        visibility: 1, // Public
        lights: true,
        lightColor: '#FF6B35',
        vibration: true,
        enableVibration: true,
        vibrationPattern: [1000, 1000, 1000, 1000],
      });

      console.log('Virtual call notification channel created');
    } catch (error) {
      console.error('Error creating virtual call channel:', error);
    }
  }

  // Schedule reminder with virtual call capability
  async scheduleReminderWithCall(reminder) {
    try {
      // Schedule regular notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'TimeTuneAI Reminder',
            body: reminder.title,
            id: reminder.id,
            schedule: { at: new Date(`${reminder.date}T${reminder.time}`) },
            sound: 'default',
            extra: {
              reminderId: reminder.id,
              reminderData: reminder,
              hasVirtualCall: true,
            },
            channelId: 'virtual_calls',
          },
        ],
      });

      console.log('Reminder scheduled with virtual call capability');
    } catch (error) {
      console.error('Error scheduling reminder with virtual call:', error);
    }
  }

  // Cancel virtual call notification
  async cancelVirtualCall(reminderId) {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: reminderId + 10000 }],
      });
    } catch (error) {
      console.error('Error cancelling virtual call:', error);
    }
  }

  // Cleanup
  destroy() {
    this.stopBackgroundChecks();
    this.callCallbacks = [];
    App.removeAllListeners();
    LocalNotifications.removeAllListeners();
  }
}

export const androidCallService = AndroidCallService.getInstance();