import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationService } from '../services/notificationService';



const RemindersContext = createContext(undefined);

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

const remindersReducer = (state, action)=> {
  switch (action.type) {
    case 'ADD_REMINDER': {
      const newReminder = {
        ...action.payload,
        id:Math.floor(Date.now() % 2147483647),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newState = {
        ...state,
        reminders: [...state.reminders, newReminder],
      };
      localStorage.setItem('reminders', JSON.stringify(newState.reminders));
      return newState;
    }
    case 'UPDATE_REMINDER': {
      const newState = {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id
            ? { ...reminder, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : reminder
        ),
      };
      localStorage.setItem('reminders', JSON.stringify(newState.reminders));
      return newState;
    }
    case 'DELETE_REMINDER': {
      const newState = {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
      localStorage.setItem('reminders', JSON.stringify(newState.reminders));
      return newState;
    }
    case 'TOGGLE_COMPLETE': {
      const newState = {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload
            ? { ...reminder, isCompleted: !reminder.isCompleted, updatedAt: new Date().toISOString() }
            : reminder
        ),
      };
      localStorage.setItem('reminders', JSON.stringify(newState.reminders));
      return newState;
    }
    case 'LOAD_REMINDERS':
      return {
        ...state,
        reminders: action.payload,
      };
    default:
      return state;
  }
};

export const RemindersProvider= ({ children }) => {
  const [state, dispatch] = useReducer(remindersReducer, { reminders: [] });

  useEffect(() => {
    // Load reminders from localStorage on mount
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      try {
        const parsedReminders = JSON.parse(savedReminders);
        dispatch({ type: 'LOAD_REMINDERS', payload: parsedReminders });
      } catch (error) {
        console.error('Error loading reminders from localStorage:', error);
      }
    }
  }, []);

  const addReminder = (reminder)=> {
    const id =  Math.floor(Date.now() % 2147483647);
    console.log('RemindersContext: Adding reminder with ID:', id, reminder);
    
    const newReminder = {
      ...reminder,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_REMINDER', payload: reminder });
    
    console.log('RemindersContext: Reminder added, scheduling notification...');
    // Schedule notification for the new reminder
    if (!newReminder.isCompleted) {
      notificationService.scheduleReminderNotification(newReminder);
    }
    
    console.log('RemindersContext: Returning ID:', id);
    return id;
  };

  const updateReminder = (id, updates) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: { id, updates } });
    
    // Update notification
    const updatedReminder = state.reminders.find(r => r.id === id);
    if (updatedReminder) {
      const finalReminder = { ...updatedReminder, ...updates };
      notificationService.updateReminderNotification(finalReminder);
    }
  };

  const deleteReminder = (id) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
    
    // Cancel notification
    notificationService.cancelReminderNotification(id);
  };

  const toggleComplete = (id) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    
    // Update notification based on completion status
    const reminder = state.reminders.find(r => r.id === id);
    if (reminder) {
      const updatedReminder = { ...reminder, isCompleted: !reminder.isCompleted };
      notificationService.updateReminderNotification(updatedReminder);
    }
  };

  const findReminders = (query) => {
    const lowerQuery = query.toLowerCase();
    return state.reminders.filter(reminder =>
      reminder.title.toLowerCase().includes(lowerQuery) ||
      reminder.description?.toLowerCase().includes(lowerQuery) ||
      reminder.category.toLowerCase().includes(lowerQuery)
    );
  };

  const value = {
    reminders: state.reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
    findReminders,
  };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};