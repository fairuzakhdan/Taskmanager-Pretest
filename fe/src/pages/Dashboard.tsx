import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { taskApi } from '../services/taskApi';
import type { Task } from '../types';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await taskApi.getMyTasks(token);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string; completed?: boolean }) => {
    if (!token) return;

    try {
      await taskApi.createTask(token, taskData);
      setSuccess('Task created successfully!');
      setShowForm(false);
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, taskData: { title?: string; description?: string; completed?: boolean }) => {
    if (!token) return;

    try {
      await taskApi.updateTask(token, id, taskData);
      setSuccess('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskApi.deleteTask(token, id);
      setSuccess('Task deleted successfully!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    await handleUpdateTask(task.id, { completed: !task.completed });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}
        
        {success && (
          <div className="mx-4 mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Create Task Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Create New Task
          </button>
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask 
                  ? (data) => handleUpdateTask(editingTask.id, data)
                  : handleCreateTask
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="px-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                              {task.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
