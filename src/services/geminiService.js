import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  return 'AIzaSyDpj_YVxGgUxTsmcHCgPEbzkSspl1il4vo';
};

const API_KEY = getApiKey();

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
  console.warn('Gemini API key not found or is a placeholder. Please add your VITE_GEMINI_API_KEY to your environment or replace the placeholder.');
}

let genAI = null;

const initializeGenAI = () => {
  const apiKey = getApiKey();
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  }
  return false;
};

// Updated System Prompt with instructions for current time and multiple reminders
const SYSTEM_PROMPT = `You are TimeTuneAI, an intelligent and friendly reminder assistant. Your primary role is to help users create, manage, and organize reminders through natural conversation.

CURRENT CONTEXT:
- The user's message will be prepended with the current date and time in ISO format (e.g., "Current time is 2024-07-23T10:00:00.000Z").
- You MUST use this timestamp as the point of reference for all relative time requests (e.g., "tomorrow", "in 2 hours", "next Monday").

CORE RESPONSIBILITIES:
1.  Parse natural language to extract reminder details (title, date, time, description).
2.  Handle multiple reminder requests in a single user message.
3.  Be conversational, friendly, empathetic, and efficient.
4.  Handle queries like "show my reminders", "delete the meeting reminder", etc.
5.  Summarize the actions you've taken in a clear, friendly message.

REMINDER EXTRACTION RULES:
- Extract: title, description, date, time, priority (high/medium/low), category (work/personal/health/other).
- Handle relative dates and times based on the provided "Current time".
- Default to medium priority if not specified.
- Default to personal category if not specified.
- For dates: use YYYY-MM-DD format.
- For times: use HH:MM format (24-hour).

FUNCTION CALLING:
You can perform actions by responding with a single, valid JSON object. Do not include any text outside the JSON object.

CREATE A SINGLE REMINDER:
{
  "action": "create_reminder",
  "data": {
    "title": "Call mom",
    "description": "Weekly check-in call",
    "date": "2024-07-24",
    "time": "15:00",
    "priority": "medium",
    "category": "personal"
  },
  "message": "Perfect! I've set a reminder for you to call mom tomorrow at 3:00 PM. ✨"
}

CREATE MULTIPLE REMINDERS:
If the user asks to set multiple reminders at once, use this action. The "data" field must be an array of reminder objects.
{
  "action": "create_multiple_reminders",
  "data": [
    {
      "title": "Submit project report",
      "description": "Final version for Q2",
      "date": "2024-07-26",
      "time": "11:00",
      "priority": "high",
      "category": "work"
    },
    {
      "title": "Dentist appointment",
      "description": "Annual check-up",
      "date": "2024-07-29",
      "time": "14:30",
      "priority": "medium",
      "category": "health"
    }
  ],
  "message": "All set! I've scheduled two reminders for you: one to submit your project report on Friday, and another for your dentist appointment next Monday. 👍"
}

LIST REMINDERS:
{
  "action": "list_reminders",
  "data": { "filter": "today" },
  "message": "Here are your reminders for today:"
}

DELETE REMINDER:
{
  "action": "delete_reminder",
  "data": { "query": "call mom" },
  "message": "I've deleted the 'call mom' reminder for you."
}

REGULAR CONVERSATION:
For general questions, greetings, or when no action is needed, respond with plain text, not JSON. Be warm and helpful.

IMPORTANT: Always respond with either a valid JSON object for actions or regular text for conversation. Never mix both. Your JSON must be perfectly formatted.
`;

export class GeminiService {
  model;
  chat;
  callbacks;

  constructor() {
    this.initializeModel();
  }

  initializeModel() {
    if (initializeGenAI() && genAI) {
      this.model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Using a capable model
        generationConfig: {
          responseMimeType: "application/json", // Instructs the model to output JSON
          temperature: 0.2 // Lower temperature for more predictable JSON output
        },
        systemInstruction: SYSTEM_PROMPT,
      });
      this.initializeChat();
    }
  }

  initializeChat() {
    this.chat = this.model.startChat({
      history: [
        // The system prompt is now part of the model initialization
        {
          role: "user",
          parts: [{ text: "Hello!" }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm TimeTuneAI, your personal reminder assistant. How can I help you stay organized today? You can ask me to set one or multiple reminders at once! 😊" }],
        },
      ],
    });
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  // Helper functions remain useful for standardizing data from AI
  parseDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    // The AI should provide a valid YYYY-MM-DD, so we trust it but have a fallback.
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];

  }

  parseTime(timeStr) {
    if (!timeStr) return '09:00';
    // AI should provide HH:MM, this is just a safeguard.
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      return timeStr;
    }
    return '09:00'; // Default fallback
  }

  async executeAction(actionData) {
    try {
      console.log('Executing action:', actionData);
      const { action, data, message } = actionData;

      switch (action) {
        case 'create_reminder': {
          if (!this.callbacks.addReminder) return "I can't create reminders right now.";

          const reminderData = {
            title: data.title,
            description: data.description || '',
            date: this.parseDate(data.date),
            time: this.parseTime(data.time),
            priority: data.priority || 'medium',
            category: data.category || 'personal',
            isCompleted: false,
          };
          this.callbacks.addReminder(reminderData);
          return message; // Use the friendly message from the AI
        }

        case 'create_multiple_reminders': {
          if (!this.callbacks.addReminder) return "I can't create reminders right now.";
          if (!Array.isArray(data)) return "I received an incorrect format for multiple reminders.";

          data.forEach(item => {
            const reminderData = {
              title: item.title,
              description: item.description || '',
              date: this.parseDate(item.date),
              time: this.parseTime(item.time),
              priority: item.priority || 'medium',
              category: item.category || 'personal',
              isCompleted: false,
            };
            this.callbacks.addReminder(reminderData);
          });
          return message; // Use the friendly summary message from the AI
        }

        case 'list_reminders': {
          if (!this.callbacks.getAllReminders) return "I can't list reminders right now.";

          const allReminders = this.callbacks.getAllReminders();
          const filter = data.filter || 'all';
          const today = new Date().toISOString().split('T')[0];
          let filteredReminders = allReminders;

          switch (filter) {
            case 'today':
              filteredReminders = allReminders.filter(r => r.date === today && !r.isCompleted);
              break;
            // Add more filters as needed
          }

          if (filteredReminders.length === 0) {
            return `You don't have any ${filter === 'all' ? '' : filter + ' '}reminders.`;
          }

          const remindersList = filteredReminders
            .slice(0, 5)
            .map(r => `• ${r.title} at ${r.time}`)
            .join('\n');

          return `${message}\n\n${remindersList}${filteredReminders.length > 5 ? '\n...and a few more.' : ''}`;
        }

        default:
          return "I'm sorry, I don't understand that action.";
      }
    } catch (error) {
      console.error('Error executing action:', error);
      return "I'm sorry, something went wrong while processing your request.";
    }
  }

  async sendMessage(message) {
    if (!this.model || !this.chat) {
      this.initializeModel();
      if (!this.model || !this.chat) {
        return "I'm having trouble initializing. Please check your API key and try again.";
      }
    }

    try {
      // Prepend the current time to the user's message for context
      const currentTime = new Date().toLocaleString();
      const messageWithContext = `Current time is ${currentTime}. User's request: "${message}"`;

      console.log('Sending to Gemini:', messageWithContext);

      const result = await this.chat.sendMessage(messageWithContext);
      const response = await result.response;
      const responseText = response.text();

      console.log('Raw Gemini response:', responseText);

      // Since we requested JSON, we can be more confident in parsing it.
      try {
        const actionData = JSON.parse(responseText);
        // Check for the essential fields
        if (actionData.action && actionData.data && actionData.message) {
          return await this.executeAction(actionData);
        } else {
          // It's 
          return responseText;
        }
      } catch (e) {
        // If it's not JSON, it's a regular conversation
        console.log('Response is not JSON, treating as plain text.');
        return responseText;
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      // Fallback for network errors or API issues
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  resetChat() {
    if (this.model) {
      this.initializeChat();
    }
  }
}

export const geminiService = new GeminiService();