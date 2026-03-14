import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import { userApi } from '../services/userApi';
import type { Task } from '../types';
import type { User } from '../services/userApi';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tasks' | 'users'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData] = await Promise.all([
          taskApi.getAllTasks(),
          userApi.getAllUsers(),
        ]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">📋 Task Manager</h1>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 ${activeTab === 'tasks' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} transition cursor-pointer`}
            >
              ✅ Tasks
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 ${activeTab === 'users' ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} transition cursor-pointer`}
            >
              👥 Users
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
            >
              🔐 Login
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'tasks' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  ✅ All Tasks
                </h2>
                {tasks.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No tasks available</p>
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
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  👥 All Users
                </h2>
                {users.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-4xl mb-2">👤</div>
                    <p>No users available</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <div 
                        key={user.id} 
                        onClick={() => navigate(`/users/${user.id}/tasks`)}
                        className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer"
                      >
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                          👤 {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          ✉️ {user.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
