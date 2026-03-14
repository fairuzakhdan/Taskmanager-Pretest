const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUserTasks: async (userId: number) => {
    const response = await fetch(`${API_BASE}/users/${userId}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch user tasks');
    return response.json();
  },

  getProfile: async (token: string, id: number): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to fetch profile');
    }
    return response.json();
  },

  updateProfile: async (token: string, id: number, data: { email?: string; name?: string; password?: string }): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to update profile');
    }
    return response.json();
  },

  deleteAccount: async (token: string, id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to delete account');
    }
  },
};
