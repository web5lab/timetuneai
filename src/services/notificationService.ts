import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import type { Reminder } from '../contexts/RemindersContext';

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check if running on native platform
      if (!Capacitor.isNativePlatform()) {
        console.log('Local notifications not available on web platform');
        return false;
      }

      // Request permissions
      const permission = await LocalNotifications.requestPermissions();
      
      if (permission.display === 'granted') {
        this.isInitialized = true;
        console.log('Local notifications permission granted');
        
        // Listen for notification actions
        await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
          console.log('Notification action performed:', notification);
          this.handleNotificationAction(notification);
        });

        return true;
      } else {
        console.log('Local notifications permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  async scheduleReminderNotification(reminder: Reminder): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      // Parse reminder date and time
      const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
      const now = new Date();

      // Don't schedule notifications for past dates
      if (reminderDateTime <= now) {
        console.log('Cannot schedule notification for past date');
        return false;
      }

      // Create notification
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'TimeTuneAI Reminder',
            body: reminder.title,
            id: parseInt(reminder.id),
            schedule: { at: reminderDateTime },
            sound: 'default',
            attachments: undefined,
            actionTypeId: 'REMINDER_ACTION',
            extra: {
              reminderId: reminder.id,
              category: reminder.category,
              priority: reminder.priority,
            },
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#FF6B35',
            ongoing: false,
            autoCancel: true,
            largeIcon: undefined,
            largeBody: reminder.description || reminder.title,
            summaryText: `${reminder.category} • ${reminder.priority} priority`,
            group: 'reminders',
            groupSummary: false,
            channelId: 'reminders',
          },
        ],
      });

      console.log(`Notification scheduled for reminder: ${reminder.title} at ${reminderDateTime}`);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  async cancelReminderNotification(reminderId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) return false;

      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(reminderId) }],
      });

      console.log(`Notification cancelled for reminder: ${reminderId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  }

  async updateReminderNotification(reminder: Reminder): Promise<boolean> {
    try {
      // Cancel existing notification
      await this.cancelReminderNotification(reminder.id);
      
      // Schedule new notification if not completed
      if (!reminder.isCompleted) {
        return await this.scheduleReminderNotification(reminder);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating notification:', error);
      return false;
    }
  }

  async cancelAllNotifications(): Promise<boolean> {
    try {
      if (!this.isInitialized) return false;

      await LocalNotifications.cancelAll();
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }

  async getPendingNotifications(): Promise<any[]> {
    try {
      if (!this.isInitialized) return [];

      const pending = await LocalNotifications.getPending();
      return pending.notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  private handleNotificationAction(notification: any): void {
    console.log('Handling notification action:', notification);
    
    // You can add custom logic here to handle notification taps
    // For example, navigate to the reminders page or mark as completed
    
    if (notification.notification?.extra?.reminderId) {
      // Could dispatch an event or call a callback to handle the action
      window.dispatchEvent(new CustomEvent('reminderNotificationTapped', {
        detail: {
          reminderId: notification.notification.extra.reminderId,
          action: notification.actionId,
        }
      }));
    }
  }

  async createNotificationChannel(): Promise<void> {
    try {
      if (!Capacitor.isNativePlatform()) return;

      // Create notification channel for Android
      await LocalNotifications.createChannel({
        id: 'reminders',
        name: 'Reminders',
        description: 'Notifications for your reminders',
        sound: 'default',
        importance: 4, // High importance
        visibility: 1, // Public
        lights: true,
        lightColor: '#FF6B35',
        vibration: true,
      });

      console.log('Notification channel created');
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();