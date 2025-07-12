export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  isCompleted: boolean;
  isRecurring: boolean;
  category: 'personal' | 'work' | 'health' | 'other';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    soundEnabled: boolean;
    theme: 'light' | 'dark';
  };
}