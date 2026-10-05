import { api } from './client';
import type { AuthResponse, User, Task, TasksResponse, TaskStats, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@/types';

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data),
  
  getMe: () => api.get<User>('/api/auth/me'),
};

export const taskService = {
  getTasks: (filters?: TaskFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    return api.get<TasksResponse>(`/api/tasks${query ? `?${query}` : ''}`);
  },
  
  getTask: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  
  createTask: (data: CreateTaskInput) => api.post<Task>('/api/tasks', data),
  
  updateTask: (id: string, data: UpdateTaskInput) => api.put<Task>(`/api/tasks/${id}`, data),
  
  deleteTask: (id: string) => api.delete<{ message: string }>(`/api/tasks/${id}`),
  
  getStats: () => api.get<TaskStats>('/api/tasks/stats'),
};
