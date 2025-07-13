import { authService } from './authService';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

interface ReminderData {
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'health' | 'other';
  isRecurring?: boolean;
  recurrencePattern?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  private getHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
        }
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: data.success,
        data: data.reminders || data.reminder || data,
        message: data.message,
        count: data.count,
      };
    } catch (error) {
      console.error('API response error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Reminders API
  async getReminders(filters?: {
    category?: string;
    completed?: boolean;
    date?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.completed !== undefined) params.append('completed', filters.completed.toString());
      if (filters?.date) params.append('date', filters.date);

      const response = await fetch(`${this.baseURL}/api/reminders?${params}`, {
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Get reminders error:', error);
      return { success: false, message: 'Failed to fetch reminders' };
    }
  }

  async createReminder(reminderData: ReminderData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/api/reminders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(reminderData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Create reminder error:', error);
      return { success: false, message: 'Failed to create reminder' };
    }
  }

  async updateReminder(id: string, updates: Partial<ReminderData>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/api/reminders/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Update reminder error:', error);
      return { success: false, message: 'Failed to update reminder' };
    }
  }

  async deleteReminder(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/api/reminders/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Delete reminder error:', error);
      return { success: false, message: 'Failed to delete reminder' };
    }
  }

  async toggleReminderComplete(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/api/reminders/${id}/complete`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Toggle reminder complete error:', error);
      return { success: false, message: 'Failed to update reminder' };
    }
  }
}

export const apiService = new ApiService();
export type { ReminderData, ApiResponse };