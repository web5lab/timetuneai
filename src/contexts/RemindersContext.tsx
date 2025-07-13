import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'health' | 'other';
  isCompleted: boolean;
  isRecurring: boolean;
  recurrencePattern?: string;
  createdAt: string;
  updatedAt: string;
}

interface RemindersState {
  reminders: Reminder[];
}

type RemindersAction =
  | { type: 'ADD_REMINDER'; payload: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_REMINDER'; payload: { id: string; updates: Partial<Reminder> } }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'LOAD_REMINDERS'; payload: Reminder[] };

interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleComplete: (id: string) => void;
  findReminders: (query: string) => Reminder[];
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

const remindersReducer = (state: RemindersState, action: RemindersAction): RemindersState => {
  switch (action.type) {
    case 'ADD_REMINDER': {
      const newReminder: Reminder = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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

interface RemindersProviderProps {
  children: React.ReactNode;
}

export const RemindersProvider: React.FC<RemindersProviderProps> = ({ children }) => {
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

  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'ADD_REMINDER', payload: reminder });
    return id;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: { id, updates } });
  };

  const deleteReminder = (id: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  };

  const toggleComplete = (id: string) => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
  };

  const findReminders = (query: string): Reminder[] => {
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