interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  preferences: {
    notifications: boolean;
    soundEnabled: boolean;
    theme: 'light' | 'dark';
    defaultReminderTime: string;
    snoozeTime: number;
  };
  subscription: {
    plan: 'free' | 'pro' | 'premium';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: string;
  };
  stats: {
    totalReminders: number;
    completedReminders: number;
    streakDays: number;
  };
  completionRate: number;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

class AuthService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.token = localStorage.getItem('timetuneai_token');
  }

  // Get auth headers
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  // Start Google OAuth flow
  loginWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // Handle OAuth callback
  async handleAuthCallback(token: string): Promise<AuthResponse> {
    try {
      this.token = token;
      localStorage.setItem('timetuneai_token', token);
      
      const user = await this.getCurrentUser();
      if (user) {
        return { success: true, user };
      }
      
      throw new Error('Failed to get user data');
    } catch (error) {
      console.error('Auth callback error:', error);
      this.logout();
      return { 
        success: false, 
        message: 'Authentication failed. Please try again.' 
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.token) return null;

      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      return data.success ? data.user : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<boolean> {
    try {
      if (!this.token) return false;

      const response = await fetch(`${this.baseURL}/auth/preferences`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    this.token = null;
    localStorage.removeItem('timetuneai_token');
    window.location.href = '/';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get stored token
  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
export type { User, AuthResponse };