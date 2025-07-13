import React, { createContext, useContext, useState, useEffect } from 'react';
import { calendarService, CalendarProvider } from '../services/calendarService';
import { useReminders } from './RemindersContext';
import type { Reminder } from './RemindersContext';

interface CalendarSyncSettings {
  autoSync: boolean;
  defaultCalendar: string;
  syncCategories: string[];
  reminderOffset: number; // minutes before event
}

interface CalendarContextType {
  providers: CalendarProvider[];
  syncSettings: CalendarSyncSettings;
  isConnecting: boolean;
  lastSyncTime: Date | null;
  connectGoogle: () => Promise<boolean>;
  connectOutlook: () => Promise<boolean>;
  connectApple: () => Promise<boolean>;
  disconnectProvider: (providerId: string) => Promise<boolean>;
  syncReminder: (reminder: Reminder) => Promise<string | null>;
  updateSyncSettings: (settings: Partial<CalendarSyncSettings>) => void;
  refreshProviders: () => Promise<void>;
  syncAllReminders: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

interface CalendarProviderProps {
  children: React.ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncSettings, setSyncSettings] = useState<CalendarSyncSettings>({
    autoSync: true,
    defaultCalendar: 'primary',
    syncCategories: ['work', 'personal'],
    reminderOffset: 15,
  });

  const { reminders } = useReminders();

  useEffect(() => {
    // Load sync settings from localStorage
    const savedSettings = localStorage.getItem('calendar_sync_settings');
    if (savedSettings) {
      try {
        setSyncSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load sync settings:', error);
      }
    }

    // Load providers
    refreshProviders();
  }, []);

  const refreshProviders = async () => {
    try {
      const connectedProviders = await calendarService.getConnectedCalendars();
      setProviders(connectedProviders);
    } catch (error) {
      console.error('Failed to refresh providers:', error);
    }
  };

  const connectGoogle = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const token = await calendarService.authenticateGoogle();
      if (token) {
        const success = await calendarService.initializeGoogleCalendar(token);
        if (success) {
          localStorage.setItem('calendar_token_google', token);
          await refreshProviders();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOutlook = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const success = await calendarService.connectOutlook();
      if (success) {
        await refreshProviders();
      }
      return success;
    } catch (error) {
      console.error('Failed to connect Outlook:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectApple = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const success = await calendarService.connectApple();
      if (success) {
        await refreshProviders();
      }
      return success;
    } catch (error) {
      console.error('Failed to connect Apple Calendar:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectProvider = async (providerId: string): Promise<boolean> => {
    try {
      const success = await calendarService.disconnectCalendar(providerId);
      if (success) {
        await refreshProviders();
      }
      return success;
    } catch (error) {
      console.error('Failed to disconnect provider:', error);
      return false;
    }
  };

  const syncReminder = async (reminder: Reminder): Promise<string | null> => {
    try {
      // Check if category should be synced
      if (!syncSettings.syncCategories.includes(reminder.category)) {
        return null;
      }

      const eventId = await calendarService.syncReminderToCalendar(reminder);
      if (eventId) {
        setLastSyncTime(new Date());
      }
      return eventId;
    } catch (error) {
      console.error('Failed to sync reminder:', error);
      return null;
    }
  };

  const syncAllReminders = async () => {
    try {
      const connectedProvider = providers.find(p => p.connected);
      if (!connectedProvider) {
        console.warn('No calendar provider connected');
        return;
      }

      const remindersToSync = reminders.filter(r => 
        !r.isCompleted && 
        syncSettings.syncCategories.includes(r.category)
      );

      for (const reminder of remindersToSync) {
        await syncReminder(reminder);
      }

      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Failed to sync all reminders:', error);
    }
  };

  const updateSyncSettings = (newSettings: Partial<CalendarSyncSettings>) => {
    const updatedSettings = { ...syncSettings, ...newSettings };
    setSyncSettings(updatedSettings);
    localStorage.setItem('calendar_sync_settings', JSON.stringify(updatedSettings));
  };

  const value = {
    providers,
    syncSettings,
    isConnecting,
    lastSyncTime,
    connectGoogle,
    connectOutlook,
    connectApple,
    disconnectProvider,
    syncReminder,
    updateSyncSettings,
    refreshProviders,
    syncAllReminders,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};