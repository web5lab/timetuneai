import { useState, useEffect, useCallback } from 'react';
import { useReminders } from '../contexts/RemindersContext';
import { androidCallService } from '../services/androidCallService';
import { Capacitor } from '@capacitor/core';

export const useVirtualCalling = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [callQueue, setCallQueue] = useState([]);
  const { reminders, toggleComplete, updateReminder } = useReminders();

  // Initialize Android call service
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const initializeService = async () => {
        try {
          await androidCallService.initialize();
          await androidCallService.createVirtualCallChannel();
          
          // Register callback for virtual calls
          androidCallService.onVirtualCall((reminder) => {
            console.log('Virtual call callback triggered:', reminder);
            setActiveCall(reminder);
          });
          
          console.log('Android call service initialized successfully');
        } catch (error) {
          console.error('Error initializing Android call service:', error);
        }
      };
      
      initializeService();
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        androidCallService.destroy();
      }
    };
  }, []);

  // Check for due reminders every minute
  useEffect(() => {
    const checkDueReminders = () => {
      const now = new Date();

      const dueReminders = reminders.filter(reminder => {
        if (reminder.isCompleted) return false;
        
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        const timeDiff = Math.abs(now.getTime() - reminderDateTime.getTime());
        
        // Trigger call if reminder is due (within 2 minutes for better reliability)
        return timeDiff <= 120000; // 2 minute tolerance
      });

      // Add due reminders to call queue
      dueReminders.forEach(reminder => {
        console.log('Found due reminder:', reminder.title, 'at', reminder.time);
        
        if (!callQueue.find(call => call.id === reminder.id) && 
            (!activeCall || activeCall.id !== reminder.id)) {
          // Use Android service for native platform, fallback to web behavior
          if (Capacitor.isNativePlatform()) {
            console.log('Triggering Android virtual call for:', reminder.title);
            androidCallService.triggerVirtualCall(reminder);
          } else {
            console.log('Adding reminder to call queue:', reminder.title);
            setCallQueue(prev => [...prev, reminder]);
          }
        }
      });
    };

    // Check immediately and then every 15 seconds for better responsiveness
    checkDueReminders();
    const interval = setInterval(checkDueReminders, 15000);

    return () => clearInterval(interval);
  }, [reminders, callQueue, activeCall]);

  // Process call queue
  useEffect(() => {
    if (!activeCall && callQueue.length > 0) {
      const nextCall = callQueue[0];
      console.log('Processing next call from queue:', nextCall.title);
      setActiveCall(nextCall);
      setCallQueue(prev => prev.slice(1));
    }
  }, [activeCall, callQueue]);

  const answerCall = useCallback(() => {
    console.log('Call answered for reminder:', activeCall?.title);
    // Call is answered, keep it active for user interaction
  }, [activeCall]);

  const dismissCall = useCallback(() => {
    console.log('Call dismissed for reminder:', activeCall?.title);
    if (activeCall) {
      // Mark as completed when dismissed
      toggleComplete(activeCall.id);
    }
    setActiveCall(null);
  }, [activeCall, toggleComplete]);

  const snoozeCall = useCallback(() => {
    console.log('Call snoozed for reminder:', activeCall?.title);
    if (activeCall) {
      // Snooze for 5 minutes
      const now = new Date();
      const snoozeTime = new Date(now.getTime() + 5 * 60000); // 5 minutes later
      
      const updates = {
        date: snoozeTime.toISOString().split('T')[0],
        time: snoozeTime.toTimeString().slice(0, 5)
      };
      
      console.log('Snoozing reminder to:', updates.date, updates.time);
      updateReminder(activeCall.id, updates);
    }
    setActiveCall(null);
  }, [activeCall, updateReminder]);

  const endCall = useCallback(() => {
    console.log('Call ended for reminder:', activeCall?.title);
    setActiveCall(null);
  }, [activeCall]);

  // Test function to trigger a call manually
  const triggerTestCall = useCallback((reminder) => {
    console.log('Triggering test call for:', reminder.title);
    
    if (Capacitor.isNativePlatform()) {
      androidCallService.triggerVirtualCall(reminder);
    } else {
      if (!activeCall) {
        setActiveCall(reminder);
      } else {
        setCallQueue(prev => [...prev, reminder]);
      }
    }
  }, [activeCall]);

  return {
    activeCall,
    callQueue: callQueue.length,
    answerCall,
    dismissCall,
    snoozeCall,
    endCall,
    triggerTestCall,
    isCallActive: !!activeCall
  };
};