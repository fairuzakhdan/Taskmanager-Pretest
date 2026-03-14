import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const result = await register(formData.name, formData.email, formData.password);
        setSuccess(result.message);
        setIsLogin(true); // Switch ke login form
        setFormData({ name: '', email: '', password: '' }); // Clear form
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess(''); // Clear success message ketika switch form
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer"
        >
          ← Back
        </button>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          {isLogin ? '🔐 Sign in' : '📝 Create account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  👤 Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                ✉️ Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                🔒 Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg relative flex items-center gap-2">
                ✅ {success}
                <button 
                  type="button"
                  onClick={() => setSuccess('')} 
                  className="absolute top-2 right-2 text-green-800 hover:text-green-900 font-bold text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative flex items-center gap-2">
                ⚠️ {error}
                <button 
                  type="button"
                  onClick={() => setError('')} 
                  className="absolute top-2 right-2 text-red-800 hover:text-red-900 font-bold text-lg cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? '⏳ Loading...' : (isLogin ? '🔐 Sign in' : '📝 Sign up')}
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={handleToggleForm}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition cursor-pointer"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
