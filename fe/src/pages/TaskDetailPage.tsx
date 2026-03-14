import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';

interface TaskDetail {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      try {
        const data = await taskApi.getTaskById(id);
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">{error || 'Task not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">📋 Task Manager</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              checked={task.completed}
              disabled
              className="mt-1 w-6 h-6 cursor-not-allowed"
            />
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {task.title}
              </h2>
              {task.description && (
                <p className="text-gray-600 mt-3">{task.description}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.completed 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {task.completed ? '✓ Completed' : '○ In Progress'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">Created by:</span>
              <button
                onClick={() => navigate(`/users/${task.user.id}/tasks`)}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                👤 {task.user.name}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Email:</span>
              <span>✉️ {task.user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Created:</span>
              <span>📅 {new Date(task.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Updated:</span>
              <span>📅 {new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
