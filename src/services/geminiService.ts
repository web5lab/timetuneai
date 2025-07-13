import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Reminder } from '../contexts/RemindersContext';

const getApiKey = () => {
  return 'AIzaSyDpj_YVxGgUxTsmcHCgPEbzkSspl1il4vo'
};

const API_KEY = getApiKey();

if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

let genAI: GoogleGenerativeAI | null = null;

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
- Offer related suggestions when appropriate

IMPORTANT: Always respond with either valid JSON for actions or regular text for conversation. Never mix both in the same response.`;

export interface ReminderAction {
  action: 'create_reminder' | 'update_reminder' | 'delete_reminder' | 'list_reminders';
  data: any;
  message: string;
}

interface GeminiServiceCallbacks {
  addReminder?: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReminder?: (id: number, updates: Partial<Reminder>) => void;
  deleteReminder?: (id: number) => void;
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
      console.log('Executing action:', actionData);
      
      switch (actionData.action) {
        case 'create_reminder': {
          if (!this.callbacks.addReminder) {
            console.error('addReminder callback not available');
            return "I'm sorry, I can't create reminders right now. Please try again.";
          }
          
          console.log('Creating reminder with data:', actionData.data);
          
          const reminderData = {
            title: actionData.data.title,
            description: actionData.data.description || '',
            date: this.parseDate(actionData.data.date || 'today'),
            time: this.parseTime(actionData.data.time || '09:00'),
            priority: actionData.data.priority || 'medium',
            category: actionData.data.category || 'personal',
            isCompleted: false,
            isRecurring: actionData.data.isRecurring || false,
            recurrencePattern: actionData.data.recurrencePattern || '',
          };
          
          console.log('Parsed reminder data:', reminderData);
          
          const id = this.callbacks.addReminder(reminderData);
          console.log('Reminder created with ID:', id);
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
          
          const reminder = reminders[0]; // Delete the first match
          this.callbacks.deleteReminder(reminder.id);
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
            .map(r => `• ${r.title} - ${r.date} at ${r.time} (${r.priority} priority)`)
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
      console.log('Gemini service sending message:', message);
      
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
      
      console.log('Raw Gemini response:', responseText);
      
      // Try to parse as JSON action
      try {
        // Clean up the response text to extract JSON
        let cleanedResponse = responseText.trim();
        
        console.log('Attempting to parse JSON from response...');
        
        // Look for JSON patterns in the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          console.log('Found JSON string:', jsonString);
          const actionData = JSON.parse(jsonString);
          
          if (actionData.action && actionData.message) {
            console.log('Valid action data found, executing...');
            return await this.executeAction(actionData);
          }
        }
        
        // If no JSON found, try parsing the entire response
        console.log('Trying to parse entire response as JSON...');
        const actionData = JSON.parse(cleanedResponse);
        if (actionData.action && actionData.message) {
          console.log('Entire response is valid JSON action, executing...');
          return await this.executeAction(actionData);
        }
      } catch (e) {
        console.log('JSON parsing failed, checking for JSON-like content...');
        // Not valid JSON, check if it contains JSON-like content
        if (responseText.includes('"action"') && responseText.includes('"create_reminder"')) {
          // Try to extract and fix malformed JSON
          try {
            console.log('Attempting to extract malformed JSON...');
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
              const jsonPart = responseText.substring(jsonStart, jsonEnd);
              console.log('Extracted JSON part:', jsonPart);
              const actionData = JSON.parse(jsonPart);
              if (actionData.action && actionData.message) {
                console.log('Extracted JSON is valid, executing...');
                return await this.executeAction(actionData);
              }
            }
          } catch (parseError) {
            console.error('Failed to parse extracted JSON:', parseError);
          }
        }
      }
      
      console.log('No valid JSON action found, returning raw response');
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
        const reminderData = {
          title: message.replace(/remind me to /i, '').replace(/remind me /i, ''),
          description: '',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          priority: 'medium' as const,
          category: 'personal' as const,
          isCompleted: false,
          isRecurring: false,
          recurrencePattern: '',
        };
        
        const id = this.callbacks.addReminder(reminderData);
        return `I've created a reminder for you: "${reminderData.title}". I set it for today at 9:00 AM. You can update the time and date in your reminders page if needed.`;
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