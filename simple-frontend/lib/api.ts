const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://rec-finder-backend.onrender.com';

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  phone?: string;
}

export interface Event {
  id: number;
  sport: string;
  location: string;
  date: string;
  time: string;
  skillLevel: string;
  ageGroup: string;
  createdBy: string;
  attendees: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.token = result.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.token = result.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events');
  }

  async createEvent(data: {
    sport: string;
    location: string;
    date: string;
    time: string;
    skillLevel: string;
    ageGroup: string;
  }): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinEvent(id: number): Promise<Event> {
    return this.request<Event>(`/events/${id}/join`, {
      method: 'POST',
    });
  }

  async leaveEvent(id: number): Promise<Event> {
    return this.request<Event>(`/events/${id}/leave`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();