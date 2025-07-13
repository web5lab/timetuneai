import { useState, useCallback } from 'react';
import { geminiService } from '../services/geminiService';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'reminder' | 'confirmation' | 'suggestion';
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm TimeTuneAI, your personal reminder assistant. I can help you set reminders using natural language. Try saying something like 'Remind me to call mom at 3 PM tomorrow' or just type it!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'suggestion'
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await geminiService.sendMessage(text);
      
      // Determine message type based on content
      let messageType: 'reminder' | 'confirmation' | 'suggestion' = 'suggestion';
      if (aiResponse.toLowerCase().includes('set') || aiResponse.toLowerCase().includes('created') || aiResponse.toLowerCase().includes('scheduled')) {
        messageType = 'confirmation';
      } else if (text.toLowerCase().includes('remind')) {
        messageType = 'reminder';
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: messageType
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm TimeTuneAI, your personal reminder assistant. I can help you set reminders using natural language. Try saying something like 'Remind me to call mom at 3 PM tomorrow' or just type it!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'suggestion'
      },
    ]);
    geminiService.resetChat();
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
};