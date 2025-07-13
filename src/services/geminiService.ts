import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  return 'AIzaSyDpj_YVxGgUxTsmcHCgPEbzkSspl1il4vo'
};

const initializeGenAI = () => {
  const apiKey = getApiKey();
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  }
  return false;
};

const SYSTEM_PROMPT = `You are TimeTuneAI, an intelligent reminder assistant. Your primary role is to help users create, manage, and organize reminders through natural conversation.

CORE RESPONSIBILITIES:
1. Parse natural language to extract reminder details (title, date, time, description, priority, category)
2. Create, update, delete, and manage reminders based on user requests
3. Provide helpful suggestions for reminder optimization
4. Be conversational, friendly, and efficient
5. Handle reminder queries like "show my reminders", "delete the meeting reminder", etc.

REMINDER EXTRACTION RULES:
- Extract: title, description, date, time, priority (high/medium/low), category (work/personal/health/other)
- Handle relative dates: "tomorrow", "next week", "in 2 hours", etc.
- Handle recurring patterns: "daily", "weekly", "every Monday", etc.
- Default to medium priority if not specified
- Default to personal category if not specified
- For dates: use YYYY-MM-DD format
- For times: use HH:MM format (24-hour)

FUNCTION CALLING:
You can perform these actions by responding with JSON in this format:

CREATE REMINDER:
{
  "action": "create_reminder",
  "data": {
    "title": "Call mom",
    "description": "Weekly check-in call",
    "date": "2024-01-16",
    "time": "15:00",
    "priority": "medium",
    "category": "personal",
    "isRecurring": false,
    "recurrencePattern": ""
  },
  "message": "Perfect! I've set a reminder for you to call mom tomorrow at 3:00 PM."
}

UPDATE REMINDER:
{
  "action": "update_reminder",
  "data": {
    "query": "meeting reminder",
    "updates": {
      "time": "14:00",
      "priority": "high"
    }
  },
  "message": "I've updated your meeting reminder to 2:00 PM and marked it as high priority."
}

DELETE REMINDER:
{
  "action": "delete_reminder",
  "data": {
    "query": "call mom"
  },
  "message": "I've deleted the reminder to call mom."
}

LIST REMINDERS:
{
  "action": "list_reminders",
  "data": {
    "filter": "today" // or "all", "completed", "pending", "work", "personal", etc.
  },
  "message": "Here are your reminders for today:"
}

REGULAR CONVERSATION:
For general questions or when no action is needed, respond normally without JSON.

CONVERSATION STYLE:
- Be warm, helpful, and encouraging
- Use emojis sparingly but effectively
- Keep responses concise but complete
- Acknowledge successful reminder creation

IMPORTANT: Always respond with either valid JSON for actions or regular text for conversation. Never mix both in the same response.`;

export interface ReminderAction {
  action: 'create_reminder' | 'update_reminder' | 'delete_reminder' | 'list_reminders';
  data: any;
  message: string;
}

interface GeminiServiceCallbacks {
  addReminder?: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReminder?: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder?: (id: string) => void;
  findReminders?: (query: string) => Reminder[];
  getAllReminders?: () => Reminder[];
}

export interface ReminderData {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: 'work' | 'personal' | 'health' | 'other';
  recurring?: boolean;
  recurrencePattern?: string;
}

export class GeminiService {
  private model;
  private chat;
  private callbacks: GeminiServiceCallbacks = {};

  constructor() {
    this.initializeModel();
  }

  private initializeModel() {
    if (initializeGenAI() && genAI) {
      this.model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
       generationConfig: {
      maxOutputTokens: 65536,
      temperature: 1,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    }
      });
      this.initializeChat();
    }
  }

  private initializeChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm TimeTuneAI, your personal reminder assistant. I'm here to help you stay organized and never miss anything important. You can tell me about any reminder you'd like to set using natural language - just speak or type as you normally would. What would you like me to help you remember today?" }],
        },
      ],
    });
  }

  setCallbacks(callbacks: GeminiServiceCallbacks) {
    this.callbacks = callbacks;
  }

  private parseDate(dateStr: string): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const lowerDate = dateStr.toLowerCase();
    
    if (lowerDate.includes('today')) {
      return today.toISOString().split('T')[0];
    } else if (lowerDate.includes('tomorrow')) {
      return tomorrow.toISOString().split('T')[0];
    } else if (lowerDate.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    } else if (lowerDate.includes('monday')) {
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
      return nextMonday.toISOString().split('T')[0];
    } else if (lowerDate.includes('tuesday')) {
      const nextTuesday = new Date(today);
      nextTuesday.setDate(today.getDate() + (2 + 7 - today.getDay()) % 7);
      return nextTuesday.toISOString().split('T')[0];
    } else if (lowerDate.includes('wednesday')) {
      const nextWednesday = new Date(today);
      nextWednesday.setDate(today.getDate() + (3 + 7 - today.getDay()) % 7);
      return nextWednesday.toISOString().split('T')[0];
    } else if (lowerDate.includes('thursday')) {
      const nextThursday = new Date(today);
      nextThursday.setDate(today.getDate() + (4 + 7 - today.getDay()) % 7);
      return nextThursday.toISOString().split('T')[0];
    } else if (lowerDate.includes('friday')) {
      const nextFriday = new Date(today);
      nextFriday.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);
      return nextFriday.toISOString().split('T')[0];
    } else if (lowerDate.includes('saturday')) {
      const nextSaturday = new Date(today);
      nextSaturday.setDate(today.getDate() + (6 + 7 - today.getDay()) % 7);
      return nextSaturday.toISOString().split('T')[0];
    } else if (lowerDate.includes('sunday')) {
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
      return nextSunday.toISOString().split('T')[0];
    }
    
    // Try to parse as date
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    
    return today.toISOString().split('T')[0];
  }

  private parseTime(timeStr: string): string {
    // Handle common time formats
    const time = timeStr.toLowerCase().replace(/\s+/g, '');
    
    // Handle AM/PM format
    if (time.includes('am') || time.includes('pm')) {
      const isPM = time.includes('pm');
      const numericTime = time.replace(/[ap]m/, '');
      let [hours, minutes = '00'] = numericTime.split(':');
      
      hours = parseInt(hours);
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Handle 24-hour format
    if (time.includes(':')) {
      return time;
    }
    
    // Default to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  private async executeAction(actionData: ReminderAction): Promise<string> {
    try {
      switch (actionData.action) {
        case 'create_reminder': {
          if (!this.callbacks.addReminder) {
            return "I'm sorry, I can't create reminders right now. Please try again.";
          }
          
          // Handle recurring reminders
          const isRecurring = actionData.data.isRecurring || false;
          let recurrenceDetails = actionData.data.recurrenceDetails || {};
          
          // Parse recurrence pattern
          if (isRecurring && actionData.data.recurrencePattern) {
            const pattern = actionData.data.recurrencePattern.toLowerCase();
            
            if (pattern === 'weekdays') {
              recurrenceDetails = {
                frequency: 1,
                daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
                ...recurrenceDetails
              };
            } else if (pattern === 'weekends') {
              recurrenceDetails = {
                frequency: 1,
                daysOfWeek: [0, 6], // Sunday and Saturday
                ...recurrenceDetails
              };
            } else if (pattern === 'daily') {
              recurrenceDetails = {
                frequency: 1,
                ...recurrenceDetails
              };
            } else if (pattern === 'weekly') {
              recurrenceDetails = {
                frequency: 1,
                daysOfWeek: [new Date(this.parseDate(actionData.data.date)).getDay()],
                ...recurrenceDetails
              };
            }
          }
          
          const reminderData = {
            title: actionData.data.title,
            description: actionData.data.description || '',
            date: this.parseDate(actionData.data.date),
            time: this.parseTime(actionData.data.time),
            priority: actionData.data.priority || 'medium',
            category: actionData.data.category || 'personal',
            isCompleted: false,
            isRecurring,
            recurrencePattern: actionData.data.recurrencePattern || undefined,
            recurrenceDetails: isRecurring ? recurrenceDetails : undefined,
            nextOccurrence: isRecurring ? this.calculateNextOccurrence(
              this.parseDate(actionData.data.date),
              this.parseTime(actionData.data.time),
              actionData.data.recurrencePattern,
              recurrenceDetails
            ) : undefined,
          };
          
          const id = this.callbacks.addReminder(reminderData);
          return actionData.message + ` (ID: ${id})`;
        }
        
        case 'update_reminder': {
          if (!this.callbacks.findReminders || !this.callbacks.updateReminder) {
            return "I'm sorry, I can't update reminders right now. Please try again.";
          }
          
          const reminders = this.callbacks.findReminders(actionData.data.query);
          if (reminders.length === 0) {
            return `I couldn't find any reminders matching "${actionData.data.query}".`;
          }
          
          const reminder = reminders[0]; // Update the first match
          this.callbacks.updateReminder(reminder.id, actionData.data.updates);
          return actionData.message;
        }
        
        case 'delete_reminder': {
          if (!this.callbacks.findReminders || !this.callbacks.deleteReminder) {
            return "I'm sorry, I can't delete reminders right now. Please try again.";
          }
          
          const reminders = this.callbacks.findReminders(actionData.data.query);
          if (reminders.length === 0) {
            return `I couldn't find any reminders matching "${actionData.data.query}".`;
          }
          
          // Handle deleting recurring reminders
          const deleteAll = actionData.data.deleteAll || false;
          
          if (deleteAll) {
            // Delete all instances of recurring reminder
            reminders.forEach(reminder => {
              if (reminder.isRecurring || reminder.parentReminderId) {
                this.callbacks.deleteReminder!(reminder.id);
              }
            });
            return actionData.message;
          } else {
            // Delete only the first match
            const reminder = reminders[0];
            this.callbacks.deleteReminder(reminder.id);
          }
          
          return actionData.message;
        }
        
        case 'list_reminders': {
          if (!this.callbacks.getAllReminders) {
            return "I'm sorry, I can't list reminders right now. Please try again.";
          }
          
          const allReminders = this.callbacks.getAllReminders();
          const filter = actionData.data.filter || 'all';
          
          let filteredReminders = allReminders;
          const today = new Date().toISOString().split('T')[0];
          
          switch (filter) {
            case 'today':
              filteredReminders = allReminders.filter(r => r.date === today);
              break;
            case 'completed':
              filteredReminders = allReminders.filter(r => r.isCompleted);
              break;
            case 'pending':
              filteredReminders = allReminders.filter(r => !r.isCompleted);
              break;
            case 'recurring':
              filteredReminders = allReminders.filter(r => r.isRecurring);
              break;
            case 'work':
              filteredReminders = allReminders.filter(r => r.category === 'work');
              break;
            case 'personal':
              filteredReminders = allReminders.filter(r => r.category === 'personal');
              break;
          }
          
          if (filteredReminders.length === 0) {
            return `You don't have any ${filter === 'all' ? '' : filter + ' '}reminders.`;
          }
          
          const remindersList = filteredReminders
            .slice(0, 5) // Limit to 5 reminders
            .map(r => {
              const recurringText = r.isRecurring ? ` [${r.recurrencePattern}]` : '';
              return `• ${r.title} - ${r.date} at ${r.time} (${r.priority} priority)${recurringText}`;
            })
            .join('\n');
          
          return `${actionData.message}\n\n${remindersList}${filteredReminders.length > 5 ? '\n\n...and more in your reminders page.' : ''}`;
        }
        
        default:
          return "I'm sorry, I don't understand that action.";
      }
    } catch (error) {
      console.error('Error executing action:', error);
      return "I'm sorry, something went wrong while processing your request.";
    }
  }
  async sendMessage(message: string): Promise<string> {
    try {
      const apiKey = getApiKey();
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return "I'm sorry, but I need an API key to function properly. Please add your Gemini API key to the environment variables.";
      }
      
      if (!this.model || !this.chat) {
        this.initializeModel();
        if (!this.model || !this.chat) {
          return "I'm having trouble initializing. Please check your API key and try again.";
        }
      }

      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const responseText = response.text();
      
      // Try to parse as JSON action
      try {
        const actionData = JSON.parse(responseText);
        if (actionData.action && actionData.message) {
          return await this.executeAction(actionData);
        }
      } catch (e) {
        // Not JSON, return as regular response
      }
      
      return responseText;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Fallback responses for common reminder patterns
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('list') || lowerMessage.includes('show') || lowerMessage.includes('my reminders')) {
      if (this.callbacks.getAllReminders) {
        const reminders = this.callbacks.getAllReminders();
        if (reminders.length === 0) {
          return "You don't have any reminders yet. Would you like me to create one for you?";
        }
        const remindersList = reminders
          .slice(0, 3)
          .map(r => `• ${r.title} - ${r.date} at ${r.time}`)
          .join('\n');
        return `Here are your recent reminders:\n\n${remindersList}${reminders.length > 3 ? '\n\n...and more in your reminders page.' : ''}`;
      }
    } else if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      return "I can help you delete reminders! Please tell me which reminder you'd like to remove, for example: 'Delete my meeting reminder' or 'Remove the call mom reminder'.";
    } else if (lowerMessage.includes('update') || lowerMessage.includes('change') || lowerMessage.includes('modify')) {
      return "I can help you update your reminders! Tell me which reminder you want to change and what you'd like to update. For example: 'Change my meeting time to 3 PM' or 'Update the call mom reminder to high priority'.";
    } else if (lowerMessage.includes('remind')) {
      // Try to create a basic reminder with fallback
      if (this.callbacks.addReminder) {
        // Check for recurring patterns
        const isRecurring = lowerMessage.includes('daily') || 
                           lowerMessage.includes('every day') ||
                           lowerMessage.includes('weekly') ||
                           lowerMessage.includes('every week');
        
        let recurrencePattern = undefined;
        let recurrenceDetails = undefined;
        
        if (isRecurring) {
          if (lowerMessage.includes('daily') || lowerMessage.includes('every day')) {
            recurrencePattern = 'daily';
            recurrenceDetails = { frequency: 1 };
          } else if (lowerMessage.includes('weekly') || lowerMessage.includes('every week')) {
            recurrencePattern = 'weekly';
            recurrenceDetails = { frequency: 1 };
          }
        }
        
        const reminderData = {
          title: message.replace(/remind me to /i, '').replace(/remind me /i, ''),
          description: '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          priority: 'medium' as const,
          category: 'personal' as const,
          isCompleted: false,
          isRecurring,
          recurrencePattern,
          recurrenceDetails,
          nextOccurrence: isRecurring ? this.calculateNextOccurrence(
            new Date().toISOString().split('T')[0],
            '09:00',
            recurrencePattern,
            recurrenceDetails
          ) : undefined,
        };
        
        const id = this.callbacks.addReminder(reminderData);
        const recurringText = isRecurring ? ` as a ${recurrencePattern} reminder` : '';
        return `I've created a reminder for you: "${reminderData.title}"${recurringText}. I set it for today at 9:00 AM. You can update the time and date in your reminders page if needed.`;
      }
      return "I understand you want to set a reminder. Could you please provide more details like the date and time? For example: 'Remind me to call mom tomorrow at 3 PM'.";
    } else {
      return "I'm here to help you manage your reminders! You can ask me to create, update, delete, or list your reminders. Try saying something like 'Remind me to call mom tomorrow at 3 PM' or 'Show me my reminders'.";
    }
  }

  // Method to extract reminder data from conversation (for future use)
  extractReminderData(message: string): Partial<ReminderData> {
    const data: Partial<ReminderData> = {};
    const lowerMessage = message.toLowerCase();

    // Extract priority
    if (lowerMessage.includes('urgent') || lowerMessage.includes('important') || lowerMessage.includes('critical')) {
      data.priority = 'high';
    } else if (lowerMessage.includes('low priority') || lowerMessage.includes('when I have time')) {
      data.priority = 'low';
    } else {
      data.priority = 'medium';
    }

    // Extract category
    if (lowerMessage.includes('work') || lowerMessage.includes('meeting') || lowerMessage.includes('office')) {
      data.category = 'work';
    } else if (lowerMessage.includes('doctor') || lowerMessage.includes('medicine') || lowerMessage.includes('health') || lowerMessage.includes('workout')) {
      data.category = 'health';
    } else {
      data.category = 'personal';
    }

    // Extract recurring pattern
    if (lowerMessage.includes('daily') || lowerMessage.includes('every day')) {
      data.recurring = true;
      data.recurrencePattern = 'daily';
    } else if (lowerMessage.includes('weekly') || lowerMessage.includes('every week')) {
      data.recurring = true;
      data.recurrencePattern = 'weekly';
    }

    return data;
  }

  resetChat() {
    if (this.model) {
      this.initializeChat();
    }
  }
}

export const geminiService = new GeminiService();