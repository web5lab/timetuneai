import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState([]);

  useEffect(() => {
    // Initialize notifications and check permission status
    const initializeNotifications = async () => {
      const initialized = await notificationService.initialize();
      setIsPermissionGranted(initialized);
      
      if (initialized) {
        // Get pending notifications
        const pending = await notificationService.getPendingNotifications();
        setPendingNotifications(pending);
      }
    };

    initializeNotifications();

    // Listen for notification taps
    const handleNotificationTap = (event) => {
      console.log('Reminder notification tapped:', event.detail);
      // You can add navigation logic here
      // For example, navigate to the specific reminder or reminders page
    };

    window.addEventListener('reminderNotificationTapped', handleNotificationTap);

    return () => {
      window.removeEventListener('reminderNotificationTapped', handleNotificationTap);
    };
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.initialize();
    setIsPermissionGranted(granted);
    return granted;
  };

  const refreshPendingNotifications = async () => {
    if (isPermissionGranted) {
      const pending = await notificationService.getPendingNotifications();
      setPendingNotifications(pending);
    }
  };

  return {
    isPermissionGranted,
    pendingNotifications,
    requestPermission,
    refreshPendingNotifications,
  };
};