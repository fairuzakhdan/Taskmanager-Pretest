import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../services/userApi';
import type { Task } from '../types';

export default function UserTasksPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserTasks = async () => {
      if (!id) return;
      
      try {
        const [tasksData, usersData] = await Promise.all([
          userApi.getUserTasks(Number(id)),
          userApi.getAllUsers(),
        ]);
        
        setTasks(tasksData);
        const user = usersData.find(u => u.id === Number(id));
        setUserName(user?.name || 'Unknown User');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          👤 {userName}'s Tasks
        </h2>
        <p className="text-gray-600 mb-6">Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-500">This user hasn't created any tasks yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled
                    className="mt-1 w-5 h-5 cursor-not-allowed pointer-events-none"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      📅 {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
