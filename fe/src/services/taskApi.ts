import type { Task } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const taskApi = {
  // Get all tasks (public)
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Get current user's tasks (auth required)
  getMyTasks: async (token: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE}/tasks/my-tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch my tasks');
    return response.json();
  },

  // Get task by ID (public)
  getTaskById: async (id: string | number): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
  },

  // Create task (auth required)
  createTask: async (token: string, data: { title: string; description?: string; completed?: boolean }): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }
    return response.json();
  },

  // Update task (auth required)
  updateTask: async (token: string, id: string | number, data: { title?: string; description?: string; completed?: boolean }): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }
    return response.json();
  },

  // Delete task (auth required)
  deleteTask: async (token: string, id: string | number): Promise<void> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete task');
    }
  },
};
