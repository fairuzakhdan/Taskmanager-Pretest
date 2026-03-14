import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks(token);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = async (taskData: { title: string; description?: string; completed?: boolean }) => {
    await createTask(taskData);
    setShowForm(false);
  };

  const handleUpdateTask = async (id: number, taskData: { title?: string; description?: string; completed?: boolean }) => {
    await updateTask({ id, data: taskData });
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await deleteTask(id);
  };

  const handleToggleComplete = async (task: Task) => {
    await updateTask({ id: task.id, data: { completed: !task.completed } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📋 Task Manager</h1>
            <p className="text-sm text-gray-600">👤 {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition cursor-pointer"
            >
              👤 Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded text-sm transition cursor-pointer"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm transition font-medium cursor-pointer"
          >
            ➕ New Task
          </button>
        </div>

        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
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

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between hover:shadow-md transition">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 hover:bg-blue-50 rounded transition cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-3 py-1 hover:bg-red-50 rounded transition cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
