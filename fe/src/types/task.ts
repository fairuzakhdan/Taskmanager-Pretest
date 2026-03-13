export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
