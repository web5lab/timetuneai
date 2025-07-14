import { useState, useCallback, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { useReminders } from '../contexts/RemindersContext';


export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm TimeTuneAI, your personal reminder assistant. I can help you create, update, delete, and manage your reminders using natural language. Try saying something like 'Remind me to call mom at 3 PM tomorrow' or 'Show me my reminders'!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'suggestion'
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const { addReminder, updateReminder, deleteReminder, findReminders, reminders } = useReminders();

  // Set up callbacks for the Gemini service
  useEffect(() => {
    console.log('Setting up Gemini service callbacks...');
    geminiService.setCallbacks({
      addReminder: (reminderData) => {
        console.log('Adding reminder via callback:', reminderData);
        return addReminder(reminderData);
      },
      updateReminder: (id, updates) => {
        console.log('Updating reminder via callback:', id, updates);
        updateReminder(id, updates);
      },
      deleteReminder: (id) => {
        console.log('Deleting reminder via callback:', id);
        deleteReminder(id);
      },
      findReminders: (query) => {
        console.log('Finding reminders via callback:', query);
        return findReminders(query);
      },
      getAllReminders: () => {
        console.log('Getting all reminders via callback, count:', reminders.length);
        return reminders;
      },
    });
  }, [addReminder, updateReminder, deleteReminder, findReminders, reminders]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    console.log('Sending message:', text);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      console.log('Calling Gemini service...');
      const aiResponse = await geminiService.sendMessage(text);
      console.log('Received AI response:', aiResponse);
      
      // Determine message type based on content
      let messageType;
      if (aiResponse.toLowerCase().includes('set') || 
          aiResponse.toLowerCase().includes('created') || 
          aiResponse.toLowerCase().includes('scheduled') || 
          aiResponse.toLowerCase().includes('reminder')) {
        messageType = 'confirmation';
      } else if (text.toLowerCase().includes('remind') || 
                 text.toLowerCase().includes('delete') || 
                 text.toLowerCase().includes('update')) {
        messageType = 'reminder';
      }

      const aiMessage = {
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
      const errorMessage = {
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
        text: "Hi! I'm TimeTuneAI, your personal reminder assistant. I can help you create, update, delete, and manage your reminders using natural language. Try saying something like 'Remind me to call mom at 3 PM tomorrow' or 'Show me my reminders'!",
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