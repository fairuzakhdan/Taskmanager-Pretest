import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import UserTasksPage from './pages/UserTasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/users/:id/tasks" element={<UserTasksPage />} />
      <Route path="/tasks/:id" element={<TaskDetailPage />} />
      
      <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      
      <Route path="*" element={user ? <NotFoundPage /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
