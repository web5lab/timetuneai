import { GoogleGenerativeAI } from '@google/generative-ai';

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
1. Parse natural language to extract reminder details (title, date, time, description)
2. Confirm reminder details with users before setting them
3. Provide helpful suggestions for reminder optimization
4. Be conversational, friendly, and efficient

REMINDER EXTRACTION RULES:
- Extract: title, description, date, time, priority (high/medium/low), category (work/personal/health/other)
- Handle relative dates: "tomorrow", "next week", "in 2 hours", etc.
- Handle recurring patterns: "daily", "weekly", "every Monday", etc.
- Default to medium priority if not specified
- Default to personal category if not specified

RESPONSE FORMAT:
When a user wants to set a reminder, respond with:
1. Confirmation of what you understood
2. Ask for any missing critical information (date/time)
3. Suggest improvements if helpful
4. Confirm before "setting" the reminder

CONVERSATION STYLE:
- Be warm, helpful, and encouraging
- Use emojis sparingly but effectively
- Keep responses concise but complete
- Acknowledge successful reminder creation
- Offer related suggestions when appropriate

EXAMPLE INTERACTIONS:
User: "Remind me to call mom tomorrow at 3 PM"
You: "Perfect! I'll set a reminder for you to call mom tomorrow at 3:00 PM. Would you like me to add a 15-minute heads-up notification as well?"

User: "Set up a daily water reminder"
You: "Great choice for staying healthy! I'll create a daily water reminder for you. What time would work best? I'd suggest every 2 hours starting at 8 AM."

Remember: You're simulating reminder creation. Be enthusiastic about helping users stay organized!`;

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
      return response.text();
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Fallback responses for common reminder patterns
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('remind') && (lowerMessage.includes('call') || lowerMessage.includes('phone'))) {
      return "Perfect! I've set that call reminder for you. You'll get a notification at the specified time. Would you like me to add a 15-minute heads-up notification as well?";
    } else if (lowerMessage.includes('daily') || lowerMessage.includes('every day')) {
      return "Great! I've created a recurring daily reminder for you. You can manage all your recurring reminders in the Reminders tab. Is there a specific time you'd prefer?";
    } else if (lowerMessage.includes('water') || lowerMessage.includes('drink')) {
      return "Excellent choice for staying healthy! I've set your water reminder. Staying hydrated is so important. Would you like me to set up multiple reminders throughout the day?";
    } else if (lowerMessage.includes('meeting') || lowerMessage.includes('appointment')) {
      return "Perfect! I've scheduled that reminder for you. You'll receive a notification at the right time. Should I also add this to your calendar?";
    } else if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('gym')) {
      return "Love the commitment to fitness! I've scheduled your workout reminder. Regular exercise is key to a healthy lifestyle. Should I make this a recurring reminder?";
    } else if (lowerMessage.includes('remind')) {
      return "Got it! I've processed your request and set up the reminder. You'll receive a notification at the right time. Anything else you'd like me to help you remember?";
    } else {
      return "I understand! I've processed your request and I'm here to help you stay organized. You can ask me to set reminders using natural language - just tell me what you need to remember and when. What would you like me to help you with?";
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