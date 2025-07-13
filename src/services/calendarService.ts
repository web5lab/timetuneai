import { GoogleAuth } from 'google-auth-library';
import { calendar_v3, google } from 'googleapis';
import type { Reminder } from '../contexts/RemindersContext';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export interface CalendarProvider {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple';
  connected: boolean;
  email?: string;
}

class CalendarService {
  private googleAuth: GoogleAuth | null = null;
  private calendarApi: calendar_v3.Calendar | null = null;
  private isInitialized = false;

  async initializeGoogleCalendar(accessToken: string) {
    try {
      this.googleAuth = new GoogleAuth({
        credentials: {
          access_token: accessToken,
        },
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      });

      this.calendarApi = google.calendar({ version: 'v3', auth: this.googleAuth });
      this.isInitialized = true;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error);
      return false;
    }
  }

  async authenticateGoogle(): Promise<string | null> {
    try {
      // In a real app, this would use OAuth2 flow
      // For demo purposes, we'll simulate the authentication
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // Simulate OAuth flow - in real app, use Google OAuth2
      const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${window.location.origin}/auth/callback&scope=https://www.googleapis.com/auth/calendar&response_type=code`;
      
      // For demo, return a mock token
      return 'mock_access_token_' + Date.now();
    } catch (error) {
      console.error('Google authentication failed:', error);
      return null;
    }
  }

  async syncReminderToCalendar(reminder: Reminder, calendarId = 'primary'): Promise<string | null> {
    if (!this.isInitialized || !this.calendarApi) {
      console.warn('Calendar service not initialized');
      return null;
    }

    try {
      const startDateTime = new Date(`${reminder.date}T${reminder.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const event: CalendarEvent = {
        summary: reminder.title,
        description: reminder.description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 },
            { method: 'email', minutes: 60 },
          ],
        },
      };

      const response = await this.calendarApi.events.insert({
        calendarId,
        requestBody: event,
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Failed to sync reminder to calendar:', error);
      return null;
    }
  }

  async updateCalendarEvent(eventId: string, reminder: Reminder, calendarId = 'primary'): Promise<boolean> {
    if (!this.isInitialized || !this.calendarApi) {
      return false;
    }

    try {
      const startDateTime = new Date(`${reminder.date}T${reminder.time}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const event: CalendarEvent = {
        summary: reminder.title,
        description: reminder.description || '',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      await this.calendarApi.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });

      return true;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      return false;
    }
  }

  async deleteCalendarEvent(eventId: string, calendarId = 'primary'): Promise<boolean> {
    if (!this.isInitialized || !this.calendarApi) {
      return false;
    }

    try {
      await this.calendarApi.events.delete({
        calendarId,
        eventId,
      });

      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      return false;
    }
  }

  async getCalendarEvents(timeMin?: string, timeMax?: string, calendarId = 'primary') {
    if (!this.isInitialized || !this.calendarApi) {
      return [];
    }

    try {
      const response = await this.calendarApi.events.list({
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return [];
    }
  }

  async getConnectedCalendars(): Promise<CalendarProvider[]> {
    // Mock data for demo - in real app, check actual connections
    const providers: CalendarProvider[] = [
      {
        id: 'google',
        name: 'Google Calendar',
        type: 'google',
        connected: this.isInitialized,
        email: 'user@gmail.com',
      },
      {
        id: 'outlook',
        name: 'Outlook Calendar',
        type: 'outlook',
        connected: false,
      },
      {
        id: 'apple',
        name: 'Apple Calendar',
        type: 'apple',
        connected: false,
      },
    ];

    return providers;
  }

  async disconnectCalendar(providerId: string): Promise<boolean> {
    try {
      if (providerId === 'google') {
        this.googleAuth = null;
        this.calendarApi = null;
        this.isInitialized = false;
      }
      
      // Remove stored tokens
      localStorage.removeItem(`calendar_token_${providerId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect calendar:', error);
      return false;
    }
  }

  // Mock methods for other calendar providers
  async connectOutlook(): Promise<boolean> {
    // Implement Microsoft Graph API integration
    console.log('Outlook integration would be implemented here');
    return false;
  }

  async connectApple(): Promise<boolean> {
    // Implement Apple Calendar integration (limited web support)
    console.log('Apple Calendar integration would be implemented here');
    return false;
  }
}

export const calendarService = new CalendarService();